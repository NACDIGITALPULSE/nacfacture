
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Tableau de bord" },
  { to: "/factures", label: "Factures" },
  { to: "/devis", label: "Devis" },
  { to: "/bons-livraison", label: "Bons de livraison" },
  { to: "/clients", label: "Clients" },
  { to: "/produits-services", label: "Produits & services" },
  { to: "/fournisseurs", label: "Fournisseurs" },
];

const TopNav = () => (
  <nav className="w-full bg-gray-50 border-b px-8 flex gap-4 text-base font-medium">
    {links.map(({ to, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `transition px-3 py-2 rounded-t-md ${
            isActive
              ? "bg-blue-100 text-blue-700 font-bold shadow"
              : "text-gray-600 hover:bg-gray-100"
          }`
        }
        end={to === "/"}
      >
        {label}
      </NavLink>
    ))}
  </nav>
);

export default TopNav;
