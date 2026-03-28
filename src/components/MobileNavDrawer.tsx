
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, FileText, FileCheck, Truck, Users, Package, 
  Building2, BarChart3, User, Crown, HelpCircle 
} from "lucide-react";
import React from "react";

const links = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/factures", label: "Factures", icon: FileText },
  { to: "/devis", label: "Devis", icon: FileCheck },
  { to: "/bons-livraison", label: "Bons de livraison", icon: Truck },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/produits-services", label: "Produits & services", icon: Package },
  { to: "/fournisseurs", label: "Fournisseurs", icon: Building2 },
  { to: "/reports", label: "Rapports", icon: BarChart3 },
  { to: "/profil", label: "Profil", icon: User },
  { to: "/abonnement", label: "Abonnement", icon: Crown },
  { to: "/support", label: "Support", icon: HelpCircle },
];

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-primary font-bold text-lg">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col py-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border-r-2 border-primary font-bold"
                    : "text-foreground hover:bg-muted"
                }`
              }
              onClick={() => onOpenChange(false)}
              end={to === "/"}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavDrawer;
