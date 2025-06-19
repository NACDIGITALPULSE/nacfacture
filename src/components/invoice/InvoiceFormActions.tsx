
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

interface InvoiceFormActionsProps {
  isSubmitting: boolean;
}

const InvoiceFormActions: React.FC<InvoiceFormActionsProps> = ({ 
  isSubmitting 
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
        ) : (
          <Plus size={18} />
        )}
        Enregistrer
      </Button>
    </div>
  );
};

export default InvoiceFormActions;
