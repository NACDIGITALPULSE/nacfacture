
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import { ClientFormData } from "@/hooks/useClientsManagement";

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClientFormData) => void;
  defaultValues?: ClientFormData;
  isLoading?: boolean;
  title: string;
}

const ClientForm: React.FC<ClientFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading = false,
  title
}) => {
  const form = useForm<ClientFormData>({
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      address: ""
    }
  });

  React.useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({ name: "", email: "", phone: "", address: "" });
    }
  }, [defaultValues, form]);

  const handleSubmit = (data: ClientFormData) => {
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
            <User className="h-5 w-5 text-blue-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du client *</Label>
            <Input
              id="name"
              {...form.register("name", { required: "Le nom est requis" })}
              placeholder="Nom complet ou raison sociale"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder="client@exemple.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              {...form.register("phone")}
              placeholder="+227 XX XX XX XX"
            />
          </div>

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              {...form.register("address")}
              placeholder="Adresse complète du client"
              rows={3}
            />
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

export default ClientForm;
