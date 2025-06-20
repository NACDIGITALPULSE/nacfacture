
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export function useUserProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    setLoading(true);
    supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        setProfile(data as UserProfile | null);
        setError(error?.message ?? null);
        setLoading(false);
      });
  }, [user]);

  const upsertProfile = async (fields: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>> & { first_name: string; last_name: string }) => {
    setLoading(true);
    if (!user) {
      setError("Utilisateur non authentifié");
      setLoading(false);
      return { error: { message: "Utilisateur non authentifié" } };
    }

    if (!fields.first_name || !fields.last_name) {
      setError("Le prénom et nom sont requis");
      setLoading(false);
      return { error: { message: "Le prénom et nom sont requis" } };
    }

    const upsertObj = {
      first_name: fields.first_name,
      last_name: fields.last_name,
      phone: fields.phone || null,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(upsertObj, { onConflict: "user_id" })
      .select()
      .single();

    if (!error && data) {
      setProfile(data as UserProfile);
      setError(null);
    } else {
      setError(error?.message || "Erreur lors de la sauvegarde");
    }
    setLoading(false);
    return { error };
  };

  return { profile, setProfile, upsertProfile, loading, error };
}
