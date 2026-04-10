
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, User, Mail, Phone, MapPin } from "lucide-react";
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
      <DialogContent className="max-w-md w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <div className="bg-primary/10 p-2 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-xs font-medium flex items-center gap-1.5 mb-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Nom du client *
            </Label>
            <Input
              id="name"
              {...form.register("name", { required: "Le nom est requis" })}
              placeholder="Nom complet ou raison sociale"
              className="text-sm"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
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
              placeholder="client@exemple.com"
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
              {...form.register("phone")}
              placeholder="+227 XX XX XX XX"
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-xs font-medium flex items-center gap-1.5 mb-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Adresse
            </Label>
            <Textarea
              id="address"
              {...form.register("address")}
              placeholder="Adresse complète du client"
              rows={3}
              className="text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              size="sm"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} size="sm">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {defaultValues ? "Mettre à jour" : "Ajouter le client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientForm;
