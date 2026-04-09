
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";
import { Shield } from "lucide-react";

const ADMIN_EMAILS = ["nouredinechekaraou@live.fr", "support@nacdigitalpulse.com"];

const AdminLogin = () => {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;

    if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
      toast({ title: "Accès refusé", description: "Ce portail est réservé aux administrateurs.", variant: "destructive" });
      return;
    }

    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) {
      toast({ title: "Erreur connexion", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4">
      <div className="w-full max-w-md bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-border/50">
        <div className="flex justify-center mb-4">
          <Logo className="scale-125 sm:scale-150" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold text-primary">
            Administration
          </h1>
        </div>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Portail réservé aux administrateurs nacFacture
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            required
            type="email"
            placeholder="Email administrateur"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={busy || loading}
            autoFocus
          />
          <div className="relative">
            <Input
              required
              type={showPw ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={busy || loading}
              className="pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw(s => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition"
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
          <Button type="submit" disabled={busy || loading} className="w-full font-medium mt-2">
            {busy || loading ? <span className="animate-pulse">Connexion…</span> : "🔐 Connexion Admin"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => navigate("/auth")} className="text-xs text-muted-foreground hover:text-primary transition">
            ← Retour à la connexion utilisateur
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
