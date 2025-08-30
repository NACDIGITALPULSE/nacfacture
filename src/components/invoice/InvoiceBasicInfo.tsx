
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClients } from "@/hooks/useClients";
import TemplateSelector from "@/components/TemplateSelector";

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
    <div className="space-y-6">
      {/* Informations de base */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="gradient-text">Informations de base</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Client</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus-ring"
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
            <label className="block text-sm mb-1 font-medium">Date</label>
            <Input type="date" {...form.register("date", { required: true })} className="focus-ring" />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Commentaires</label>
            <Textarea {...form.register("comments")} className="h-14 focus-ring" />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Conditions de paiement</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus-ring"
              {...form.register("payment_terms")}
            >
              <option value="immediate">Paiement immédiat</option>
              <option value="50_percent">Acompte 50%</option>
              <option value="30_days">30 jours</option>
              <option value="custom">Personnalisé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Notes en-tête</label>
            <Textarea {...form.register("header_notes")} placeholder="Notes à afficher en haut de la facture" className="h-12 focus-ring" />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Notes pied de page</label>
            <Textarea {...form.register("footer_notes")} placeholder="Conditions générales, coordonnées bancaires..." className="h-12 focus-ring" />
          </div>
        </CardContent>
      </Card>

      {/* Sélection de template */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="gradient-text">Template de facture</CardTitle>
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
