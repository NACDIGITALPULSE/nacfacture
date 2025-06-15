
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import DashboardCards from "../components/DashboardCards";
import { Link } from "react-router-dom";

const Index = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-bl from-blue-50 to-white">
    <Header />
    <TopNav />
    <main className="max-w-5xl w-full mx-auto px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-blue-800">Bienvenue sur Facture 227</h1>
      <p className="text-lg mb-8 text-gray-700">
        Votre solution de <span className="font-semibold">facturation simple, rapide et adaptée au Niger</span>.<br />
        Générez en quelques clics des <b>factures</b>, <b>devis</b> ou <b>bons de livraison</b> prêts à envoyer sur WhatsApp ou par email&nbsp;!
      </p>
      <DashboardCards />
      <div className="flex flex-col md:flex-row gap-7 mt-8">
        <Link className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl p-6 text-xl flex flex-col items-center transition shadow"
          to="/factures">
          + Nouvelle facture
          <span className="text-base opacity-70 mt-1">Commencez votre première facture gratuite</span>
        </Link>
        <Link className="flex-1 bg-white border border-blue-200 text-blue-800 font-semibold rounded-xl p-6 text-xl flex flex-col items-center transition hover:bg-blue-50 shadow"
          to="/profil">
          Personnalisez votre profil
          <span className="text-base opacity-70 mt-1">Ajoutez logo, coordonnées, signature…</span>
        </Link>
      </div>
      <div className="mt-12 flex flex-col md:flex-row items-center gap-6 justify-center">
        <div className="p-4 bg-yellow-200 rounded-xl text-yellow-900 font-medium">
          <span>Démo gratuite <b>5 factures</b> <b>incluses</b> — Passez à l’abonnement pour un usage illimité !</span>
        </div>
        <Link to="/abonnement"
          className="inline-block px-6 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow transition">
          Abonnement 2500 FCFA/mois via MyNITA
        </Link>
      </div>
      <div className="mt-12 flex flex-col items-center">
        <Link to="/support" className="text-blue-800 hover:underline mt-3">Besoin d’aide ? Contactez le support</Link>
      </div>
    </main>
  </div>
);

export default Index;
