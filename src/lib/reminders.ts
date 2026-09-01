/**
 * Service centralisé des relances de factures impayées.
 * Ne jamais dupliquer cette logique dans les composants.
 */
import { computeAmounts, formatAmount, paymentLink } from "@/lib/invoiceStatus";

export type ReminderLevel = "upcoming" | "courtesy" | "firm" | "formal";

export interface ReminderLevelMeta {
  level: ReminderLevel;
  label: string;
  className: string;
  /** Délai minimum conseillé avant une nouvelle relance du même niveau (jours) */
  cooldownDays: number;
}

export const REMINDER_LEVELS: Record<ReminderLevel, ReminderLevelMeta> = {
  upcoming: {
    level: "upcoming",
    label: "Échéance proche",
    className: "bg-primary/10 text-primary border-primary/30",
    cooldownDays: 3,
  },
  courtesy: {
    level: "courtesy",
    label: "Relance courtoise",
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    cooldownDays: 5,
  },
  firm: {
    level: "firm",
    label: "Relance ferme",
    className: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    cooldownDays: 7,
  },
  formal: {
    level: "formal",
    label: "Mise en demeure",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    cooldownDays: 10,
  },
};

export function reminderLevelMeta(level?: string | null): ReminderLevelMeta {
  return REMINDER_LEVELS[(level as ReminderLevel) ?? "courtesy"] ?? REMINDER_LEVELS.courtesy;
}

const DAY = 24 * 60 * 60 * 1000;

/** Nombre de jours de retard (négatif = échéance à venir). */
export function daysOverdue(dueDate?: string | null): number | null {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const today = new Date(new Date().toDateString());
  return Math.round((today.getTime() - new Date(due.toDateString()).getTime()) / DAY);
}

/** Niveau de relance conseillé pour une facture, ou null si aucune relance n'est requise. */
export function suggestedLevel(invoice: {
  status?: string | null;
  due_date?: string | null;
  ttc_amount?: number | null;
  total_amount?: number | null;
  tva_total?: number | null;
  amount_paid?: number | null;
}): ReminderLevel | null {
  const status = invoice.status ?? "proforma";
  if (status === "cancelled" || status === "proforma") return null;
  const { due } = computeAmounts(invoice);
  if (due <= 0) return null;

  const d = daysOverdue(invoice.due_date);
  if (d === null) return null;
  if (d < -3) return null;
  if (d < 0) return "upcoming";
  if (d <= 7) return "courtesy";
  if (d <= 21) return "firm";
  return "formal";
}

export interface ReminderTarget {
  invoice: any;
  level: ReminderLevel;
  days: number;
  lastSentAt: string | null;
  canSend: boolean;
}

/** Construit la liste des factures à relancer, triée par urgence. */
export function buildReminderPlan(
  invoices: any[],
  reminders: { invoice_id: string; sent_at: string }[]
): ReminderTarget[] {
  const lastByInvoice = new Map<string, string>();
  for (const r of reminders) {
    const prev = lastByInvoice.get(r.invoice_id);
    if (!prev || new Date(r.sent_at) > new Date(prev)) lastByInvoice.set(r.invoice_id, r.sent_at);
  }

  return invoices
    .map((invoice) => {
      const level = suggestedLevel(invoice);
      if (!level) return null;
      const lastSentAt = lastByInvoice.get(invoice.id) ?? null;
      const cooldown = REMINDER_LEVELS[level].cooldownDays;
      const canSend =
        !lastSentAt || (Date.now() - new Date(lastSentAt).getTime()) / DAY >= cooldown;
      return { invoice, level, days: daysOverdue(invoice.due_date) ?? 0, lastSentAt, canSend };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.days - a.days) as ReminderTarget[];
}

/** Message de relance professionnel, adapté au niveau. */
export function buildReminderMessage(
  target: ReminderTarget,
  opts: { companyName?: string; clientName?: string; currency?: string; publicToken?: string | null }
): string {
  const { invoice, level, days } = target;
  const amounts = computeAmounts(invoice);
  const currency = opts.currency || "FCFA";
  const client = opts.clientName || "Cher client";
  const company = opts.companyName || "";
  const number = invoice.number || "";
  const dueLabel = invoice.due_date
    ? new Date(invoice.due_date).toLocaleDateString("fr-FR")
    : "—";
  const link = opts.publicToken ? `\n\nRégler en ligne : ${paymentLink(opts.publicToken)}` : "";
  const montants =
    `Facture N° ${number}\n` +
    `Montant total : ${formatAmount(amounts.total, currency)}\n` +
    (amounts.paid > 0 ? `Déjà réglé : ${formatAmount(amounts.paid, currency)}\n` : "") +
    `Restant dû : ${formatAmount(amounts.due, currency)}\n` +
    `Échéance : ${dueLabel}`;

  const intro: Record<ReminderLevel, string> = {
    upcoming:
      `Bonjour ${client},\n\nNous vous rappelons aimablement que l'échéance de votre facture approche.`,
    courtesy:
      `Bonjour ${client},\n\nSauf erreur de notre part, la facture ci-dessous demeure impayée depuis ${days} jour(s). Il s'agit probablement d'un simple oubli.`,
    firm:
      `Bonjour ${client},\n\nMalgré nos précédentes relances, la facture ci-dessous reste impayée depuis ${days} jours. Nous vous prions de procéder au règlement sous 7 jours.`,
    formal:
      `Bonjour ${client},\n\nMISE EN DEMEURE — la facture ci-dessous demeure impayée depuis ${days} jours malgré nos relances successives. À défaut de règlement sous 8 jours, nous serons contraints d'engager les procédures de recouvrement prévues.`,
  };

  const outro: Record<ReminderLevel, string> = {
    upcoming: "Nous vous remercions par avance de votre règlement dans les délais.",
    courtesy: "Nous vous remercions de bien vouloir régulariser dans les meilleurs délais.",
    firm: "Merci de nous confirmer la date de votre règlement.",
    formal: "Nous restons à votre disposition pour convenir d'un échéancier avant cette date.",
  };

  return (
    `${intro[level]}\n\n${montants}${link}\n\n${outro[level]}\n\nCordialement,\n${company}`
  );
}

export function whatsappReminderUrl(phone: string | undefined | null, message: string) {
  const digits = (phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  const normalized = digits.length === 8 ? `227${digits}` : digits;
  const text = encodeURIComponent(message);
  return normalized ? `https://wa.me/${normalized}?text=${text}` : `https://wa.me/?text=${text}`;
}
