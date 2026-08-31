import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Clock, FileCheck, DollarSign, XCircle, Send, AlertTriangle, PieChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { statusMeta } from "@/lib/invoiceStatus";

interface InvoiceStatusUpdaterProps {
  invoiceId: string;
  currentStatus: string;
  onStatusUpdated: () => void;
}

/** Statuts modifiables manuellement. Les autres découlent des paiements. */
type ManualStatus = "proforma" | "sent" | "validated" | "final" | "cancelled";

const MANUAL_STATUSES: { value: ManualStatus; icon: React.ElementType }[] = [
  { value: "proforma", icon: Clock },
  { value: "sent", icon: Send },
  { value: "validated", icon: FileCheck },
  { value: "final", icon: FileCheck },
  { value: "cancelled", icon: XCircle },
];

const DERIVED_ICONS: Record<string, React.ElementType> = {
  paid: DollarSign,
  partially_paid: PieChart,
  overdue: AlertTriangle,
};

const InvoiceStatusUpdater: React.FC<InvoiceStatusUpdaterProps> = ({
  invoiceId,
  currentStatus,
  onStatusUpdated,
}) => {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const meta = statusMeta(currentStatus);

  // Statut calculé à partir des paiements : non modifiable à la main.
  if (DERIVED_ICONS[currentStatus]) {
    const Icon = DERIVED_ICONS[currentStatus];
    return (
      <Badge variant="outline" className={`h-8 gap-1.5 px-2.5 text-xs font-semibold ${meta.className}`}>
        <Icon className="h-3.5 w-3.5" />
        {meta.label}
      </Badge>
    );
  }

  const handleStatusChange = async (newStatus: ManualStatus) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.from("invoices").update({ status: newStatus }).eq("id", invoiceId);
      if (error) {
        toast({ title: "Erreur", description: "Impossible de mettre à jour le statut", variant: "destructive" });
        return;
      }
      toast({ title: "Statut mis à jour", description: `Facture marquée « ${statusMeta(newStatus).label} »` });
      onStatusUpdated();
    } finally {
      setIsUpdating(false);
    }
  };

  const CurrentIcon = MANUAL_STATUSES.find((s) => s.value === currentStatus)?.icon ?? Clock;

  return (
    <Select value={currentStatus} onValueChange={(v) => handleStatusChange(v as ManualStatus)} disabled={isUpdating}>
      <SelectTrigger className={`w-[150px] h-8 text-xs font-semibold border ${meta.className}`}>
        <div className="flex items-center gap-1.5">
          <CurrentIcon className="h-3.5 w-3.5" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {MANUAL_STATUSES.map(({ value, icon: Icon }) => (
          <SelectItem key={value} value={value}>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="font-medium">{statusMeta(value).label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default InvoiceStatusUpdater;
