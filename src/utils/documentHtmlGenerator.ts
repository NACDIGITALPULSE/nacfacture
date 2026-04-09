
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

  const primaryColor = template?.color_scheme?.primary || '#1a6fb5';
  const secondaryColor = template?.color_scheme?.secondary || '#64748b';
  const accentColor = template?.color_scheme?.accent || '#e8913a';
  const fontFamily = template?.font_family || 'Calibri, Segoe UI';

  const getPaymentTermsText = (terms: string) => {
    switch (terms) {
      case 'immediate': return 'Paiement immédiat';
      case '50_percent': return 'Paiement des 50% à la commande, solde à la livraison';
      case '30_days': return 'Paiement à 30 jours';
      case 'custom': return 'Conditions selon accord';
      default: return 'Paiement immédiat';
    }
  };

  const totalHT = Number(isInvoice ? data.total_amount : data.total_amount) - Number(isInvoice ? data.tva_total : 0);
  const totalTVA = Number(isInvoice ? data.tva_total : 0);
  const totalTTC = Number(isInvoice ? data.total_amount : data.total_amount);

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${getTitle()} ${documentNumber || ""}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body { 
          font-family: '${fontFamily}', 'Segoe UI', sans-serif; 
          margin: 0; 
          padding: 20px; 
          background: #f0f0f0;
          color: #333;
          font-size: 13px;
          line-height: 1.5;
        }
        
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          background: white; 
          padding: 0;
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
          position: relative;
        }

        /* ===== HEADER ===== */
        .doc-header {
          padding: 30px 40px 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid ${primaryColor};
        }

        .company-block {
          flex: 1;
        }

        .company-logo {
          max-width: 80px;
          max-height: 80px;
          margin-bottom: 10px;
        }

        .company-name {
          font-size: 20px;
          font-weight: 700;
          color: #222;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }

        .company-detail {
          font-size: 12px;
          color: #555;
          margin: 2px 0;
        }

        .company-detail strong {
          color: #333;
        }

        .doc-title-block {
          text-align: right;
        }

        .doc-title {
          font-size: 38px;
          font-weight: 800;
          color: ${primaryColor};
          font-family: 'Montserrat', 'Calibri', sans-serif;
          letter-spacing: 2px;
        }

        /* ===== INFO TABLE (N° FACTURE / DATE) ===== */
        .info-tables {
          padding: 15px 40px;
        }

        .info-grid {
          display: flex;
          justify-content: flex-end;
          gap: 0;
        }

        .info-cell-header {
          background: ${primaryColor};
          color: white;
          padding: 8px 20px;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: center;
        }

        .info-cell-value {
          padding: 8px 20px;
          font-weight: 700;
          font-size: 13px;
          text-align: center;
          border: 1px solid #ddd;
          border-top: none;
        }

        /* ===== CLIENT SECTION ===== */
        .client-section {
          padding: 0 40px 15px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .client-info {
          flex: 1;
        }

        .client-label {
          background: ${primaryColor};
          color: white;
          padding: 6px 16px;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: inline-block;
          margin-bottom: 10px;
        }

        .client-detail {
          font-size: 12px;
          color: #444;
          margin: 3px 0;
        }

        .client-detail strong {
          color: #222;
        }

        .ref-conditions {
          display: flex;
          gap: 0;
        }

        .ref-col {
          min-width: 130px;
        }

        /* ===== ITEMS TABLE ===== */
        .items-section {
          padding: 10px 40px 20px;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
        }

        .items-table thead th {
          background: ${primaryColor};
          color: white;
          padding: 10px 12px;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
          border: none;
        }

        .items-table thead th:last-child,
        .items-table thead th:nth-child(2),
        .items-table thead th:nth-child(3),
        .items-table thead th:nth-child(4) {
          text-align: right;
        }

        .items-table tbody td {
          padding: 10px 12px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 12px;
          color: #333;
        }

        .items-table tbody td:last-child,
        .items-table tbody td:nth-child(2),
        .items-table tbody td:nth-child(3),
        .items-table tbody td:nth-child(4) {
          text-align: right;
        }

        .items-table tbody tr:last-child td {
          border-bottom: 2px solid ${primaryColor};
        }

        /* ===== TOTALS ===== */
        .totals-section {
          padding: 10px 40px 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .thanks-msg {
          font-style: italic;
          color: ${primaryColor};
          font-size: 13px;
          flex: 1;
        }

        .totals-table {
          min-width: 250px;
        }

        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #eee;
        }

        .totals-row-label {
          background: #d6e8f5;
          padding: 6px 16px;
          font-weight: 700;
          font-size: 12px;
          color: #333;
          min-width: 100px;
        }

        .totals-row-value {
          padding: 6px 16px;
          font-weight: 600;
          font-size: 12px;
          text-align: right;
          min-width: 120px;
        }

        .totals-row-final .totals-row-label {
          background: ${primaryColor};
          color: white;
          font-size: 14px;
        }

        .totals-row-final .totals-row-value {
          font-size: 14px;
          font-weight: 800;
          color: ${primaryColor};
        }

        /* ===== PAYMENT / CONDITIONS ===== */
        .conditions-section {
          padding: 15px 40px;
          font-size: 12px;
          color: #555;
        }

        .conditions-section strong {
          color: ${primaryColor};
        }

        /* ===== CONTACT FOOTER ===== */
        .contact-footer {
          padding: 20px 40px;
          font-size: 11px;
          color: #666;
          text-align: center;
        }

        .contact-footer strong {
          color: ${primaryColor};
        }

        /* ===== SIGNATURE SECTION ===== */
        .signature-section {
          padding: 30px 40px 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .sig-block {
          text-align: center;
          min-width: 180px;
        }

        .sig-block img {
          max-width: 140px;
          max-height: 80px;
          margin-bottom: 8px;
        }

        .sig-block .sig-line {
          border-bottom: 1px solid #999;
          width: 160px;
          margin: 0 auto 5px;
        }

        .sig-block small {
          font-size: 10px;
          color: #888;
        }

        /* ===== GENERATED INFO ===== */
        .gen-info {
          text-align: center;
          padding: 15px 40px;
          border-top: 1px solid #e0e0e0;
          font-size: 10px;
          color: #aaa;
        }

        /* ===== NOTES ===== */
        .header-notes {
          margin: 10px 40px;
          padding: 12px 16px;
          background: #f0f7ff;
          border-left: 4px solid ${primaryColor};
          font-size: 12px;
          color: #444;
        }

        .header-notes strong {
          color: ${primaryColor};
        }

        .footer-notes {
          margin: 10px 40px;
          padding: 12px 16px;
          background: #f9f9f9;
          border: 1px solid #e5e5e5;
          font-size: 11px;
          color: #777;
          border-radius: 4px;
        }

        @media print {
          body { background: white; padding: 0; }
          .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <div class="doc-header">
            <div class="company-block">
                ${company?.logo_url ? `<img src="${company.logo_url}" alt="Logo" class="company-logo" />` : ''}
                <div class="company-name">${company?.name || "Entreprise"}</div>
                ${company?.address ? `<div class="company-detail"><strong>Adresse:</strong> ${company.address}</div>` : ''}
                ${company?.phone ? `<div class="company-detail"><strong>Téléphone:</strong> ${company.phone}</div>` : ''}
                ${company?.email ? `<div class="company-detail"><strong>Mail:</strong> ${company.email}</div>` : ''}
            </div>
            <div class="doc-title-block">
                <div class="doc-title">${getTitle()}</div>
            </div>
        </div>

        <!-- N° & DATE -->
        <div class="info-tables">
            <div class="info-grid">
                <div class="ref-col">
                    <div class="info-cell-header">N° ${getTitle()}</div>
                    <div class="info-cell-value">${documentNumber || document?.number || '-'}</div>
                </div>
                <div class="ref-col">
                    <div class="info-cell-header">DATE</div>
                    <div class="info-cell-value">${new Date((isInvoice ? data.date : data.date)).toLocaleDateString('fr-FR')}</div>
                </div>
            </div>
        </div>

        ${headerNotes ? `<div class="header-notes"><strong>Information:</strong> ${headerNotes}</div>` : ''}

        <!-- CLIENT SECTION -->
        <div class="client-section">
            <div class="client-info">
                <div class="client-label">${getTitle()} À</div>
                <div class="client-detail"><strong>Nom:</strong> ${client?.name || ""}</div>
                ${client?.address ? `<div class="client-detail"><strong>Adresse:</strong> ${client.address}</div>` : ''}
                ${client?.phone ? `<div class="client-detail"><strong>Téléphone:</strong> ${client.phone}</div>` : ''}
                ${client?.email ? `<div class="client-detail"><strong>Email:</strong> ${client.email}</div>` : ''}
            </div>
            <div>
                <div class="ref-conditions">
                    <div class="ref-col">
                        <div class="info-cell-header">RÉF CLIENT</div>
                        <div class="info-cell-value">${client?.id?.substring(0, 5) || '-'}</div>
                    </div>
                    <div class="ref-col">
                        <div class="info-cell-header">CONDITIONS</div>
                        <div class="info-cell-value" style="font-size:11px;">${getPaymentTermsText(paymentTerms)}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ITEMS TABLE -->
        <div class="items-section">
            <table class="items-table">
                <thead>
                    <tr>
                        <th>DESCRIPTION</th>
                        <th>QTÉ</th>
                        <th>PRIX UNITAIRE</th>
                        ${type !== 'delivery_note' ? '<th>TVA</th>' : ''}
                        <th>MONTANT</th>
                    </tr>
                </thead>
                <tbody>
                    ${items?.map((item: any) => `
                        <tr>
                            <td>${item.description || ""}</td>
                            <td>${item.quantity}</td>
                            <td>${Number(item.unit_price).toLocaleString('fr-FR')} FCFA</td>
                            ${type !== 'delivery_note' ? `<td>${item.tva || 0}%</td>` : ''}
                            <td><strong>${Number(item.total).toLocaleString('fr-FR')} FCFA</strong></td>
                        </tr>
                    `).join("") || ""}
                </tbody>
            </table>
        </div>

        <!-- TOTALS -->
        <div class="totals-section">
            <div class="thanks-msg">
                <em>Nous vous remercions de votre confiance.</em>
            </div>
            <div class="totals-table">
                <div class="totals-row">
                    <div class="totals-row-label">SOUS-TOTAL HT</div>
                    <div class="totals-row-value">${totalHT.toLocaleString('fr-FR')} FCFA</div>
                </div>
                <div class="totals-row">
                    <div class="totals-row-label">TVA</div>
                    <div class="totals-row-value">${totalTVA.toLocaleString('fr-FR')} FCFA</div>
                </div>
                <div class="totals-row">
                    <div class="totals-row-label">TOTAL</div>
                    <div class="totals-row-value">${totalTTC.toLocaleString('fr-FR')} FCFA</div>
                </div>
                <div class="totals-row totals-row-final">
                    <div class="totals-row-label">RESTANT</div>
                    <div class="totals-row-value">${totalTTC.toLocaleString('fr-FR')} XOF</div>
                </div>
            </div>
        </div>

        ${data.comments ? `<div class="header-notes"><strong>Commentaires:</strong> ${data.comments}</div>` : ""}

        <!-- CONDITIONS -->
        <div class="conditions-section">
            Pour toute question concernant ce document, veuillez contacter<br/>
            <strong>${company?.name || ''} sur Tél: ${company?.phone || ''} ${company?.email || ''}</strong>
        </div>

        <!-- SIGNATURES -->
        <div class="signature-section">
            <div class="sig-block">
                ${company?.stamp_url ? `<img src="${company.stamp_url}" alt="Cachet" />` : ''}
                <div class="sig-line"></div>
                <small>Cachet de l'entreprise</small>
            </div>
            <div class="sig-block">
                ${company?.signature_url ? `<img src="${company.signature_url}" alt="Signature" />` : ''}
                <div class="sig-line"></div>
                <small>${company?.name || 'Signature'}<br/>Signature autorisée</small>
            </div>
        </div>

        ${footerNotes ? `<div class="footer-notes">${footerNotes}</div>` : ""}

        <div class="gen-info">
            Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}<br/>
            <span>Conforme aux standards de facturation - nacFacture</span>
        </div>
    </div>
</body>
</html>`;
};
