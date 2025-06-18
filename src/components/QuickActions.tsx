
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Package, FileText, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const actions = [
    {
      title: "Nouvelle facture",
      description: "Créer une facture proforma",
      icon: Plus,
      href: "/factures",
      className: "bg-blue-50 hover:bg-blue-100 border-blue-200"
    },
    {
      title: "Ajouter un client",
      description: "Nouveau client dans votre base",
      icon: Users,
      href: "/clients",
      className: "bg-green-50 hover:bg-green-100 border-green-200"
    },
    {
      title: "Nouveau produit",
      description: "Ajouter au catalogue",
      icon: Package,
      href: "/produits-services",
      className: "bg-purple-50 hover:bg-purple-100 border-purple-200"
    },
    {
      title: "Mes factures",
      description: "Voir toutes les factures",
      icon: FileText,
      href: "/factures",
      className: "bg-orange-50 hover:bg-orange-100 border-orange-200"
    },
    {
      title: "Mon profil",
      description: "Configurer l'entreprise",
      icon: Settings,
      href: "/profil",
      className: "bg-gray-50 hover:bg-gray-100 border-gray-200"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Button
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-2 w-full ${action.className}`}
              >
                <action.icon className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
