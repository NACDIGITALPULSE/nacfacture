
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";

const UserProfileForm = () => {
  const { user } = useAuth();
  const { profile, upsertProfile, loading } = useUserProfile(user);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fields = {
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      phone: form.phone.value,
    };
    const { error } = await upsertProfile(fields);
    if (!error) {
      toast({ 
        title: "Profil mis à jour", 
        description: "Vos informations personnelles ont été enregistrées avec succès."
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    const form = e.target as HTMLFormElement;
    const newPassword = form.new_password.value;
    const confirmPassword = form.confirm_password.value;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      setPasswordLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès."
      });
      form.reset();
    }
    setPasswordLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Informations personnelles */}
      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl shadow-lg p-6">
        <h2 className="font-bold text-xl text-blue-700 mb-2">Informations personnelles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Prénom *</label>
            <Input name="first_name" defaultValue={profile?.first_name || ""} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Nom *</label>
            <Input name="last_name" defaultValue={profile?.last_name || ""} required />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Téléphone</label>
          <Input name="phone" type="tel" defaultValue={profile?.phone || ""} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email (non modifiable)</label>
          <Input value={user?.email || ""} disabled className="bg-gray-100" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer les informations"}
        </Button>
      </form>

      {/* Modification du mot de passe */}
      <form onSubmit={handlePasswordChange} className="space-y-5 bg-white rounded-xl shadow-lg p-6">
        <h2 className="font-bold text-xl text-blue-700 mb-2">Modifier le mot de passe</h2>
        <div>
          <label className="block text-sm mb-1">Nouveau mot de passe *</label>
          <div className="relative">
            <Input 
              name="new_password" 
              type={showPassword ? "text" : "password"}
              required 
              minLength={6}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Confirmer le mot de passe *</label>
          <Input 
            name="confirm_password" 
            type={showPassword ? "text" : "password"}
            required 
            minLength={6}
          />
        </div>
        <Button type="submit" className="w-full" disabled={passwordLoading}>
          {passwordLoading ? "Modification..." : "Modifier le mot de passe"}
        </Button>
      </form>
    </div>
  );
};

export default UserProfileForm;
