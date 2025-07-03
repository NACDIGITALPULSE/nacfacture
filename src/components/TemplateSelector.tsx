import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Plus, Star, Edit, Trash2 } from "lucide-react";
import { useInvoiceTemplates } from "@/hooks/useInvoiceTemplates";

interface TemplateSelectorProps {
  selectedTemplateId?: string;
  onTemplateSelect: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onTemplateSelect
}) => {
  const { 
    templates, 
    defaultTemplate, 
    createTemplate, 
    setDefaultTemplate,
    deleteTemplate,
    isCreating 
  } = useInvoiceTemplates();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    layout_type: "modern",
    color_scheme: {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#06b6d4"
    },
    font_family: "Inter",
    logo_position: "top-left"
  });

  const handleCreateTemplate = () => {
    createTemplate({
      ...newTemplate,
      is_default: false
    });
    setIsCreateOpen(false);
    setNewTemplate({
      name: "",
      description: "",
      layout_type: "modern",
      color_scheme: {
        primary: "#3b82f6",
        secondary: "#64748b", 
        accent: "#06b6d4"
      },
      font_family: "Inter",
      logo_position: "top-left"
    });
  };

  const colorPresets = [
    { name: "Bleu moderne", colors: { primary: "#3b82f6", secondary: "#64748b", accent: "#06b6d4" } },
    { name: "Vert professionnel", colors: { primary: "#059669", secondary: "#6b7280", accent: "#10b981" } },
    { name: "Violet créatif", colors: { primary: "#7c3aed", secondary: "#a855f7", accent: "#ec4899" } },
    { name: "Orange dynamique", colors: { primary: "#ea580c", secondary: "#f97316", accent: "#facc15" } },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Template de facture</Label>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Nom du template</Label>
                <Input
                  id="template-name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="Ex: Template Moderne"
                />
              </div>
              
              <div>
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Description du template"
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Style de mise en page</Label>
                <Select
                  value={newTemplate.layout_type}
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, layout_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Moderne</SelectItem>
                    <SelectItem value="classic">Classique</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="colorful">Coloré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Schéma de couleurs</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setNewTemplate({ ...newTemplate, color_scheme: preset.colors })}
                      className="flex items-center gap-2 p-2 rounded border hover:bg-accent text-left"
                    >
                      <div className="flex gap-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: preset.colors.secondary }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: preset.colors.accent }}
                        />
                      </div>
                      <span className="text-xs">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleCreateTemplate} 
                className="w-full"
                disabled={!newTemplate.name || isCreating}
              >
                {isCreating ? "Création..." : "Créer le template"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplateId === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <CardHeader className="p-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                <div className="flex items-center gap-1">
                  {template.is_default && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Défaut
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDefaultTemplate(template.id);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Star className={`h-3 w-3 ${template.is_default ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplate(template.id);
                    }}
                    className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {template.description && (
                <p className="text-xs text-muted-foreground">{template.description}</p>
              )}
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="flex items-center gap-2">
                <Palette className="h-3 w-3 text-muted-foreground" />
                <div className="flex gap-1">
                  <div 
                    className="w-3 h-3 rounded-full border" 
                    style={{ backgroundColor: template.color_scheme.primary }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full border" 
                    style={{ backgroundColor: template.color_scheme.secondary }}
                  />
                  {template.color_scheme.accent && (
                    <div 
                      className="w-3 h-3 rounded-full border" 
                      style={{ backgroundColor: template.color_scheme.accent }}
                    />
                  )}
                </div>
                <span className="text-xs text-muted-foreground capitalize">
                  {template.layout_type}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;