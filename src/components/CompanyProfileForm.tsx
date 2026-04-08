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
  FileX,
  FileSignature,
  Save,
  CheckCircle
} from "lucide-react";
import SignatureManager from "./SignatureManager";
import DocumentTemplateManager from "./DocumentTemplateManager";
import InvoiceCustomizer from "./InvoiceCustomizer";
import BackButton from "./BackButton";

const bucket = "company-assets";

function getPublicUrl(path: string) {
  return `https://mmstjobewmpeoqqwxbkw.supabase.co/storage/v1/object/public/${path}`;
}

const CompanyProfileForm = () => {
  const { user } = useAuth();
  const { profile, upsertProfile, updateField, loading } = useCompanyProfile(user);
  const [logoUrl, setLogoUrl] = useState(profile?.logo_url || "");
  const [sigUrl, setSigUrl] = useState(profile?.signature_url || "");
  const [stampUrl, setStampUrl] = useState((profile as any)?.stamp_url || "");
  const [headerNotes, setHeaderNotes] = useState("");
  const [footerNotes, setFooterNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const logoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLogoUrl(profile?.logo_url || "");
    setSigUrl(profile?.signature_url || "");
    setStampUrl((profile as any)?.stamp_url || "");
  }, [profile]);

  const uploadFile = async (file: File, type: "logo" | "signature") => {
    if (!user) return null;
    const filePath = `${user.id}/${type}_${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
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
      stamp_url: stampUrl,
    };
    const { error } = await upsertProfile(fields as any);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast({ 
        title: "Profil entreprise mis à jour ✓", 
        description: "Les informations ont été enregistrées avec succès."
      });
    }
  };

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const url = await uploadFile(e.target.files[0], "logo");
      if (url) {
        setLogoUrl(url);
        await updateField("logo_url", url);
        toast({ title: "Logo mis à jour ✓" });
      }
    }
  };

  const handleSignatureUpdate = async (url: string) => {
    setSigUrl(url);
    await updateField("signature_url", url);
  };

  const handleStampUpdate = async (url: string) => {
    setStampUrl(url);
    await updateField("stamp_url", url);
  };

  const handleSignatureRemove = async () => {
    setSigUrl("");
    await updateField("signature_url", null);
    toast({ title: "Signature supprimée" });
  };

  const handleStampRemove = async () => {
    setStampUrl("");
    await updateField("stamp_url", null);
    toast({ title: "Cachet supprimé" });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <BackButton to="/" />
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Gestion d'entreprise
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Configurez votre identité et personnalisez vos documents
          </p>
        </div>
        <div className="w-10 sm:w-24"></div>
      </div>
      
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="flex flex-wrap w-full gap-1 bg-muted p-1 rounded-xl h-auto">
          <TabsTrigger value="info" className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-xs sm:text-sm py-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Info</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-xs sm:text-sm py-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="signatures" className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-xs sm:text-sm py-2">
            <FileSignature className="h-4 w-4" />
            <span className="hidden sm:inline">Signatures</span>
          </TabsTrigger>
          <TabsTrigger value="headers" className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-xs sm:text-sm py-2">
            <FileX className="h-4 w-4" />
            <span className="hidden sm:inline">En-têtes</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-xs sm:text-sm py-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Factures</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-xs sm:text-sm py-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
        </TabsList>

        {/* Info tab */}
        <TabsContent value="info" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-t-lg">
              <CardTitle className="text-lg sm:text-xl text-blue-800 dark:text-blue-300">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Nom de l'entreprise *</label>
                    <Input name="company_name" defaultValue={profile?.name || ""} required />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Email de contact *</label>
                    <Input name="contact_email" type="email" defaultValue={profile?.email || ""} required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Téléphone *</label>
                    <Input name="phone" type="tel" defaultValue={profile?.phone || ""} required />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Adresse complète *</label>
                    <Input name="address" defaultValue={profile?.address || ""} required />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {saved ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enregistré ✓
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Enregistrement..." : "Enregistrer les informations"}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-t-lg">
              <CardTitle className="text-lg sm:text-xl text-purple-800 dark:text-purple-300">Logo et identité visuelle</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium">Logo de l'entreprise</label>
                <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center hover:border-purple-300 transition-colors">
                  {logoUrl ? (
                    <div className="space-y-3">
                      <img src={logoUrl} alt="Logo" className="h-24 mx-auto rounded border shadow-sm object-contain" />
                      <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Logo actuel
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Aucun logo uploadé</p>
                    </div>
                  )}
                  <input ref={logoInput} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-3" 
                    onClick={() => logoInput.current?.click()}
                  >
                    <FileImage className="h-4 w-4 mr-2" />
                    {logoUrl ? "Changer le logo" : "Choisir un logo"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Signatures tab */}
        <TabsContent value="signatures" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 rounded-t-lg">
              <CardTitle className="text-lg sm:text-xl text-orange-800 dark:text-orange-300">Signatures et cachets</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ajoutez votre signature et cachet — ils seront automatiquement insérés dans vos documents
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {user && (
                <SignatureManager 
                  userId={user.id}
                  signatureUrl={sigUrl}
                  stampUrl={stampUrl}
                  onSignatureUpdate={handleSignatureUpdate}
                  onStampUpdate={handleStampUpdate}
                  onSignatureRemove={handleSignatureRemove}
                  onStampRemove={handleStampRemove}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Headers tab */}
        <TabsContent value="headers" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-t-lg">
              <CardTitle className="text-lg sm:text-xl text-green-800 dark:text-green-300">En-têtes et pieds de page</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Notes d'en-tête</label>
                <Textarea 
                  value={headerNotes}
                  onChange={(e) => setHeaderNotes(e.target.value)}
                  placeholder="Informations en haut de vos documents (conditions spéciales, mentions légales...)"
                  className="h-20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Notes de pied de page</label>
                <Textarea 
                  value={footerNotes}
                  onChange={(e) => setFooterNotes(e.target.value)}
                  placeholder="Informations en bas de vos documents (coordonnées bancaires, conditions générales...)"
                  className="h-20"
                />
              </div>
              
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les en-têtes et pieds de page
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices tab */}
        <TabsContent value="invoices" className="space-y-6">
          <InvoiceCustomizer />
        </TabsContent>

        {/* Templates tab */}
        <TabsContent value="templates" className="space-y-6">
          <DocumentTemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyProfileForm;
