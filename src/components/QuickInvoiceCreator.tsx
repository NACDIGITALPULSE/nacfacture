
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Plus, 
  Settings, 
  Zap,
  Receipt,
  FileCheck
} from "lucide-react";

const QuickInvoiceCreator: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Nouvelle facture",
      description: "Créer une facture rapidement",
      icon: Receipt,
      action: () => navigate("/factures/nouvelle"),
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Nouveau devis",
      description: "Créer un devis pour un client",
      icon: FileText,
      action: () => navigate("/devis/nouveau"),
      color: "from-green-500 to-green-600"
    },
    {
      title: "Personnaliser",
      description: "Modifier l'apparence des factures",
      icon: Settings,
      action: () => navigate("/profil"),
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                className={`h-auto p-4 flex flex-col items-center gap-2 bg-gradient-to-r ${action.color} hover:shadow-lg transition-all`}
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickInvoiceCreator;
