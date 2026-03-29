import { Home, FileText, Users, Package, MoreHorizontal } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  BarChart3,
  UserCircle,
  CreditCard,
  HelpCircle,
  Truck,
  FileCheck,
  Factory,
} from "lucide-react";

const mainTabs = [
  { to: "/", icon: Home, label: "Accueil" },
  { to: "/factures", icon: FileText, label: "Factures" },
  { to: "/clients", icon: Users, label: "Clients" },
  { to: "/produits-services", icon: Package, label: "Produits" },
];

const moreLinks = [
  { to: "/devis", icon: FileCheck, label: "Devis" },
  { to: "/bons-livraison", icon: Truck, label: "Livraisons" },
  { to: "/fournisseurs", icon: Factory, label: "Fournisseurs" },
  { to: "/reports", icon: BarChart3, label: "Rapports" },
  { to: "/profile", icon: UserCircle, label: "Profil" },
  { to: "/abonnement", icon: CreditCard, label: "Abonnement" },
  { to: "/support", icon: HelpCircle, label: "Support" },
];

const BottomNav = () => {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
        <div className="flex items-center justify-around h-14">
          {mainTabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-muted-foreground transition-colors",
                  isActive && "text-primary"
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-muted-foreground"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">Plus</span>
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8">
          <SheetHeader>
            <SheetTitle className="text-left">Navigation</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {moreLinks.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMoreOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  )
                }
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BottomNav;
