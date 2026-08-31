import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateInvoiceNumber } from "@/utils/numberGenerator";
import { canConvertQuote } from "@/lib/quoteStatus";

/** Met à jour le statut d'un devis. */
export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quoteId, status }: { quoteId: string; status: string }) => {
      const { error } = await supabase.from("quotes").update({ status }).eq("id", quoteId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast({ title: "Statut mis à jour", description: "Le statut du devis a été modifié." });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });
}

/**
 * Convertit un devis accepté en facture officielle :
 * duplique la facture source et ses lignes sous un nouveau numéro,
 * puis verrouille le devis via converted_invoice_id.
 */
export function useConvertQuoteToInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quote: any) => {
      if (!canConvertQuote(quote)) {
        throw new Error("Ce devis ne peut pas être converti (déjà converti, refusé ou expiré).");
      }

      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) throw new Error("Utilisateur non authentifié");

      // Facture source du devis
      const { data: source, error: sourceError } = await supabase
        .from("invoices")
        .select("*, invoice_items(*)")
        .eq("id", quote.invoice_id)
        .single();
      if (sourceError) throw sourceError;

      // Numérotation basée sur les initiales de l'entreprise
      const [{ data: company }, { data: existing }] = await Promise.all([
        supabase.from("companies").select("name").eq("id", source.company_id).maybeSingle(),
        supabase.from("invoices").select("number").eq("user_id", userId),
      ]);

      const number = generateInvoiceNumber(
        (existing || []).map((i: any) => i.number).filter(Boolean),
        company?.name
      );

      const today = new Date();
      const dueDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          user_id: userId,
          client_id: source.client_id,
          company_id: source.company_id,
          template_id: source.template_id,
          custom_styling: source.custom_styling,
          status: "validated",
          number,
          date: today.toISOString().slice(0, 10),
          due_date: dueDate.toISOString().slice(0, 10),
          total_amount: source.total_amount,
          tva_total: source.tva_total,
          allow_partial_payment: true,
          comments: source.comments,
        })
        .select()
        .single();
      if (invoiceError) throw invoiceError;

      const items = (source.invoice_items || []).map((item: any) => ({
        invoice_id: invoice.id,
        product_id: item.product_id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tva: item.tva,
        total: item.total,
      }));

      if (items.length > 0) {
        const { error: itemsError } = await supabase.from("invoice_items").insert(items);
        if (itemsError) throw itemsError;
      }

      const { error: quoteError } = await supabase
        .from("quotes")
        .update({ status: "accepted", converted_invoice_id: invoice.id })
        .eq("id", quote.id);
      if (quoteError) throw quoteError;

      return invoice;
    },
    onSuccess: (invoice: any) => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({
        title: "Devis converti",
        description: `La facture ${invoice.number} a été créée à partir de ce devis.`,
      });
    },
    onError: (error: any) => {
      toast({ title: "Conversion impossible", description: error.message, variant: "destructive" });
    },
  });
}
