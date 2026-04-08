
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
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Users, Package, TrendingUp, Download, BarChart3, ArrowUpRight, ArrowDownRight, Percent } from "lucide-react";

const Reports = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["reports-data", user?.id, selectedCategory],
    queryFn: async () => {
      if (!user) return null;

      const [invoicesResult, clientsResult, productsResult, itemsResult] = await Promise.all([
        supabase.from("invoices").select("*, clients(name)").eq("user_id", user.id),
        supabase.from("clients").select("*").eq("user_id", user.id),
        supabase.from("products").select("*").eq("user_id", user.id),
        supabase.from("invoice_items").select("*, invoices!inner(user_id, number, date, status, client_id, clients(name))").eq("invoices.user_id", user.id),
      ]);

      const invoices = invoicesResult.data || [];
      const clients = clientsResult.data || [];
      const products = productsResult.data || [];
      const allItems = itemsResult.data || [];

      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + Number(inv.total_amount), 0);

      const totalTVA = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + Number(inv.tva_total || 0), 0);

      const avgInvoiceValue = invoices.length > 0 
        ? invoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0) / invoices.length 
        : 0;

      // Calcul des marges par facture
      const invoiceMargins = invoices.map((invoice: any) => {
        const invoiceItems = allItems.filter((item: any) => item.invoice_id === invoice.id);
        const totalHT = invoiceItems.reduce((sum: number, item: any) => sum + Number(item.total || 0), 0);
        const totalTVAInv = invoiceItems.reduce((sum: number, item: any) => {
          const ht = Number(item.total || 0);
          const tvaRate = Number(item.tva || 0);
          return sum + (ht * tvaRate / 100);
        }, 0);
        const totalTTC = totalHT + totalTVAInv;
        
        // Marge = montant total - coûts (ici on montre HT vs TTC et la TVA comme indicateur)
        const marginPercent = totalTTC > 0 ? ((totalTVAInv / totalTTC) * 100) : 0;

        return {
          id: invoice.id,
          number: invoice.number || `F-${new Date(invoice.date).toLocaleDateString('fr-FR')}`,
          date: invoice.date,
          clientName: invoice.clients?.name || 'Client inconnu',
          status: invoice.status,
          totalHT,
          totalTVA: totalTVAInv,
          totalTTC,
          marginPercent,
          itemCount: invoiceItems.length,
        };
      });

      // Stats globales marges
      const totalHTAll = invoiceMargins.reduce((s, m) => s + m.totalHT, 0);
      const totalTTCAll = invoiceMargins.reduce((s, m) => s + m.totalTTC, 0);
      const avgMargin = invoiceMargins.length > 0 
        ? invoiceMargins.reduce((s, m) => s + m.marginPercent, 0) / invoiceMargins.length
        : 0;

      return {
        invoices,
        clients,
        products,
        invoiceMargins,
        summary: {
          totalInvoices: invoices.length,
          totalClients: clients.length,
          totalProducts: products.length,
          totalRevenue,
          totalTVA,
          avgInvoiceValue,
          pendingInvoices: invoices.filter(inv => inv.status === 'proforma').length,
          paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
          totalHTAll,
          totalTTCAll,
          avgMargin,
        }
      };
    },
    enabled: !!user,
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      proforma: { label: "Proforma", variant: "secondary" },
      validated: { label: "Validée", variant: "outline" },
      final: { label: "Finale", variant: "default" },
      paid: { label: "Payée", variant: "default" },
      cancelled: { label: "Annulée", variant: "destructive" },
    };
    const c = config[status] || { label: status, variant: "secondary" as const };
    return <Badge variant={c.variant} className={status === 'paid' ? 'bg-green-500 text-white' : ''}>{c.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <TopNav />
        <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-muted-foreground">Chargement des rapports...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <TopNav />
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24 sm:pb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <BackButton />
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Rapports & Analyses
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                <SelectItem value="invoices">Factures</SelectItem>
                <SelectItem value="clients">Clients</SelectItem>
                <SelectItem value="products">Produits</SelectItem>
                <SelectItem value="margins">Marges</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card>
              <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="hidden sm:inline">Factures</span>
                  <span className="sm:hidden">Fact.</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="text-xl sm:text-2xl font-bold">{reportData?.summary.totalInvoices || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {reportData?.summary.paidInvoices || 0} payées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Clients
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="text-xl sm:text-2xl font-bold">{reportData?.summary.totalClients || 0}</div>
                <p className="text-xs text-muted-foreground">Actifs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="hidden sm:inline">Chiffre d'affaires</span>
                  <span className="sm:hidden">CA</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="text-lg sm:text-2xl font-bold">{(reportData?.summary.totalRevenue || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">FCFA</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
                  <Percent className="h-4 w-4 text-orange-500" />
                  <span className="hidden sm:inline">TVA collectée</span>
                  <span className="sm:hidden">TVA</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="text-lg sm:text-2xl font-bold">{(reportData?.summary.totalTVA || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">FCFA</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          {(selectedCategory === "all" || selectedCategory === "invoices") && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <ClientAnalytics />
            </div>
          )}

          {/* Margin Analysis */}
          {(selectedCategory === "all" || selectedCategory === "margins") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Analyse des marges par facture
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Détail HT, TVA et TTC pour chaque facture
                </p>
              </CardHeader>
              <CardContent>
                {reportData?.invoiceMargins && reportData.invoiceMargins.length > 0 ? (
                  <>
                    {/* Summary row */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground">Total HT</p>
                        <p className="text-sm sm:text-lg font-bold text-blue-700 dark:text-blue-300">
                          {(reportData.summary.totalHTAll || 0).toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground">Total TVA</p>
                        <p className="text-sm sm:text-lg font-bold text-orange-700 dark:text-orange-300">
                          {(reportData.summary.totalTVA || 0).toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground">Total TTC</p>
                        <p className="text-sm sm:text-lg font-bold text-green-700 dark:text-green-300">
                          {(reportData.summary.totalTTCAll || 0).toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Facture</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">HT</TableHead>
                            <TableHead className="text-right">TVA</TableHead>
                            <TableHead className="text-right">TTC</TableHead>
                            <TableHead className="text-right">% TVA</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reportData.invoiceMargins.map((m: any) => (
                            <TableRow key={m.id}>
                              <TableCell className="font-medium">{m.number}</TableCell>
                              <TableCell>{m.clientName}</TableCell>
                              <TableCell>{new Date(m.date).toLocaleDateString('fr-FR')}</TableCell>
                              <TableCell>{getStatusBadge(m.status)}</TableCell>
                              <TableCell className="text-right">{m.totalHT.toLocaleString()}</TableCell>
                              <TableCell className="text-right text-orange-600">{m.totalTVA.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-semibold">{m.totalTTC.toLocaleString()}</TableCell>
                              <TableCell className="text-right">
                                <span className={`inline-flex items-center gap-1 ${m.marginPercent > 10 ? 'text-green-600' : 'text-muted-foreground'}`}>
                                  {m.marginPercent > 0 && <ArrowUpRight className="h-3 w-3" />}
                                  {m.marginPercent.toFixed(1)}%
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                      {reportData.invoiceMargins.map((m: any) => (
                        <div key={m.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{m.number}</p>
                              <p className="text-xs text-muted-foreground">{m.clientName}</p>
                            </div>
                            {getStatusBadge(m.status)}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">HT</p>
                              <p className="font-medium">{m.totalHT.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">TVA</p>
                              <p className="font-medium text-orange-600">{m.totalTVA.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">TTC</p>
                              <p className="font-semibold">{m.totalTTC.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-xs text-right">
                            <span className={`inline-flex items-center gap-1 ${m.marginPercent > 10 ? 'text-green-600' : 'text-muted-foreground'}`}>
                              TVA: {m.marginPercent.toFixed(1)}%
                              {m.marginPercent > 0 && <ArrowUpRight className="h-3 w-3" />}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Aucune facture trouvée. Créez vos premières factures pour voir les analyses de marges.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Client details */}
          {(selectedCategory === "clients") && (
            <Card>
              <CardHeader>
                <CardTitle>Détail des clients</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData?.clients && reportData.clients.length > 0 ? (
                  <div className="space-y-2">
                    {reportData.clients.map((client: any) => (
                      <div key={client.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-xs text-muted-foreground">{client.email || client.phone || ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">Aucun client trouvé</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Products details */}
          {(selectedCategory === "products") && (
            <Card>
              <CardHeader>
                <CardTitle>Catalogue produits & services</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData?.products && reportData.products.length > 0 ? (
                  <div className="space-y-2">
                    {reportData.products.map((product: any) => (
                      <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.product_type} • TVA {product.tva || 0}%</p>
                        </div>
                        <p className="font-semibold">{Number(product.price).toLocaleString()} FCFA</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">Aucun produit trouvé</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reports;
