
import React from "react";
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
  <nav className="w-full bg-gray-50 border-b px-1 xs:px-4 md:px-8 flex gap-1 xs:gap-3 text-sm xs:text-base font-medium
    justify-between xs:justify-start
    hidden md:flex">
    {links.map(({ to, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `transition px-2 xs:px-3 py-2 rounded-t-md ${
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
