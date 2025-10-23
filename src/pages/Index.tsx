import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import QuickActions from "@/components/QuickActions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const Index = () => {
  const { user, loading, hasActiveSubscription, subscriptionLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !subscriptionLoading && user && !hasActiveSubscription) {
      // Optionnel: rediriger automatiquement vers la page d'abonnement après 5 secondes
      const timer = setTimeout(() => {
        navigate("/abonnement");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, subscriptionLoading, user, hasActiveSubscription, navigate]);

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Si l'utilisateur n'a pas d'abonnement actif, afficher un message
  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-xl font-bold">Abonnement requis</AlertTitle>
              <AlertDescription className="text-base mt-2">
                Votre abonnement a expiré ou n'est pas encore actif. Pour continuer à utiliser
                Facture Digital, veuillez renouveler votre abonnement.
              </AlertDescription>
            </Alert>

            <div className="bg-card p-8 rounded-xl shadow-lg border border-border text-center">
              <h2 className="text-2xl font-bold text-card-foreground mb-4">
                Accès limité
              </h2>
              <p className="text-muted-foreground mb-6">
                Activez votre abonnement pour accéder à toutes les fonctionnalités de l'application.
              </p>
              <Button
                onClick={() => navigate("/abonnement")}
                size="lg"
                className="w-full"
              >
                Voir les options d'abonnement
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Bienvenue sur Facture Digital
          </h1>
          <p className="text-muted-foreground">
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
