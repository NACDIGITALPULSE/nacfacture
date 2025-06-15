
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import React from "react";

const links = [
  { to: "/", label: "Tableau de bord" },
  { to: "/factures", label: "Factures" },
  { to: "/devis", label: "Devis" },
  { to: "/bons-livraison", label: "Bons de livraison" },
  { to: "/clients", label: "Clients" },
  { to: "/produits-services", label: "Produits & services" },
  { to: "/fournisseurs", label: "Fournisseurs" },
];

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ open, onOpenChange }) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-2 pb-8 pt-3">
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-blue-700">Menu</span>
          <DrawerClose className="p-2 rounded-full hover:bg-muted">
            <X size={24} />
          </DrawerClose>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-3 rounded text-base font-medium transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-bold shadow"
                    : "text-gray-800 hover:bg-gray-100"
                }`
              }
              onClick={() => onOpenChange(false)}
              end={to === "/"}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavDrawer;
