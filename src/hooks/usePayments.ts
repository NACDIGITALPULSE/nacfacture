import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PaymentInput {
  invoice_id: string;
  amount: number;
  currency?: string;
  payment_method: string;
  payment_reference?: string | null;
  notes?: string | null;
  paid_at?: string;
}

/** Tous les paiements de l'utilisateur (avec facture + client). */
export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*, invoices(number, ttc_amount, total_amount, tva_total, amount_paid, clients(name))")
        .order("paid_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

/** Paiements d'une facture précise. */
export function useInvoicePayments(invoiceId?: string) {
  return useQuery({
    queryKey: ["payments", invoiceId],
    enabled: !!invoiceId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("invoice_id", invoiceId!)
        .order("paid_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  ["payments", "factures", "invoices", "receipts", "dashboard-stats"].forEach((key) =>
    queryClient.invalidateQueries({ queryKey: [key] })
  );
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: PaymentInput) => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) throw new Error("Utilisateur non authentifié");

      // Validation serveur-side friendly : on relit la facture avant d'écrire
      const { data: invoice, error: invErr } = await supabase
        .from("invoices")
        .select("id, ttc_amount, total_amount, tva_total, amount_paid, allow_partial_payment")
        .eq("id", input.invoice_id)
        .single();
      if (invErr) throw invErr;

      const total = Number(invoice.ttc_amount ?? Number(invoice.total_amount) + Number(invoice.tva_total));
      const due = Math.max(total - Number(invoice.amount_paid ?? 0), 0);

      if (input.amount <= 0) throw new Error("Le montant doit être supérieur à 0");
      if (input.amount > due) throw new Error(`Le montant dépasse le restant dû (${due.toLocaleString("fr-FR")})`);

      const { data: payment, error } = await supabase
        .from("payments")
        .insert({
          user_id: userId,
          invoice_id: input.invoice_id,
          amount: input.amount,
          currency: input.currency ?? "FCFA",
          payment_method: input.payment_method,
          payment_reference: input.payment_reference || null,
          notes: input.notes || null,
          status: "success",
          paid_at: input.paid_at ?? new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;

      // Reçu automatique
      const receiptNumber = `REC-${new Date().getFullYear()}-${payment.id.slice(0, 8).toUpperCase()}`;
      await supabase.from("receipts").insert({
        user_id: userId,
        payment_id: payment.id,
        invoice_id: input.invoice_id,
        amount: input.amount,
        number: receiptNumber,
      });

      return { payment, receiptNumber };
    },
    onSuccess: ({ receiptNumber }) => {
      toast({ title: "Paiement enregistré ✓", description: `Reçu ${receiptNumber} généré automatiquement.` });
      invalidateAll(queryClient);
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await supabase.from("payments").delete().eq("id", paymentId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Paiement supprimé", description: "Les montants de la facture ont été recalculés." });
      invalidateAll(queryClient);
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });
}

export function useReceipts() {
  return useQuery({
    queryKey: ["receipts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*, invoices(number, clients(name)), payments(payment_method, paid_at)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}
