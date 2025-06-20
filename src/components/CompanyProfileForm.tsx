
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Upload, FileImage } from "lucide-react";

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

  useEffect(() => {
    setLogoUrl(profile?.logo_url || "");
    setSigUrl(profile?.signature_url || "");
  }, [profile]);

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
    if (!error) {
      toast({ 
        title: "Profil entreprise mis à jour", 
        description: "Les informations de votre entreprise ont été enregistrées et prises en compte avec succès."
      });
    }
  };

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const url = await uploadFile(e.target.files[0], "logo");
      if (url) setLogoUrl(url);
    }
  };

  const handleSig = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const url = await uploadFile(e.target.files[0], "signature");
      if (url) setSigUrl(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-700">Profil d'entreprise</h1>
      </div>
      
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="branding">Image de marque</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-semibold text-lg text-gray-800 mb-4">Informations générales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom de l'entreprise *</label>
                <Input name="company_name" defaultValue={profile?.name || ""} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email de contact *</label>
                <Input name="contact_email" type="email" defaultValue={profile?.email || ""} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone *</label>
                <Input name="phone" type="tel" defaultValue={profile?.phone || ""} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adresse complète *</label>
                <Input name="address" defaultValue={profile?.address || ""} required />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer les informations"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-semibold text-lg text-gray-800 mb-4">Logo et signature</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Logo de l'entreprise</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {logoUrl ? (
                      <div className="space-y-2">
                        <img src={logoUrl} alt="Logo" className="h-16 mx-auto rounded border" />
                        <p className="text-sm text-gray-600">Logo actuel</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">Aucun logo</p>
                      </div>
                    )}
                    <input 
                      ref={logoInput} 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleLogo} 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mt-2" 
                      onClick={() => logoInput.current?.click()}
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      Choisir un logo
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Signature</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {sigUrl ? (
                      <div className="space-y-2">
                        <img src={sigUrl} alt="Signature" className="h-16 mx-auto rounded border" />
                        <p className="text-sm text-gray-600">Signature actuelle</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">Aucune signature</p>
                      </div>
                    )}
                    <input 
                      ref={sigInput} 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleSig} 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => sigInput.current?.click()}
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      Choisir une signature
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-semibold text-lg text-gray-800 mb-4">Paramètres avancés</h2>
            <p className="text-gray-600">Fonctionnalités à venir : préférences de facturation, formats d'export, etc.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyProfileForm;
