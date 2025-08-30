
export const generateDocumentHTML = (data: any, type: string, documentNumber?: string, template?: any) => {
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

  // Utiliser les couleurs du template si disponible
  const primaryColor = template?.color_scheme?.primary || '#3b82f6';
  const secondaryColor = template?.color_scheme?.secondary || '#64748b';
  const accentColor = template?.color_scheme?.accent || '#06b6d4';
  const fontFamily = template?.font_family || 'Segoe UI';

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body { 
          font-family: '${fontFamily}', sans-serif; 
          margin: 0; 
          padding: 20px; 
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          color: #1e293b;
        }
        
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          background: white; 
          padding: 40px; 
          border-radius: 16px; 
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          position: relative;
          overflow: hidden;
        }
        
        .container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%);
        }
        
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          margin-bottom: 40px; 
          padding-bottom: 30px; 
          border-bottom: 2px solid ${primaryColor}20;
          position: relative;
        }
        
        .company-info { 
          flex: 1; 
        }
        
        .company-info h3 { 
          color: ${primaryColor}; 
          font-size: 28px; 
          margin: 0 0 15px 0; 
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        
        .company-logo {
          max-width: 120px;
          max-height: 80px;
          margin-bottom: 15px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .document-info { 
          text-align: right; 
          background: linear-gradient(135deg, ${primaryColor}08, ${accentColor}08);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid ${primaryColor}20;
        }
        
        .document-title { 
          font-size: 32px; 
          font-weight: 800; 
          color: ${primaryColor}; 
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .document-number { 
          font-size: 18px; 
          color: ${secondaryColor}; 
          margin-top: 8px;
          font-weight: 600;
        }
        
        .parties { 
          display: flex; 
          justify-content: space-between; 
          margin: 40px 0; 
          gap: 20px;
        }
        
        .party { 
          flex: 1; 
          padding: 25px; 
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px; 
          border: 1px solid ${primaryColor}15;
          position: relative;
        }
        
        .party::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: ${primaryColor};
          border-radius: 12px 12px 0 0;
        }
        
        .party h4 { 
          color: ${primaryColor}; 
          margin: 0 0 15px 0; 
          font-size: 14px; 
          text-transform: uppercase; 
          font-weight: 700;
          letter-spacing: 1px;
        }
        
        .header-notes { 
          background: linear-gradient(135deg, ${accentColor}08, ${primaryColor}08);
          padding: 20px; 
          border-radius: 12px; 
          margin: 25px 0; 
          border-left: 4px solid ${accentColor};
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .header-notes strong {
          color: ${primaryColor};
          font-weight: 600;
        }
        
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 30px 0; 
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        th { 
          background: linear-gradient(135deg, ${primaryColor}, ${accentColor}); 
          color: white; 
          padding: 16px 12px; 
          text-align: left; 
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        
        td { 
          border-bottom: 1px solid #e2e8f0; 
          padding: 16px 12px;
          background: white;
          transition: background-color 0.2s ease;
        }
        
        tr:hover td {
          background-color: ${primaryColor}05;
        }
        
        .total-section { 
          background: linear-gradient(135deg, #f8fafc, #f1f5f9); 
          padding: 25px; 
          border-radius: 12px; 
          margin-top: 30px;
          border: 1px solid ${primaryColor}20;
        }
        
        .total-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 10px 0;
          padding: 8px 0;
        }
        
        .total-final { 
          font-size: 22px; 
          font-weight: 700; 
          color: ${primaryColor}; 
          padding-top: 15px; 
          border-top: 2px solid ${primaryColor};
          background: white;
          margin-top: 15px;
          padding: 15px;
          border-radius: 8px;
        }
        
        .text-right { text-align: right; }
        
        .payment-terms { 
          background: linear-gradient(135deg, ${accentColor}08, ${primaryColor}08);
          padding: 20px; 
          border-radius: 12px; 
          margin: 25px 0; 
          border: 1px solid ${accentColor}30;
        }
        
        .payment-terms strong {
          color: ${primaryColor};
          font-weight: 600;
        }
        
        .footer-notes { 
          background: #f9fafb; 
          padding: 20px; 
          border-radius: 12px; 
          margin-top: 30px; 
          font-size: 13px; 
          color: ${secondaryColor};
          border: 1px solid #e5e7eb;
        }
        
        .signature-section { 
          margin-top: 50px; 
          text-align: right;
          display: flex;
          justify-content: space-between;
          align-items: end;
        }
        
        .signature-box {
          text-align: center;
          min-width: 200px;
        }
        
        .signature-image {
          max-width: 150px;
          max-height: 80px;
          margin-bottom: 10px;
        }
        
        .stamp-box {
          text-align: center;
          min-width: 120px;
        }
        
        .stamp-image {
          max-width: 100px;
          max-height: 100px;
          margin-bottom: 10px;
        }
        
        .generated-info { 
          text-align: center; 
          margin-top: 50px; 
          padding-top: 25px; 
          border-top: 1px solid #e2e8f0; 
          font-size: 11px; 
          color: #94a3b8;
        }
        
        @media print {
          body { background: white; }
          .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="company-info">
                ${company?.logo_url ? `<img src="${company.logo_url}" alt="Logo" class="company-logo" />` : ''}
                <h3>${company?.name || "Entreprise"}</h3>
                <p><strong>Adresse:</strong> ${company?.address || ""}</p>
                <p><strong>Tél:</strong> ${company?.phone || ""}</p>
                <p><strong>Email:</strong> ${company?.email || ""}</p>
            </div>
            <div class="document-info">
                <div class="document-title">${getTitle()}</div>
                <div class="document-number">N° ${documentNumber || document?.id}</div>
                <p><strong>Date:</strong> ${new Date((isInvoice ? data.date : data.date)).toLocaleDateString('fr-FR')}</p>
            </div>
        </div>

        ${headerNotes ? `<div class="header-notes"><strong>Information importante:</strong><br>${headerNotes}</div>` : ''}

        <div class="parties">
            <div class="party">
                <h4>Émetteur</h4>
                <p><strong>${company?.name || "Entreprise"}</strong></p>
                <p>${company?.address || ""}</p>
                <p><strong>Tél:</strong> ${company?.phone || ""}</p>
                <p><strong>Email:</strong> ${company?.email || ""}</p>
            </div>
            <div class="party">
                <h4>Destinataire</h4>
                <p><strong>${client?.name || ""}</strong></p>
                <p>${client?.address || ""}</p>
                <p><strong>Tél:</strong> ${client?.phone || ""}</p>
                <p><strong>Email:</strong> ${client?.email || ""}</p>
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
                        <td><strong>${item.description || ""}</strong></td>
                        <td class="text-right">${item.quantity}</td>
                        <td class="text-right">${Number(item.unit_price).toLocaleString()} FCFA</td>
                        <td class="text-right">${item.tva || 0}%</td>
                        <td class="text-right"><strong>${Number(item.total).toLocaleString()} FCFA</strong></td>
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

        <div class="signature-section">
            <div class="stamp-box">
                ${company?.stamp_url ? `<img src="${company.stamp_url}" alt="Cachet" class="stamp-image" />` : ''}
                <div style="border-bottom: 1px solid #ccc; width: 120px; margin-top: 10px;"></div>
                <small>Cachet de l'entreprise</small>
            </div>
            
            <div class="signature-box">
                ${company?.signature_url ? `<img src="${company.signature_url}" alt="Signature" class="signature-image" />` : ''}
                <div style="border-bottom: 1px solid #ccc; width: 200px; margin-top: 10px;"></div>
                <small>Signature autorisée</small>
            </div>
        </div>

        ${footerNotes ? `<div class="footer-notes">${footerNotes}</div>` : ""}

        <div class="generated-info">
            <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            <p style="margin-top: 5px; font-size: 10px;">Conforme aux standards de facturation électronique</p>
        </div>
    </div>
</body>
</html>`;
};
