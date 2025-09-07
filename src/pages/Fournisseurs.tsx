
import React from "react";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import SubscriptionGuard from "../components/SubscriptionGuard";
import BackButton from "../components/BackButton";
import FournisseurForm from "../components/FournisseurForm";
import { useFournisseurs } from "../hooks/useFournisseurs";
import { Plus, Building2, Mail, Phone, MapPin, Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import LoadingState from "@/components/ui/loading-state";

const Fournisseurs = () => {
  const {
    fournisseurs,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    editingFournisseur,
    setEditingFournisseur,
    createFournisseur,
    updateFournisseur,
    deleteFournisseur,
    isCreating,
    isUpdating,
    isDeleting,
  } = useFournisseurs();

  const handleCreate = (data: any) => {
    createFournisseur(data);
  };

  const handleUpdate = (data: any) => {
    if (editingFournisseur) {
      updateFournisseur({ ...data, id: editingFournisseur.id });
    }
  };

  const handleEdit = (fournisseur: any) => {
    setEditingFournisseur(fournisseur);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      deleteFournisseur(id);
    }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingFournisseur(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
      <Header />
      <TopNav />
      <SubscriptionGuard>
        <main className="max-w-6xl w-full mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-4">
          <BackButton />
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Fournisseurs</h1>
            <p className="text-gray-600">Gérez votre liste de fournisseurs habituels.</p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} /> 
            Ajouter fournisseur
          </Button>
        </div>

        {isLoading ? (
          <LoadingState type="grid" count={6} />
        ) : fournisseurs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fournisseurs.map((fournisseur: any) => (
              <Card key={fournisseur.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{fournisseur.name}</CardTitle>
                      {fournisseur.contact_person && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {fournisseur.contact_person}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(fournisseur)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(fournisseur.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-3">
                  {fournisseur.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{fournisseur.email}</span>
                    </div>
                  )}
                  {fournisseur.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{fournisseur.phone}</span>
                    </div>
                  )}
                  {fournisseur.website && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={fournisseur.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 hover:underline"
                      >
                        Site web
                      </a>
                    </div>
                  )}
                  {fournisseur.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span className="line-clamp-2">{fournisseur.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow mt-3 flex flex-col items-center">
            <Building2 size={48} className="text-gray-300 mb-3" />
            <div className="text-gray-700 text-lg mb-2">Aucun fournisseur référencé.</div>
            <div className="text-gray-500 text-sm mb-4">Ajoutez vos fournisseurs pour faciliter la gestion.</div>
            <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
              <Plus size={16} />
              Ajouter votre premier fournisseur
            </Button>
          </div>
        )}

        <FournisseurForm
          open={isFormOpen || !!editingFournisseur}
          onOpenChange={resetForm}
          onSubmit={editingFournisseur ? handleUpdate : handleCreate}
          defaultValues={editingFournisseur}
          isLoading={isCreating || isUpdating}
          title={editingFournisseur ? "Modifier le fournisseur" : "Ajouter un fournisseur"}
        />
        </main>
      </SubscriptionGuard>
    </div>
  );
};

export default Fournisseurs;
