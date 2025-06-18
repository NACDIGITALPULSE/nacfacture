
import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/hooks/useClients";
import { useProducts } from "@/hooks/useProducts";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Loader2, X } from "lucide-react";

interface FactureFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFactureSaved: () => void;
}

type Product = {
  id: string;
  name: string;
  price: number;
  tva: number | null;
}

type Client = {
  id: string;
  name: string;
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

const FactureProformaForm: React.FC<FactureFormProps> = ({ open, onOpenChange, onFactureSaved }) => {
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const form = useForm<FactureFormValues>({
    defaultValues: {
      client_id: "",
      date: new Date().toISOString().substring(0, 10),
      lignes: [
        {
          product_id: "",
          description: "",
          quantity: 1,
          unit_price: 0,
          tva: 0,
        }
      ],
      comments: "",
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lignes"
  });

  // Calcul du total
  const lignes = form.watch("lignes");
  const totalHT = lignes.reduce((sum, l) => sum + Number(l.quantity) * Number(l.unit_price), 0);
  const totalTVA = lignes.reduce((sum, l) => sum + Number(l.quantity) * Number(l.unit_price) * (Number(l.tva) / 100), 0);
  const totalTTC = totalHT + totalTVA;

  // Sélection auto du prix/TVA produit lors du sélection dans le formulaire
  function handleProductChange(index: number, product_id: string) {
    const prod = products.find((p: Product) => p.id === product_id);
    if (prod) {
      form.setValue(`lignes.${index}.unit_price`, prod.price);
      form.setValue(`lignes.${index}.tva`, prod.tva || 0);
      form.setValue(`lignes.${index}.description`, prod.name);
    }
  }

  async function onSubmit(values: FactureFormValues) {
    const user_id = (await supabase.auth.getUser()).data.user?.id;
    if (!user_id) return toast({ title: "Erreur", description: "Utilisateur non authentifié", variant: "destructive" });

    const { data: companyArr } = await supabase.from("companies").select("id").eq("user_id", user_id).limit(1);
    const company_id = companyArr?.[0]?.id;
    if (!company_id) return toast({ title: "Entreprise manquante", description: "Configurez d'abord votre profil entreprise.", variant: "destructive" });

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
      toast({ title: "Erreur création facture", description: error?.message || "Erreur inconnue", variant: "destructive" });
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

    toast({ title: "Facture enregistrée", description: "La facture proforma a bien été créée." });
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
          <div>
            <label className="block text-sm mb-1 font-medium">Client</label>
            <select
              className="w-full border rounded px-3 py-2"
              {...form.register("client_id", { required: true })}
              disabled={clientsLoading}
            >
              <option value="">Sélectionner un client</option>
              {clients.map((client: Client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Date</label>
            <Input type="date" {...form.register("date", { required: true })} />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Lignes</label>
            <div className="flex flex-col gap-3">
              {fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2 items-end shadow-sm border rounded-lg p-2 bg-gray-50">
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-xs text-gray-500">Produit</label>
                    <select className="w-full border rounded px-2 py-1"
                      {...form.register(`lignes.${idx}.product_id` as const, {
                        onChange: (e) => handleProductChange(idx, e.target.value),
                        required: true,
                      })}
                      disabled={productsLoading}
                    >
                      <option value="">Sélectionner</option>
                      {products.map((prod: Product) => (
                        <option key={prod.id} value={prod.id}>{prod.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[80px]">
                    <label className="text-xs text-gray-500">Qté</label>
                    <Input type="number" min={1} {...form.register(`lignes.${idx}.quantity` as const, { valueAsNumber: true, required: true })} />
                  </div>
                  <div className="flex-1 min-w-[80px]">
                    <label className="text-xs text-gray-500">Prix U</label>
                    <Input type="number" step={0.01} {...form.register(`lignes.${idx}.unit_price` as const, { valueAsNumber: true, required: true })} />
                  </div>
                  <div className="flex-1 min-w-[80px]">
                    <label className="text-xs text-gray-500">TVA (%)</label>
                    <Input type="number" step={0.01} {...form.register(`lignes.${idx}.tva` as const, { valueAsNumber: true, required: true })} />
                  </div>
                  <button type="button" onClick={() => remove(idx)} className="p-1 text-destructive hover:bg-red-100 rounded">
                    <X size={20} />
                  </button>
                </div>
              ))}
              <button type="button"
                className="w-fit flex gap-1 items-center text-blue-700 font-medium mt-1"
                onClick={() => append({ product_id: "", description: "", quantity: 1, unit_price: 0, tva: 0 })}
              >
                <Plus size={16} /> Ajouter ligne
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Commentaires</label>
            <Textarea {...form.register("comments")} className="h-14" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between"><span>Sous-total HT</span><span>{totalHT.toFixed(2)} FCFA</span></div>
            <div className="flex justify-between"><span>Total TVA</span><span>{totalTVA.toFixed(2)} FCFA</span></div>
            <div className="flex justify-between font-bold text-blue-700 text-lg"><span>Total TTC</span><span>{totalTTC.toFixed(2)} FCFA</span></div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting} className="flex gap-2 items-center">
              {form.formState.isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Plus size={18} />}
              Enregistrer
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default FactureProformaForm;
