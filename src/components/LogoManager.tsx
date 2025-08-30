
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Upload, RotateCw, Move, ZoomIn, ZoomOut, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LogoManagerProps {
  currentLogo?: string;
  onLogoUpdate: (logoUrl: string) => void;
}

const LogoManager: React.FC<LogoManagerProps> = ({ currentLogo, onLogoUpdate }) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(currentLogo || "");
  const [logoSettings, setLogoSettings] = useState({
    width: 150,
    height: 80,
    rotation: 0,
    brightness: 100,
    contrast: 100
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Fichier trop volumineux",
          description: "La taille du logo ne doit pas dépasser 5MB",
          variant: "destructive"
        });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = async () => {
    if (!logoFile) {
      toast({
        title: "Aucun logo sélectionné",
        description: "Veuillez d'abord sélectionner un logo",
        variant: "destructive"
      });
      return;
    }

    // Ici, vous pourriez uploader le fichier vers Supabase Storage
    // Pour l'instant, on simule avec l'URL de prévisualisation
    onLogoUpdate(logoPreview);
    
    toast({
      title: "Logo sauvegardé",
      description: "Votre logo a été mis à jour avec succès"
    });
  };

  const resetLogo = () => {
    setLogoFile(null);
    setLogoPreview(currentLogo || "");
    setLogoSettings({
      width: 150,
      height: 80,
      rotation: 0,
      brightness: 100,
      contrast: 100
    });
  };

  const logoStyle = {
    width: `${logoSettings.width}px`,
    height: `${logoSettings.height}px`,
    transform: `rotate(${logoSettings.rotation}deg)`,
    filter: `brightness(${logoSettings.brightness}%) contrast(${logoSettings.contrast}%)`,
    objectFit: 'contain' as const,
    transition: 'all 0.3s ease'
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Gestion du Logo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="space-y-3">
          <Label htmlFor="logo-upload">Télécharger un nouveau logo</Label>
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choisir un fichier
            </Button>
            {logoFile && (
              <Button variant="outline" onClick={resetLogo}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Formats acceptés: PNG, JPG, SVG (max. 5MB)
          </p>
        </div>

        {/* Preview Section */}
        {logoPreview && (
          <div className="space-y-4">
            <Label>Aperçu du logo</Label>
            <div className="flex justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <img
                src={logoPreview}
                alt="Logo preview"
                style={logoStyle}
                className="border border-gray-200 rounded"
              />
            </div>

            {/* Dimension Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Largeur: {logoSettings.width}px</Label>
                <Slider
                  value={[logoSettings.width]}
                  onValueChange={(value) => 
                    setLogoSettings(prev => ({ ...prev, width: value[0] }))
                  }
                  max={300}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Hauteur: {logoSettings.height}px</Label>
                <Slider
                  value={[logoSettings.height]}
                  onValueChange={(value) => 
                    setLogoSettings(prev => ({ ...prev, height: value[0] }))
                  }
                  max={200}
                  min={30}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Rotation and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Rotation: {logoSettings.rotation}°</Label>
                <Slider
                  value={[logoSettings.rotation]}
                  onValueChange={(value) => 
                    setLogoSettings(prev => ({ ...prev, rotation: value[0] }))
                  }
                  max={360}
                  min={-360}
                  step={15}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Luminosité: {logoSettings.brightness}%</Label>
                <Slider
                  value={[logoSettings.brightness]}
                  onValueChange={(value) => 
                    setLogoSettings(prev => ({ ...prev, brightness: value[0] }))
                  }
                  max={200}
                  min={50}
                  step={10}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Contraste: {logoSettings.contrast}%</Label>
                <Slider
                  value={[logoSettings.contrast]}
                  onValueChange={(value) => 
                    setLogoSettings(prev => ({ ...prev, contrast: value[0] }))
                  }
                  max={200}
                  min={50}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveLogo} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les modifications
              </Button>
              <Button variant="outline" onClick={resetLogo}>
                Réinitialiser
              </Button>
            </div>
          </div>
        )}

        {/* Logo Templates */}
        <div className="space-y-3">
          <Label>Templates de logo prédéfinis</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Moderne", style: "bg-gradient-to-r from-blue-500 to-purple-500" },
              { name: "Corporate", style: "bg-gradient-to-r from-gray-600 to-gray-800" },
              { name: "Créatif", style: "bg-gradient-to-r from-pink-500 to-orange-500" },
              { name: "Minimal", style: "bg-gradient-to-r from-green-400 to-blue-500" }
            ].map((template, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary"
                onClick={() => {
                  // Générer un logo basique avec le style sélectionné
                  const canvas = document.createElement('canvas');
                  canvas.width = 150;
                  canvas.height = 80;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    const gradient = ctx.createLinearGradient(0, 0, 150, 0);
                    gradient.addColorStop(0, template.name === 'Moderne' ? '#3b82f6' : 
                                           template.name === 'Corporate' ? '#4b5563' :
                                           template.name === 'Créatif' ? '#ec4899' : '#10b981');
                    gradient.addColorStop(1, template.name === 'Moderne' ? '#8b5cf6' : 
                                           template.name === 'Corporate' ? '#1f2937' :
                                           template.name === 'Créatif' ? '#f97316' : '#3b82f6');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, 150, 80);
                    
                    ctx.fillStyle = 'white';
                    ctx.font = 'bold 16px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('LOGO', 75, 50);
                  }
                  setLogoPreview(canvas.toDataURL());
                }}
              >
                <CardContent className="p-3 text-center">
                  <div className={`h-12 rounded mb-2 flex items-center justify-center text-white text-xs font-bold ${template.style}`}>
                    LOGO
                  </div>
                  <p className="text-xs font-medium">{template.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoManager;
