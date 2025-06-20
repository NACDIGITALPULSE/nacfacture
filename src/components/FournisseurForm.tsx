
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useForm } from "react-hook-form";

interface FournisseurFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  defaultValues?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    contact_person?: string;
    website?: string;
  };
  isLoading?: boolean;
  title: string;
}

const FournisseurForm: React.FC<FournisseurFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading = false,
  title
}) => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      contact_person: "",
      website: "",
      ...defaultValues,
    }
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else if (!open) {
      form.reset({
        name: "",
        email: "",
        phone: "",
        address: "",
        contact_person: "",
        website: "",
      });
    }
  }, [defaultValues, open, form]);

  const handleSubmit = (data: any) => {
    onSubmit(data);
    if (!defaultValues) {
      form.reset();
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>

        <div className="px-6 pb-6 overflow-y-auto">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du fournisseur *</Label>
              <Input
                id="name"
                {...form.register("name", { required: true })}
                placeholder="Nom de l'entreprise"
              />
            </div>

            <div>
              <Label htmlFor="contact_person">Personne de contact</Label>
              <Input
                id="contact_person"
                {...form.register("contact_person")}
                placeholder="Nom du contact principal"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="contact@fournisseur.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                {...form.register("phone")}
                placeholder="+227 XX XX XX XX"
              />
            </div>

            <div>
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                type="url"
                {...form.register("website")}
                placeholder="https://www.fournisseur.com"
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                {...form.register("address")}
                placeholder="Adresse complète du fournisseur"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FournisseurForm;
