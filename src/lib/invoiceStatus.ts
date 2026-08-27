/**
 * Service centralisé des statuts de facture.
 * Ne jamais dupliquer cette logique dans les composants.
 */

export type InvoiceStatus =
  | "proforma"
  | "sent"
  | "validated"
  | "final"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "cancelled";

export interface StatusMeta {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
}

export const INVOICE_STATUS_META: Record<string, StatusMeta> = {
  proforma: { label: "Brouillon", variant: "secondary", className: "bg-muted text-muted-foreground" },
  sent: { label: "Envoyée", variant: "outline", className: "bg-primary/10 text-primary border-primary/30" },
  validated: { label: "Validée", variant: "default", className: "bg-primary/15 text-primary border-primary/30" },
  final: { label: "Finalisée", variant: "outline", className: "bg-primary/10 text-primary border-primary/30" },
  partially_paid: {
    label: "Partiellement payée",
    variant: "outline",
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  paid: {
    label: "Payée",
    variant: "default",
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  overdue: {
    label: "En retard",
    variant: "destructive",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  cancelled: { label: "Annulée", variant: "destructive", className: "bg-destructive/10 text-destructive" },
};

export function statusMeta(status?: string | null): StatusMeta {
  return INVOICE_STATUS_META[status ?? ""] ?? INVOICE_STATUS_META.proforma;
}

export interface InvoiceAmounts {
  total: number;
  paid: number;
  due: number;
}

/** Calcule les montants d'une facture (TTC source de vérité côté DB). */
export function computeAmounts(invoice: {
  ttc_amount?: number | null;
  total_amount?: number | null;
  tva_total?: number | null;
  amount_paid?: number | null;
}): InvoiceAmounts {
  const total = Number(
    invoice.ttc_amount ?? (Number(invoice.total_amount ?? 0) + Number(invoice.tva_total ?? 0))
  );
  const paid = Number(invoice.amount_paid ?? 0);
  return { total, paid, due: Math.max(total - paid, 0) };
}

/** Statut effectif affiché (prend en compte le retard sans écriture DB). */
export function effectiveStatus(invoice: {
  status?: string | null;
  due_date?: string | null;
  ttc_amount?: number | null;
  total_amount?: number | null;
  tva_total?: number | null;
  amount_paid?: number | null;
}): InvoiceStatus {
  const status = (invoice.status ?? "proforma") as InvoiceStatus;
  if (status === "cancelled" || status === "proforma") return status;

  const { total, paid, due } = computeAmounts(invoice);
  if (total > 0 && paid >= total) return "paid";
  if (paid > 0) return "partially_paid";
  if (invoice.due_date && due > 0 && new Date(invoice.due_date) < new Date(new Date().toDateString())) {
    return "overdue";
  }
  return status;
}

export const PAYMENT_METHODS = [
  { value: "cash", label: "Espèces" },
  { value: "bank_transfer", label: "Virement bancaire" },
  { value: "cheque", label: "Chèque" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "ipay", label: "i-Pay (en ligne)" },
  { value: "other", label: "Autre" },
] as const;

export function paymentMethodLabel(value?: string | null) {
  return PAYMENT_METHODS.find((m) => m.value === value)?.label ?? "Autre";
}

export function formatAmount(amount: number, currency = "FCFA") {
  return `${Number(amount || 0).toLocaleString("fr-FR")} ${currency}`;
}

export function paymentLink(token: string) {
  return `${window.location.origin}/pay/${token}`;
}
