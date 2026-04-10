
/**
 * Generate invoice number using company initials
 * Format: [INITIALS]-[YY]-[XXXX]
 * e.g., EPC-26-0001 for "Expertise Pro Co"
 */
const getInitials = (companyName?: string): string => {
  if (!companyName || companyName.trim().length === 0) return "FAC";
  const words = companyName.trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase();
  }
  return words.map(w => w[0]).join("").toUpperCase().substring(0, 4);
};

export const generateInvoiceNumber = (existingNumbers: string[] = [], companyName?: string): string => {
  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);
  const prefix = getInitials(companyName);
  
  // Find the highest existing number for the current year with any prefix
  const yearNumbers = existingNumbers
    .filter(num => num && num.includes(`-${yearSuffix}-`))
    .map(num => {
      const parts = num.split('-');
      return parseInt(parts[parts.length - 1]) || 0;
    })
    .sort((a, b) => b - a);
  
  const nextNumber = (yearNumbers[0] || 0) + 1;
  
  return `${prefix}-${yearSuffix}-${nextNumber.toString().padStart(4, '0')}`;
};

export const generateQuoteNumber = (existingNumbers: string[] = [], companyName?: string): string => {
  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);
  const prefix = companyName ? `D${getInitials(companyName)}` : "DEV";
  
  const yearNumbers = existingNumbers
    .filter(num => num && num.includes(`-${yearSuffix}-`))
    .map(num => {
      const parts = num.split('-');
      return parseInt(parts[parts.length - 1]) || 0;
    })
    .sort((a, b) => b - a);
  
  const nextNumber = (yearNumbers[0] || 0) + 1;
  
  return `${prefix}-${yearSuffix}-${nextNumber.toString().padStart(4, '0')}`;
};

export const generateDeliveryNumber = (existingNumbers: string[] = [], companyName?: string): string => {
  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);
  const prefix = companyName ? `BL${getInitials(companyName)}` : "BL";
  
  const yearNumbers = existingNumbers
    .filter(num => num && num.includes(`-${yearSuffix}-`))
    .map(num => {
      const parts = num.split('-');
      return parseInt(parts[parts.length - 1]) || 0;
    })
    .sort((a, b) => b - a);
  
  const nextNumber = (yearNumbers[0] || 0) + 1;
  
  return `${prefix}-${yearSuffix}-${nextNumber.toString().padStart(4, '0')}`;
};
