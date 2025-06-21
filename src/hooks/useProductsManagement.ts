
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "./useProducts";

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  tva?: number;
  product_type?: string;
}

export function useProductsManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useProducts();

  const createMutation = useMutation({
    mutationFn: async (productData: ProductFormData) => {
      console.log("Creating product with data:", productData);
      
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Utilisateur non authentifié");

      // Pour l'instant, on exclut product_type car la colonne n'existe pas encore dans la DB
      const { product_type, ...dataToInsert } = productData;
      
      const { data, error } = await supabase
        .from("products")
        .insert([{ ...dataToInsert, user_id: user.data.user.id }])
        .select()
        .single();

      if (error) {
        console.error("Error creating product:", error);
        throw error;
      }
      
      console.log("Product created successfully:", data);
      return data;
    },
    onSuccess: () => {
      toast({ title: "Produit créé", description: "Le produit a été ajouté avec succès" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error("Create product error:", error);
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, product_type, ...productData }: ProductFormData & { id: string }) => {
      console.log("Updating product with data:", { id, ...productData });
      
      // Pour l'instant, on exclut product_type car la colonne n'existe pas encore dans la DB
      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating product:", error);
        throw error;
      }
      
      console.log("Product updated successfully:", data);
      return data;
    },
    onSuccess: () => {
      toast({ title: "Produit modifié", description: "Les informations ont été mises à jour" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
    },
    onError: (error) => {
      console.error("Update product error:", error);
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      console.log("Deleting product:", productId);
      
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) {
        console.error("Error deleting product:", error);
        throw error;
      }
      
      console.log("Product deleted successfully");
    },
    onSuccess: () => {
      toast({ title: "Produit supprimé", description: "Le produit a été supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Delete product error:", error);
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  return {
    products,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    editingProduct,
    setEditingProduct,
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
