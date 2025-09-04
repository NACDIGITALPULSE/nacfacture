
import React from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import QuickActions from "@/components/QuickActions";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            Bienvenue sur Facture Digital
          </h1>
          <p className="text-gray-600">
            Gérez vos factures, clients et produits en toute simplicité
          </p>
        </div>
        
        <QuickActions />
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
