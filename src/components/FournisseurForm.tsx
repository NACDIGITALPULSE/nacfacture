
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { useForm } from "react-hook-form";
import { ArrowLeft, X, Building2, User, Mail, Phone, Globe, MapPin } from "lucide-react";

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
        <DrawerHeader className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DrawerTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              {title}
            </DrawerTitle>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 sm:px-6 pb-6 overflow-y-auto">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-xs font-medium flex items-center gap-1.5 mb-1.5">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Nom du fournisseur *
                </Label>
                <Input
                  id="name"
                  {...form.register("name", { required: true })}
                  placeholder="Nom de l'entreprise"
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="contact_person" className="text-xs font-medium flex items-center gap-1.5 mb-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Personne de contact
                </Label>
                <Input
                  id="contact_person"
                  {...form.register("contact_person")}
                  placeholder="Nom du contact principal"
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-xs font-medium flex items-center gap-1.5 mb-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="contact@fournisseur.com"
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs font-medium flex items-center gap-1.5 mb-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register("phone")}
                  placeholder="+227 XX XX XX XX"
                  className="text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="website" className="text-xs font-medium flex items-center gap-1.5 mb-1.5">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  Site web
                </Label>
                <Input
                  id="website"
                  type="url"
                  {...form.register("website")}
                  placeholder="https://www.fournisseur.com"
                  className="text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="address" className="text-xs font-medium flex items-center gap-1.5 mb-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  Adresse
                </Label>
                <Textarea
                  id="address"
                  {...form.register("address")}
                  placeholder="Adresse complète du fournisseur"
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                size="sm"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
                size="sm"
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
