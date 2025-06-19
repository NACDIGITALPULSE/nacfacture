
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
    </div>
  );
};

export default InvoiceBasicInfo;
