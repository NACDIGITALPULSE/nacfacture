import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "@/hooks/use-toast";

export interface InvoiceTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  logo_position: string;
  color_scheme: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  font_family: string;
  layout_type: string;
  custom_css?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useInvoiceTemplates = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["invoice-templates", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("invoice_templates")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as InvoiceTemplate[];
    },
    enabled: !!user,
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<InvoiceTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("invoice_templates")
        .insert({ ...template, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Template créé",
        description: "Le template de facture a été créé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["invoice-templates"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InvoiceTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from("invoice_templates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Template modifié",
        description: "Le template de facture a été mis à jour avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["invoice-templates"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const setDefaultTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      if (!user) throw new Error("User not authenticated");
      
      // Unset all defaults first
      await supabase
        .from("invoice_templates")
        .update({ is_default: false })
        .eq("user_id", user.id);
      
      // Set new default
      const { error } = await supabase
        .from("invoice_templates")
        .update({ is_default: true })
        .eq("id", templateId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Template par défaut modifié",
        description: "Le template par défaut a été mis à jour",
      });
      queryClient.invalidateQueries({ queryKey: ["invoice-templates"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase
        .from("invoice_templates")
        .delete()
        .eq("id", templateId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Template supprimé",
        description: "Le template de facture a été supprimé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["invoice-templates"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const defaultTemplate = templates.find(t => t.is_default);

  return {
    templates,
    defaultTemplate,
    isLoading,
    createTemplate: createTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    setDefaultTemplate: setDefaultTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    isCreating: createTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending,
  };
};