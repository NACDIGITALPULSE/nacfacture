
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

      // Générer le PDF
      await generateAndDownloadPDF(data, documentType, documentNumber || documentId);

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

  const generateAndDownloadPDF = async (data: any, type: string, documentId: string) => {
    const htmlContent = generatePDFContent(data, type);
    
    // Créer un élément temporaire pour le rendu
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    document.body.appendChild(tempDiv);

    try {
      // Convertir en canvas
      const canvas = await html2canvas(tempDiv.querySelector('.container') as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Créer le PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Télécharger le PDF
      const fileName = `${getDocumentTypeName(type)}_${documentNumber || documentId}.pdf`;
      pdf.save(fileName);
    } finally {
      // Nettoyer l'élément temporaire
      document.body.removeChild(tempDiv);
    }
  };

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

    const customStyling = isInvoice ? data.custom_styling : data.custom_styling;
    const paymentTerms = customStyling?.payment_terms || 'immediate';
    const headerNotes = customStyling?.header_notes || '';
    const footerNotes = customStyling?.footer_notes || '';

    const getPaymentTermsText = (terms: string) => {
      switch (terms) {
        case 'immediate': return 'Paiement immédiat';
        case '50_percent': return 'Acompte de 50% à la commande, solde à la livraison';
        case '30_days': return 'Paiement à 30 jours';
        case 'custom': return 'Conditions selon accord';
        default: return 'Paiement immédiat';
      }
    };

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${getTitle()} ${documentNumber || ""}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #3b82f6; }
        .company-info { flex: 1; }
        .company-info h3 { color: #3b82f6; font-size: 24px; margin: 0 0 10px 0; }
        .document-info { text-align: right; }
        .document-title { font-size: 28px; font-weight: bold; color: #1e40af; margin: 0; }
        .document-number { font-size: 16px; color: #64748b; margin-top: 5px; }
        .parties { display: flex; justify-content: space-between; margin: 30px 0; }
        .party { flex: 1; padding: 20px; background: #f8fafc; border-radius: 6px; margin: 0 10px; }
        .party h4 { color: #3b82f6; margin: 0 0 15px 0; font-size: 16px; text-transform: uppercase; }
        .header-notes { background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        th { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 12px 8px; text-align: left; font-weight: 600; }
        td { border-bottom: 1px solid #e2e8f0; padding: 12px 8px; }
        .total-section { background: #f8fafc; padding: 20px; border-radius: 6px; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .total-final { font-size: 20px; font-weight: bold; color: #1e40af; padding-top: 10px; border-top: 2px solid #3b82f6; }
        .text-right { text-align: right; }
        .payment-terms { background: #f0f9ff; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #bae6fd; }
        .footer-notes { background: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 30px; font-size: 12px; color: #64748b; }
        .signature-section { margin-top: 40px; text-align: right; }
        .generated-info { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="company-info">
                <h3>${company?.name || "Entreprise"}</h3>
                <p>${company?.address || ""}</p>
                <p>Tél: ${company?.phone || ""}</p>
                <p>Email: ${company?.email || ""}</p>
            </div>
            <div class="document-info">
                <div class="document-title">${getTitle()}</div>
                <div class="document-number">N° ${documentNumber || documentId}</div>
                <p><strong>Date:</strong> ${new Date((isInvoice ? data.date : data.date)).toLocaleDateString('fr-FR')}</p>
            </div>
        </div>

        ${headerNotes ? `<div class="header-notes"><strong>Information importante:</strong><br>${headerNotes}</div>` : ''}

        <div class="parties">
            <div class="party">
                <h4>Émetteur</h4>
                <p><strong>${company?.name || "Entreprise"}</strong></p>
                <p>${company?.address || ""}</p>
                <p>Tél: ${company?.phone || ""}</p>
                <p>Email: ${company?.email || ""}</p>
            </div>
            <div class="party">
                <h4>Destinataire</h4>
                <p><strong>${client?.name || ""}</strong></p>
                <p>${client?.address || ""}</p>
                <p>Tél: ${client?.phone || ""}</p>
                <p>Email: ${client?.email || ""}</p>
            </div>
        </div>

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
        </table>

        <div class="total-section">
            <div class="total-row">
                <span>Sous-total HT:</span>
                <span><strong>${Number((isInvoice ? data.total_amount : data.total_amount) - (isInvoice ? data.tva_total : 0)).toLocaleString()} FCFA</strong></span>
            </div>
            <div class="total-row">
                <span>Total TVA:</span>
                <span><strong>${Number(isInvoice ? data.tva_total : 0).toLocaleString()} FCFA</strong></span>
            </div>
            <div class="total-row total-final">
                <span>Total à payer:</span>
                <span>${Number(isInvoice ? data.total_amount : data.total_amount).toLocaleString()} FCFA</span>
            </div>
        </div>

        <div class="payment-terms">
            <strong>Conditions de paiement:</strong> ${getPaymentTermsText(paymentTerms)}
        </div>

        ${data.comments ? `<div class="header-notes"><strong>Commentaires:</strong><br>${data.comments}</div>` : ""}

        ${footerNotes ? `<div class="footer-notes">${footerNotes}</div>` : ""}

        <div class="signature-section">
            <p>Signature:</p>
            <div style="border-bottom: 1px solid #ccc; width: 200px; margin: 20px 0 0 auto;"></div>
        </div>

        <div class="generated-info">
            <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        </div>
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
