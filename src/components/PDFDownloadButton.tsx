
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
      let query;
      let tableName;
      
      switch (documentType) {
        case "invoice":
          tableName = "invoices";
          query = supabase
            .from("invoices")
            .select(`
              *,
              clients(name, email, phone, address),
              companies(name, address, phone, email, logo_url),
              invoice_items(description, quantity, unit_price, tva, total)
            `)
            .eq("id", documentId)
            .single();
          break;
        case "quote":
          tableName = "quotes";
          query = supabase
            .from("quotes")
            .select(`
              *,
              invoices!inner(
                clients(name, email, phone, address),
                companies(name, address, phone, email, logo_url),
                invoice_items(description, quantity, unit_price, tva, total)
              )
            `)
            .eq("id", documentId)
            .single();
          break;
        case "delivery_note":
          tableName = "delivery_notes";
          query = supabase
            .from("delivery_notes")
            .select(`
              *,
              invoices!inner(
                clients(name, email, phone, address),
                companies(name, address, phone, email, logo_url),
                invoice_items(description, quantity, unit_price, tva, total)
              )
            `)
            .eq("id", documentId)
            .single();
          break;
        default:
          throw new Error("Type de document non supporté");
      }

      const { data, error } = await query;
      if (error) throw error;

      // Générer le contenu HTML du PDF
      const htmlContent = generatePDFContent(data, documentType);
      
      // Créer et télécharger le fichier
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = `${getDocumentTypeName(documentType)}_${documentNumber || documentId}.html`;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

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

  const generatePDFContent = (data: any, type: string) => {
    const isInvoice = type === "invoice";
    const document = isInvoice ? data : data.invoices;
    const client = isInvoice ? data.clients : data.invoices.clients;
    const company = isInvoice ? data.companies : data.invoices.companies;
    const items = isInvoice ? data.invoice_items : data.invoices.invoice_items;

    const getTitle = () => {
      switch (type) {
        case "invoice": return "FACTURE";
        case "quote": return "DEVIS";
        case "delivery_note": return "BON DE LIVRAISON";
        default: return "DOCUMENT";
      }
    };

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${getTitle()} ${documentNumber || ""}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company-info, .client-info { flex: 1; }
        .document-title { text-align: center; font-size: 24px; font-weight: bold; margin: 30px 0; }
        .document-number { text-align: center; font-size: 18px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total-row { font-weight: bold; background-color: #f9f9f9; }
        .text-right { text-align: right; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-info">
            <h3>${company?.name || "Entreprise"}</h3>
            <p>${company?.address || ""}</p>
            <p>Tél: ${company?.phone || ""}</p>
            <p>Email: ${company?.email || ""}</p>
        </div>
        <div class="client-info">
            <h3>Client:</h3>
            <p><strong>${client?.name || ""}</strong></p>
            <p>${client?.address || ""}</p>
            <p>Tél: ${client?.phone || ""}</p>
            <p>Email: ${client?.email || ""}</p>
        </div>
    </div>

    <div class="document-title">${getTitle()}</div>
    <div class="document-number">N° ${documentNumber || documentId}</div>
    <p><strong>Date:</strong> ${new Date((isInvoice ? data.date : data.date)).toLocaleDateString('fr-FR')}</p>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>TVA (%)</th>
                <th>Total HT</th>
            </tr>
        </thead>
        <tbody>
            ${items?.map((item: any) => `
                <tr>
                    <td>${item.description || ""}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">${Number(item.unit_price).toLocaleString()} FCFA</td>
                    <td class="text-right">${item.tva || 0}%</td>
                    <td class="text-right">${Number(item.total).toLocaleString()} FCFA</td>
                </tr>
            `).join("") || ""}
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="4">Total HT</td>
                <td class="text-right">${Number((isInvoice ? data.total_amount : data.total_amount) - (isInvoice ? data.tva_total : 0)).toLocaleString()} FCFA</td>
            </tr>
            <tr class="total-row">
                <td colspan="4">TVA</td>
                <td class="text-right">${Number(isInvoice ? data.tva_total : 0).toLocaleString()} FCFA</td>
            </tr>
            <tr class="total-row">
                <td colspan="4"><strong>Total TTC</strong></td>
                <td class="text-right"><strong>${Number(isInvoice ? data.total_amount : data.total_amount).toLocaleString()} FCFA</strong></td>
            </tr>
        </tfoot>
    </table>

    ${data.comments ? `<div><strong>Commentaires:</strong><br>${data.comments}</div>` : ""}

    <div class="footer">
        <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
    </div>
</body>
</html>`;
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case "invoice": return "Facture";
      case "quote": return "Devis";
      case "delivery_note": return "BonLivraison";
      default: return "Document";
    }
  };

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
