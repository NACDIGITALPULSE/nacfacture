import React from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "./ui/button";
import { Lock, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  showMessage?: boolean;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ 
  children, 
  showMessage = true 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, hasPendingSubscription, loading: subLoading } = useSubscription();
  const navigate = useNavigate();

  if (authLoading || subLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <Lock className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
        <p className="text-muted-foreground text-center mb-4">
          Vous devez être connecté pour accéder à cette fonctionnalité.
        </p>
        <Button onClick={() => navigate("/auth")} variant="default">
          Se connecter
        </Button>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    if (!showMessage) return null;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <CreditCard className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Abonnement requis</h2>
        <p className="text-muted-foreground text-center mb-4">
          {hasPendingSubscription 
            ? "Votre paiement est en cours de validation. Vous recevrez un accès complet une fois le paiement confirmé."
            : "Cette fonctionnalité nécessite un abonnement actif pour être utilisée."
          }
        </p>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/abonnement")} variant="default">
            {hasPendingSubscription ? "Voir mon abonnement" : "S'abonner maintenant"}
          </Button>
          <Button onClick={() => navigate("/")} variant="outline">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGuard;