
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, Star, TrendingUp } from "lucide-react";

const ClientAnalytics = () => {
  const clientStats = [
    {
      name: "Entreprise ABC",
      totalAmount: 450000,
      invoiceCount: 12,
      paymentRate: 95,
      lastPayment: "2024-06-15",
      status: "excellent"
    },
    {
      name: "Société XYZ",
      totalAmount: 320000,
      invoiceCount: 8,
      paymentRate: 100,
      lastPayment: "2024-06-10",
      status: "excellent"
    },
    {
      name: "Client DEF",
      totalAmount: 180000,
      invoiceCount: 6,
      paymentRate: 85,
      lastPayment: "2024-06-05",
      status: "good"
    },
    {
      name: "Partenaire GHI",
      totalAmount: 95000,
      invoiceCount: 4,
      paymentRate: 70,
      lastPayment: "2024-05-28",
      status: "average"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      excellent: { label: "Excellent", variant: "default" as const, color: "text-green-600" },
      good: { label: "Bon", variant: "secondary" as const, color: "text-blue-600" },
      average: { label: "Moyen", variant: "outline" as const, color: "text-yellow-600" }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.average;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <Crown className="h-4 w-4 text-yellow-500" />;
      case "good": return <Star className="h-4 w-4 text-blue-500" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  const totalRevenue = clientStats.reduce((sum, client) => sum + client.totalAmount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Analyse des clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{clientStats.length}</div>
              <div className="text-sm text-gray-600">Clients actifs</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} FCFA</div>
              <div className="text-sm text-gray-600">Chiffre d'affaires total</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round(clientStats.reduce((sum, c) => sum + c.paymentRate, 0) / clientStats.length)}%
              </div>
              <div className="text-sm text-gray-600">Taux de paiement moyen</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Top clients</h3>
            {clientStats.map((client, index) => {
              const statusConfig = getStatusBadge(client.status);
              return (
                <div key={client.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{client.name}</h4>
                        <p className="text-sm text-gray-600">
                          {client.invoiceCount} factures • Dernier paiement: {client.lastPayment}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(client.status)}
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Chiffre d'affaires</span>
                        <span className="font-medium">{client.totalAmount.toLocaleString()} FCFA</span>
                      </div>
                      <Progress 
                        value={(client.totalAmount / Math.max(...clientStats.map(c => c.totalAmount))) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Taux de paiement</span>
                        <span className="font-medium">{client.paymentRate}%</span>
                      </div>
                      <Progress 
                        value={client.paymentRate} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAnalytics;
