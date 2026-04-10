
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateInvoiceNumber } from "@/utils/numberGenerator";
import InvoiceBasicInfo from "./invoice/InvoiceBasicInfo";
import InvoiceLineItems from "./invoice/InvoiceLineItems";
import InvoiceTotals from "./invoice/InvoiceTotals";
import InvoiceFormActions from "./invoice/InvoiceFormActions";
import { ArrowLeft, X } from "lucide-react";

interface FactureProformaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFactureSaved: () => void;
  editInvoiceId?: string | null;
}

const FactureProformaForm: React.FC<FactureProformaFormProps> = ({
  open,
  onOpenChange,
  onFactureSaved,
  editInvoiceId,
}) => {
  const form = useForm({
    defaultValues: {
      client_id: "",
      date: new Date().toISOString().split("T")[0],
      comments: "",
      payment_terms: "immediate",
      header_notes: "",
      footer_notes: "",
      items: [{ product_id: "", description: "", quantity: 1, unit_price: 0, tva: 0 }],
    }
  });

  const queryClient = useQueryClient();
  const isEditing = !!editInvoiceId;

  const { data: editData } = useQuery({
    queryKey: ["invoice-edit", editInvoiceId],
    queryFn: async () => {
      if (!editInvoiceId) return null;
      const { data: invoice, error } = await supabase
        .from("invoices")
        .select("*, invoice_items(*)")
        .eq("id", editInvoiceId)
        .single();
      if (error) throw error;
      return invoice;
    },
    enabled: !!editInvoiceId && open,
  });

  useEffect(() => {
    if (editData && open) {
      const styling = editData.custom_styling as any || {};
      form.reset({
        client_id: editData.client_id,
        date: editData.date,
        comments: editData.comments || "",
        payment_terms: styling.payment_terms || "immediate",
        header_notes: styling.header_notes || "",
        footer_notes: styling.footer_notes || "",
        items: editData.invoice_items?.length > 0
          ? editData.invoice_items.map((item: any) => ({
              product_id: item.product_id || "",
              description: item.description || "",
              quantity: item.quantity,
              unit_price: item.unit_price,
              tva: item.tva || 0,
            }))
          : [{ product_id: "", description: "", quantity: 1, unit_price: 0, tva: 0 }],
      });
    }
  }, [editData, open, form]);

  const { data: existingNumbers = [] } = useQuery({
    queryKey: ["invoice-numbers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("number")
        .not("number", "is", null);
      if (error) throw error;
      return data.map(invoice => invoice.number);
    }
  });

  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Utilisateur non authentifié");

      const { data: company } = await supabase
        .from("companies")
        .select("id, name")
        .eq("user_id", user.data.user.id)
        .single();

      if (!company) throw new Error("Profil d'entreprise requis. Allez dans Profil > Entreprise pour le créer.");

      const totalHT = formData.items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.unit_price, 0
      );
      const totalTVA = formData.items.reduce(
        (sum: number, item: any) => sum + (item.quantity * item.unit_price * item.tva) / 100, 0
      );

      if (isEditing) {
        const { error: invoiceError } = await supabase
          .from("invoices")
          .update({
            client_id: formData.client_id,
            date: formData.date,
            comments: formData.comments,
            total_amount: totalHT,
            tva_total: totalTVA,
            custom_styling: {
              payment_terms: formData.payment_terms,
              header_notes: formData.header_notes,
              footer_notes: formData.footer_notes,
            },
          })
          .eq("id", editInvoiceId);

        if (invoiceError) throw invoiceError;

        await supabase.from("invoice_items").delete().eq("invoice_id", editInvoiceId!);

        const invoiceItems = formData.items.map((item: any) => ({
          invoice_id: editInvoiceId,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tva: item.tva,
          total: item.quantity * item.unit_price,
          product_id: item.product_id || null,
        }));

        const { error: itemsError } = await supabase.from("invoice_items").insert(invoiceItems);
        if (itemsError) throw itemsError;

        return { id: editInvoiceId };
      } else {
        // Use company initials for invoice number
        const invoiceNumber = generateInvoiceNumber(existingNumbers, company.name);

        const { data: invoice, error: invoiceError } = await supabase
          .from("invoices")
          .insert([{
            user_id: user.data.user.id,
            company_id: company.id,
            client_id: formData.client_id,
            date: formData.date,
            comments: formData.comments,
            total_amount: totalHT,
            tva_total: totalTVA,
            number: invoiceNumber,
            status: "proforma",
            custom_styling: {
              payment_terms: formData.payment_terms,
              header_notes: formData.header_notes,
              footer_notes: formData.footer_notes,
            },
          }])
          .select()
          .single();

        if (invoiceError) throw invoiceError;

        const invoiceItems = formData.items.map((item: any) => ({
          invoice_id: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tva: item.tva,
          total: item.quantity * item.unit_price,
          product_id: item.product_id || null,
        }));

        const { error: itemsError } = await supabase.from("invoice_items").insert(invoiceItems);
        if (itemsError) throw itemsError;

        return invoice;
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "✅ Facture modifiée" : "✅ Facture créée",
        description: isEditing 
          ? "La facture a été modifiée avec succès" 
          : "La facture proforma a été créée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-numbers"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-edit"] });
      onFactureSaved();
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const watchedItems = form.watch("items");

  const { totalHT, totalTVA, totalTTC } = React.useMemo(() => {
    const totalHT = watchedItems.reduce(
      (sum, item) => sum + item.quantity * item.unit_price, 0
    );
    const totalTVA = watchedItems.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price * item.tva) / 100, 0
    );
    return { totalHT, totalTVA, totalTTC: totalHT + totalTVA };
  }, [watchedItems]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DrawerTitle className="text-lg font-bold">
              {isEditing ? "Modifier la facture" : "Nouvelle facture"}
            </DrawerTitle>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 sm:px-6 pb-6 overflow-y-auto">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <InvoiceBasicInfo form={form} />
              
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <h3 className="font-semibold mb-4 text-sm text-foreground">Récapitulatif</h3>
                <InvoiceTotals 
                  totalHT={totalHT}
                  totalTVA={totalTVA}
                  totalTTC={totalTTC}
                />
              </div>
            </div>

            <InvoiceLineItems form={form} />
            <InvoiceFormActions isSubmitting={mutation.isPending} isEditing={isEditing} />
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FactureProformaForm;
