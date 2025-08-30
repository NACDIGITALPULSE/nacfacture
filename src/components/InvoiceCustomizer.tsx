import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload, 
  FileImage, 
  Palette, 
  Settings, 
  Eye, 
  Download,
  Plus,
  Check,
  FileText,
  Receipt
} from "lucide-react";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useAuth } from "@/contexts/AuthProvider";
import { useInvoiceTemplates } from "@/hooks/useInvoiceTemplates";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import LogoManager from "./LogoManager";

const InvoiceCustomizer: React.FC = () => {
  const { user } = useAuth();
  const { profile, upsertProfile } = useCompanyProfile(user);
  const { templates, createTemplate, setDefaultTemplate } = useInvoiceTemplates();
  const [documentType, setDocumentType] = useState<string>("invoice");
  const [customColors, setCustomColors] = useState({
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#06b6d4"
  });

  const handleLogoUpdate = async (logoUrl: string) => {
    await upsertProfile({
      name: profile?.name || "Entreprise",
      logo_url: logoUrl
    });

    toast({
      title: "Logo mis à jour",
      description: "Votre logo a été enregistré avec succès"
    });
  };

  const createCustomTemplate = async () => {
    const templateName = documentType === "invoice" ? "Template Facture Personnalisé" : "Template Devis Personnalisé";
    
    await createTemplate({
      name: templateName,
      description: `Template créé avec vos couleurs personnalisées pour ${documentType === "invoice" ? "les factures" : "les devis"}`,
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
          Personnalisation des documents
        </h2>
        <p className="text-gray-600">Créez des documents qui reflètent votre identité d'entreprise</p>
      </div>

      {/* Document Type Selection */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Type de document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all ${documentType === "invoice" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"}`}
              onClick={() => setDocumentType("invoice")}
            >
              <CardContent className="p-4 text-center">
                <Receipt className={`h-8 w-8 mx-auto mb-2 ${documentType === "invoice" ? "text-blue-600" : "text-gray-500"}`} />
                <div className={`font-medium ${documentType === "invoice" ? "text-blue-700" : "text-gray-700"}`}>
                  Factures
                </div>
              </CardContent>
            </Card>
            <Card 
              className={`cursor-pointer transition-all ${documentType === "quote" ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"}`}
              onClick={() => setDocumentType("quote")}
            >
              <CardContent className="p-4 text-center">
                <FileText className={`h-8 w-8 mx-auto mb-2 ${documentType === "quote" ? "text-green-600" : "text-gray-500"}`} />
                <div className={`font-medium ${documentType === "quote" ? "text-green-700" : "text-gray-700"}`}>
                  Devis
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="logo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="logo" className="space-y-4">
          <LogoManager
            currentLogo={profile?.logo_url || ""}
            onLogoUpdate={handleLogoUpdate}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates disponibles pour {documentType === "invoice" ? "les factures" : "les devis"}</CardTitle>
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
                    <div 
                      className="h-24 rounded border mb-3 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${template.color_scheme?.primary || "#3b82f6"}20, ${template.color_scheme?.accent || "#06b6d4"}20)`
                      }}
                    >
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
                  <span className="text-xs text-gray-500 mt-1">
                    Pour {documentType === "invoice" ? "factures" : "devis"}
                  </span>
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
                Créer un template {documentType === "invoice" ? "facture" : "devis"} avec ces couleurs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu du {documentType === "invoice" ? "facture" : "devis"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    {profile?.logo_url && (
                      <img src={profile.logo_url} alt="Logo" className="h-12 mb-3 object-contain" />
                    )}
                    <h3 className="text-lg font-bold" style={{color: customColors.primary}}>
                      {profile?.name || "Votre Entreprise"}
                    </h3>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold" style={{color: customColors.primary}}>
                      {documentType === "invoice" ? "FACTURE" : "DEVIS"}
                    </h2>
                    <p className="text-gray-600">N° {documentType === "invoice" ? "F" : "D"}2024-001</p>
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
                  <p className="text-xs text-gray-500 text-center">
                    Aperçu du design de votre {documentType === "invoice" ? "facture" : "devis"}
                  </p>
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
