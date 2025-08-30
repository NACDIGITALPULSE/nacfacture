
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Trash2, Edit, Stamp, FileSignature, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SignatureManagerProps {
  userId: string;
  onSignatureUpdate?: (signatureUrl: string) => void;
  onStampUpdate?: (stampUrl: string) => void;
}

const SignatureManager: React.FC<SignatureManagerProps> = ({
  userId,
  onSignatureUpdate,
  onStampUpdate
}) => {
  const [signatures, setSignatures] = useState<any[]>([]);
  const [stamps, setStamps] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File, type: 'signature' | 'stamp') => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('company-assets')
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const publicUrl = supabase.storage
        .from('company-assets')
        .getPublicUrl(filePath).data.publicUrl;

      if (type === 'signature') {
        onSignatureUpdate?.(publicUrl);
      } else {
        onStampUpdate?.(publicUrl);
      }

      toast({
        title: `${type === 'signature' ? 'Signature' : 'Cachet'} ajouté`,
        description: "Le fichier a été uploadé avec succès",
      });

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Erreur d'upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await uploadFile(e.target.files[0], 'signature');
    }
  };

  const handleStampUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await uploadFile(e.target.files[0], 'stamp');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Gestion des signatures */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-blue-600" />
            Signatures numériques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
            <FileSignature className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              Ajoutez votre signature manuscrite ou électronique
            </p>
            <input
              ref={signatureInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleSignatureUpload}
            />
            <Button
              onClick={() => signatureInputRef.current?.click()}
              disabled={isUploading}
              className="bg-gradient-to-r from-blue-500 to-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une signature
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gestion des cachets */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stamp className="h-5 w-5 text-purple-600" />
            Cachets d'entreprise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-purple-300 transition-colors">
            <Stamp className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              Ajoutez le cachet officiel de votre entreprise
            </p>
            <input
              ref={stampInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleStampUpload}
            />
            <Button
              onClick={() => stampInputRef.current?.click()}
              disabled={isUploading}
              className="bg-gradient-to-r from-purple-500 to-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un cachet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignatureManager;
