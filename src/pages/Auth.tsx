
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const { signIn, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-bl from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4 text-blue-700 text-center">
          {isSignUp ? "Créer un compte" : "Connexion"}
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            required
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
          />
          <Input
            required
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            variant="default"
            type="submit"
            disabled={busy || loading}
            className="w-full"
          >
            {isSignUp ? "S’inscrire" : "Se connecter"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-blue-700 hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={busy}
          >
            {isSignUp
              ? "Déjà un compte ? Se connecter"
              : "Créer un compte"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
