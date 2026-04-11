
import React from "react";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import PDFDownloadButton from "../components/PDFDownloadButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, FileText, Calendar, Banknote } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "@/hooks/use-toast";
import LoadingState from "@/components/ui/loading-state";
import { Card, CardContent } from "@/components/ui/card";
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

const Devis = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["quotes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("quotes")
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

  const deleteQuoteMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const { error } = await supabase
        .from("quotes")
        .delete()
        .eq("id", quoteId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Devis supprimé",
        description: "Le devis a été supprimé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
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

  const filteredQuotes = quotes.filter(quote =>
    quote.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.invoices?.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedQuotes,
    goToPage,
    resetPage,
    totalItems,
    itemsPerPage,
  } = usePagination({
    data: filteredQuotes,
    itemsPerPage: 10,
  });

  React.useEffect(() => {
    resetPage();
  }, [searchTerm, resetPage]);

  const handleDelete = () => {
    if (deleteId) {
      deleteQuoteMutation.mutate(deleteId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Header />
      <TopNav />
      <main className="max-w-6xl w-full mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-4">
          <BackButton />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Mes devis</h1>
            <p className="text-muted-foreground">Liste de tous vos devis générés.</p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par numéro ou client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{quotes.length}</div>
            <div className="text-sm text-muted-foreground">Total devis</div>
          </div>
          <div className="bg-card p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {quotes.reduce((sum, q) => sum + Number(q.total_amount), 0).toLocaleString()} FCFA
            </div>
            <div className="text-sm text-muted-foreground">Montant total</div>
          </div>
        </div>

        {isLoading ? (
          <LoadingState type="table" count={10} />
        ) : quotes.length > 0 ? (
          <>
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {paginatedQuotes.map((quote: any) => (
                <Card key={quote.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-mono font-medium text-sm">{quote.number || "—"}</p>
                        <p className="text-sm text-muted-foreground">{quote.invoices?.clients?.name || "—"}</p>
                      </div>
                      <p className="font-semibold text-primary">{Number(quote.total_amount).toLocaleString()} FCFA</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(quote.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-2">
                        <PDFDownloadButton documentId={quote.id} documentType="quote" documentNumber={quote.number} />
                        <Button variant="outline" size="sm" onClick={() => setDeleteId(quote.id)} className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white dark:bg-card rounded-xl shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Devis</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedQuotes.map((quote: any) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-mono">{quote.number || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell>{quote.invoices?.clients?.name || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell>{new Date(quote.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="text-right font-medium">{Number(quote.total_amount).toLocaleString()} FCFA</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PDFDownloadButton documentId={quote.id} documentType="quote" documentNumber={quote.number} />
                          <Button variant="outline" size="sm" onClick={() => setDeleteId(quote.id)} className="text-destructive hover:bg-destructive/10">
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
          <div className="bg-card p-6 rounded-xl shadow border mt-3 flex flex-col items-center">
            <span className="text-4xl text-yellow-300 mb-2">—</span>
            <div className="text-foreground text-lg mb-2">Aucun devis pour le moment.</div>
            <div className="text-muted-foreground text-sm mb-2">Les devis apparaîtront ici après génération depuis les factures.</div>
          </div>
        )}

        {/* Dialog de suppression */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le devis</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce devis ? Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                disabled={deleteQuoteMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteQuoteMutation.isPending ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Devis;
