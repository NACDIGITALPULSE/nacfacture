import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, RefreshCw, UserCheck, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    if (!isAdmin) {
      toast({ title: "Accès refusé", description: "Droits administrateur requis", variant: "destructive" });
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
      toast({ title: "Erreur", description: "Impossible de charger les abonnements", variant: "destructive" });
    } else {
      setSubscriptions(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (sub: Subscription, months = 1) => {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        subscription_status: "active",
        activated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", sub.id);
    if (error) {
      toast({ title: "Erreur", description: "Impossible d'approuver", variant: "destructive" });
    } else {
      toast({ title: "✅ Abonnement activé", description: `Activé pour ${months} mois` });
      loadSubscriptions();
    }
  };

  const handleReject = async (subId: string) => {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({ subscription_status: "rejected" })
      .eq("id", subId);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de rejeter", variant: "destructive" });
    } else {
      toast({ title: "Abonnement rejeté", variant: "destructive" });
      loadSubscriptions();
    }
  };

  const handleBlock = async (subId: string) => {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({ subscription_status: "expired", expires_at: new Date().toISOString() })
      .eq("id", subId);
    if (error) {
      toast({ title: "Erreur", variant: "destructive" });
    } else {
      toast({ title: "Compte bloqué" });
      loadSubscriptions();
    }
  };

  const filtered = subscriptions.filter(s => filter === "all" || s.subscription_status === filter);

  const statusLabel = (s: string) => {
    const map: Record<string, string> = { active: "Actif", pending: "En attente", rejected: "Rejeté", expired: "Expiré/Bloqué" };
    return map[s] || s;
  };

  const statusVariant = (s: string) => {
    if (s === "active") return "default" as const;
    if (s === "pending") return "secondary" as const;
    return "destructive" as const;
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
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24 lg:pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestion des Abonnements</h1>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filtrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="expired">Expirés</SelectItem>
                <SelectItem value="rejected">Rejetés</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={loadSubscriptions}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", count: subscriptions.length, color: "text-foreground" },
            { label: "En attente", count: subscriptions.filter(s => s.subscription_status === "pending").length, color: "text-yellow-600" },
            { label: "Actifs", count: subscriptions.filter(s => s.subscription_status === "active").length, color: "text-green-600" },
            { label: "Bloqués", count: subscriptions.filter(s => ["expired", "rejected"].includes(s.subscription_status)).length, color: "text-red-600" },
          ].map(stat => (
            <div key={stat.label} className="bg-card p-4 rounded-xl border border-border text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mobile cards */}
        <div className="space-y-3">
          {filtered.map((sub) => (
            <div key={sub.id} className="bg-card p-4 rounded-xl border border-border shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{sub.user_id.substring(0, 12)}...</p>
                  <Badge variant={sub.payment_method === "free_trial" ? "secondary" : "default"} className="mt-1">
                    {sub.payment_method === "free_trial" ? "Essai gratuit" : sub.payment_method || "Paiement"}
                  </Badge>
                </div>
                <Badge variant={statusVariant(sub.subscription_status)}>
                  {statusLabel(sub.subscription_status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                <div>
                  <span className="block font-medium text-card-foreground">Créé le</span>
                  {new Date(sub.created_at).toLocaleDateString("fr-FR")}
                </div>
                <div>
                  <span className="block font-medium text-card-foreground">Expire le</span>
                  {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString("fr-FR") : "N/A"}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {sub.subscription_status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => handleApprove(sub)}>
                      <Check className="h-3.5 w-3.5 mr-1" /> Approuver (1 mois)
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(sub.id)}>
                      <X className="h-3.5 w-3.5 mr-1" /> Rejeter
                    </Button>
                  </>
                )}
                {sub.subscription_status === "active" && (
                  <Button size="sm" variant="destructive" onClick={() => handleBlock(sub.id)}>
                    <UserX className="h-3.5 w-3.5 mr-1" /> Bloquer
                  </Button>
                )}
                {(sub.subscription_status === "expired" || sub.subscription_status === "rejected") && (
                  <Button size="sm" onClick={() => handleApprove(sub)}>
                    <UserCheck className="h-3.5 w-3.5 mr-1" /> Réactiver
                  </Button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Aucun abonnement trouvé.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminSubscriptions;
