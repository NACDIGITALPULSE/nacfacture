
import React from "react";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import RevenueChart from "../components/RevenueChart";
import ClientAnalytics from "../components/ClientAnalytics";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Users, Package, Euro, Download, BarChart3 } from "lucide-react";

const Reports = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["reports-data", user?.id, selectedCategory],
    queryFn: async () => {
      if (!user) return null;

      // Récupérer les données réelles selon la catégorie sélectionnée
      const [invoicesResult, clientsResult, productsResult] = await Promise.all([
        supabase.from("invoices").select("*").eq("user_id", user.id),
        supabase.from("clients").select("*").eq("user_id", user.id),
        supabase.from("products").select("*").eq("user_id", user.id)
      ]);

      const invoices = invoicesResult.data || [];
      const clients = clientsResult.data || [];
      const products = productsResult.data || [];

      // Calculer les statistiques
      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + Number(inv.total_amount), 0);

      const avgInvoiceValue = invoices.length > 0 
        ? invoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0) / invoices.length 
        : 0;

      // Filtrer par catégorie si nécessaire
      let filteredData = { invoices, clients, products };
      if (selectedCategory !== "all") {
        if (selectedCategory === "invoices") {
          filteredData = { invoices, clients: [], products: [] };
        } else if (selectedCategory === "clients") {
          filteredData = { invoices: [], clients, products: [] };
        } else if (selectedCategory === "products") {
          filteredData = { invoices: [], clients: [], products };
        }
      }

      return {
        ...filteredData,
        summary: {
          totalInvoices: invoices.length,
          totalClients: clients.length,
          totalProducts: products.length,
          totalRevenue,
          avgInvoiceValue,
          pendingInvoices: invoices.filter(inv => inv.status === 'proforma').length,
          paidInvoices: invoices.filter(inv => inv.status === 'paid').length
        }
      };
    },
    enabled: !!user,
  });

  const handleDownloadReport = () => {
    // TODO: Implémenter le téléchargement des rapports en PDF
    console.log("Téléchargement du rapport pour la catégorie:", selectedCategory);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
        <Header />
        <TopNav />
        <main className="max-w-6xl w-full mx-auto px-6 py-10">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-600">Chargement des rapports...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
      <Header />
      <TopNav />
      <main className="max-w-6xl w-full mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <BackButton />
          <div className="flex items-center gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="invoices">Factures</SelectItem>
                <SelectItem value="clients">Clients</SelectItem>
                <SelectItem value="products">Produits & Services</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleDownloadReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Télécharger rapport
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-700">
              Rapports et analyses {selectedCategory !== "all" && `- ${selectedCategory}`}
            </h1>
          </div>

          {/* Résumé des statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Factures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData?.summary.totalInvoices || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {reportData?.summary.paidInvoices || 0} payées, {reportData?.summary.pendingInvoices || 0} en attente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData?.summary.totalClients || 0}</div>
                <p className="text-xs text-muted-foreground">Clients actifs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Produits & Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData?.summary.totalProducts || 0}</div>
                <p className="text-xs text-muted-foreground">Dans le catalogue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Chiffre d'affaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData?.summary.totalRevenue?.toFixed(0) || 0} FCFA</div>
                <p className="text-xs text-muted-foreground">
                  Moy: {reportData?.summary.avgInvoiceValue?.toFixed(0) || 0} FCFA
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques et analyses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart />
            <ClientAnalytics />
          </div>

          {/* Données détaillées */}
          {selectedCategory === "all" || selectedCategory === "invoices" ? (
            <Card>
              <CardHeader>
                <CardTitle>Détail des factures</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData?.invoices && reportData.invoices.length > 0 ? (
                  <div className="space-y-2">
                    {reportData.invoices.slice(0, 10).map((invoice: any) => (
                      <div key={invoice.id} className="flex justify-between items-center p-2 border rounded">
                        <span>{invoice.number || `Facture du ${new Date(invoice.date).toLocaleDateString()}`}</span>
                        <span className="font-medium">{Number(invoice.total_amount).toFixed(0)} FCFA</span>
                      </div>
                    ))}
                    {reportData.invoices.length > 10 && (
                      <p className="text-sm text-muted-foreground text-center">
                        Et {reportData.invoices.length - 10} autres factures...
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">Aucune facture trouvée</p>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Reports;
