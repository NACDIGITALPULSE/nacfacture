import { fetchDocumentData } from "@/utils/documentDataFetcher";
import { generateDocumentHTML } from "@/utils/documentHtmlGenerator";
import { generateAndDownloadPDF } from "@/utils/pdfGenerator";

const normalizePhone = (raw?: string) => {
  if (!raw) return "";
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.length === 8) return `227${digits}`;
  return digits;
};

export type WhatsAppDocType = "invoice" | "quote" | "delivery_note";

export const sendDocumentViaWhatsApp = async (
  documentId: string,
  documentType: WhatsAppDocType,
  documentNumber?: string
) => {
  const data = await fetchDocumentData(documentId, documentType);
  const html = generateDocumentHTML(data, documentType, documentNumber || documentId);
  await generateAndDownloadPDF(html, documentType, documentNumber || documentId);

  const isInvoice = documentType === "invoice";
  const doc = isInvoice ? data : (data as any).invoices;
  const client = isInvoice ? (data as any).clients : (data as any).invoices?.clients;
  const company = isInvoice ? (data as any).companies : (data as any).invoices?.companies;

  const phone = normalizePhone(client?.phone);
  const docLabel =
    documentType === "invoice"
      ? (doc?.status === "proforma" ? "facture proforma" : "facture")
      : documentType === "quote" ? "devis" : "bon de livraison";

  const text = encodeURIComponent(
    `Bonjour ${client?.name || ""},\n\n` +
    `Veuillez trouver en pièce jointe votre ${docLabel} N° ${documentNumber || ""} de la part de ${company?.name || ""}.\n\n` +
    `Le PDF vient d'être téléchargé sur votre appareil — merci de le joindre à ce message WhatsApp.\n\n` +
    `Cordialement,\n${company?.name || ""}`
  );

  const url = phone
    ? `https://wa.me/${phone}?text=${text}`
    : `https://wa.me/?text=${text}`;
  window.open(url, "_blank");
  return { phone };
};