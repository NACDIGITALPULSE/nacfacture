
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InvoiceExportButtonProps {
  invoiceId: string;
  type?: "pdf" | "json";
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const InvoiceExportButton: React.FC<InvoiceExportButtonProps> = ({
  invoiceId,
  type = "pdf",
  variant = "outline",
  size = "sm"
}) => {

  const handleExport = async () => {
    try {
      // Récupérer les données complètes de la facture
      const { data: invoice, error } = await supabase
        .from("invoices")
        .select(`
          *,
          clients(*),
          companies(*),
          invoice_items(*)
        `)
        .eq("id", invoiceId)
        .single();

      if (error || !invoice) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les données de la facture",
          variant: "destructive"
        });
        return;
      }

      if (type === "json") {
        // Export JSON
        const jsonData = JSON.stringify(invoice, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `facture-${invoice.number || invoice.id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Export réussi",
          description: "Facture exportée en JSON"
        });
      } else {
        // Pour le PDF, on créerait ici un générateur PDF
        // En attendant, on simule avec un export HTML
        const htmlContent = generateInvoiceHTML(invoice);
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `facture-${invoice.number || invoice.id}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Export réussi",
          description: "Facture exportée en HTML (PDF bientôt disponible)"
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'export de la facture",
        variant: "destructive"
      });
    }
  };

  const generateInvoiceHTML = (invoice: any) => {
    const totalHT = invoice.invoice_items?.reduce((sum: number, item: any) => 
      sum + (Number(item.quantity) * Number(item.unit_price)), 0) || 0;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Facture ${invoice.number || invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .logo { max-height: 80px; }
            .invoice-info { text-align: right; }
            .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .party { width: 45%; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .totals { text-align: right; font-weight: bold; }
            .total-final { font-size: 1.2em; color: #1e40af; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              ${invoice.companies?.logo_url ? `<img src="${invoice.companies.logo_url}" alt="Logo" class="logo">` : ''}
              <h1>${invoice.companies?.name || 'Entreprise'}</h1>
            </div>
            <div class="invoice-info">
              <h2>FACTURE ${invoice.status.toUpperCase()}</h2>
              <p>N° ${invoice.number || invoice.id}</p>
              <p>Date: ${new Date(invoice.date).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div class="parties">
            <div class="party">
              <h3>Émetteur</h3>
              <p><strong>${invoice.companies?.name}</strong></p>
              <p>${invoice.companies?.address || ''}</p>
              <p>${invoice.companies?.phone || ''}</p>
              <p>${invoice.companies?.email || ''}</p>
            </div>
            <div class="party">
              <h3>Client</h3>
              <p><strong>${invoice.clients?.name}</strong></p>
              <p>${invoice.clients?.address || ''}</p>
              <p>${invoice.clients?.phone || ''}</p>
              <p>${invoice.clients?.email || ''}</p>
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
              ${invoice.invoice_items?.map((item: any) => `
                <tr>
                  <td>${item.description || ''}</td>
                  <td>${item.quantity}</td>
                  <td>${Number(item.unit_price).toFixed(2)} FCFA</td>
                  <td>${item.tva}%</td>
                  <td>${(Number(item.quantity) * Number(item.unit_price)).toFixed(2)} FCFA</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>

          <div class="totals">
            <p>Sous-total HT: ${totalHT.toFixed(2)} FCFA</p>
            <p>Total TVA: ${Number(invoice.tva_total).toFixed(2)} FCFA</p>
            <p class="total-final">Total TTC: ${Number(invoice.total_amount).toFixed(2)} FCFA</p>
          </div>

          ${invoice.comments ? `<div><h3>Commentaires</h3><p>${invoice.comments}</p></div>` : ''}
          
          ${invoice.companies?.signature_url ? `
            <div style="margin-top: 50px;">
              <p>Signature:</p>
              <img src="${invoice.companies.signature_url}" alt="Signature" style="max-height: 60px;">
            </div>
          ` : ''}
        </body>
      </html>
    `;
  };

  return (
    <Button
      onClick={handleExport}
      variant={variant}
      size={size}
      className="flex items-center gap-2"
    >
      {type === "pdf" ? <Download className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
      {type === "pdf" ? "PDF" : "JSON"}
    </Button>
  );
};

export default InvoiceExportButton;
