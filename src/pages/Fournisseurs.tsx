
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import { Plus } from "lucide-react";

const Fournisseurs = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
    <Header />
    <TopNav />
    <main className="max-w-5xl w-full mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Fournisseurs</h1>
          <p className="text-gray-600">Liste de vos fournisseurs habituels.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition">
          <Plus size={18} /> Ajouter fournisseur
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow mt-3 flex flex-col items-center">
        <div className="text-gray-700 text-lg mb-2">Aucun fournisseur référencé.</div>
        <div className="text-gray-500 text-sm mb-2">Ajoutez vos fournisseurs pour faciliter la gestion.</div>
      </div>
    </main>
  </div>
);

export default Fournisseurs;
