import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Abonnement = () => {
  const { user, hasActiveSubscription, subscriptionLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadSubscription();
  }, [user, navigate]);

  const loadSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setSubscription(data);
    }
    setLoading(false);
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Bonjour, je souhaite renouveler mon abonnement.\nEmail: ${user?.email}\nUserID: ${user?.id}`
    );
    window.open(`https://wa.me/22788082987?text=${message}`, "_blank");
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <TopNav />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  const daysRemaining = subscription?.expires_at 
    ? Math.ceil((new Date(subscription.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <TopNav />
      <main className="max-w-3xl w-full mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-6">Mon Abonnement</h1>
        
        {/* Statut de l'abonnement */}
        <div className="bg-card p-8 rounded-xl shadow-lg mb-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-card-foreground">Statut actuel</h2>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              hasActiveSubscription 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}>
              {hasActiveSubscription ? "Actif" : "Expiré"}
            </span>
          </div>

          {subscription && (
            <div className="space-y-3 text-card-foreground">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">
                  {subscription.payment_method === "free_trial" ? "Essai gratuit" : "Abonnement payant"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date d'expiration:</span>
                <span className="font-medium">
                  {new Date(subscription.expires_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              {hasActiveSubscription && daysRemaining > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jours restants:</span>
                  <span className="font-bold text-primary">{daysRemaining} jours</span>
                </div>
              )}
              {subscription.subscription_status === "pending" && (
                <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg">
                  <p className="font-medium">⏳ Paiement en attente de validation par l'administrateur</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Plan d'abonnement */}
        <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-2">Abonnement Mensuel</h2>
            <div className="text-5xl font-black text-primary mb-2">2500 FCFA</div>
            <p className="text-muted-foreground">par mois</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">✓</span>
              <p className="text-card-foreground">Accès illimité à toutes les fonctionnalités</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">✓</span>
              <p className="text-card-foreground">Génération de factures, devis et bons de livraison</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">✓</span>
              <p className="text-card-foreground">Gestion clients et fournisseurs</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">✓</span>
              <p className="text-card-foreground">Support client rapide</p>
            </div>
          </div>

          <div className="bg-accent p-4 rounded-lg mb-6">
            <p className="font-semibold text-accent-foreground mb-2">🎁 Premier mois gratuit !</p>
            <p className="text-sm text-muted-foreground">
              Profitez d'un mois d'essai gratuit dès votre inscription. Aucun paiement requis pour commencer.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="font-semibold text-card-foreground mb-2">💳 Comment payer ?</p>
            <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
              <li>Effectuez le paiement via MyNITA au <span className="font-bold text-card-foreground">+227 88 08 29 87</span></li>
              <li>Cliquez sur le bouton ci-dessous pour contacter le support</li>
              <li>Envoyez votre preuve de paiement via WhatsApp</li>
              <li>Votre abonnement sera activé après validation (sous 24h)</li>
            </ol>
          </div>

          <Button 
            onClick={handleWhatsAppContact}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg"
            size="lg"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Contacter le support via WhatsApp
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Facturation 100% sécurisée • Assistance rapide
          </p>
        </div>
      </main>
    </div>
  );
};

export default Abonnement;
