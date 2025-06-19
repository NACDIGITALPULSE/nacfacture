
import React from "react";

interface InvoiceTotalsProps {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({ 
  totalHT, 
  totalTVA, 
  totalTTC 
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <span>Sous-total HT</span>
        <span>{totalHT.toFixed(2)} FCFA</span>
      </div>
      <div className="flex justify-between">
        <span>Total TVA</span>
        <span>{totalTVA.toFixed(2)} FCFA</span>
      </div>
      <div className="flex justify-between font-bold text-blue-700 text-lg">
        <span>Total TTC</span>
        <span>{totalTTC.toFixed(2)} FCFA</span>
      </div>
    </div>
  );
};

export default InvoiceTotals;
