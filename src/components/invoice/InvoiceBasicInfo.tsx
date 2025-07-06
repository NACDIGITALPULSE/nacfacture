
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/hooks/useClients";

interface Client {
  id: string;
  name: string;
}

interface InvoiceBasicInfoProps {
  form: UseFormReturn<any>;
}

const InvoiceBasicInfo: React.FC<InvoiceBasicInfoProps> = ({ form }) => {
  const { data: clients = [], isLoading: clientsLoading } = useClients();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm mb-1 font-medium">Client</label>
        <select
          className="w-full border rounded px-3 py-2"
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
        <Input type="date" {...form.register("date", { required: true })} />
      </div>

      <div>
        <label className="block text-sm mb-1 font-medium">Commentaires</label>
        <Textarea {...form.register("comments")} className="h-14" />
      </div>

      <div>
        <label className="block text-sm mb-1 font-medium">Conditions de paiement</label>
        <select
          className="w-full border rounded px-3 py-2"
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
        <Textarea {...form.register("header_notes")} placeholder="Notes à afficher en haut de la facture" className="h-12" />
      </div>

      <div>
        <label className="block text-sm mb-1 font-medium">Notes pied de page</label>
        <Textarea {...form.register("footer_notes")} placeholder="Conditions générales, coordonnées bancaires..." className="h-12" />
      </div>
    </div>
  );
};

export default InvoiceBasicInfo;
