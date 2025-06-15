
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// L’interface pour le profil entreprise selon la table companies
export interface CompanyProfile {
  id: string;
  user_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  logo_url?: string | null;
  signature_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export function useCompanyProfile(user: User | null) {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lecture du profil à l’ouverture
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    setLoading(true);
    supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        setProfile(data as CompanyProfile | null);
        setError(error?.message ?? null);
        setLoading(false);
      });
  }, [user]);

  // Upsert le profil
  const upsertProfile = async (fields: Partial<CompanyProfile>) => {
    setLoading(true);
    // upsert par user_id (clé unique logique de profil entreprise)
    const { error } = await supabase
      .from("companies")
      .upsert([{ ...fields, user_id: user?.id }], { onConflict: "user_id" });
    if (!error) {
      setProfile({ ...(profile || {}), ...fields, user_id: user?.id || "" } as CompanyProfile);
    } else {
      setError(error.message);
    }
    setLoading(false);
    return { error };
  };

  return { profile, setProfile, upsertProfile, loading, error };
}
