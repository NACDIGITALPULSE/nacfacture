
export const generateInvoiceNumber = (existingNumbers: string[] = []): string => {
  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);
  
  // Find the highest existing number for the current year
  const yearNumbers = existingNumbers
    .filter(num => num && num.startsWith(`FAC-${yearSuffix}`))
    .map(num => parseInt(num.split('-')[2]) || 0)
    .sort((a, b) => b - a);
  
  const nextNumber = (yearNumbers[0] || 0) + 1;
  
  return `FAC-${yearSuffix}-${nextNumber.toString().padStart(4, '0')}`;
};

export const generateQuoteNumber = (existingNumbers: string[] = []): string => {
  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);
  
  const yearNumbers = existingNumbers
    .filter(num => num && num.startsWith(`DEV-${yearSuffix}`))
    .map(num => parseInt(num.split('-')[2]) || 0)
    .sort((a, b) => b - a);
  
  const nextNumber = (yearNumbers[0] || 0) + 1;
  
  return `DEV-${yearSuffix}-${nextNumber.toString().padStart(4, '0')}`;
};

export const generateDeliveryNumber = (existingNumbers: string[] = []): string => {
  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);
  
  const yearNumbers = existingNumbers
    .filter(num => num && num.startsWith(`BL-${yearSuffix}`))
    .map(num => parseInt(num.split('-')[2]) || 0)
    .sort((a, b) => b - a);
  
  const nextNumber = (yearNumbers[0] || 0) + 1;
  
  return `BL-${yearSuffix}-${nextNumber.toString().padStart(4, '0')}`;
};
