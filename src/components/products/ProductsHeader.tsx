
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductsHeaderProps {
  onAddProduct: () => void;
  isCreating: boolean;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  onAddProduct,
  isCreating
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-800">Produits & Services</h1>
        <p className="text-gray-600">
          Gérez votre catalogue de produits et services à facturer.
        </p>
      </div>
      
      <Button 
        onClick={onAddProduct}
        className="flex items-center gap-2"
        disabled={isCreating}
      >
        <Plus size={18} /> 
        {isCreating ? "Ajout..." : "Ajouter"}
      </Button>
    </div>
  );
};

export default ProductsHeader;
