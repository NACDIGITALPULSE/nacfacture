import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Check, X, RefreshCw, UserCheck, UserX, Search,
  Key, Trash2, DollarSign, Users, TrendingUp, Calendar
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface UserSub {
  id: string;
  user_id: string;
  activated_at: string | null;
  expires_at: string | null;
  subscription_status: string;
  payment_method: string;
  payment_proof_url: string | null;
  created_at: string;
  user_email?: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subs, setSubs] = useState<UserSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetting, setResetting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    if (!isAdmin) { navigate("/"); return; }
    loadData();
  }, [user, isAdmin]);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("user_subscriptions")
      .select("*")
      .order("created_at", { ascending: false });
    setSubs(data || []);
    setLoading(false);
  };

  const handleApprove = async (sub: UserSub, months = 1) => {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        subscription_status: "active",
        activated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", sub.id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Abonnement activé", description: `Activé pour ${months} mois` });
      loadData();
    }
  };

  const handleBlock = async (subId: string) => {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({ subscription_status: "expired", expires_at: new Date().toISOString() })
      .eq("id", subId);
    if (!error) { toast({ title: "Compte bloqué" }); loadData(); }
  };

  const handleReject = async (subId: string) => {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({ subscription_status: "rejected" })
      .eq("id", subId);
    if (!error) { toast({ title: "Abonnement rejeté" }); loadData(); }
  };

  const handleResetPassword = async (userId: string) => {
    setResetting(userId);
    // We need the user's email - use admin API via edge function or just prompt
    const email = prompt("Entrez l'email de l'utilisateur pour réinitialiser son mot de passe:");
    if (!email) { setResetting(null); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetting(null);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Email envoyé", description: `Lien de réinitialisation envoyé à ${email}` });
    }
  };

  const handleDeleteUser = async (sub: UserSub) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur et son abonnement ?")) return;
    // Delete subscription (user data will cascade via RLS)
    await supabase.from("user_subscriptions").delete().eq("id", sub.id);
    toast({ title: "Utilisateur supprimé" });
    loadData();
  };

  const filtered = subs.filter(s => {
    const matchStatus = filter === "all" || s.subscription_status === filter;
    const matchSearch = !search || s.user_id.includes(search);
    return matchStatus && matchSearch;
  });

  // Revenue calculations
  const activePaid = subs.filter(s => s.subscription_status === "active" && s.payment_method !== "free_trial");
  const totalRevenue = activePaid.length * 2500;
  const monthlyRevenue = activePaid.length * 2500;
  const totalUsers = subs.length;
  const activeUsers = subs.filter(s => s.subscription_status === "active").length;
  const pendingUsers = subs.filter(s => s.subscription_status === "pending").length;

  const statusLabel = (s: string) => {
    const map: Record<string, string> = { active: "Actif", pending: "En attente", rejected: "Rejeté", expired: "Bloqué" };
    return map[s] || s;
  };
  const statusVariant = (s: string) => {
    if (s === "active") return "default" as const;
    if (s === "pending") return "secondary" as const;
    return "destructive" as const;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
          🔑 Tableau de bord Administrateur
        </h1>

        {/* Revenue Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[
            { icon: Users, label: "Total utilisateurs", value: totalUsers, color: "text-foreground" },
            { icon: UserCheck, label: "Actifs", value: activeUsers, color: "text-green-600" },
            { icon: Calendar, label: "En attente", value: pendingUsers, color: "text-yellow-600" },
            { icon: DollarSign, label: "Revenu mensuel", value: `${monthlyRevenue.toLocaleString()} F`, color: "text-primary" },
            { icon: TrendingUp, label: "Revenu total", value: `${totalRevenue.toLocaleString()} F`, color: "text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card p-4 rounded-xl border border-border text-center">
              <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
              <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par ID utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="expired">Bloqués</SelectItem>
              <SelectItem value="rejected">Rejetés</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={loadData} className="shrink-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* User cards */}
        <div className="space-y-3">
          {filtered.map((sub) => {
            const createdDate = new Date(sub.created_at);
            const expiresDate = sub.expires_at ? new Date(sub.expires_at) : null;
            const daysLeft = expiresDate ? Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

            return (
              <div key={sub.id} className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground break-all">
                      {sub.user_id}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={sub.payment_method === "free_trial" ? "secondary" : "default"}>
                        {sub.payment_method === "free_trial" ? "Essai gratuit" : sub.payment_method || "Paiement"}
                      </Badge>
                      <Badge variant={statusVariant(sub.subscription_status)}>
                        {statusLabel(sub.subscription_status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground mb-3">
                  <div>
                    <span className="block font-medium text-card-foreground">Créé le</span>
                    {createdDate.toLocaleDateString("fr-FR")}
                  </div>
                  <div>
                    <span className="block font-medium text-card-foreground">Expire le</span>
                    {expiresDate ? expiresDate.toLocaleDateString("fr-FR") : "N/A"}
                  </div>
                  <div>
                    <span className="block font-medium text-card-foreground">Jours restants</span>
                    <span className={daysLeft > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                      {daysLeft > 0 ? `${daysLeft} jours` : "Expiré"}
                    </span>
                  </div>
                  <div>
                    <span className="block font-medium text-card-foreground">Revenu</span>
                    {sub.payment_method !== "free_trial" && sub.subscription_status === "active" ? "2 500 F/mois" : "0 F"}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {sub.subscription_status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => handleApprove(sub, 1)}>
                        <Check className="h-3.5 w-3.5 mr-1" /> Approuver (1 mois)
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleApprove(sub, 3)}>
                        <Check className="h-3.5 w-3.5 mr-1" /> 3 mois
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
                    <Button size="sm" onClick={() => handleApprove(sub, 1)}>
                      <UserCheck className="h-3.5 w-3.5 mr-1" /> Réactiver
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleResetPassword(sub.user_id)} disabled={resetting === sub.user_id}>
                    <Key className="h-3.5 w-3.5 mr-1" /> {resetting === sub.user_id ? "Envoi..." : "Reset MDP"}
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteUser(sub)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Supprimer
                  </Button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Aucun utilisateur trouvé.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
