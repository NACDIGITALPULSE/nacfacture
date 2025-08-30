
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileImage, 
  Palette, 
  Settings, 
  Eye, 
  Download,
  Plus,
  Check
} from "lucide-react";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useAuth } from "@/contexts/AuthProvider";
import { useInvoiceTemplates } from "@/hooks/useInvoiceTemplates";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const logoTemplates = [
  { id: "modern", name: "Moderne", preview: "/api/placeholder/150/80?text=Logo+Moderne" },
  { id: "classic", name: "Classique", preview: "/api/placeholder/150/80?text=Logo+Classic" },
  { id: "minimal", name: "Minimal", preview: "/api/placeholder/150/80?text=Logo+Minimal" },
  { id: "corporate", name: "Corporate", preview: "/api/placeholder/150/80?text=Logo+Corp" }
];

const InvoiceCustomizer: React.FC = () => {
  const { user } = useAuth();
  const { profile, upsertProfile } = useCompanyProfile(user);
  const { templates, createTemplate, setDefaultTemplate } = useInvoiceTemplates();
  const [selectedLogo, setSelectedLogo] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customColors, setCustomColors] = useState({
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#06b6d4"
  });
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !user) return;
    
    const file = e.target.files[0];
    const filePath = `${user.id}/logo_${Date.now()}.${file.name.split('.').pop()}`;
    
    const { data, error } = await supabase.storage
      .from('company-assets')
      .upload(filePath, file, { upsert: true });

    if (error) {
      toast({
        title: "Erreur d'upload",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    const publicUrl = supabase.storage
      .from('company-assets')
      .getPublicUrl(filePath).data.publicUrl;

    await upsertProfile({
      name: profile?.name || "Entreprise",
      logo_url: publicUrl
    });

    toast({
      title: "Logo mis à jour",
      description: "Votre logo a été enregistré avec succès"
    });
  };

  const createCustomTemplate = async () => {
    await createTemplate({
      name: "Template Personnalisé",
      description: "Template créé avec vos couleurs personnalisées",
      logo_position: "top-left",
      color_scheme: customColors,
      font_family: "Inter",
      layout_type: "modern",
      is_default: false
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Personnalisation des factures
        </h2>
        <p className="text-gray-600">Créez des factures qui reflètent votre identité d'entreprise</p>
      </div>

      <Tabs defaultValue="logo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="logo" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo actuel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  {profile?.logo_url ? (
                    <img src={profile.logo_url} alt="Logo" className="h-20 mx-auto mb-3" />
                  ) : (
                    <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <Button
                    onClick={() => logoInputRef.current?.click()}
                    className="bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {profile?.logo_url ? "Changer le logo" : "Ajouter un logo"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Templates de logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {logoTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedLogo === template.id
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedLogo(template.id)}
                    >
                      <div className="bg-gray-100 rounded h-12 mb-2 flex items-center justify-center">
                        <span className="text-xs text-gray-500">{template.name}</span>
                      </div>
                      <p className="text-xs text-center font-medium">{template.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4 hover:shadow-md cursor-pointer"
                    onClick={() => setDefaultTemplate(template.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{template.name}</h4>
                      {template.is_default && (
                        <Badge className="bg-green-100 text-green-700">
                          <Check className="h-3 w-3 mr-1" />
                          Actuel
                        </Badge>
                      )}
                    </div>
                    <div className="h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded border mb-3 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Aperçu</span>
                    </div>
                    <p className="text-xs text-gray-600">{template.description}</p>
                  </div>
                ))}
                
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 cursor-pointer transition-colors flex flex-col items-center justify-center"
                  onClick={createCustomTemplate}
                >
                  <Plus className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Nouveau template</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Palette de couleurs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Couleur principale</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customColors.primary}
                    onChange={(e) => setCustomColors({...customColors, primary: e.target.value})}
                    className="w-12 h-10 border rounded"
                  />
                  <Input
                    value={customColors.primary}
                    onChange={(e) => setCustomColors({...customColors, primary: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Couleur secondaire</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customColors.secondary}
                    onChange={(e) => setCustomColors({...customColors, secondary: e.target.value})}
                    className="w-12 h-10 border rounded"
                  />
                  <Input
                    value={customColors.secondary}
                    onChange={(e) => setCustomColors({...customColors, secondary: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Couleur d'accent</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customColors.accent}
                    onChange={(e) => setCustomColors({...customColors, accent: e.target.value})}
                    className="w-12 h-10 border rounded"
                  />
                  <Input
                    value={customColors.accent}
                    onChange={(e) => setCustomColors({...customColors, accent: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <Button onClick={createCustomTemplate} className="w-full">
                Créer un template avec ces couleurs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu de la facture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    {profile?.logo_url && (
                      <img src={profile.logo_url} alt="Logo" className="h-12 mb-3" />
                    )}
                    <h3 className="text-lg font-bold" style={{color: customColors.primary}}>
                      {profile?.name || "Votre Entreprise"}
                    </h3>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold" style={{color: customColors.primary}}>FACTURE</h2>
                    <p className="text-gray-600">N° F2024-001</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium mb-2" style={{color: customColors.secondary}}>Émetteur</h4>
                    <p>{profile?.name || "Votre Entreprise"}</p>
                    <p>{profile?.address || "Adresse de l'entreprise"}</p>
                    <p>{profile?.phone || "Téléphone"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2" style={{color: customColors.secondary}}>Client</h4>
                    <p>Nom du client</p>
                    <p>Adresse du client</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 text-center">Aperçu du design de votre facture</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceCustomizer;
