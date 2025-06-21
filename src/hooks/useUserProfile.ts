
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
    
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Pour l'instant, on crée un profil fictif basé sur l'utilisateur
        // En attendant que la table user_profiles soit reconnue par Supabase
        const mockProfile: UserProfile = {
          id: user.id,
          user_id: user.id,
          first_name: user.user_metadata?.first_name || "Utilisateur",
          last_name: user.user_metadata?.last_name || "",
          phone: user.user_metadata?.phone || null,
          created_at: user.created_at,
          updated_at: new Date().toISOString()
        };
        setProfile(mockProfile);
        setError(null);
      } catch (err: any) {
        setError("Erreur de chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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

    try {
      // Mettre à jour les métadonnées utilisateur pour l'instant
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: fields.first_name,
          last_name: fields.last_name,
          phone: fields.phone || null
        }
      });

      if (!updateError) {
        const updatedProfile: UserProfile = {
          id: user.id,
          user_id: user.id,
          first_name: fields.first_name,
          last_name: fields.last_name,
          phone: fields.phone || null,
          created_at: profile?.created_at || user.created_at,
          updated_at: new Date().toISOString()
        };
        setProfile(updatedProfile);
        setError(null);
      } else {
        setError(updateError?.message || "Erreur lors de la sauvegarde");
      }
      setLoading(false);
      return { error: updateError };
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde");
      setLoading(false);
      return { error: { message: err.message } };
    }
  };

  return { profile, setProfile, upsertProfile, loading, error };
}
