import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface SubscriptionStatus {
  id?: string;
  subscription_status: string;
  payment_method?: string;
  payment_proof_url?: string;
  activated_at?: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les informations d'abonnement",
          variant: "destructive",
        });
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPendingSubscription = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          subscription_status: 'pending',
          payment_method: 'mynita',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating subscription:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer l'abonnement",
          variant: "destructive",
        });
        return null;
      }

      setSubscription(data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const updateSubscriptionProof = async (proofUrl: string) => {
    if (!user || !subscription) return false;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          payment_proof_url: proofUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating subscription:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la preuve de paiement",
          variant: "destructive",
        });
        return false;
      }

      setSubscription(data);
      toast({
        title: "Succès",
        description: "Preuve de paiement enregistrée avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const hasActiveSubscription = subscription?.subscription_status === 'active';
  const hasPendingSubscription = subscription?.subscription_status === 'pending';

  return {
    subscription,
    loading,
    hasActiveSubscription,
    hasPendingSubscription,
    fetchSubscription,
    createPendingSubscription,
    updateSubscriptionProof,
  };
};