
import React from "react";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import SubscriptionGuard from "../components/SubscriptionGuard";
import BackButton from "../components/BackButton";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useProductsManagement } from "@/hooks/useProductsManagement";
import { usePagination } from "@/hooks/usePagination";
import ProductFormDrawer from "@/components/ProductFormDrawer";
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductsSearchBar from "@/components/products/ProductsSearchBar";
import ProductsStats from "@/components/products/ProductsStats";
import ProductsList from "@/components/products/ProductsList";

const ProduitsServices = () => {
  const {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting
  } = useProductsManagement();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteProductId, setDeleteProductId] = React.useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedProducts,
    goToPage,
    resetPage,
    totalItems,
    itemsPerPage,
  } = usePagination({
    data: filteredProducts,
    itemsPerPage: 9,
  });

  // Reset to first page when search changes
  React.useEffect(() => {
    resetPage();
  }, [searchTerm, resetPage]);

  const handleCreateProduct = (data: any) => {
    console.log("Creating product:", data);
    createProduct(data);
    setIsFormOpen(false);
  };

  const handleUpdateProduct = (data: any) => {
    if (editingProduct) {
      console.log("Updating product:", { ...data, id: editingProduct.id });
      updateProduct({ ...data, id: editingProduct.id });
      setEditingProduct(null);
    }
  };

  const handleEditProduct = (product: any) => {
    console.log("Editing product:", product);
    setEditingProduct(product);
  };

  const handleCloseEditForm = () => {
    setEditingProduct(null);
  };

  const handleDelete = () => {
    if (deleteProductId) {
      deleteProduct(deleteProductId);
      setDeleteProductId(null);
    }
  };

  const totalValue = products.reduce((sum, product) => sum + Number(product.price), 0);
  const productsWithTax = products.filter(p => p.tva && p.tva > 0).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
      <Header />
      <TopNav />
      <SubscriptionGuard>
        <main className="max-w-6xl w-full mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-4">
          <BackButton />
        </div>
        
        <ProductsHeader 
          onAddProduct={() => setIsFormOpen(true)}
          isCreating={isCreating}
        />

        <ProductsSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <ProductsStats 
          totalProducts={products.length}
          totalValue={totalValue}
          productsWithTax={productsWithTax}
        />

        <ProductsList 
          isLoading={isLoading}
          paginatedProducts={paginatedProducts}
          filteredProducts={filteredProducts}
          searchTerm={searchTerm}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
          onEditProduct={handleEditProduct}
          onDeleteProduct={setDeleteProductId}
        />

        {/* Formulaire de création */}
        <ProductFormDrawer
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleCreateProduct}
          isLoading={isCreating}
          title="Nouveau produit/service"
        />

        {/* Formulaire de modification */}
        <ProductFormDrawer
          open={!!editingProduct}
          onOpenChange={handleCloseEditForm}
          onSubmit={handleUpdateProduct}
          defaultValues={editingProduct ? {
            name: editingProduct.name,
            description: editingProduct.description || "",
            price: editingProduct.price,
            tva: editingProduct.tva || 0,
            product_type: editingProduct.product_type || 'product'
          } : undefined}
          isLoading={isUpdating}
          title="Modifier le produit/service"
        />

        {/* Dialog de suppression */}
        <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le produit/service</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce produit/service ? Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </main>
      </SubscriptionGuard>
    </div>
  );
};

export default ProduitsServices;
