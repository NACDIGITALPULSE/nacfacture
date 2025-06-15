import { Link } from "react-router-dom";
import { UserCircle, HelpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();

  return (
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
        {isAdmin && (
          <Link to="/admin" className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded shadow border border-blue-200 hover:bg-blue-200 transition">
            Admin
          </Link>
        )}
        {user ? (
          <>
            <button
              onClick={signOut}
              className="text-blue-600 underline underline-offset-2 hover:text-blue-800 ml-2"
              title="Déconnexion"
            >
              Déconnexion
            </button>
            <Link to="/profil" title="Profil utilisateur">
              <UserCircle size={34} className="text-blue-400 hover:scale-110 transition" />
            </Link>
          </>
        ) : (
          <Link to="/auth" className="text-blue-600 underline">Connexion</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
