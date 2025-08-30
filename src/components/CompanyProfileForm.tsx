
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  Upload, 
  FileImage, 
  Settings, 
  Palette,
  FileText,
  Stamp,
  Header as HeaderIcon,
  FileSignature
} from "lucide-react";
import SignatureManager from "./SignatureManager";
import DocumentTemplateManager from "./DocumentTemplateManager";

const bucket = "company-assets";

function getPublicUrl(path: string) {
  return `https://mmstjobewmpeoqqwxbkw.supabase.co/storage/v1/object/public/${path}`;
}

const CompanyProfileForm = () => {
  const { user } = useAuth();
  const { profile, upsertProfile, loading } = useCompanyProfile(user);
  const [logoUrl, setLogoUrl] = useState(profile?.logo_url || "");
  const [sigUrl, setSigUrl] = useState(profile?.signature_url || "");
  const [headerNotes, setHeaderNotes] = useState("");
  const [footerNotes, setFooterNotes] = useState("");
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
        description: "Les informations de votre entreprise ont été enregistrées avec succès."
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <div className="flex items-center justify-center gap-3">
          <Building2 className="h-10 w-10 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestion d'entreprise
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Configurez votre identité d'entreprise et personnalisez vos documents
        </p>
      </div>
      
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="info" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Informations</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="headers" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <HeaderIcon className="h-4 w-4" />
            <span className="hidden sm:inline">En-têtes</span>
          </TabsTrigger>
          <TabsTrigger value="signatures" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <FileSignature className="h-4 w-4" />
            <span className="hidden sm:inline">Signatures</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <CardTitle className="text-xl text-blue-800">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise *</label>
                    <Input 
                      name="company_name" 
                      defaultValue={profile?.name || ""} 
                      required 
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email de contact *</label>
                    <Input 
                      name="contact_email" 
                      type="email" 
                      defaultValue={profile?.email || ""} 
                      required 
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Téléphone *</label>
                    <Input 
                      name="phone" 
                      type="tel" 
                      defaultValue={profile?.phone || ""} 
                      required 
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Adresse complète *</label>
                    <Input 
                      name="address" 
                      defaultValue={profile?.address || ""} 
                      required 
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer les informations"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
              <CardTitle className="text-xl text-purple-800">Logo et identité visuelle</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700">Logo de l'entreprise</label>
                    <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center hover:border-purple-300 transition-colors">
                      {logoUrl ? (
                        <div className="space-y-3">
                          <img src={logoUrl} alt="Logo" className="h-20 mx-auto rounded border shadow-sm" />
                          <p className="text-sm text-purple-600 font-medium">Logo actuel</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="h-12 w-12 mx-auto text-purple-400" />
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
                        className="mt-3 border-purple-200 text-purple-600 hover:bg-purple-50" 
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
                    <label className="block text-sm font-medium mb-3 text-gray-700">Couleurs de marque</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded border-2 border-white shadow-md"></div>
                        <Input placeholder="Couleur principale" className="flex-1" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-500 rounded border-2 border-white shadow-md"></div>
                        <Input placeholder="Couleur secondaire" className="flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="headers" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
              <CardTitle className="text-xl text-green-800">En-têtes et pieds de page</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700">Notes d'en-tête</label>
                <Textarea 
                  value={headerNotes}
                  onChange={(e) => setHeaderNotes(e.target.value)}
                  placeholder="Informations à afficher en haut de vos documents (conditions spéciales, mentions légales...)"
                  className="h-20 focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700">Notes de pied de page</label>
                <Textarea 
                  value={footerNotes}
                  onChange={(e) => setFooterNotes(e.target.value)}
                  placeholder="Informations à afficher en bas de vos documents (coordonnées bancaires, conditions générales...)"
                  className="h-20 focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                Enregistrer les en-têtes et pieds de page
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signatures" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
              <CardTitle className="text-xl text-orange-800">Signatures et cachets</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {user && (
                <SignatureManager 
                  userId={user.id}
                  onSignatureUpdate={setSigUrl}
                  onStampUpdate={(stampUrl) => {
                    toast({
                      title: "Cachet ajouté",
                      description: "Le cachet d'entreprise a été enregistré",
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <DocumentTemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyProfileForm;
