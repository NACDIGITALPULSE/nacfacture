
import React from "react";

interface ProductsStatsProps {
  totalProducts: number;
  totalValue: number;
  productsWithTax: number;
}

const ProductsStats: React.FC<ProductsStatsProps> = ({
  totalProducts,
  totalValue,
  productsWithTax
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-card p-4 rounded-lg shadow border">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalProducts}</div>
        <div className="text-sm text-muted-foreground">Total produits/services</div>
      </div>
      <div className="bg-card p-4 rounded-lg shadow border">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {totalValue.toLocaleString()} FCFA
        </div>
        <div className="text-sm text-muted-foreground">Valeur catalogue</div>
      </div>
      <div className="bg-card p-4 rounded-lg shadow border">
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {productsWithTax}
        </div>
        <div className="text-sm text-muted-foreground">Avec TVA</div>
      </div>
    </div>
  );
};

export default ProductsStats;
