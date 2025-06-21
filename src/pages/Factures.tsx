
import React from "react";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import GenerateDocumentButton from "../components/GenerateDocumentButton";
import { PlusCircle, Search, Settings, Trash2 } from "lucide-react";
import FactureProformaForm from "@/components/FactureProformaForm";
import LoadingState from "@/components/ui/loading-state";
import DataTablePagination from "@/components/ui/data-table-pagination";
import InvoiceStatusUpdater from "@/components/InvoiceStatusUpdater";
import InvoiceExportButton from "@/components/InvoiceExportButton";
import { usePagination } from "@/hooks/usePagination";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Factures = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  // Liste des factures proforma
  const { data: factures = [], refetch, isLoading } = useQuery({
    queryKey: ["factures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select(
          "id, status, date, total_amount, tva_total, client:clients(name), number"
        )
        .order("date", { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      // Supprimer d'abord les éléments de facture
      await supabase.from("invoice_items").delete().eq("invoice_id", invoiceId);
      // Puis supprimer la facture
      const { error } = await supabase.from("invoices").delete().eq("id", invoiceId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Facture supprimée",
        description: "La facture a été supprimée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredFactures = factures.filter(facture =>
    facture.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedFactures,
    goToPage,
    resetPage,
    totalItems,
    itemsPerPage,
  } = usePagination({
    data: filteredFactures,
    itemsPerPage: 10,
  });

  // Reset to first page when search changes
  React.useEffect(() => {
    resetPage();
  }, [searchTerm, resetPage]);

  const handleDelete = () => {
    if (deleteId) {
      deleteInvoiceMutation.mutate(deleteId);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      proforma: { label: "Proforma", variant: "secondary" as const },
      validated: { label: "Validée", variant: "default" as const },
      final: { label: "Finale", variant: "default" as const },
      paid: { label: "Payée", variant: "default" as const },
      cancelled: { label: "Annulée", variant: "destructive" as const }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const };
    
    return config;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
      <Header />
      <TopNav />
      <main className="max-w-6xl w-full mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-4">
          <BackButton />
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Mes factures</h1>
            <p className="text-gray-600">Liste de toutes vos factures créées.</p>
          </div>
          <Button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle size={20} /> 
            Nouvelle facture
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par client ou numéro de facture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{factures.length}</div>
            <div className="text-sm text-gray-600">Total factures</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {factures.filter(f => f.status === 'proforma').length}
            </div>
            <div className="text-sm text-gray-600">Proforma</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {factures.filter(f => f.status === 'paid').length}
            </div>
            <div className="text-sm text-gray-600">Payées</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {factures.reduce((sum, f) => sum + Number(f.total_amount), 0).toLocaleString()} FCFA
            </div>
            <div className="text-sm text-gray-600">Chiffre d'affaires</div>
          </div>
        </div>

        <FactureProformaForm
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onFactureSaved={refetch}
        />

        {isLoading ? (
          <LoadingState type="table" count={10} />
        ) : factures.length > 0 ? (
          <>
            <div className="bg-white rounded-xl shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N°</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Montant TTC</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFactures.map((facture: any) => (
                    <TableRow key={facture.id}>
                      <TableCell className="font-mono">
                        {facture.number || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        {facture.client?.name || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        {new Date(facture.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <InvoiceStatusUpdater
                          invoiceId={facture.id}
                          currentStatus={facture.status}
                          onStatusUpdated={refetch}
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {Number(facture.total_amount).toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <div className="flex items-center gap-2 w-full">
                                <InvoiceExportButton
                                  invoiceId={facture.id}
                                  type="pdf"
                                  variant="ghost"
                                  size="sm"
                                />
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <div className="flex items-center gap-2 w-full">
                                <InvoiceExportButton
                                  invoiceId={facture.id}
                                  type="json"
                                  variant="ghost"
                                  size="sm"
                                />
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <div className="flex items-center gap-2 w-full">
                                <GenerateDocumentButton
                                  invoiceId={facture.id}
                                  type="quote"
                                  disabled={facture.status === 'cancelled'}
                                />
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <div className="flex items-center gap-2 w-full">
                                <GenerateDocumentButton
                                  invoiceId={facture.id}
                                  type="delivery_note"
                                  disabled={facture.status !== 'validated' && facture.status !== 'final'}
                                />
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(facture.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow mt-3 flex flex-col items-center">
            <PlusCircle size={48} className="text-gray-300 mb-3" />
            <div className="text-gray-700 text-lg mb-2">Aucune facture encore créée.</div>
            <div className="text-gray-500 text-sm mb-2">Créez votre première facture ci-dessus pour démarrer.</div>
          </div>
        )}

        {/* Dialog de suppression */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer la facture</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette facture ? Cette action ne peut pas être annulée et supprimera aussi tous les éléments associés.
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
