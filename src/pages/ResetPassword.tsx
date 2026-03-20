import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";
import PasswordStrength from "@/components/PasswordStrength";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setValid(true);
    } else {
      // Also check if user has an active session from recovery
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setValid(true);
      });
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Erreur", description: "Le mot de passe doit contenir au moins 8 caractères.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Mot de passe mis à jour", description: "Vous pouvez maintenant vous connecter." });
      navigate("/auth");
    }
  };

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-blue-50 to-white px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Logo />
          <h1 className="text-xl font-bold text-blue-700 mt-4">Lien invalide</h1>
          <p className="text-muted-foreground mt-2">Ce lien de réinitialisation est invalide ou expiré.</p>
          <Button className="mt-4" onClick={() => navigate("/auth")}>Retour à la connexion</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-blue-50 to-white px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <Logo />
        <h1 className="text-xl font-bold text-blue-700 mt-4 text-center">Réinitialiser le mot de passe</h1>
        <form onSubmit={handleReset} className="flex flex-col gap-4 mt-6">
          <div>
            <Input
              type="password"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              disabled={busy}
            />
            <PasswordStrength password={password} />
          </div>
          <Input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={8}
            required
            disabled={busy}
          />
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
