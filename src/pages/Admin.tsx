import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Eye, Calendar, User, CreditCard } from "lucide-react";
import Header from "@/components/Header";
import { useRealtimeSubscriptions } from "@/hooks/useRealtimeSubscriptions";

interface UserSubscription {
  id: string;
  user_id: string;
  subscription_status: string;
  payment_method: string;
  payment_proof_url?: string;
  created_at: string;
  activated_at?: string;
  expires_at?: string;
  user_email?: string;
}

const Admin = () => {
  const { isAdmin, loading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
  const { toast } = useToast();

  useRealtimeSubscriptions(() => {
    fetchPendingSubscriptions();
    toast({
      title: "Nouvel abonnement",
      description: "Un nouvel abonnement est en attente de validation",
    });
  });

  useEffect(() => {
    if (isAdmin) {
      fetchPendingSubscriptions();
    }
  }, [isAdmin]);

  const fetchPendingSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          users:user_id (email)
        `)
        .eq('subscription_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const subscriptionsWithEmail = data?.map(sub => ({
        ...sub,
        user_email: (sub as any).users?.email
      })) || [];

      setSubscriptions(subscriptionsWithEmail);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les abonnements",
        variant: "destructive",
      });
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  const handleApproveSubscription = async (subscriptionId: string) => {
    try {
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 an d'abonnement

      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          subscription_status: 'active',
          activated_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      toast({
        title: "Abonnement approuvé",
        description: "L'abonnement a été activé avec succès",
      });

      fetchPendingSubscriptions();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver l'abonnement",
        variant: "destructive",
      });
    }
  };

  const handleRejectSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          subscription_status: 'rejected',
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      toast({
        title: "Abonnement rejeté",
        description: "L'abonnement a été rejeté",
      });

      fetchPendingSubscriptions();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter l'abonnement",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            Administration
          </h1>
          <p className="text-gray-600">
            Gérer les abonnements en attente de validation
          </p>
        </div>

        {loadingSubscriptions ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des abonnements...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">Aucun abonnement en attente de validation</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {subscription.user_email || 'Email non disponible'}
                    </CardTitle>
                    <Badge variant="outline">
                      {subscription.subscription_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        Méthode: {subscription.payment_method}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        Demandé le: {new Date(subscription.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  {subscription.payment_proof_url && (
                    <div className="mb-6">
                      <p className="text-sm font-medium mb-2">Preuve de paiement:</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(subscription.payment_proof_url, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Voir la preuve
                      </Button>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleApproveSubscription(subscription.id)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approuver
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectSubscription(subscription.id)}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Rejeter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;