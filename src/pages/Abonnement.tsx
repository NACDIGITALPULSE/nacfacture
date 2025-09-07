import Header from "../components/Header";
import TopNav from "../components/TopNav";
import { useAuth } from "@/contexts/AuthProvider";
import { useSubscription } from "@/hooks/useSubscription";
import { CheckCircle, Clock, CreditCard } from "lucide-react";

const Abonnement = () => {
  const { user } = useAuth();
  const { subscription, hasActiveSubscription, hasPendingSubscription, loading } = useSubscription();

  const getStatusDisplay = () => {
    if (loading) {
      return (
        <div className="bg-gray-100 p-3 rounded-xl text-gray-900 text-base mb-3 flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Vérification du statut...
        </div>
      );
    }

    if (hasActiveSubscription) {
      return (
        <div className="bg-green-100 p-3 rounded-xl text-green-900 text-base mb-3 flex items-center">
          <CheckCircle className="mr-2 h-5 w-5" />
          <div>
            <b>Abonnement actif</b><br />
            Vous avez accès à toutes les fonctionnalités.
          </div>
        </div>
      );
    }

    if (hasPendingSubscription) {
      return (
        <div className="bg-yellow-100 p-3 rounded-xl text-yellow-900 text-base mb-3 flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          <div>
            <b>Paiement en cours de validation</b><br />
            Votre paiement est en cours de vérification.
          </div>
        </div>
      );
    }

    return (
      <div className="bg-blue-100 p-3 rounded-xl text-blue-900 text-base mb-3 flex items-center">
        <CreditCard className="mr-2 h-5 w-5" />
        <div>
          <b>Abonnement requis</b><br />
          Activez votre abonnement pour accéder à toutes les fonctionnalités.
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
      <Header />
      <TopNav />
      <main className="max-w-xl w-full mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-yellow-700 mb-4">Abonnement</h1>
        <div className="bg-white p-8 rounded-xl shadow flex flex-col gap-5 text-center">
          
          {getStatusDisplay()}

          {!hasActiveSubscription && (
            <>
              <span className="block text-5xl font-black text-yellow-500 drop-shadow mb-2">2500 FCFA</span>
              <div className="text-lg mb-2">par mois</div>
              <div className="text-gray-700 mb-2">Bénéficiez d'un accès illimité à toutes vos fonctionnalités.</div>
              <div className="bg-yellow-100 p-3 rounded-xl text-yellow-900 text-base mb-3">
                <b>Paiement manuel via MyNITA :</b><br />
                <span className="font-bold">+227 88 08 29 87</span>
              </div>
              <div className="text-gray-600 mb-2">
                Après paiement, envoyez une preuve via WhatsApp :<br />
                <span className="font-medium">+227 88 08 29 87</span>
              </div>
              <a
                href="https://wa.me/22788082987"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition mt-1"
              >
                Envoyer une preuve via WhatsApp
              </a>
            </>
          )}

          {hasActiveSubscription && (
            <div className="text-center">
              <div className="text-lg text-green-700 mb-4">
                Merci ! Votre abonnement est actif.
              </div>
              <a
                href="https://wa.me/22788082987"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition"
              >
                Contacter le support
              </a>
            </div>
          )}

          <div className="text-sm mt-4 text-gray-500">Facturation 100% sécurisée. Assistance rapide.</div>
        </div>
      </main>
    </div>
  );
};

export default Abonnement;