
import React from "react";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2 } from "lucide-react";
import UserProfileForm from "@/components/UserProfileForm";
import CompanyProfileForm from "@/components/CompanyProfileForm";

const ProfilPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
      <Header />
      <TopNav />
      <main className="max-w-6xl w-full mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <BackButton />
        </div>
        
        <Tabs defaultValue="user" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil personnel
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Profil entreprise
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="space-y-6">
            <UserProfileForm />
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <CompanyProfileForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProfilPage;
