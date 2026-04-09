import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo-nacfacture.png";
import {
  FileText, Users, Package, BarChart3, Shield, Smartphone,
  CheckCircle, ArrowRight, Star, Zap, Globe
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: FileText, title: "Facturation complète", desc: "Créez factures, devis et bons de livraison en quelques clics." },
    { icon: Users, title: "Gestion clients", desc: "Suivez vos clients, leurs coordonnées et historique de facturation." },
    { icon: Package, title: "Produits & Services", desc: "Cataloguez vos produits avec prix, TVA et descriptions." },
    { icon: BarChart3, title: "Rapports & Analyses", desc: "Visualisez vos revenus, marges et statistiques en temps réel." },
    { icon: Shield, title: "Sécurisé", desc: "Vos données sont protégées et accessibles uniquement par vous." },
    { icon: Smartphone, title: "Mobile friendly", desc: "Utilisez nacFacture sur mobile, tablette ou ordinateur." },
  ];

  const steps = [
    { num: "1", title: "Créez votre compte", desc: "Inscription gratuite en 30 secondes" },
    { num: "2", title: "Configurez votre entreprise", desc: "Ajoutez logo, signature et informations" },
    { num: "3", title: "Commencez à facturer", desc: "Créez vos premières factures immédiatement" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <img src={logoImg} alt="nacFacture" className="h-14 sm:h-16 object-contain" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Se connecter
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")}>
              S'inscrire gratuitement
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              2 mois d'essai gratuit !
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
              La facturation <span className="text-primary">simplifiée</span> pour votre entreprise
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Créez, gérez et suivez vos factures, devis et bons de livraison en toute simplicité.
              Solution complète de gestion commerciale pour les entreprises au Niger.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate("/auth")}>
                Commencer gratuitement <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => document.getElementById("tarifs")?.scrollIntoView({ behavior: "smooth" })}>
                Voir les tarifs
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">✅ Aucune carte bancaire requise • 2 mois gratuits</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-muted-foreground text-lg">Des outils puissants pour gérer votre activité</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-card-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Comment ça marche ?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Tarif simple et transparent</h2>
            <p className="text-muted-foreground text-lg">Un seul plan, toutes les fonctionnalités</p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-card p-8 rounded-2xl border-2 border-primary shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold">
                🎁 2 mois gratuits
              </div>
              <div className="text-center mb-6 pt-2">
                <h3 className="text-xl font-bold text-card-foreground mb-1">Abonnement Mensuel</h3>
                <div className="text-5xl font-black text-primary my-4">2 500 <span className="text-xl">FCFA</span></div>
                <p className="text-muted-foreground text-sm">par mois, après la période d'essai</p>
              </div>
              <div className="space-y-3 mb-8">
                {[
                  "Factures, devis & bons de livraison illimités",
                  "Gestion clients & fournisseurs",
                  "Catalogue produits & services",
                  "Rapports & analyses de revenus",
                  "Signature & cachet sur documents",
                  "Export PDF professionnel",
                  "Support WhatsApp prioritaire",
                  "Accès mobile optimisé",
                ].map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-card-foreground text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="w-full text-lg py-6" onClick={() => navigate("/auth")}>
                Commencer 2 mois gratuits <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Paiement par NITA ou AMANATA • +227 88 08 29 87
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Prêt à simplifier votre facturation ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Rejoignez les entreprises qui font confiance à nacFacture
          </p>
          <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate("/auth")}>
            Créer mon compte gratuitement <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={logoImg} alt="nacFacture" className="h-12 object-contain" />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="https://wa.me/22788082987" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              Support WhatsApp
            </a>
            <span>•</span>
            <button onClick={() => navigate("/auth")} className="hover:text-primary">Connexion</button>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} nacFacture. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
