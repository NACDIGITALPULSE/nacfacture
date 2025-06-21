
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Package, Wrench } from "lucide-react";

interface ProductFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  title: string;
  defaultValues?: {
    name: string;
    description: string;
    price: number;
    tva: number;
    product_type: string;
  };
}

const ProductFormDrawer: React.FC<ProductFormDrawerProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  title,
  defaultValues
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      tva: parseFloat(formData.get("tva") as string) || 0,
      product_type: formData.get("product_type") as string,
    };

    onSubmit(productData);
    form.reset();
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            {title}
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-6 pb-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <Select name="product_type" defaultValue={defaultValues?.product_type || "product"}>
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
                  defaultValue={defaultValues?.name}
                  placeholder="Nom du produit/service"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea 
                name="description" 
                defaultValue={defaultValues?.description}
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
                  defaultValue={defaultValues?.price}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">TVA (%)</label>
                <Input 
                  name="tva" 
                  type="number" 
                  step="0.01" 
                  defaultValue={defaultValues?.tva || 0}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductFormDrawer;
