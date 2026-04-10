
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, FileCheck, DollarSign, XCircle, Send, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InvoiceStatusUpdaterProps {
  invoiceId: string;
  currentStatus: string;
  onStatusUpdated: () => void;
}

type InvoiceStatus = "proforma" | "validated" | "final" | "paid" | "cancelled";

const statusConfig = {
  proforma: { label: "Brouillon", icon: Clock, color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800" },
  validated: { label: "Envoyée", icon: Send, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" },
  final: { label: "Finalisée", icon: FileCheck, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800" },
  paid: { label: "Payée", icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" },
  cancelled: { label: "Annulée", icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" },
};

const InvoiceStatusUpdater: React.FC<InvoiceStatusUpdaterProps> = ({
  invoiceId,
  currentStatus,
  onStatusUpdated
}) => {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("invoices")
        .update({ status: newStatus })
        .eq("id", invoiceId);

      if (error) {
        toast({ title: "Erreur", description: "Impossible de mettre à jour le statut", variant: "destructive" });
        return;
      }

      toast({ title: "Statut mis à jour", description: `Facture marquée comme "${statusConfig[newStatus]?.label}"` });
      onStatusUpdated();
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour du statut", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const config = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.proforma;
  const StatusIcon = config.icon;

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
      <SelectTrigger className={`w-[140px] h-8 text-xs font-semibold border ${config.bg} ${config.color}`}>
        <div className="flex items-center gap-1.5">
          <StatusIcon className="h-3.5 w-3.5" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusConfig).map(([status, cfg]) => (
          <SelectItem key={status} value={status}>
            <div className="flex items-center gap-2">
              <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
              <span className="font-medium">{cfg.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default InvoiceStatusUpdater;
