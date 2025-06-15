
import { Link } from "react-router-dom";
import { UserCircle, HelpCircle, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import React from "react";
import MobileNavDrawer from "./MobileNavDrawer";

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="w-full flex items-center justify-between py-3 md:py-4 px-4 md:px-8 bg-white border-b shadow-sm">
      {/* Logo & menu */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Hamburger menu on mobile */}
        {user && (
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={28} className="text-blue-700" />
          </button>
        )}
        <img
          src="https://lovable.dev/opengraph-image-p98pqg.png"
          alt="Logo"
          className="h-10 rounded-md mr-2 hidden xs:inline-block"
        />
        <Link to="/" className="text-xl xs:text-2xl font-extrabold tracking-tight text-blue-700">
          Facture 227
        </Link>
      </div>
      {/* Actions utilisateur */}
      <div className="flex items-center gap-2 md:gap-5">
        <Link
          to="/abonnement"
          className="hidden xs:block px-3 py-2 bg-yellow-400 text-black font-medium rounded-lg shadow hover:bg-yellow-500 transition"
        >
          Abonnement
        </Link>
        <Link
          to="/support"
          className="flex items-center gap-1 xs:gap-2 text-blue-700 hover:underline text-base"
        >
          <HelpCircle size={20} /> <span className="hidden xs:inline">Support client</span>
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            className="hidden xs:block bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded shadow border border-blue-200 hover:bg-blue-200 transition"
          >
            Admin
          </Link>
        )}
        {user ? (
          <>
            <button
              onClick={signOut}
              className="text-blue-600 underline underline-offset-2 hover:text-blue-800 ml-1 xs:ml-2"
              title="Déconnexion"
            >
              Déconnexion
            </button>
            <Link to="/profil" title="Profil utilisateur">
              <UserCircle size={30} className="text-blue-400 hover:scale-110 transition" />
            </Link>
          </>
        ) : (
          <Link to="/auth" className="text-blue-600 underline">Connexion</Link>
        )}
      </div>
      {/* Menu mobile drawer */}
      {user && (
        <MobileNavDrawer open={menuOpen} onOpenChange={setMenuOpen} />
      )}
    </header>
  );
};

export default Header;
