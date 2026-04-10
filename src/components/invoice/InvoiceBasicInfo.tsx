import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClients } from "@/hooks/useClients";
import TemplateSelector from "@/components/TemplateSelector";
import { CalendarDays, User, FileText, CreditCard } from "lucide-react";

interface Client {
  id: string;
  name: string;
}

interface InvoiceBasicInfoProps {
  form: UseFormReturn<any>;
}

const InvoiceBasicInfo: React.FC<InvoiceBasicInfoProps> = ({ form }) => {
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("");

  React.useEffect(() => {
    if (selectedTemplateId) {
      form.setValue("template_id", selectedTemplateId);
    }
  }, [selectedTemplateId, form]);

  return (
    <div className="space-y-4">
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            Informations de base
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="client_id" className="text-xs font-medium flex items-center gap-1.5 mb-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Client *
            </Label>
            <select
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus-ring"
              {...form.register("client_id", { required: true })}
              disabled={clientsLoading}
            >
              <option value="">Sélectionner un client</option>
              {clients.map((client: Client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="date" className="text-xs font-medium flex items-center gap-1.5 mb-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              Date *
            </Label>
            <Input type="date" {...form.register("date", { required: true })} className="text-sm" />
          </div>

          <div>
            <Label htmlFor="payment_terms" className="text-xs font-medium flex items-center gap-1.5 mb-1.5">
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
              Conditions de paiement
            </Label>
            <select
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus-ring"
              {...form.register("payment_terms")}
            >
              <option value="immediate">Paiement immédiat</option>
              <option value="50_percent">Acompte 50%</option>
              <option value="30_days">30 jours</option>
              <option value="60_days">60 jours</option>
              <option value="custom">Personnalisé</option>
            </select>
          </div>

          <div>
            <Label className="text-xs font-medium mb-1.5 block">Commentaires</Label>
            <Textarea {...form.register("comments")} className="h-14 text-sm" placeholder="Notes internes..." />
          </div>

          <div>
            <Label className="text-xs font-medium mb-1.5 block">Notes en-tête</Label>
            <Textarea {...form.register("header_notes")} placeholder="Notes en haut de la facture" className="h-12 text-sm" />
          </div>

          <div>
            <Label className="text-xs font-medium mb-1.5 block">Notes pied de page</Label>
            <Textarea {...form.register("footer_notes")} placeholder="Conditions générales, coordonnées bancaires..." className="h-12 text-sm" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">Template</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateSelector
            selectedTemplateId={selectedTemplateId}
            onTemplateSelect={setSelectedTemplateId}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceBasicInfo;
