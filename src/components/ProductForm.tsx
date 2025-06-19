
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Package } from "lucide-react";
import { ProductFormData } from "@/hooks/useProductsManagement";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormData) => void;
  defaultValues?: ProductFormData;
  isLoading?: boolean;
  title: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading = false,
  title
}) => {
  const form = useForm<ProductFormData>({
    defaultValues: defaultValues || {
      name: "",
      description: "",
      price: 0,
      tva: 0
    }
  });

  React.useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({ name: "", description: "", price: 0, tva: 0 });
    }
  }, [defaultValues, form]);

  const handleSubmit = (data: ProductFormData) => {
    onSubmit(data);
    if (!defaultValues) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du produit/service *</Label>
            <Input
              id="name"
              {...form.register("name", { required: "Le nom est requis" })}
              placeholder="Ex: Consultation, Formation, Produit..."
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Description détaillée du produit ou service"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prix unitaire (FCFA) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...form.register("price", { 
                  required: "Le prix est requis",
                  valueAsNumber: true,
                  min: { value: 0, message: "Le prix doit être positif" }
                })}
                placeholder="0.00"
              />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="tva">TVA (%)</Label>
              <Input
                id="tva"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...form.register("tva", { 
                  valueAsNumber: true,
                  min: { value: 0, message: "La TVA doit être positive" },
                  max: { value: 100, message: "La TVA ne peut dépasser 100%" }
                })}
                placeholder="0.00"
              />
              {form.formState.errors.tva && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.tva.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {defaultValues ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
