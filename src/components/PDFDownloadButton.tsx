
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { fetchDocumentData } from "@/utils/documentDataFetcher";
import { generateDocumentHTML } from "@/utils/documentHtmlGenerator";
import { generateAndDownloadPDF } from "@/utils/pdfGenerator";

interface PDFDownloadButtonProps {
  documentId: string;
  documentType: "invoice" | "quote" | "delivery_note";
  documentNumber?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  documentId,
  documentType,
  documentNumber,
  variant = "outline",
  size = "sm"
}) => {
  const downloadMutation = useMutation({
    mutationFn: async () => {
      const data = await fetchDocumentData(documentId, documentType);
      const htmlContent = generateDocumentHTML(data, documentType, documentNumber || documentId);
      await generateAndDownloadPDF(htmlContent, documentType, documentNumber || documentId);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Téléchargement réussi",
        description: "Le document a été téléchargé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de téléchargement",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      onClick={() => downloadMutation.mutate()}
      disabled={downloadMutation.isPending}
      variant={variant}
      size={size}
      className="flex items-center gap-2"
    >
      {downloadMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {downloadMutation.isPending ? "Téléchargement..." : "PDF"}
    </Button>
  );
};

export default PDFDownloadButton;
