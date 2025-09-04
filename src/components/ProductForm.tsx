
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { Package, Wrench } from "lucide-react";

interface ProductFormProps {
  onProductAdded: () => void;
  initialData?: any;
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded, initialData, isEditing = false }) => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      tva: parseFloat(formData.get("tva") as string) || 0,
      product_type: formData.get("product_type") as string,
      user_id: user.id,
    };

    try {
      let result;
      if (isEditing && initialData) {
        result = await supabase
          .from("products")
          .update(productData)
          .eq("id", initialData.id);
      } else {
        result = await supabase
          .from("products")
          .insert([productData]);
      }

      if (result.error) throw result.error;

      toast({
        title: isEditing ? "Produit/Service modifié" : "Produit/Service ajouté",
        description: `Le ${productData.product_type === 'product' ? 'produit' : 'service'} a été ${isEditing ? 'modifié' : 'ajouté'} avec succès.`,
      });

      form.reset();
      onProductAdded();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">
          {isEditing ? "Modifier" : "Ajouter"} un produit/service
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type *</label>
          <Select name="product_type" defaultValue={initialData?.product_type || "product"}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Produit
                </div>
              </SelectItem>
              <SelectItem value="service">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Service
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nom *</label>
          <Input 
            name="name" 
            required 
            defaultValue={initialData?.name}
            placeholder="Nom du produit/service"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea 
          name="description" 
          defaultValue={initialData?.description}
          placeholder="Description détaillée"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prix unitaire (FCFA) *</label>
          <Input 
            name="price" 
            type="number" 
            step="0.01" 
            required 
            defaultValue={initialData?.price}
            placeholder="0.00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">TVA (%)</label>
          <Input 
            name="tva" 
            type="number" 
            step="0.01" 
            defaultValue={initialData?.tva}
            placeholder="0.00"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Enregistrement..." : isEditing ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};

export default ProductForm;
