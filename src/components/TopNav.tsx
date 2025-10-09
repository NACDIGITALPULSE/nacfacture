
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
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 overflow-x-auto py-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
