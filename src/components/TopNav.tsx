
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthProvider";
import { useSubscription } from "@/hooks/useSubscription";
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
  HelpCircle,
  Lock
} from "lucide-react";

const restrictedPages = [
  "/factures", 
  "/clients", 
  "/produits-services", 
  "/devis", 
  "/bons-livraison", 
  "/fournisseurs", 
  "/reports"
];

const navigation = [
  { name: "Factures", href: "/factures", icon: FileText, restricted: true },
  { name: "Clients", href: "/clients", icon: Users, restricted: true },
  { name: "Produits & Services", href: "/produits-services", icon: Package, restricted: true },
  { name: "Devis", href: "/devis", icon: FileCheck, restricted: true },
  { name: "Bons de livraison", href: "/bons-livraison", icon: Truck, restricted: true },
  { name: "Fournisseurs", href: "/fournisseurs", icon: Building2, restricted: true },
  { name: "Rapports", href: "/reports", icon: BarChart3, restricted: true },
  { name: "Profil", href: "/profil", icon: User, restricted: false },
  { name: "Abonnement", href: "/abonnement", icon: Crown, restricted: false },
  { name: "Support", href: "/support", icon: HelpCircle, restricted: false },
];

const TopNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const isRestricted = item.restricted && !hasActiveSubscription;
            
            return (
              <Link
                key={item.name}
                to={isRestricted ? "/abonnement" : item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors relative",
                  isActive
                    ? "bg-blue-800 text-white"
                    : isRestricted
                    ? "text-blue-300 hover:bg-blue-600 hover:text-white opacity-75"
                    : "text-blue-100 hover:bg-blue-600 hover:text-white"
                )}
              >
                {isRestricted ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span>{item.name}</span>
                {isRestricted && (
                  <Lock className="h-3 w-3 absolute -top-1 -right-1 text-yellow-400" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
