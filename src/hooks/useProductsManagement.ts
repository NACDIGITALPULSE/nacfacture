
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
}

export function useProductsManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useProducts();

  const createMutation = useMutation({
    mutationFn: async (productData: ProductFormData) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Utilisateur non authentifié");

      const { data, error } = await supabase
        .from("products")
        .insert([{ ...productData, user_id: user.data.user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Produit créé", description: "Le produit a été ajouté avec succès" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...productData }: ProductFormData & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Produit modifié", description: "Les informations ont été mises à jour" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Produit supprimé", description: "Le produit a été supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
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
