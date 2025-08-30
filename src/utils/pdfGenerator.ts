
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateAndDownloadPDF = async (
  htmlContent: string, 
  documentType: string, 
  documentNumber: string
) => {
  // Create temporary element for rendering
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  tempDiv.style.width = '800px';
  document.body.appendChild(tempDiv);

  try {
    // Convert to canvas
    const canvas = await html2canvas(tempDiv.querySelector('.container') as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Create PDF
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
    
    // Download PDF
    const fileName = `${getDocumentTypeName(documentType)}_${documentNumber}.pdf`;
    pdf.save(fileName);
  } finally {
    // Clean up temporary element
    document.body.removeChild(tempDiv);
  }
};

const getDocumentTypeName = (type: string) => {
  switch (type) {
    case "invoice": return "Facture";
    case "quote": return "Devis";
    case "delivery_note": return "BonLivraison";
    default: return "Document";
  }
};
