
import React from "react";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useClientsManagement } from "@/hooks/useClientsManagement";
import { usePagination } from "@/hooks/usePagination";
import ClientForm from "@/components/ClientForm";
import ClientsList from "@/components/ClientsList";
import LoadingState from "@/components/ui/loading-state";
import DataTablePagination from "@/components/ui/data-table-pagination";

const Clients = () => {
  const {
    clients,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    editingClient,
    setEditingClient,
    createClient,
    updateClient,
    deleteClient,
    isCreating,
    isUpdating,
    isDeleting
  } = useClientsManagement();

  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedClients,
    goToPage,
    resetPage,
    totalItems,
    itemsPerPage,
  } = usePagination({
    data: filteredClients,
    itemsPerPage: 9,
  });

  // Reset to first page when search changes
  React.useEffect(() => {
    resetPage();
  }, [searchTerm, resetPage]);

  const handleCreateClient = (data: any) => {
    createClient(data);
  };

  const handleUpdateClient = (data: any) => {
    if (editingClient) {
      updateClient({ ...data, id: editingClient.id });
    }
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
  };

  const handleCloseEditForm = () => {
    setEditingClient(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
      <Header />
      <TopNav />
      <main className="max-w-6xl w-full mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Clients</h1>
            <p className="text-gray-600">
              Gérez vos clients et leurs informations de contact.
            </p>
          </div>
          
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2"
            disabled={isCreating}
          >
            <Plus size={18} /> 
            {isCreating ? "Ajout..." : "Ajouter client"}
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un client par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
            <div className="text-sm text-gray-600">Total clients</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {clients.filter(c => c.email).length}
            </div>
            <div className="text-sm text-gray-600">Avec email</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {clients.filter(c => c.phone).length}
            </div>
            <div className="text-sm text-gray-600">Avec téléphone</div>
          </div>
        </div>

        {/* Liste des clients avec pagination */}
        {isLoading ? (
          <LoadingState type="cards" count={9} />
        ) : (
          <>
            <ClientsList
              clients={paginatedClients}
              onEdit={handleEditClient}
              onDelete={deleteClient}
              isDeleting={isDeleting}
            />
            
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
        )}

        {/* Formulaire de création */}
        <ClientForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleCreateClient}
          isLoading={isCreating}
          title="Nouveau client"
        />

        {/* Formulaire de modification */}
        <ClientForm
          open={!!editingClient}
          onOpenChange={handleCloseEditForm}
          onSubmit={handleUpdateClient}
          defaultValues={editingClient ? {
            name: editingClient.name,
            email: editingClient.email || "",
            phone: editingClient.phone || "",
            address: editingClient.address || ""
          } : undefined}
          isLoading={isUpdating}
          title="Modifier le client"
        />
      </main>
    </div>
  );
};

export default Clients;
