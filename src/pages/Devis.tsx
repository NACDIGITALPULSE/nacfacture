
import Header from "../components/Header";
import TopNav from "../components/TopNav";

const Devis = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
    <Header />
    <TopNav />
    <main className="max-w-5xl w-full mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-yellow-700">Mes devis</h1>
          <p className="text-gray-600">Liste de tous vos devis générés.</p>
        </div>
        <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow transition">
          + Nouveau devis
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow mt-3 flex flex-col items-center">
        <span className="text-4xl text-yellow-300 mb-2">—</span>
        <div className="text-gray-700 text-lg mb-2">Aucun devis pour le moment.</div>
        <div className="text-gray-500 text-sm mb-2">Générez un devis pour vos clients ici.</div>
      </div>
    </main>
  </div>
);

export default Devis;
