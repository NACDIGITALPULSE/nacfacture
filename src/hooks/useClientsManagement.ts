
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useClients } from "./useClients";

export interface ClientFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export function useClientsManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const queryClient = useQueryClient();
  const { data: clients = [], isLoading } = useClients();

  const createMutation = useMutation({
    mutationFn: async (clientData: ClientFormData) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Utilisateur non authentifié");

      const { data, error } = await supabase
        .from("clients")
        .insert([{ ...clientData, user_id: user.data.user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Client créé", description: "Le client a été ajouté avec succès" });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...clientData }: ClientFormData & { id: string }) => {
      const { data, error } = await supabase
        .from("clients")
        .update(clientData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Client modifié", description: "Les informations ont été mises à jour" });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setEditingClient(null);
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Client supprimé", description: "Le client a été supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  return {
    clients,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    editingClient,
    setEditingClient,
    createClient: createMutation.mutate,
    updateClient: updateMutation.mutate,
    deleteClient: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
