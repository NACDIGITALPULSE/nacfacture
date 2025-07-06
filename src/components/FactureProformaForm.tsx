
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateInvoiceNumber } from "@/utils/numberGenerator";
import InvoiceBasicInfo from "./invoice/InvoiceBasicInfo";
import InvoiceLineItems from "./invoice/InvoiceLineItems";
import InvoiceTotals from "./invoice/InvoiceTotals";
import InvoiceFormActions from "./invoice/InvoiceFormActions";

interface FactureProformaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFactureSaved: () => void;
}

const FactureProformaForm: React.FC<FactureProformaFormProps> = ({
  open,
  onOpenChange,
  onFactureSaved,
}) => {
  const form = useForm({
    defaultValues: {
      client_id: "",
      date: new Date().toISOString().split("T")[0],
      comments: "",
      payment_terms: "immediate",
      header_notes: "",
      footer_notes: "",
      items: [{ description: "", quantity: 1, unit_price: 0, tva: 0 }],
    }
  });

  const queryClient = useQueryClient();

  // Get existing invoice numbers for auto-numbering
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
        .select("id")
        .eq("user_id", user.data.user.id)
        .single();

      if (!company) throw new Error("Profil d'entreprise requis");

      // Calculate totals
      const totalHT = formData.items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.unit_price,
        0
      );
      const totalTVA = formData.items.reduce(
        (sum: number, item: any) => sum + (item.quantity * item.unit_price * item.tva) / 100,
        0
      );
      const totalTTC = totalHT + totalTVA;

      // Generate invoice number
      const invoiceNumber = generateInvoiceNumber(existingNumbers);

      // Create invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert([
          {
            user_id: user.data.user.id,
            company_id: company.id,
            client_id: formData.client_id,
            date: formData.date,
            comments: formData.comments,
            total_amount: totalTTC,
            tva_total: totalTVA,
            number: invoiceNumber,
            status: "proforma",
            custom_styling: {
              payment_terms: formData.payment_terms,
              header_notes: formData.header_notes,
              footer_notes: formData.footer_notes
            },
          },
        ])
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create invoice items
      const invoiceItems = formData.items.map((item: any) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tva: item.tva,
        total: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItems);

      if (itemsError) throw itemsError;

      return invoice;
    },
    onSuccess: () => {
      toast({
        title: "Facture créée",
        description: "La facture proforma a été créée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-numbers"] });
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
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const totalTVA = watchedItems.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price * item.tva) / 100,
      0
    );
    const totalTTC = totalHT + totalTVA;
    return { totalHT, totalTVA, totalTTC };
  }, [watchedItems]);

  // Reset form when drawer closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader>
          <DrawerTitle>Nouvelle facture proforma</DrawerTitle>
        </DrawerHeader>

        <div className="px-6 pb-6 overflow-y-auto">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <InvoiceBasicInfo form={form} />
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Totaux</h3>
                <InvoiceTotals 
                  totalHT={totalHT}
                  totalTVA={totalTVA}
                  totalTTC={totalTTC}
                />
              </div>
            </div>

            <InvoiceLineItems form={form} />
            <InvoiceFormActions isSubmitting={mutation.isPending} />
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FactureProformaForm;
