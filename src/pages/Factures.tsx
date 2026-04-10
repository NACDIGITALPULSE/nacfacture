
import React from "react";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import GenerateDocumentButton from "../components/GenerateDocumentButton";
import PDFDownloadButton from "../components/PDFDownloadButton";
import { PlusCircle, Search, Settings, Trash2, Pencil, FileText, DollarSign, Clock, CheckCircle } from "lucide-react";
import ExportButton from "@/components/ExportButton";
import FactureProformaForm from "@/components/FactureProformaForm";
import LoadingState from "@/components/ui/loading-state";
import DataTablePagination from "@/components/ui/data-table-pagination";
import InvoiceStatusUpdater from "@/components/InvoiceStatusUpdater";
import { usePagination } from "@/hooks/usePagination";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  proforma: { label: "Brouillon", variant: "secondary" },
  validated: { label: "Envoyée", variant: "default" },
  final: { label: "Finalisée", variant: "outline" },
  paid: { label: "Payée", variant: "default" },
  cancelled: { label: "Annulée", variant: "destructive" },
};

const Factures = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [editInvoiceId, setEditInvoiceId] = React.useState<string | null>(null);

  const { data: factures = [], refetch, isLoading } = useQuery({
    queryKey: ["factures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("id, status, date, total_amount, tva_total, client:clients(name), number")
        .order("date", { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      await supabase.from("quotes").delete().eq("invoice_id", invoiceId);
      await supabase.from("delivery_notes").delete().eq("invoice_id", invoiceId);
      await supabase.from("invoice_items").delete().eq("invoice_id", invoiceId);
      const { error } = await supabase.from("invoices").delete().eq("id", invoiceId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Facture supprimée", description: "La facture et tous ses documents associés ont été supprimés" });
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["delivery_notes"] });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const filteredFactures = factures.filter(facture =>
    facture.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage, totalPages, paginatedData: paginatedFactures,
    goToPage, resetPage, totalItems, itemsPerPage,
  } = usePagination({ data: filteredFactures, itemsPerPage: 10 });

  React.useEffect(() => { resetPage(); }, [searchTerm, resetPage]);

  const handleDelete = () => { if (deleteId) deleteInvoiceMutation.mutate(deleteId); };

  const totalCA = factures.reduce((sum, f) => sum + Number(f.total_amount), 0);
  const totalPaid = factures.filter(f => f.status === 'paid').reduce((sum, f) => sum + Number(f.total_amount), 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <TopNav />
      <main className="max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="flex items-center gap-2 mb-4">
          <BackButton />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Mes factures</h1>
            <p className="text-sm text-muted-foreground">Gérez et suivez toutes vos factures.</p>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton
              data={factures.map((f: any) => ({
                number: f.number || "",
                client: f.client?.name || "",
                date: new Date(f.date).toLocaleDateString("fr-FR"),
                status: statusLabels[f.status]?.label || f.status,
                total: Number(f.total_amount),
              }))}
              columns={[
                { key: "number", label: "Numéro" },
                { key: "client", label: "Client" },
                { key: "date", label: "Date" },
                { key: "status", label: "Statut" },
                { key: "total", label: "Montant HT" },
              ]}
              filename="factures.csv"
            />
            <Button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2">
              <PlusCircle size={18} /> 
              <span className="hidden sm:inline">Nouvelle facture</span>
              <span className="sm:hidden">Nouvelle</span>
            </Button>
          </div>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par client ou numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
          <div className="bg-card p-3 sm:p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-foreground">{factures.length}</div>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Brouillons</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
              {factures.filter(f => f.status === 'proforma').length}
            </div>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Payées</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {factures.filter(f => f.status === 'paid').length}
            </div>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">CA Total</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-foreground">
              {totalCA.toLocaleString()} <span className="text-xs text-muted-foreground">FCFA</span>
            </div>
          </div>
        </div>

        <FactureProformaForm
          open={drawerOpen}
          onOpenChange={(open) => { setDrawerOpen(open); if (!open) setEditInvoiceId(null); }}
          onFactureSaved={refetch}
          editInvoiceId={editInvoiceId}
        />

        {isLoading ? (
          <LoadingState type="table" count={10} />
        ) : factures.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block bg-card rounded-xl border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold">N°</TableHead>
                    <TableHead className="text-xs font-semibold">Client</TableHead>
                    <TableHead className="text-xs font-semibold">Date</TableHead>
                    <TableHead className="text-xs font-semibold">Statut</TableHead>
                    <TableHead className="text-right text-xs font-semibold">Montant HT</TableHead>
                    <TableHead className="text-xs font-semibold w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFactures.map((facture: any) => (
                    <TableRow key={facture.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs">{facture.number || "—"}</TableCell>
                      <TableCell className="text-sm font-medium">{facture.client?.name || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(facture.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <InvoiceStatusUpdater invoiceId={facture.id} currentStatus={facture.status} onStatusUpdated={refetch} />
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm">{Number(facture.total_amount).toLocaleString()} FCFA</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <div className="flex items-center gap-2 w-full">
                                <PDFDownloadButton documentId={facture.id} documentType="invoice" documentNumber={facture.number} variant="ghost" size="sm" />
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setEditInvoiceId(facture.id); setDrawerOpen(true); }}>
                              <Pencil className="h-4 w-4 mr-2" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <div className="flex items-center gap-2 w-full">
                                <GenerateDocumentButton invoiceId={facture.id} type="quote" disabled={facture.status === 'cancelled'} />
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <div className="flex items-center gap-2 w-full">
                                <GenerateDocumentButton invoiceId={facture.id} type="delivery_note" disabled={facture.status !== 'validated' && facture.status !== 'final' && facture.status !== 'paid'} />
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(facture.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col gap-2.5">
              {paginatedFactures.map((facture: any) => (
                <div key={facture.id} className="bg-card rounded-xl border border-border p-3.5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] text-muted-foreground">{facture.number || "—"}</p>
                      <p className="font-semibold text-sm mt-0.5 truncate text-foreground">{facture.client?.name || "—"}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <div className="flex items-center gap-2 w-full">
                            <PDFDownloadButton documentId={facture.id} documentType="invoice" documentNumber={facture.number} variant="ghost" size="sm" />
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setEditInvoiceId(facture.id); setDrawerOpen(true); }}>
                          <Pencil className="h-4 w-4 mr-2" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <div className="flex items-center gap-2 w-full">
                            <GenerateDocumentButton invoiceId={facture.id} type="quote" disabled={facture.status === 'cancelled'} />
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <div className="flex items-center gap-2 w-full">
                            <GenerateDocumentButton invoiceId={facture.id} type="delivery_note" disabled={facture.status !== 'validated' && facture.status !== 'final' && facture.status !== 'paid'} />
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteId(facture.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{new Date(facture.date).toLocaleDateString('fr-FR')}</span>
                    <InvoiceStatusUpdater invoiceId={facture.id} currentStatus={facture.status} onStatusUpdated={refetch} />
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-right font-bold text-sm text-foreground">{Number(facture.total_amount).toLocaleString()} FCFA</p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={goToPage}
              />
            )}
            <div className="h-16 lg:hidden" />
          </>
        ) : (
          <div className="bg-card p-8 rounded-xl border border-border flex flex-col items-center">
            <FileText size={48} className="text-muted-foreground/30 mb-3" />
            <div className="text-foreground text-lg font-medium mb-1">Aucune facture créée</div>
            <div className="text-muted-foreground text-sm mb-4">Créez votre première facture pour démarrer.</div>
            <Button onClick={() => setDrawerOpen(true)} size="sm">
              <PlusCircle className="h-4 w-4 mr-2" /> Créer une facture
            </Button>
          </div>
        )}

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer la facture</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera la facture et tous les documents associés (devis, bons de livraison). Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                disabled={deleteInvoiceMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteInvoiceMutation.isPending ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Factures;
