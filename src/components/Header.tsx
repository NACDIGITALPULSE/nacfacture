
import { Link } from "react-router-dom";
import { UserCircle, HelpCircle } from "lucide-react";

const Header = () => (
  <header className="w-full flex items-center justify-between py-4 px-8 bg-white border-b shadow-sm">
    <div className="flex items-center gap-3">
      <img src="https://lovable.dev/opengraph-image-p98pqg.png" alt="Logo" className="h-10 rounded-md mr-2" />
      <Link to="/" className="text-2xl font-extrabold tracking-tight text-blue-700">Facture 227</Link>
    </div>
    <div className="flex items-center gap-5">
      <Link to="/abonnement" className="px-4 py-2 bg-yellow-400 text-black font-medium rounded-lg shadow hover:bg-yellow-500 transition">Abonnement</Link>
      <Link to="/support" className="flex items-center gap-2 text-blue-700 hover:underline">
        <HelpCircle size={20} /> Support client
      </Link>
      <Link to="/profil" title="Profil utilisateur">
        <UserCircle size={34} className="text-blue-400 hover:scale-110 transition" />
      </Link>
    </div>
  </header>
);

export default Header;
