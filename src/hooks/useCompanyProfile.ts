
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function useCompanyProfile(user: User | null) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer le profil à l'ouverture
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    setLoading(true);
    supabase
      .from("company_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        setProfile(data);
        setError(error?.message ?? null);
        setLoading(false);
      });
  }, [user]);

  // Mettre à jour ou créer (upsert) le profil
  const upsertProfile = async (fields: any) => {
    setLoading(true);
    const { error } = await supabase
      .from("company_profiles")
      .upsert([{ ...fields, user_id: user?.id }], { onConflict: "user_id" });
    if (!error) {
      setProfile({ ...profile, ...fields });
    } else {
      setError(error.message);
    }
    setLoading(false);
    return { error };
  };

  return { profile, setProfile, upsertProfile, loading, error };
}
