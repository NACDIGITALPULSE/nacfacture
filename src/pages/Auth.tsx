
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";
import PasswordStrength from "@/components/PasswordStrength";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthPage = () => {
  const { signIn, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const [resetSent, setResetSent] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const navigate = useNavigate();

  // Validation email/password instantané
  function validate() {
    const e: { email?: string; password?: string } = {};
    if (!email) e.email = "L'email est requis.";
    else if (!EMAIL_REGEX.test(email)) e.email = "Adresse email invalide.";
    if (!password) e.password = "Le mot de passe est requis.";
    else if (isSignUp && password.length < 8)
      e.password = "Minimum 8 caractères.";
    setError(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      setBusy(false);
      if (error) {
        toast({ title: "Erreur inscription", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Vérifiez vos emails", description: "Un lien de confirmation a été envoyé." });
        setIsSignUp(false);
        setEmail("");
        setPassword("");
      }
    } else {
      const { error } = await signIn(email, password);
      setBusy(false);
      if (error) {
        toast({ title: "Erreur connexion", description: error.message, variant: "destructive" });
      } else {
        navigate("/");
      }
    }
  }

  // Fonctionnalité mot de passe oublié via Supabase
  async function handleForgotPassword() {
    if (!EMAIL_REGEX.test(email)) {
      setError(e => ({ ...e, email: "Veuillez renseigner un email valide pour réinitialiser." }));
      return;
    }
    setBusy(true);
    // Supabase reset password via magic link
    let redirect = window.location.origin + "/auth";
    // @ts-ignore
    const { error } = await window.supabase.auth.resetPasswordForEmail(email, { redirectTo: redirect });
    setBusy(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setResetSent(true);
      toast({ title: "Lien envoyé", description: "Consultez votre email pour réinitialiser le mot de passe." });
    }
  }

  // Animation d'apparition
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-bl from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-scale-in relative">
        <Logo />
        <h1 className="text-2xl font-bold mb-3 text-blue-700 text-center">
          {isSignUp ? "Créer un compte" : "Connexion"}
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          {isSignUp ? "Commencez gratuitement, aucun engagement requis." : "Connectez-vous pour accéder à votre espace Facture Digital."}
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          autoComplete="on"
        >
          <div>
            <Input
              required
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(err => ({ ...err, email: undefined })); }}
              onBlur={validate}
              disabled={busy || loading}
              autoFocus
              aria-invalid={!!error.email}
              className={error.email ? "border-red-400 focus:ring-destructive" : ""}
            />
            {error.email && <span className="text-xs text-red-500">{error.email}</span>}
          </div>
          <div className="relative">
            <Input
              required
              type={showPw ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(err => ({ ...err, password: undefined })); }}
              onBlur={validate}
              disabled={busy || loading}
              aria-invalid={!!error.password}
              className={error.password ? "border-red-400 focus:ring-destructive pr-10" : "pr-10"}
              minLength={isSignUp ? 8 : 1}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw(s => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition"
              aria-label={showPw ? "Masquer" : "Afficher"}
            >
              {showPw ? (
                <svg viewBox="0 0 24 24" width={18} height={18} fill="none"><path d="M12 3C7 3 2.73 7.11 2.13 12c.6 4.89 4.87 9 9.87 9s9.27-4.11 9.87-9c-.6-4.89-4.87-9-9.87-9Z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2"/><path d="M17.5 17.5L6.5 6.5" stroke="currentColor" strokeWidth="2" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" width={18} height={18} fill="none"><path d="M1.05 12c1.27-5.29 6.09-9 10.95-9s9.68 3.71 10.95 9c-1.27 5.29-6.09 9-10.95 9s-9.68-3.71-10.95-9Z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2"/></svg>
              )}
            </button>
            {error.password && (
              <span className="text-xs text-red-500">{error.password}</span>
            )}
            {isSignUp && <PasswordStrength password={password} />}
          </div>
          <Button
            variant="default"
            type="submit"
            disabled={busy || loading}
            className="w-full font-medium mt-2"
          >
            {busy || loading ? (
              <span className="animate-pulse">Chargement…</span>
            ) : isSignUp ? "S’inscrire" : "Se connecter"}
          </Button>
        </form>
        {resetSent && (
          <div className="mt-2 text-green-600 text-sm text-center animate-fade-in">
            Lien de réinitialisation envoyé !
          </div>
        )}
        <div className="mt-4 flex flex-col gap-2 items-center">
          <button
            className="text-blue-700 hover:underline text-sm disabled:text-gray-400"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={busy}
            type="button"
          >
            {isSignUp
              ? "Déjà un compte ? Se connecter"
              : "Créer un compte"}
          </button>
          {!isSignUp && (
            <button
              className="text-gray-500 hover:text-blue-600 text-xs"
              onClick={handleForgotPassword}
              disabled={busy || !email}
              type="button"
            >
              Mot de passe oublié ?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
