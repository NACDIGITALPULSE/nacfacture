import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MANUAL_QUOTE_STATUSES,
  effectiveQuoteStatus,
  quoteStatusMeta,
} from "@/lib/quoteStatus";
import { useUpdateQuoteStatus } from "@/hooks/useQuoteConversion";

interface QuoteStatusUpdaterProps {
  quote: any;
}

const QuoteStatusUpdater: React.FC<QuoteStatusUpdaterProps> = ({ quote }) => {
  const updateStatus = useUpdateQuoteStatus();
  const status = effectiveQuoteStatus(quote);
  const meta = quoteStatusMeta(status);

  // Statuts dérivés (converti / expiré) : lecture seule.
  if (status === "converted" || status === "expired") {
    return (
      <Badge variant="outline" className={`h-8 px-2.5 text-xs font-semibold ${meta.className}`}>
        {meta.label}
      </Badge>
    );
  }

  return (
    <Select
      value={status}
      onValueChange={(value) => updateStatus.mutate({ quoteId: quote.id, status: value })}
      disabled={updateStatus.isPending}
    >
      <SelectTrigger className={`w-[130px] h-8 text-xs font-semibold border ${meta.className}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {MANUAL_QUOTE_STATUSES.map((value) => (
          <SelectItem key={value} value={value}>
            {quoteStatusMeta(value).label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default QuoteStatusUpdater;
