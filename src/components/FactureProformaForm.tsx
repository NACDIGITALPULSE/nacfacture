
import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import InvoiceBasicInfo from "./invoice/InvoiceBasicInfo";
import InvoiceLineItems from "./invoice/InvoiceLineItems";
import InvoiceTotals from "./invoice/InvoiceTotals";
import InvoiceFormActions from "./invoice/InvoiceFormActions";

interface FactureFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFactureSaved: () => void;
}

interface LigneForm {
  product_id: string;
  description?: string;
  quantity: number;
  unit_price: number;
  tva: number;
}

interface FactureFormValues {
  client_id: string;
  date: string;
  comments?: string;
  lignes: LigneForm[];
}

const FactureProformaForm: React.FC<FactureFormProps> = ({ 
  open, 
  onOpenChange, 
  onFactureSaved 
}) => {
  const form = useForm<FactureFormValues>({
    defaultValues: {
      client_id: "",
      date: new Date().toISOString().substring(0, 10),
      lignes: [{
        product_id: "",
        description: "",
        quantity: 1,
        unit_price: 0,
        tva: 0,
      }],
      comments: "",
    }
  });

  // Calcul des totaux
  const lignes = form.watch("lignes");
  const totalHT = lignes.reduce((sum, l) => sum + Number(l.quantity) * Number(l.unit_price), 0);
  const totalTVA = lignes.reduce((sum, l) => sum + Number(l.quantity) * Number(l.unit_price) * (Number(l.tva) / 100), 0);
  const totalTTC = totalHT + totalTVA;

  async function onSubmit(values: FactureFormValues) {
    const user_id = (await supabase.auth.getUser()).data.user?.id;
    if (!user_id) {
      return toast({ 
        title: "Erreur", 
        description: "Utilisateur non authentifié", 
        variant: "destructive" 
      });
    }

    const { data: companyArr } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user_id)
      .limit(1);
    
    const company_id = companyArr?.[0]?.id;
    if (!company_id) {
      return toast({ 
        title: "Entreprise manquante", 
        description: "Configurez d'abord votre profil entreprise.", 
        variant: "destructive" 
      });
    }

    // Créer la facture proforma
    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert([{
        user_id,
        client_id: values.client_id,
        company_id,
        status: "proforma" as const,
        date: values.date,
        total_amount: totalTTC,
        tva_total: totalTVA,
        comments: values.comments,
      }])
      .select()
      .single();

    if (error || !invoice) {
      toast({ 
        title: "Erreur création facture", 
        description: error?.message || "Erreur inconnue", 
        variant: "destructive" 
      });
      return;
    }

    // Enregistrer les lignes
    for (const l of values.lignes) {
      await supabase.from("invoice_items").insert({
        invoice_id: invoice.id,
        description: l.description,
        product_id: l.product_id || null,
        quantity: l.quantity,
        unit_price: l.unit_price,
        tva: l.tva,
        total: l.quantity * l.unit_price * (1 + l.tva / 100),
      });
    }

    toast({ 
      title: "Facture enregistrée", 
      description: "La facture proforma a bien été créée." 
    });
    
    onOpenChange(false);
    form.reset();
    onFactureSaved();
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-3 py-4 max-h-screen overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>
            <span className="flex items-center gap-2">
              <Plus size={20} className="text-blue-700" />
              Nouvelle facture proforma
            </span>
          </DrawerTitle>
        </DrawerHeader>
        
        <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
          <InvoiceBasicInfo form={form} />
          <InvoiceLineItems form={form} />
          <InvoiceTotals 
            totalHT={totalHT} 
            totalTVA={totalTVA} 
            totalTTC={totalTTC} 
          />
          <InvoiceFormActions isSubmitting={form.formState.isSubmitting} />
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default FactureProformaForm;
