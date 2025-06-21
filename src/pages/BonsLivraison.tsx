
import React from "react";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Search, Trash2, Download } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "@/hooks/use-toast";
import LoadingState from "@/components/ui/loading-state";
import DataTablePagination from "@/components/ui/data-table-pagination";
import { usePagination } from "@/hooks/usePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const BonsLivraison = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const { data: deliveryNotes = [], isLoading, refetch } = useQuery({
    queryKey: ["delivery_notes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("delivery_notes")
        .select(`
          *,
          invoices!inner(
            clients(name)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const deleteDeliveryNoteMutation = useMutation({
    mutationFn: async (deliveryNoteId: string) => {
      const { error } = await supabase
        .from("delivery_notes")
        .delete()
        .eq("id", deliveryNoteId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Bon de livraison supprimé",
        description: "Le bon de livraison a été supprimé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["delivery_notes"] });
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

  const filteredDeliveryNotes = deliveryNotes.filter(note =>
    note.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.invoices?.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedDeliveryNotes,
    goToPage,
    resetPage,
    totalItems,
    itemsPerPage,
  } = usePagination({
    data: filteredDeliveryNotes,
    itemsPerPage: 10,
  });

  React.useEffect(() => {
    resetPage();
  }, [searchTerm, resetPage]);

  const handleDelete = () => {
    if (deleteId) {
      deleteDeliveryNoteMutation.mutate(deleteId);
    }
  };

  const handleDownload = (deliveryNote: any) => {
    // Simuler le téléchargement PDF
    toast({
      title: "Téléchargement",
      description: "Fonctionnalité de téléchargement PDF bientôt disponible",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
      <Header />
      <TopNav />
      <main className="max-w-6xl w-full mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-4">
          <BackButton />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-700">Bons de livraison</h1>
            <p className="text-gray-600">Liste de vos bons de livraison.</p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par numéro ou client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{deliveryNotes.length}</div>
            <div className="text-sm text-gray-600">Total bons de livraison</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {deliveryNotes.filter(note => new Date(note.date) >= new Date(Date.now() - 30*24*60*60*1000)).length}
            </div>
            <div className="text-sm text-gray-600">Ce mois-ci</div>
          </div>
        </div>

        {isLoading ? (
          <LoadingState type="table" count={10} />
        ) : deliveryNotes.length > 0 ? (
          <>
            <div className="bg-white rounded-xl shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Bon</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDeliveryNotes.map((note: any) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-mono">
                        {note.number || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        {note.invoices?.clients?.name || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        {new Date(note.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(note)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(note.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
            <span className="text-4xl text-green-300 mb-2">—</span>
            <div className="text-gray-700 text-lg mb-2">Aucun bon de livraison généré.</div>
            <div className="text-gray-500 text-sm mb-2">Les bons de livraison apparaîtront ici après génération depuis les factures.</div>
          </div>
        )}

        {/* Dialog de suppression */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le bon de livraison</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce bon de livraison ? Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                disabled={deleteDeliveryNoteMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteDeliveryNoteMutation.isPending ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default BonsLivraison;
