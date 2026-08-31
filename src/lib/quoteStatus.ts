/**
 * Service centralisé des statuts de devis.
 * Ne jamais dupliquer cette logique dans les composants.
 */

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired" | "converted";

export interface QuoteStatusMeta {
  label: string;
  className: string;
}

export const QUOTE_STATUS_META: Record<string, QuoteStatusMeta> = {
  draft: { label: "Brouillon", className: "bg-muted text-muted-foreground border-border" },
  sent: { label: "Envoyé", className: "bg-primary/10 text-primary border-primary/30" },
  accepted: {
    label: "Accepté",
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  rejected: { label: "Refusé", className: "bg-destructive/15 text-destructive border-destructive/30" },
  expired: {
    label: "Expiré",
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  converted: {
    label: "Converti en facture",
    className: "bg-primary/20 text-primary border-primary/40",
  },
};

/** Statuts modifiables manuellement (les autres sont dérivés). */
export const MANUAL_QUOTE_STATUSES: QuoteStatus[] = ["draft", "sent", "accepted", "rejected"];

export function quoteStatusMeta(status?: string | null): QuoteStatusMeta {
  return QUOTE_STATUS_META[status ?? ""] ?? QUOTE_STATUS_META.draft;
}

/** Statut effectif : converti > expiré > statut stocké. Aucune écriture DB. */
export function effectiveQuoteStatus(quote: {
  status?: string | null;
  expires_at?: string | null;
  converted_invoice_id?: string | null;
}): QuoteStatus {
  if (quote.converted_invoice_id) return "converted";
  const status = (quote.status ?? "draft") as QuoteStatus;
  if (status === "rejected" || status === "accepted") return status;
  if (quote.expires_at && new Date(quote.expires_at) < new Date(new Date().toDateString())) {
    return "expired";
  }
  return status;
}

/** Un devis n'est convertible qu'une seule fois et s'il n'est ni refusé ni expiré. */
export function canConvertQuote(quote: {
  status?: string | null;
  expires_at?: string | null;
  converted_invoice_id?: string | null;
}): boolean {
  const status = effectiveQuoteStatus(quote);
  return status !== "converted" && status !== "rejected" && status !== "expired";
}
