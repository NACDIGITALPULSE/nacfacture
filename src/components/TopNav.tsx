
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
  { name: "Produits & Services", href: "/produits-services", icon: Package },
  { name: "Devis", href: "/devis", icon: FileCheck },
  { name: "Bons de livraison", href: "/bons-livraison", icon: Truck },
  { name: "Fournisseurs", href: "/fournisseurs", icon: Building2 },
  { name: "Rapports", href: "/reports", icon: BarChart3 },
  { name: "Profil", href: "/profil", icon: User },
  { name: "Abonnement", href: "/abonnement", icon: Crown },
  { name: "Support", href: "/support", icon: HelpCircle },
];

const TopNav = () => {
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:flex lg:flex-wrap gap-2 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-semibold transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:scale-105 hover:shadow-md"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-center leading-tight">{item.name}</span>
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
