
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const bucket = "company-assets";

function getPublicUrl(path: string) {
  return `https://mmstjobewmpeoqqwxbkw.supabase.co/storage/v1/object/public/${path}`;
}

const CompanyProfileForm = () => {
  const { user } = useAuth();
  const { profile, upsertProfile, loading } = useCompanyProfile(user);
  const [logoUrl, setLogoUrl] = useState(profile?.logo_url || "");
  const [sigUrl, setSigUrl] = useState(profile?.signature_url || "");
  const logoInput = useRef<HTMLInputElement>(null);
  const sigInput = useRef<HTMLInputElement>(null);

  // Mise à jour locale du logo/signature lors du chargement du profil
  useEffect(() => {
    setLogoUrl(profile?.logo_url || "");
    setSigUrl(profile?.signature_url || "");
  }, [profile]);

  // upload image vers un dossier User
  const uploadFile = async (file: File, type: "logo" | "signature") => {
    if (!user) return null;
    const filePath = `${user.id}/${type}_${file.name}`;
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
    if (error) {
      toast({ title: "Upload échoué", description: error.message, variant: "destructive" });
      return null;
    }
    return getPublicUrl(`${bucket}/${filePath}`);
  };

  // Gestion soumission formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fields = {
      name: form.company_name.value,
      email: form.contact_email.value,
      phone: form.phone.value,
      address: form.address.value,
      logo_url: logoUrl,
      signature_url: sigUrl,
    };
    const { error } = await upsertProfile(fields);
    if (!error) toast({ title: "Profil mis à jour" });
  };

  // Upload logo
  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const url = await uploadFile(e.target.files[0], "logo");
      if (url) setLogoUrl(url);
    }
  };
  // Upload signature
  const handleSig = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const url = await uploadFile(e.target.files[0], "signature");
      if (url) setSigUrl(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="font-bold text-xl text-blue-700 mb-2">Profil d&apos;entreprise</h2>
      <div>
        <label className="block text-sm mb-1">Nom de l&apos;entreprise</label>
        <Input name="company_name" defaultValue={profile?.name || ""} required autoFocus />
      </div>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <Input name="contact_email" type="email" defaultValue={profile?.email || ""} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Téléphone</label>
        <Input name="phone" type="tel" defaultValue={profile?.phone || ""} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Adresse</label>
        <Input name="address" defaultValue={profile?.address || ""} required />
      </div>
      <div className="flex gap-4 items-center">
        <div>
          <label className="text-sm">Logo</label>
          <input ref={logoInput} type="file" accept="image/*" className="block mt-1" onChange={handleLogo} />
          {logoUrl && <img src={logoUrl} alt="Logo" className="h-12 mt-2 rounded border" />}
        </div>
        <div>
          <label className="text-sm">Signature</label>
          <input ref={sigInput} type="file" accept="image/*" className="block mt-1" onChange={handleSig} />
          {sigUrl && <img src={sigUrl} alt="Signature" className="h-12 mt-2 rounded border" />}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
};

export default CompanyProfileForm;
