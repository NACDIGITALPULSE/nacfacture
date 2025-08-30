
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  FileText, 
  Receipt, 
  Truck, 
  Building2, 
  CreditCard,
  FileCheck,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  Save,
  Upload
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import TemplateCreator from "./TemplateCreator";

const documentTypes = [
  { value: "invoice", label: "Factures", icon: Receipt, color: "blue" },
  { value: "quote", label: "Devis", icon: FileText, color: "green" },
  { value: "delivery", label: "Bons de livraison", icon: Truck, color: "orange" },
  { value: "contract", label: "Contrats", icon: FileCheck, color: "purple" },
  { value: "receipt", label: "Reçus", icon: CreditCard, color: "indigo" },
  { value: "report", label: "Rapports", icon: Building2, color: "gray" },
];

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  layout: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  isDefault: boolean;
  createdAt: string;
}

const DocumentTemplateManager = () => {
  const [selectedType, setSelectedType] = useState("invoice");
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Template Standard",
      description: "Template par défaut pour les factures",
      type: "invoice",
      layout: "modern",
      colorScheme: { primary: "#3b82f6", secondary: "#64748b", accent: "#06b6d4" },
      isDefault: true,
      createdAt: new Date().toISOString()
    }
  ]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    layout: "",
    colorScheme: { primary: "#3b82f6", secondary: "#64748b", accent: "#06b6d4" }
  });

  const selectedDocType = documentTypes.find(type => type.value === selectedType);
  const filteredTemplates = templates.filter(template => template.type === selectedType);

  const handleCreateTemplate = (templateData: any) => {
    const newTemplateObj: Template = {
      id: Date.now().toString(),
      name: templateData.name,
      description: templateData.description || "Template personnalisé",
      type: selectedType,
      layout: templateData.layout_type,
      colorScheme: templateData.color_scheme,
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    setTemplates([...templates, newTemplateObj]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Template créé",
      description: "Le template a été créé avec succès"
    });
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
  };

  const handleUpdateTemplate = (templateData: any) => {
    if (!editingTemplate) return;
    
    const updatedTemplates = templates.map(t => 
      t.id === editingTemplate.id 
        ? { ...t, name: templateData.name, description: templateData.description, layout: templateData.layout_type, colorScheme: templateData.color_scheme }
        : t
    );
    
    setTemplates(updatedTemplates);
    setEditingTemplate(null);
    toast({
      title: "Template modifié",
      description: "Le template a été mis à jour avec succès"
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    toast({
      title: "Template supprimé",
      description: "Le template a été supprimé avec succès"
    });
  };

  const handleSetDefault = (templateId: string) => {
    const updatedTemplates = templates.map(t => ({
      ...t,
      isDefault: t.id === templateId
    }));
    setTemplates(updatedTemplates);
    toast({
      title: "Template par défaut",
      description: "Le template par défaut a été modifié"
    });
  };

  const handleViewTemplate = (template: Template) => {
    toast({
      title: "Aperçu du template",
      description: `Ouverture de l'aperçu pour ${template.name}`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Templates de documents administratifs
        </h2>
        <p className="text-gray-600">
          Créez et gérez tous vos templates de documents d'entreprise
        </p>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {documentTypes.map((docType) => {
          const Icon = docType.icon;
          const isSelected = selectedType === docType.value;
          
          return (
            <Card
              key={docType.value}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? `ring-2 ring-${docType.color}-500 shadow-lg bg-${docType.color}-50` 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedType(docType.value)}
            >
              <CardContent className="p-4 text-center">
                <Icon className={`h-8 w-8 mx-auto mb-2 ${
                  isSelected ? `text-${docType.color}-600` : 'text-gray-500'
                }`} />
                <div className={`text-sm font-medium ${
                  isSelected ? `text-${docType.color}-700` : 'text-gray-700'
                }`}>
                  {docType.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Templates for selected type */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {selectedDocType && <selectedDocType.icon className="h-5 w-5" />}
              Templates {selectedDocType?.label}
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau template</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                  <TemplateCreator
                    onSave={handleCreateTemplate}
                    onCancel={() => setIsCreateDialogOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className={`border-2 ${template.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{template.name}</CardTitle>
                    {template.isDefault && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <Star className="h-3 w-3 mr-1" />
                        Défaut
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-24 bg-white rounded border-2 border-dashed border-blue-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Aperçu</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewTemplate(template)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Modifier
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
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleSetDefault(template.id)}
                        disabled={template.isDefault}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Par défaut
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Bouton pour créer un nouveau template */}
            <Card 
              className="border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <CardContent className="p-6 text-center">
                <div className="space-y-3">
                  <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto">
                    <Plus className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Nouveau Template</div>
                    <div className="text-sm text-gray-500">Créer un template personnalisé</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentTemplateManager;
