
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  hasActiveSubscription: boolean;
  subscriptionLoading: boolean;
  isLegacyUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  isAdmin: false,
  hasActiveSubscription: false,
  subscriptionLoading: true,
  isLegacyUser: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [isLegacyUser, setIsLegacyUser] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
      if (sess?.user) {
        checkAdmin(sess.user.id);
        checkSubscription(sess.user.id);
      } else {
        setIsAdmin(false);
        setHasActiveSubscription(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        checkAdmin(session.user.id);
        checkSubscription(session.user.id);
      } else {
        setIsAdmin(false);
        setHasActiveSubscription(false);
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line
  }, []);

  // Vérifie si l'utilisateur a le rôle admin
  async function checkAdmin(userId: string) {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    setIsAdmin(data?.role === "admin");
  }

  // Vérifie si l'utilisateur a un abonnement actif
  async function checkSubscription(userId: string) {
    setSubscriptionLoading(true);
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (data) {
      const isActive = 
        data.subscription_status === "active" && 
        new Date(data.expires_at) > new Date();
      setHasActiveSubscription(isActive);
      setIsLegacyUser(false);
    } else {
      // Si pas d'abonnement du tout, c'est un ancien utilisateur
      setHasActiveSubscription(true);
      setIsLegacyUser(true);
    }
    setSubscriptionLoading(false);
  }

  // Connexion utilisateur
  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }

  // Inscription utilisateur
  async function signUp(email: string, password: string) {
    const redirectUrl = `${window.location.origin}/`;
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    return { error };
  }

  // Déconnexion
  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, isAdmin, hasActiveSubscription, subscriptionLoading, isLegacyUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
