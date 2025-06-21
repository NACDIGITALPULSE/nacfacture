
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const RevenueChart = () => {
  const { user } = useAuth();

  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["revenue-chart", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: invoices, error } = await supabase
        .from("invoices")
        .select("date, total_amount, status")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) throw error;

      // Grouper par mois
      const monthlyRevenue = invoices?.reduce((acc: any, invoice: any) => {
        const date = new Date(invoice.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: monthKey,
            proforma: 0,
            validated: 0,
            paid: 0,
            total: 0
          };
        }
        
        const amount = Number(invoice.total_amount);
        acc[monthKey][invoice.status] += amount;
        acc[monthKey].total += amount;
        
        return acc;
      }, {});

      return Object.values(monthlyRevenue || {}).map((item: any) => ({
        ...item,
        monthLabel: new Date(item.month + '-01').toLocaleDateString('fr-FR', { 
          month: 'short', 
          year: 'numeric' 
        })
      }));
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution du chiffre d'affaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!revenueData || revenueData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution du chiffre d'affaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Évolution du chiffre d'affaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthLabel" />
            <YAxis 
              tickFormatter={(value) => `${value.toLocaleString()} FCFA`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} FCFA`,
                name === 'paid' ? 'Payées' :
                name === 'validated' ? 'Validées' :
                name === 'proforma' ? 'Proforma' : 'Total'
              ]}
              labelFormatter={(label) => `Mois: ${label}`}
            />
            <Bar dataKey="paid" fill="#22c55e" name="paid" />
            <Bar dataKey="validated" fill="#3b82f6" name="validated" />
            <Bar dataKey="proforma" fill="#f59e0b" name="proforma" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
