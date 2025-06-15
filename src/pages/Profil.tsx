
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import { Upload, Edit } from "lucide-react";

const Profil = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
    <Header />
    <TopNav />
    <main className="max-w-2xl w-full mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Votre profil d’entreprise</h1>
      <form className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <Upload size={36} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo (optionnel)</label>
            <input type="file" className="block text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nom de l’entreprise</label>
          <input className="w-full border rounded px-3 py-2 text-base" placeholder="ex : Ma Société SARL" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Adresse</label>
          <input className="w-full border rounded px-3 py-2 text-base" placeholder="ex : BP 123, Niamey" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input className="w-full border rounded px-3 py-2 text-base" placeholder="ex : +227..." />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="w-full border rounded px-3 py-2 text-base" type="email" placeholder="ex : contact@monsite.ne" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Signature (optionnel)</label>
          <input type="file" className="block text-sm" />
        </div>
        <button className="self-end px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 transition mt-4">
          <Edit size={18} /> Enregistrer les modifications
        </button>
      </form>
    </main>
  </div>
);

export default Profil;
