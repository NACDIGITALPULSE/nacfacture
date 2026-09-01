import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BellRing, Copy, MessageCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthProvider";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useReminders, useLogReminder } from "@/hooks/useReminders";
import {
  buildReminderPlan,
  buildReminderMessage,
  reminderLevelMeta,
  whatsappReminderUrl,
  type ReminderTarget,
} from "@/lib/reminders";
import { computeAmounts, formatAmount } from "@/lib/invoiceStatus";

interface ReminderPanelProps {
  invoices: any[];
}

const ReminderPanel = ({ invoices }: ReminderPanelProps) => {
  const { user } = useAuth();
  const { profile } = useCompanyProfile(user);
  const { data: reminders = [] } = useReminders();
  const logReminder = useLogReminder();

  const plan = React.useMemo(
    () => buildReminderPlan(invoices, reminders),
    [invoices, reminders]
  );

  const messageFor = (t: ReminderTarget) =>
    buildReminderMessage(t, {
      companyName: profile?.name,
      clientName: t.invoice.clients?.name,
      currency: (profile as any)?.currency || "FCFA",
      publicToken: t.invoice.public_token,
    });

  const handleSend = async (t: ReminderTarget) => {
    const message = messageFor(t);
    window.open(whatsappReminderUrl(t.invoice.clients?.phone, message), "_blank");
    try {
      await logReminder.mutateAsync({
        invoiceId: t.invoice.id,
        level: t.level,
        channel: "whatsapp",
        message,
        invoiceNumber: t.invoice.number,
      });
      toast({ title: "Relance enregistrée", description: `Facture ${t.invoice.number || ""}` });
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    }
  };

  const handleCopy = async (t: ReminderTarget) => {
    await navigator.clipboard.writeText(messageFor(t));
    toast({ title: "Message copié", description: "Collez-le dans votre email ou SMS." });
  };

  if (plan.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-foreground mb-3">Relances automatiques</h2>
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Aucune relance nécessaire. Aucune échéance proche ou dépassée.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <BellRing className="h-4 w-4 text-amber-500" />
        <h2 className="text-sm font-semibold text-foreground">
          Relances automatiques ({plan.length})
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {plan.map((t) => {
          const meta = reminderLevelMeta(t.level);
          const a = computeAmounts(t.invoice);
          return (
            <div key={t.invoice.id} className="bg-card rounded-xl border border-border p-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {t.invoice.number || "—"}
                    </span>
                    <Badge variant="outline" className={`text-[10px] ${meta.className}`}>
                      {meta.label}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {t.days >= 0 ? `${t.days} j de retard` : `échéance dans ${-t.days} j`}
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-foreground truncate mt-0.5">
                    {t.invoice.clients?.name || "—"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Restant dû {formatAmount(a.due)}
                    {t.lastSentAt
                      ? ` — dernière relance le ${new Date(t.lastSentAt).toLocaleDateString("fr-FR")}`
                      : " — jamais relancé"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(t)}>
                    <Copy className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Copier</span>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 sm:flex-none"
                    disabled={!t.canSend || logReminder.isPending}
                    onClick={() => handleSend(t)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1.5" />
                    {t.canSend ? "Relancer" : "Déjà relancé"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ReminderPanel;
