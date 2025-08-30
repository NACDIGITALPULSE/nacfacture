
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
import { Palette, Plus, Star, Edit, Trash2, Sparkles } from "lucide-react";
import { useInvoiceTemplates } from "@/hooks/useInvoiceTemplates";
import TemplateCreator from "./TemplateCreator";

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
    updateTemplate,
    setDefaultTemplate,
    deleteTemplate,
    isCreating,
    isUpdating
  } = useInvoiceTemplates();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const handleCreateTemplate = (templateData: any) => {
    createTemplate({
      ...templateData,
      is_default: false
    });
    setIsCreateOpen(false);
  };

  const handleUpdateTemplate = (templateData: any) => {
    if (editingTemplate) {
      updateTemplate({
        id: editingTemplate.id,
        ...templateData
      });
      setEditingTemplate(null);
    }
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
  };

  return (
    <div className="space-y-6">
      {/* Header avec gradient moderne */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/10 via-blue-50 to-purple-50 rounded-xl border">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Templates de facture
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Personnalisez l'apparence de vos factures avec nos templates professionnels
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Créer un template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Créer un nouveau template</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <TemplateCreator
                onSave={handleCreateTemplate}
                onCancel={() => setIsCreateOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates grid avec design amélioré */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-lg ${
              selectedTemplateId === template.id 
                ? 'ring-2 ring-primary shadow-xl shadow-primary/20' 
                : 'hover:shadow-primary/10'
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {template.name}
                  </CardTitle>
                  {template.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {template.is_default && (
                    <Badge variant="secondary" className="text-xs bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Défaut
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-2">
              {/* Aperçu des couleurs */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Palette className="h-3 w-3 text-muted-foreground" />
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                      style={{ backgroundColor: template.color_scheme.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                      style={{ backgroundColor: template.color_scheme.secondary }}
                    />
                    {template.color_scheme.accent && (
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                        style={{ backgroundColor: template.color_scheme.accent }}
                      />
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {template.layout_type}
                </Badge>
              </div>

              {/* Aperçu miniature */}
              <div 
                className="h-20 rounded-lg border-2 p-2 mb-3 bg-gradient-to-br from-white to-gray-50"
                style={{ 
                  borderColor: template.color_scheme.primary + '20',
                  fontFamily: template.font_family 
                }}
              >
                <div 
                  className="h-2 rounded mb-1"
                  style={{ backgroundColor: template.color_scheme.primary }}
                />
                <div className="grid grid-cols-3 gap-1 mb-1">
                  <div className="h-1 bg-gray-200 rounded" />
                  <div className="h-1 bg-gray-200 rounded" />
                  <div className="h-1 bg-gray-200 rounded" />
                </div>
                <div 
                  className="h-1 w-3/4 rounded"
                  style={{ backgroundColor: template.color_scheme.accent }}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDefaultTemplate(template.id);
                    }}
                    className="h-7 w-7 p-0 hover:bg-amber-100"
                    title="Définir comme défaut"
                  >
                    <Star className={`h-3 w-3 ${template.is_default ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'}`} />
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTemplate(template);
                        }}
                        className="h-7 w-7 p-0 hover:bg-blue-100"
                        title="Modifier"
                      >
                        <Edit className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle>Modifier le template</DialogTitle>
                      </DialogHeader>
                      <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                        {editingTemplate && (
                          <TemplateCreator
                            initialTemplate={editingTemplate}
                            onSave={handleUpdateTemplate}
                            onCancel={() => setEditingTemplate(null)}
                          />
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) {
                      deleteTemplate(template.id);
                    }
                  }}
                  className="h-7 w-7 p-0 hover:bg-red-100"
                  title="Supprimer"
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Template vide pour créer */}
        <Card 
          className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer group"
          onClick={() => setIsCreateOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center h-48 text-center">
            <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 transition-colors mb-3">
              <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Créer un nouveau template
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Personnalisez vos factures
            </p>
          </CardContent>
        </Card>
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <div className="p-6 rounded-full bg-muted/50 w-fit mx-auto mb-4">
            <Palette className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Aucun template créé
          </h3>
          <p className="text-muted-foreground mb-4">
            Créez votre premier template pour personnaliser vos factures
          </p>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-gradient-to-r from-primary to-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Créer mon premier template
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
