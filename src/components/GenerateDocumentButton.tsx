
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Truck, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface GenerateDocumentButtonProps {
  invoiceId: string;
  type: "quote" | "delivery_note";
  disabled?: boolean;
  onGenerated?: () => void;
}

const generateInvoiceNumber = (existingNumbers: string[], prefix: string): string => {
  const numbers = existingNumbers
    .filter(num => num && num.startsWith(prefix))
    .map(num => {
      const match = num.match(/\d+$/);
      return match ? parseInt(match[0], 10) : 0;
    });
  
  const maxNumber = Math.max(0, ...numbers);
  return `${prefix}${String(maxNumber + 1).padStart(4, '0')}`;
};

const GenerateDocumentButton: React.FC<GenerateDocumentButtonProps> = ({
  invoiceId,
  type,
  disabled = false,
  onGenerated
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      // Get invoice details
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", invoiceId)
        .single();

      if (invoiceError) throw invoiceError;

      if (type === "quote") {
        // Generate quote
        const { data: existingNumbers } = await supabase
          .from("quotes")
          .select("number")
          .not("number", "is", null);

        const quoteNumber = generateInvoiceNumber(
          existingNumbers?.map(q => q.number).filter(Boolean) || [],
          "DEVIS"
        );

        const { error: quoteError } = await supabase
          .from("quotes")
          .insert({
            invoice_id: invoiceId,
            user_id: invoice.user_id,
            number: quoteNumber,
            date: new Date().toISOString().split('T')[0],
            total_amount: invoice.total_amount,
            comments: `Devis généré depuis la facture ${invoice.number}`
          });

        if (quoteError) throw quoteError;
        return "Devis généré avec succès et disponible dans l'onglet Devis";
      } else {
        // Generate delivery note
        const { data: existingNumbers } = await supabase
          .from("delivery_notes")
          .select("number")
          .not("number", "is", null);

        const deliveryNumber = generateInvoiceNumber(
          existingNumbers?.map(d => d.number).filter(Boolean) || [],
          "BL"
        );

        const { error: deliveryError } = await supabase
          .from("delivery_notes")
          .insert({
            invoice_id: invoiceId,
            user_id: invoice.user_id,
            number: deliveryNumber,
            date: new Date().toISOString().split('T')[0],
            comments: `Bon de livraison généré depuis la facture ${invoice.number}`
          });

        if (deliveryError) throw deliveryError;
        return "Bon de livraison généré avec succès et disponible dans l'onglet Bons de livraison";
      }
    },
    onSuccess: (message) => {
      toast({
        title: "Document généré",
        description: message,
      });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["delivery_notes"] });
      onGenerated?.();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const Icon = type === "quote" ? FileText : Truck;
  const label = type === "quote" ? "Générer devis" : "Générer bon de livraison";

  return (
    <Button
      onClick={() => mutation.mutate()}
      disabled={disabled || mutation.isPending}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {mutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      {mutation.isPending ? "Génération..." : label}
    </Button>
  );
};

export default GenerateDocumentButton;
