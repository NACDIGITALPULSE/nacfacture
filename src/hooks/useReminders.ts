import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import type { ReminderLevel } from "@/lib/reminders";

export interface InvoiceReminder {
  id: string;
  invoice_id: string;
  level: string;
  channel: string;
  message: string | null;
  sent_at: string;
}

export const useReminders = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["invoice_reminders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoice_reminders")
        .select("id, invoice_id, level, channel, message, sent_at")
        .order("sent_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data || []) as InvoiceReminder[];
    },
    enabled: !!user,
  });
};

export const useLogReminder = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      invoiceId: string;
      level: ReminderLevel;
      channel?: string;
      message?: string;
      invoiceNumber?: string | null;
    }) => {
      if (!user) throw new Error("Non authentifié");
      const { error } = await supabase.from("invoice_reminders").insert({
        user_id: user.id,
        invoice_id: payload.invoiceId,
        level: payload.level,
        channel: payload.channel ?? "whatsapp",
        message: payload.message ?? null,
      });
      if (error) throw error;

      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Relance envoyée",
        message: `Une relance a été envoyée pour la facture ${payload.invoiceNumber || ""}.`,
        type: "info",
        metadata: { invoice_id: payload.invoiceId, level: payload.level },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice_reminders"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
