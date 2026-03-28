
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Users, 
  Package, 
  FileCheck, 
  Truck,
  Building2,
  BarChart3,
  User,
  Crown,
  HelpCircle
} from "lucide-react";

const navigation = [
  { name: "Factures", href: "/factures", icon: FileText },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Produits", href: "/produits-services", icon: Package },
  { name: "Devis", href: "/devis", icon: FileCheck },
  { name: "Livraisons", href: "/bons-livraison", icon: Truck },
  { name: "Fournisseurs", href: "/fournisseurs", icon: Building2 },
  { name: "Rapports", href: "/reports", icon: BarChart3 },
  { name: "Profil", href: "/profil", icon: User },
  { name: "Abonnement", href: "/abonnement", icon: Crown },
  { name: "Support", href: "/support", icon: HelpCircle },
];

const TopNav = () => {
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border shadow-md hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:shadow-md"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
