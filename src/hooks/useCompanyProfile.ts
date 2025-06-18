
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// L'interface pour le profil entreprise selon la table companies
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

  // Lecture du profil à l'ouverture
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
  const upsertProfile = async (fields: Partial<Omit<CompanyProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>> & { name: string }) => {
    setLoading(true);
    if (!user) {
      setError("Utilisateur non authentifié");
      setLoading(false);
      return { error: { message: "Utilisateur non authentifié" } };
    }

    // Vérifier que 'name' est bien fourni (obligatoire dans la table)
    if (!fields.name || fields.name.trim() === "") {
      setError("Le nom de l'entreprise est requis");
      setLoading(false);
      return { error: { message: "Le nom de l'entreprise est requis" } };
    }

    // upsert par user_id (clé unique logique de profil entreprise)
    const upsertObj = {
      name: fields.name,
      email: fields.email || null,
      phone: fields.phone || null,
      address: fields.address || null,
      logo_url: fields.logo_url || null,
      signature_url: fields.signature_url || null,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("companies")
      .upsert(upsertObj, { onConflict: "user_id" })
      .select()
      .single();

    if (!error && data) {
      setProfile(data as CompanyProfile);
      setError(null);
    } else {
      setError(error?.message || "Erreur lors de la sauvegarde");
    }
    setLoading(false);
    return { error };
  };

  return { profile, setProfile, upsertProfile, loading, error };
}
