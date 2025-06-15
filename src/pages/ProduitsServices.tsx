
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import { Plus } from "lucide-react";

const ProduitsServices = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
    <Header />
    <TopNav />
    <main className="max-w-5xl w-full mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Produits &amp; services</h1>
          <p className="text-gray-600">Gérez votre catalogue de produits ou services à facturer.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition">
          <Plus size={18} /> Ajouter
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow mt-3 flex flex-col items-center">
        <div className="text-gray-700 text-lg mb-2">Aucun produit/service enregistré.</div>
        <div className="text-gray-500 text-sm mb-2">Ajoutez votre premier produit ou service.</div>
      </div>
    </main>
  </div>
);

export default ProduitsServices;
