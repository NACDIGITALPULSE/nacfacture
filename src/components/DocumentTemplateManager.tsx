
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
  Star
} from "lucide-react";

const documentTypes = [
  { value: "invoice", label: "Factures", icon: Receipt, color: "blue" },
  { value: "quote", label: "Devis", icon: FileText, color: "green" },
  { value: "delivery", label: "Bons de livraison", icon: Truck, color: "orange" },
  { value: "contract", label: "Contrats", icon: FileCheck, color: "purple" },
  { value: "receipt", label: "Reçus", icon: CreditCard, color: "indigo" },
  { value: "report", label: "Rapports", icon: Building2, color: "gray" },
];

const DocumentTemplateManager = () => {
  const [selectedType, setSelectedType] = useState("invoice");
  const [templates, setTemplates] = useState<any[]>([]);

  const selectedDocType = documentTypes.find(type => type.value === selectedType);

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
          <CardTitle className="flex items-center gap-2">
            {selectedDocType && <selectedDocType.icon className="h-5 w-5" />}
            Templates {selectedDocType?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="templates" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Mes Templates</TabsTrigger>
              <TabsTrigger value="create">Créer un Template</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              {/* Template par défaut */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Template Standard</CardTitle>
                      <Badge className="bg-blue-100 text-blue-700">
                        <Star className="h-3 w-3 mr-1" />
                        Défaut
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-24 bg-white rounded border-2 border-dashed border-blue-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">Aperçu</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bouton pour créer un nouveau template */}
                <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors">
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
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuration */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom du template</label>
                    <Input placeholder="Ex: Template moderne bleu" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Type de document</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mise en page</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une mise en page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Moderne</SelectItem>
                        <SelectItem value="classic">Classique</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600">
                    Créer le template
                  </Button>
                </div>

                {/* Aperçu */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Aperçu en temps réel</h4>
                  <div className="bg-white rounded border h-64 flex items-center justify-center">
                    <span className="text-gray-400">Aperçu du template</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentTemplateManager;
