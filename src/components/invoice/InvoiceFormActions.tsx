
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Save } from "lucide-react";

interface InvoiceFormActionsProps {
  isSubmitting: boolean;
  isEditing?: boolean;
}

const InvoiceFormActions: React.FC<InvoiceFormActionsProps> = ({ 
  isSubmitting,
  isEditing = false,
}) => {
  return (
    <div className="flex justify-end">
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="flex gap-2 items-center"
      >
        {isSubmitting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : isEditing ? (
          <Save size={18} />
        ) : (
          <Plus size={18} />
        )}
        {isEditing ? "Modifier" : "Enregistrer"}
      </Button>
    </div>
  );
};

export default InvoiceFormActions;
