
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useFournisseurs() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFournisseur, setEditingFournisseur] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch fournisseurs
  const { data: fournisseurs = [], isLoading } = useQuery({
    queryKey: ["fournisseurs"],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("user_id", user.data.user.id)
        .order("name");
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create fournisseur
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("suppliers")
        .insert({
          ...data,
          user_id: user.data.user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Fournisseur ajouté",
        description: "Le fournisseur a été ajouté avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["fournisseurs"] });
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update fournisseur
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const { id, ...updateData } = data;
      const { error } = await supabase
        .from("suppliers")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Fournisseur modifié",
        description: "Le fournisseur a été modifié avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["fournisseurs"] });
      setEditingFournisseur(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete fournisseur
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Fournisseur supprimé",
        description: "Le fournisseur a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["fournisseurs"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    fournisseurs,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    editingFournisseur,
    setEditingFournisseur,
    createFournisseur: createMutation.mutate,
    updateFournisseur: updateMutation.mutate,
    deleteFournisseur: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
