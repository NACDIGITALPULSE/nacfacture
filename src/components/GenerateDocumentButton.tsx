
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Truck, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateInvoiceNumber } from "@/utils/numberGenerator";

interface GenerateDocumentButtonProps {
  invoiceId: string;
  type: "quote" | "delivery_note";
  disabled?: boolean;
  onGenerated?: () => void;
}

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
          existingNumbers?.map(q => q.number) || [],
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
        return "Devis généré avec succès";
      } else {
        // Generate delivery note
        const { data: existingNumbers } = await supabase
          .from("delivery_notes")
          .select("number")
          .not("number", "is", null);

        const deliveryNumber = generateInvoiceNumber(
          existingNumbers?.map(d => d.number) || [],
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
        return "Bon de livraison généré avec succès";
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
