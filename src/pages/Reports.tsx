
import React from "react";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import RevenueChart from "../components/RevenueChart";
import ClientAnalytics from "../components/ClientAnalytics";
import NotificationCenter from "../components/NotificationCenter";
import ReminderSystem from "../components/ReminderSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, Bell, Clock } from "lucide-react";

const Reports = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
      <Header />
      <TopNav />
      <main className="max-w-6xl w-full mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <BackButton />
          <NotificationCenter />
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Rapports et analyses</h1>
          <p className="text-gray-600">Analysez vos performances et gérez vos rappels.</p>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Chiffre d'affaires
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Rappels
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <RevenueChart />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <ClientAnalytics />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Centre de notifications</h3>
              <p className="text-gray-600 mb-4">
                Gérez vos notifications depuis le bouton en haut à droite de cette page.
              </p>
              <p className="text-sm text-gray-500">
                Les notifications vous alertent sur les factures en retard, les paiements reçus et les rappels importants.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            <ReminderSystem />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
