
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Factures from "./pages/Factures";
import Clients from "./pages/Clients";
import ProduitsServices from "./pages/ProduitsServices";
import Devis from "./pages/Devis";
import BonsLivraison from "./pages/BonsLivraison";
import Fournisseurs from "./pages/Fournisseurs";
import Reports from "./pages/Reports";
import Profil from "./pages/Profil";
import Abonnement from "./pages/Abonnement";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/factures" element={<Factures />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/produits-services" element={<ProduitsServices />} />
              <Route path="/devis" element={<Devis />} />
              <Route path="/bons-livraison" element={<BonsLivraison />} />
              <Route path="/fournisseurs" element={<Fournisseurs />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/abonnement" element={<Abonnement />} />
              <Route path="/support" element={<Support />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
