
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import ProductCard from "./ProductCard";
import LoadingState from "@/components/ui/loading-state";
import DataTablePagination from "@/components/ui/data-table-pagination";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  tva?: number;
  product_type?: string;
}

interface ProductsListProps {
  isLoading: boolean;
  paginatedProducts: Product[];
  filteredProducts: Product[];
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  isLoading,
  paginatedProducts,
  filteredProducts,
  searchTerm,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEditProduct,
  onDeleteProduct
}) => {
  if (isLoading) {
    return <LoadingState type="cards" count={9} />;
  }

  if (filteredProducts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "Aucun résultat" : "Aucun produit/service"}
          </h3>
          <p className="text-gray-500 text-center">
            {searchTerm 
              ? "Aucun produit ne correspond à votre recherche."
              : "Commencez par ajouter vos produits et services au catalogue."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEditProduct}
            onDelete={onDeleteProduct}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default ProductsList;
