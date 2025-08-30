
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "@/components/ColorPicker";
import { Eye, Save, Palette, Type, Layout } from "lucide-react";

interface TemplateCreatorProps {
  onSave: (template: any) => void;
  onCancel: () => void;
  initialTemplate?: any;
}

const TemplateCreator: React.FC<TemplateCreatorProps> = ({
  onSave,
  onCancel,
  initialTemplate
}) => {
  const [template, setTemplate] = useState({
    name: initialTemplate?.name || "",
    description: initialTemplate?.description || "",
    layout_type: initialTemplate?.layout_type || "modern",
    color_scheme: initialTemplate?.color_scheme || {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#06b6d4"
    },
    font_family: initialTemplate?.font_family || "Inter",
    logo_position: initialTemplate?.logo_position || "top-left",
    custom_css: initialTemplate?.custom_css || ""
  });

  const handleSave = () => {
    onSave(template);
  };

  const fontOptions = [
    { value: "Inter", label: "Inter (Moderne)" },
    { value: "Roboto", label: "Roboto (Professionnel)" },
    { value: "Open Sans", label: "Open Sans (Lisible)" },
    { value: "Lato", label: "Lato (Élégant)" },
    { value: "Montserrat", label: "Montserrat (Stylé)" },
    { value: "Poppins", label: "Poppins (Moderne)" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {initialTemplate ? "Modifier le template" : "Créer un template"}
          </h2>
          <p className="text-muted-foreground">Personnalisez l'apparence de vos factures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!template.name}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Configuration du template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="colors">Couleurs</TabsTrigger>
                <TabsTrigger value="layout">Mise en page</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Nom du template</Label>
                  <Input
                    id="template-name"
                    value={template.name}
                    onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                    placeholder="Ex: Template Moderne Bleu"
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={template.description}
                    onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                    placeholder="Description du template"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Police de caractères</Label>
                  <Select
                    value={template.font_family}
                    onValueChange={(value) => setTemplate({ ...template, font_family: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="colors" className="space-y-4">
                <div>
                  <Label>Couleur principale</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-8 h-8 rounded border-2 border-white shadow-md"
                      style={{ backgroundColor: template.color_scheme.primary }}
                    />
                    <Input
                      type="color"
                      value={template.color_scheme.primary}
                      onChange={(e) => setTemplate({
                        ...template,
                        color_scheme: { ...template.color_scheme, primary: e.target.value }
                      })}
                      className="w-20"
                    />
                    <Input
                      value={template.color_scheme.primary}
                      onChange={(e) => setTemplate({
                        ...template,
                        color_scheme: { ...template.color_scheme, primary: e.target.value }
                      })}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Couleur secondaire</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-8 h-8 rounded border-2 border-white shadow-md"
                      style={{ backgroundColor: template.color_scheme.secondary }}
                    />
                    <Input
                      type="color"
                      value={template.color_scheme.secondary}
                      onChange={(e) => setTemplate({
                        ...template,
                        color_scheme: { ...template.color_scheme, secondary: e.target.value }
                      })}
                      className="w-20"
                    />
                    <Input
                      value={template.color_scheme.secondary}
                      onChange={(e) => setTemplate({
                        ...template,
                        color_scheme: { ...template.color_scheme, secondary: e.target.value }
                      })}
                      placeholder="#64748b"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Couleur d'accent</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-8 h-8 rounded border-2 border-white shadow-md"
                      style={{ backgroundColor: template.color_scheme.accent }}
                    />
                    <Input
                      type="color"
                      value={template.color_scheme.accent}
                      onChange={(e) => setTemplate({
                        ...template,
                        color_scheme: { ...template.color_scheme, accent: e.target.value }
                      })}
                      className="w-20"
                    />
                    <Input
                      value={template.color_scheme.accent}
                      onChange={(e) => setTemplate({
                        ...template,
                        color_scheme: { ...template.color_scheme, accent: e.target.value }
                      })}
                      placeholder="#06b6d4"
                      className="flex-1"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <div>
                  <Label>Style de mise en page</Label>
                  <Select
                    value={template.layout_type}
                    onValueChange={(value) => setTemplate({ ...template, layout_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Moderne</SelectItem>
                      <SelectItem value="classic">Classique</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="colorful">Coloré</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Position du logo</Label>
                  <Select
                    value={template.logo_position}
                    onValueChange={(value) => setTemplate({ ...template, logo_position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">En haut à gauche</SelectItem>
                      <SelectItem value="top-center">En haut au centre</SelectItem>
                      <SelectItem value="top-right">En haut à droite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>CSS personnalisé (optionnel)</Label>
                  <Textarea
                    value={template.custom_css}
                    onChange={(e) => setTemplate({ ...template, custom_css: e.target.value })}
                    placeholder="/* Votre CSS personnalisé ici */&#10;.invoice-header { margin-bottom: 20px; }"
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Aperçu */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Aperçu du template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border rounded-lg p-4 bg-white shadow-inner"
              style={{ 
                fontFamily: template.font_family,
                minHeight: "400px"
              }}
            >
              {/* Header simulé */}
              <div 
                className="flex justify-between items-start mb-6 pb-4 border-b-2"
                style={{ borderColor: template.color_scheme.primary }}
              >
                <div>
                  <h3 
                    className="text-xl font-bold"
                    style={{ color: template.color_scheme.primary }}
                  >
                    Mon Entreprise
                  </h3>
                  <p className="text-sm text-gray-600">123 Rue Example</p>
                </div>
                <div className="text-right">
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: template.color_scheme.secondary }}
                  >
                    FACTURE
                  </div>
                  <div className="text-sm text-gray-600">N° 2024-001</div>
                </div>
              </div>

              {/* Contenu simulé */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div 
                  className="p-3 rounded"
                  style={{ backgroundColor: `${template.color_scheme.primary}10` }}
                >
                  <h4 
                    className="font-semibold text-sm mb-2"
                    style={{ color: template.color_scheme.primary }}
                  >
                    ÉMETTEUR
                  </h4>
                  <p className="text-xs text-gray-600">Mon Entreprise SARL</p>
                </div>
                <div 
                  className="p-3 rounded"
                  style={{ backgroundColor: `${template.color_scheme.secondary}10` }}
                >
                  <h4 
                    className="font-semibold text-sm mb-2"
                    style={{ color: template.color_scheme.secondary }}
                  >
                    DESTINATAIRE
                  </h4>
                  <p className="text-xs text-gray-600">Client Example</p>
                </div>
              </div>

              {/* Tableau simulé */}
              <div className="border rounded overflow-hidden">
                <div 
                  className="p-2 text-white text-xs font-medium"
                  style={{ 
                    background: `linear-gradient(135deg, ${template.color_scheme.primary}, ${template.color_scheme.accent})`
                  }}
                >
                  <div className="grid grid-cols-4 gap-2">
                    <div>Description</div>
                    <div>Qté</div>
                    <div>Prix</div>
                    <div>Total</div>
                  </div>
                </div>
                <div className="p-2 text-xs border-b">
                  <div className="grid grid-cols-4 gap-2">
                    <div>Service exemple</div>
                    <div>1</div>
                    <div>100 €</div>
                    <div>100 €</div>
                  </div>
                </div>
              </div>

              {/* Total simulé */}
              <div className="flex justify-end mt-4">
                <div 
                  className="p-3 rounded"
                  style={{ backgroundColor: `${template.color_scheme.accent}10` }}
                >
                  <div 
                    className="text-lg font-bold"
                    style={{ color: template.color_scheme.accent }}
                  >
                    Total: 100 €
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TemplateCreator;
