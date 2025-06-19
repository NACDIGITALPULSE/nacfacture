
import React from "react";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
import { Plus, Search, MoreVertical, Edit, Trash2, Package, Tag } from "lucide-react";
import { useProductsManagement } from "@/hooks/useProductsManagement";
import ProductForm from "@/components/ProductForm";

const ProduitsServices = () => {
  const {
    products,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    editingProduct,
    setEditingProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting
  } = useProductsManagement();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteProductId, setDeleteProductId] = React.useState<string | null>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = (data: any) => {
    createProduct(data);
  };

  const handleUpdateProduct = (data: any) => {
    if (editingProduct) {
      updateProduct({ ...data, id: editingProduct.id });
    }
  };

  const handleEditProduct = (product: any) => {
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
      <Header />
      <TopNav />
      <main className="max-w-6xl w-full mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Produits & Services</h1>
            <p className="text-gray-600">
              Gérez votre catalogue de produits et services à facturer.
            </p>
          </div>
          
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} /> 
            Ajouter
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un produit ou service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
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
              {products.filter(p => p.tva && p.tva > 0).length}
            </div>
            <div className="text-sm text-gray-600">Avec TVA</div>
          </div>
        </div>

        {/* Liste des produits */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-blue-700">Chargement des produits...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
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
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-green-600">
                          {Number(product.price).toLocaleString()} FCFA
                        </Badge>
                        {product.tva && product.tva > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            TVA {product.tva}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleteProductId(product.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Formulaire de création */}
        <ProductForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleCreateProduct}
          isLoading={isCreating}
          title="Nouveau produit/service"
        />

        {/* Formulaire de modification */}
        <ProductForm
          open={!!editingProduct}
          onOpenChange={handleCloseEditForm}
          onSubmit={handleUpdateProduct}
          defaultValues={editingProduct ? {
            name: editingProduct.name,
            description: editingProduct.description || "",
            price: editingProduct.price,
            tva: editingProduct.tva || 0
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
    </div>
  );
};

export default ProduitsServices;
