import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Subscription {
  id: string;
  user_id: string;
  activated_at: string | null;
  expires_at: string | null;
  subscription_status: string;
  payment_method: string;
  payment_proof_url: string | null;
  created_at: string;
}

const AdminSubscriptions = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'administrateur",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    loadSubscriptions();
  }, [user, isAdmin, navigate]);

  const loadSubscriptions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les abonnements",
        variant: "destructive",
      });
    } else {
      setSubscriptions(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (subscriptionId: string) => {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        subscription_status: "active",
        activated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", subscriptionId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver l'abonnement",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Abonnement approuvé",
        description: "L'abonnement a été activé avec succès",
      });
      loadSubscriptions();
    }
  };

  const handleReject = async (subscriptionId: string) => {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        subscription_status: "rejected",
      })
      .eq("id", subscriptionId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter l'abonnement",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Abonnement rejeté",
        description: "L'abonnement a été rejeté",
        variant: "destructive",
      });
      loadSubscriptions();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <TopNav />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <TopNav />
      <main className="max-w-7xl w-full mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-6">Gestion des Abonnements</h1>

        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Méthode de paiement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-mono text-xs">
                    {sub.user_id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant={sub.payment_method === "free_trial" ? "secondary" : "default"}>
                      {sub.payment_method === "free_trial" ? "Essai gratuit" : sub.payment_method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sub.subscription_status === "active"
                          ? "default"
                          : sub.subscription_status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {sub.subscription_status === "active" && "Actif"}
                      {sub.subscription_status === "pending" && "En attente"}
                      {sub.subscription_status === "rejected" && "Rejeté"}
                      {sub.subscription_status === "expired" && "Expiré"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(sub.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    {sub.expires_at
                      ? new Date(sub.expires_at).toLocaleDateString("fr-FR")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {sub.subscription_status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(sub.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(sub.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AdminSubscriptions;
