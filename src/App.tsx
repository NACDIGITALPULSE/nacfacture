
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
