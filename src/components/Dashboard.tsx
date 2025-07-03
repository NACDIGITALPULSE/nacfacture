
import React from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Package, TrendingUp, Euro, Download, BarChart3, PieChart, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import RevenueChart from "./RevenueChart";

const Dashboard = () => {
  const { user } = useAuth();
  const { profile: userProfile } = useUserProfile(user);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const [invoicesResult, clientsResult, productsResult] = await Promise.all([
        supabase.from("invoices").select("total_amount, status").eq("user_id", user.id),
        supabase.from("clients").select("id").eq("user_id", user.id),
        supabase.from("products").select("id").eq("user_id", user.id),
      ]);

      const invoices = invoicesResult.data || [];
      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + Number(inv.total_amount), 0);
      
      return {
        totalInvoices: invoices.length,
        totalClients: clientsResult.data?.length || 0,
        totalProducts: productsResult.data?.length || 0,
        totalRevenue,
        pendingInvoices: invoices.filter(inv => inv.status === 'proforma').length,
      };
    },
    enabled: !!user,
  });

  const { data: recentInvoices } = useQuery({
    queryKey: ["recent-invoices", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("invoices")
        .select(`
          id, number, date, total_amount, status,
          clients(name)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  // Nom complet avec prénom et nom du profil utilisateur
  const displayName = userProfile?.first_name && userProfile?.last_name 
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : user?.email?.split('@')[0] || "Utilisateur";

  const handleDownloadInvoices = () => {
    // TODO: Implémenter le téléchargement des factures en PDF
    console.log("Téléchargement des factures...");
  };

  const handleDownloadQuotes = () => {
    // TODO: Implémenter le téléchargement des devis en PDF
    console.log("Téléchargement des devis...");
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-700">Chargement...</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bienvenue, {displayName}!
          </h1>
          <p className="text-muted-foreground mt-1">Voici un aperçu de votre activité</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownloadInvoices} variant="outline" size="sm" className="shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Factures PDF
          </Button>
          <Button onClick={handleDownloadQuotes} variant="outline" size="sm" className="shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Devis PDF
          </Button>
        </div>
      </div>
      
      {/* Cartes de statistiques modernisées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Factures</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{stats?.totalInvoices || 0}</div>
            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {stats?.pendingInvoices || 0} en attente
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Clients</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{stats?.totalClients || 0}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Clients actifs
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Produits & Services</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
              <PieChart className="h-3 w-3" />
              Dans le catalogue
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Chiffre d'affaires</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Euro className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">{stats?.totalRevenue?.toLocaleString() || 0} FCFA</div>
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Factures payées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique des revenus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        
        {/* Factures récentes avec design amélioré */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Factures récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentInvoices && recentInvoices.length > 0 ? (
              <div className="space-y-3">
                {recentInvoices.slice(0, 4).map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-accent transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{invoice.clients?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.number || `Facture du ${new Date(invoice.date).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{Number(invoice.total_amount).toLocaleString()} FCFA</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                        invoice.status === 'validated' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {invoice.status === 'paid' ? 'Payée' :
                         invoice.status === 'validated' ? 'Validée' :
                         'Proforma'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">Aucune facture créée pour le moment</p>
                <p className="text-sm text-muted-foreground mt-1">Créez votre première facture pour voir les statistiques</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
