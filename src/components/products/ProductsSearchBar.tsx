
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProductsSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ProductsSearchBar: React.FC<ProductsSearchBarProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Rechercher un produit ou service..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default ProductsSearchBar;
