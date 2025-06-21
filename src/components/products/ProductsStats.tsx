
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
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
        <div className="text-sm text-gray-600">Total produits/services</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-green-600">
          {totalValue.toLocaleString()} FCFA
        </div>
        <div className="text-sm text-gray-600">Valeur catalogue</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-purple-600">
          {productsWithTax}
        </div>
        <div className="text-sm text-gray-600">Avec TVA</div>
      </div>
    </div>
  );
};

export default ProductsStats;
