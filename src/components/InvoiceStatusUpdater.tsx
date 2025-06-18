
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, FileCheck, DollarSign, XCircle } from "lucide-react";

interface InvoiceStatusUpdaterProps {
  invoiceId: string;
  currentStatus: string;
  onStatusUpdated: () => void;
}

const statusConfig = {
  proforma: { label: "Proforma", icon: Clock, color: "text-yellow-600" },
  validated: { label: "Validée", icon: CheckCircle, color: "text-blue-600" },
  final: { label: "Finale", icon: FileCheck, color: "text-green-600" },
  paid: { label: "Payée", icon: DollarSign, color: "text-green-700" },
  cancelled: { label: "Annulée", icon: XCircle, color: "text-red-600" },
};

const InvoiceStatusUpdater: React.FC<InvoiceStatusUpdaterProps> = ({
  invoiceId,
  currentStatus,
  onStatusUpdated
}) => {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("invoices")
        .update({ status: newStatus })
        .eq("id", invoiceId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le statut",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Statut mis à jour",
        description: `Facture marquée comme ${statusConfig[newStatus as keyof typeof statusConfig]?.label.toLowerCase()}`
      });

      onStatusUpdated();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const StatusIcon = statusConfig[currentStatus as keyof typeof statusConfig]?.icon || Clock;

  return (
    <div className="flex items-center gap-2">
      <StatusIcon className={`h-4 w-4 ${statusConfig[currentStatus as keyof typeof statusConfig]?.color}`} />
      <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(statusConfig).map(([status, config]) => (
            <SelectItem key={status} value={status}>
              <div className="flex items-center gap-2">
                <config.icon className={`h-4 w-4 ${config.color}`} />
                {config.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default InvoiceStatusUpdater;
