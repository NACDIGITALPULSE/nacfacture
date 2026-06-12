
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus, Users, Package, FileText, FileCheck, Truck,
  Building2, BarChart3, Settings, Crown, HelpCircle, Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

type Action = {
  title: string;
  href: string;
  icon: React.ElementType;
  gradient: string;
  ring: string;
  iconClass: string;
  highlight?: boolean;
};

const actions: Action[] = [
  { title: "Nouvelle facture", href: "/factures", icon: Plus, gradient: "from-blue-500 to-indigo-600", ring: "ring-blue-200 dark:ring-blue-900", iconClass: "text-white", highlight: true },
  { title: "Devis", href: "/devis", icon: FileCheck, gradient: "from-emerald-500 to-teal-600", ring: "ring-emerald-200 dark:ring-emerald-900", iconClass: "text-white" },
  { title: "Livraisons", href: "/bons-livraison", icon: Truck, gradient: "from-amber-500 to-orange-600", ring: "ring-amber-200 dark:ring-amber-900", iconClass: "text-white" },
  { title: "Clients", href: "/clients", icon: Users, gradient: "from-pink-500 to-rose-600", ring: "ring-pink-200 dark:ring-pink-900", iconClass: "text-white" },
  { title: "Produits", href: "/produits-services", icon: Package, gradient: "from-purple-500 to-fuchsia-600", ring: "ring-purple-200 dark:ring-purple-900", iconClass: "text-white" },
  { title: "Fournisseurs", href: "/fournisseurs", icon: Building2, gradient: "from-cyan-500 to-blue-600", ring: "ring-cyan-200 dark:ring-cyan-900", iconClass: "text-white" },
  { title: "Rapports", href: "/reports", icon: BarChart3, gradient: "from-violet-500 to-purple-600", ring: "ring-violet-200 dark:ring-violet-900", iconClass: "text-white" },
  { title: "Factures", href: "/factures", icon: FileText, gradient: "from-slate-600 to-slate-800", ring: "ring-slate-200 dark:ring-slate-700", iconClass: "text-white" },
  { title: "Abonnement", href: "/abonnement", icon: Crown, gradient: "from-yellow-500 to-amber-600", ring: "ring-yellow-200 dark:ring-yellow-900", iconClass: "text-white" },
  { title: "Profil", href: "/profil", icon: Settings, gradient: "from-gray-500 to-gray-700", ring: "ring-gray-200 dark:ring-gray-700", iconClass: "text-white" },
  { title: "Support", href: "/support", icon: HelpCircle, gradient: "from-teal-500 to-emerald-600", ring: "ring-teal-200 dark:ring-teal-900", iconClass: "text-white" },
];

const QuickActions = () => {
  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-card via-card to-muted/20 overflow-hidden">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Actions rapides
        </CardTitle>
        <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">Accédez à toutes vos opérations en un clic</span>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2 sm:gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title + action.href}
                to={action.href}
                className={`group relative flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl p-2 sm:p-3 bg-gradient-to-br ${action.gradient} shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 min-h-[68px] sm:min-h-[84px] ring-1 ring-black/5 dark:ring-white/5 ${action.highlight ? "ring-2 " + action.ring : ""}`}
              >
                <div className="bg-white/20 rounded-lg p-1.5 sm:p-2 backdrop-blur-sm">
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${action.iconClass}`} />
                </div>
                <span className="font-semibold text-[10px] sm:text-[11px] text-white text-center leading-tight drop-shadow">
                  {action.title}
                </span>
                {action.highlight && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white animate-pulse shadow" />
                )}
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
