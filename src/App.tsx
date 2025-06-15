import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Factures from "./pages/Factures";
import Devis from "./pages/Devis";
import BonsLivraison from "./pages/BonsLivraison";
import Clients from "./pages/Clients";
import ProduitsServices from "./pages/ProduitsServices";
import Fournisseurs from "./pages/Fournisseurs";
import Profil from "./pages/Profil";
import Abonnement from "./pages/Abonnement";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthProvider";
import AuthPage from "@/pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            {/* Routes protégées */}
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

import { useAuth } from "@/contexts/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";
function ProtectedRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Chargement…</div>;
  return user ? (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/factures" element={<Factures />} />
      <Route path="/devis" element={<Devis />} />
      <Route path="/bons-livraison" element={<BonsLivraison />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/produits-services" element={<ProduitsServices />} />
      <Route path="/fournisseurs" element={<Fournisseurs />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/abonnement" element={<Abonnement />} />
      <Route path="/support" element={<Support />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  ) : (
    <Navigate to="/auth" replace />
  );
}

export default App;
