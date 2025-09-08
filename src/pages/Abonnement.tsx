
import Header from "../components/Header";
import TopNav from "../components/TopNav";

const Abonnement = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
    <Header />
    <TopNav />
    <main className="max-w-xl w-full mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-yellow-700 mb-4">Abonnement</h1>
      <div className="bg-white p-8 rounded-xl shadow flex flex-col gap-5 text-center">
        <span className="block text-5xl font-black text-yellow-500 drop-shadow mb-2">2500 FCFA</span>
        <div className="text-lg mb-2">par mois</div>
        <div className="text-gray-700 mb-2">Après la démo gratuite, bénéficiez d'un accès illimité à toutes vos fonctionnalités.</div>
        <div className="bg-yellow-100 p-3 rounded-xl text-yellow-900 text-base mb-3">
          <b>Paiement manuel via MyNITA :</b><br />
          <span className="font-bold">+227 88 08 29 87</span>
        </div>
        <div className="text-gray-600 mb-2">
          Après paiement, envoyez une preuve/confirmation au support client via WhatsApp :<br />
          <span className="font-medium">+227 88 08 29 87</span>
        </div>
        <a
          href="https://wa.me/22788082987"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition mt-1"
        >
          Envoyer une preuve via WhatsApp
        </a>
        <div className="text-sm mt-4 text-gray-500">Facturation 100% sécurisée. Assistance rapide.</div>
      </div>
    </main>
  </div>
);

export default Abonnement;
