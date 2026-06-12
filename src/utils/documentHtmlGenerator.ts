
export const generateDocumentHTML = (data: any, type: string, documentNumber?: string, template?: any) => {
  const isInvoice = type === "invoice";
  const document = isInvoice ? data : data.invoices;
  const client = isInvoice ? data.clients : data.invoices.clients;
  const company = isInvoice ? data.companies : data.invoices.companies;
  const items = isInvoice ? data.invoice_items : data.invoices.invoice_items;

  const getTitle = () => {
    switch (type) {
      case "invoice":
        return (isInvoice && data.status === "proforma") ? "FACTURE PROFORMA" : "FACTURE";
      case "quote": return "DEVIS";
      case "delivery_note": return "BON DE LIVRAISON";
      default: return "DOCUMENT";
    }
  };

  const customStyling = data.custom_styling;
  const paymentTerms = customStyling?.payment_terms || 'immediate';
  const headerNotes = customStyling?.header_notes || '';
  const footerNotes = customStyling?.footer_notes || '';

  const primaryColor = template?.color_scheme?.primary || '#1e4a8a';
  const accentColor = template?.color_scheme?.accent || '#f0a500';
  const fontFamily = template?.font_family || 'Calibri, Segoe UI';

  const getPaymentTermsText = (terms: string) => {
    switch (terms) {
      case 'immediate': return 'Paiement comptant';
      case '50_percent': return 'Paiement 50% à la commande';
      case '30_days': return 'Paiement à 30 jours';
      case 'custom': return 'Selon accord';
      default: return 'Paiement comptant';
    }
  };

  const totalTTC = Number(data.total_amount || 0);
  const totalTVA = Number(data.tva_total || 0);
  const totalHT = totalTTC - totalTVA;
  const amountPaid = Number(data.amount_paid || 0);
  const restantDu = Math.max(totalTTC - amountPaid, 0);
  const rccm = company?.rccm || "";
  const nif = company?.nif || "";
  const clientNif = client?.nif || "";
  const website = company?.website || "";
  const currency = company?.currency || "FCFA";
  const cur = currency === "EUR" ? "€" : currency === "USD" ? "$" : "FCFA";
  const fmtMoney = (n: number) => `${Number(n || 0).toLocaleString('fr-FR')} ${cur}`;
  const tvaRate = Number(items?.[0]?.tva ?? 19);
  const minRows = 12;
  const emptyRowsCount = Math.max(minRows - (items?.length || 0), 0);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${getTitle()} ${documentNumber || ""}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: '${fontFamily}', 'Segoe UI', sans-serif; background: #eeeeee; color: #222; font-size: 12px; line-height: 1.5; padding: 20px; }
  .container { max-width: 820px; margin: 0 auto; background: white; box-shadow: 0 2px 20px rgba(0,0,0,0.1); }
  .doc-header { display: flex; align-items: stretch; }
  .company-block { flex: 1; padding: 24px 24px 18px; display: flex; gap: 14px; }
  .company-logo { width: 70px; height: 70px; object-fit: contain; flex-shrink: 0; }
  .company-text { flex: 1; }
  .company-name { font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 2px; }
  .company-tagline { font-style: italic; color: #555; font-size: 12px; margin-bottom: 6px; }
  .company-detail { font-size: 11px; color: #555; margin: 1px 0; }
  .doc-title-box { background: ${primaryColor}; color: white; width: 230px; display: flex; align-items: center; justify-content: center; font-family: 'Montserrat', sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 2px; }
  .wrap { padding: 0 24px; margin-bottom: 8px; }
  .strip-table, .client-grid, .items-table, .totals-table { width: 100%; border-collapse: collapse; }
  .strip-table th, .client-grid th, .items-table thead th { background: ${primaryColor}; color: white; padding: 8px 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.4px; text-align: center; border: 1px solid ${primaryColor}; }
  .strip-table td { padding: 9px 10px; font-size: 12px; text-align: center; font-weight: 700; color: #1a1a1a; background: #fff; border: 1px solid #d8e3ee; }
  .client-grid th { text-align: left; }
  .client-grid th.center { text-align: center; }
  .client-grid td { padding: 5px 10px; font-size: 11.5px; background: #fff; border: 1px solid #d8e3ee; vertical-align: top; }
  .client-grid td.label { font-weight: 700; color: #1a1a1a; width: 110px; }
  .client-grid td.center { text-align: center; font-weight: 700; }
  .items-table thead th:first-child { text-align: left; }
  .items-table tbody td { padding: 6px 10px; border: 1px solid #d8e3ee; font-size: 11.5px; text-align: right; height: 22px; color: #333; }
  .items-table tbody td:first-child { text-align: left; }
  .items-table tbody tr:nth-child(even) td { background: #f3f8fc; }
  .totals-table td { padding: 9px 14px; font-size: 12px; border: 1px solid #d8e3ee; }
  .totals-table td.lbl { background: #d6e8f5; font-weight: 700; color: #1a1a1a; text-align: right; width: 70%; }
  .totals-table td.val { text-align: right; font-weight: 700; }
  .totals-table tr.final td.lbl { background: ${primaryColor}; color: white; font-size: 13px; }
  .totals-table tr.final td.val { color: ${primaryColor}; font-size: 14px; font-weight: 800; }
  .footer-zone { display: flex; padding: 14px 24px 10px; gap: 24px; align-items: flex-end; }
  .footer-left { flex: 1; font-size: 11px; color: #444; }
  .footer-left .thanks { font-weight: 700; color: #1a1a1a; margin-bottom: 4px; font-size: 12px; }
  .footer-right { width: 230px; text-align: center; font-size: 11px; color: #444; }
  .footer-right .sig-img { max-height: 80px; max-width: 200px; object-fit: contain; display:block; margin: 0 auto; }
  .footer-right .sig-label { color: ${primaryColor}; font-weight: 700; margin-bottom: 4px; }
  .bottom-strip { display: flex; height: 14px; margin-top: 6px; }
  .bottom-strip .orange { flex: 0 0 38%; background: ${accentColor}; }
  .bottom-strip .blue { flex: 1; background: ${primaryColor}; }
  .header-notes { padding: 8px 14px; background: #f0f7ff; border-left: 4px solid ${primaryColor}; margin: 0 24px 8px; font-size: 11px; color: #444; }
  @media print { body { background: white; padding: 0; } .container { box-shadow: none; } }
</style>
</head>
<body>
  <div class="container">
    <div class="doc-header">
      <div class="company-block">
        ${company?.logo_url ? `<img src="${company.logo_url}" alt="Logo" class="company-logo" />` : ''}
        <div class="company-text">
          <div class="company-name">${company?.name || "Entreprise"}</div>
          ${company?.tagline ? `<div class="company-tagline">${company.tagline}</div>` : ''}
          ${company?.address ? `<div class="company-detail">${company.address}${company?.phone ? `  |  Tél : ${company.phone}` : ''}</div>` : ''}
          ${(company?.email || website) ? `<div class="company-detail">${company?.email || ''}${(company?.email && website) ? '  |  ' : ''}${website}</div>` : ''}
        </div>
      </div>
      <div class="doc-title-box">${getTitle()}</div>
    </div>

    <div class="wrap" style="margin-top:10px;">
      <table class="strip-table">
        <thead><tr><th style="width:34%">N° DOCUMENT</th><th style="width:33%">DATE</th><th>CONDITIONS DE PAIEMENT</th></tr></thead>
        <tbody><tr>
          <td>${documentNumber || document?.number || '-'}</td>
          <td>${new Date(data.date).toLocaleDateString('fr-FR')}</td>
          <td>${getPaymentTermsText(paymentTerms)}</td>
        </tr></tbody>
      </table>
    </div>

    ${headerNotes ? `<div class="header-notes"><strong>Information :</strong> ${headerNotes}</div>` : ''}

    <div class="wrap">
      <table class="client-grid">
        <thead><tr>
          <th colspan="2" style="width:60%">${getTitle()} ÉTABLI(E) POUR</th>
          <th class="center" style="width:20%">RÉF. CLIENT</th>
          <th class="center" style="width:20%">NIF CLIENT</th>
        </tr></thead>
        <tbody>
          <tr>
            <td class="label">Nom / Entreprise :</td>
            <td>${client?.name || ""}</td>
            <td class="center" rowspan="5">${client?.id ? client.id.substring(0,6).toUpperCase() : 'Nouveau'}</td>
            <td class="center" rowspan="5">${clientNif || '-'}</td>
          </tr>
          <tr><td class="label">Contact :</td><td>${client?.contact_name || client?.name || ''}</td></tr>
          <tr><td class="label">Adresse :</td><td>${client?.address || ''}</td></tr>
          <tr><td class="label">Téléphone :</td><td>${client?.phone || ''}</td></tr>
          <tr><td class="label">Email :</td><td style="color:${primaryColor};text-decoration:underline;">${client?.email || ''}</td></tr>
        </tbody>
      </table>
    </div>

    <div class="wrap">
      <table class="items-table">
        <thead><tr>
          <th style="width:48%">DÉSIGNATION / PRESTATION</th>
          <th style="width:8%">QTÉ</th>
          <th style="width:16%">PRIX UNIT.</th>
          <th style="width:10%">REMISE %</th>
          <th style="width:18%">MONTANT</th>
        </tr></thead>
        <tbody>
          ${(items || []).map((item: any) => `
            <tr>
              <td>${item.description || ""}</td>
              <td style="text-align:center;">${item.quantity || ''}</td>
              <td>${fmtMoney(Number(item.unit_price))}</td>
              <td style="text-align:center;">${item.discount ? item.discount + '%' : ''}</td>
              <td><strong>${fmtMoney(Number(item.total))}</strong></td>
            </tr>`).join("")}
          ${Array.from({length: emptyRowsCount}).map(() => `
            <tr><td>&nbsp;</td><td></td><td></td><td></td><td style="text-align:center;color:#bbb;">-</td></tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="wrap">
      <table class="totals-table">
        <tr><td class="lbl">SOUS-TOTAL HT</td><td class="val">${fmtMoney(totalHT)}</td></tr>
        <tr><td class="lbl">TVA (${tvaRate}%)</td><td class="val">${totalTVA > 0 ? fmtMoney(totalTVA) : '-'}</td></tr>
        <tr><td class="lbl">MONTANT PAYÉ</td><td class="val">${amountPaid > 0 ? fmtMoney(amountPaid) : '-'}</td></tr>
        <tr class="final"><td class="lbl">RESTANT DÛ</td><td class="val">${fmtMoney(restantDu)}</td></tr>
      </table>
    </div>

    <div class="footer-zone">
      <div class="footer-left">
        <div class="thanks">Nous vous remercions de votre confiance.</div>
        ${(rccm || nif) ? `<div>RCCM : ${rccm || '-'}   |   NIF : ${nif || '-'}</div>` : ''}
        ${(company?.phone || company?.email) ? `<div style="font-style:italic;color:#666;margin-top:2px;">Contact : ${company?.phone || ''}${(company?.phone && company?.email) ? '  |  ' : ''}${company?.email || ''}</div>` : ''}
        ${footerNotes ? `<div style="margin-top:6px;color:#777;font-size:10.5px;">${footerNotes}</div>` : ''}
      </div>
      <div class="footer-right">
        <div class="sig-label">Signature &amp; Cachet</div>
        ${company?.signature_url ? `<img src="${company.signature_url}" alt="Signature" class="sig-img" />` : ''}
        ${company?.stamp_url ? `<img src="${company.stamp_url}" alt="Cachet" class="sig-img" style="margin-top:4px;" />` : ''}
      </div>
    </div>

    <div class="bottom-strip"><div class="orange"></div><div class="blue"></div></div>
  </div>
</body>
</html>`;
};
