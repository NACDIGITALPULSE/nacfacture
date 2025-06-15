
import React from "react";
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import { PlusCircle, FileDown } from "lucide-react";
import FactureProformaForm from "@/components/FactureProformaForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Factures = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Liste des factures proforma
  const { data: factures = [], refetch, isLoading } = useQuery({
    queryKey: ["factures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select(
          "id, status, date, total_amount, tva_total, client:clients(name), number"
        )
        .order("date", { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
      <Header />
      <TopNav />
      <main className="max-w-5xl w-full mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Mes factures</h1>
            <p className="text-gray-600">Liste de toutes vos factures créées.</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
            onClick={() => setDrawerOpen(true)}
          >
            <PlusCircle size={20} /> Nouvelle facture
          </button>
        </div>

        <FactureProformaForm
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onFactureSaved={refetch}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-blue-700">Chargement…</div>
        ) : factures.length > 0 ? (
          <div className="bg-white p-4 rounded-xl shadow mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="p-2">N°</th>
                  <th className="p-2">Client</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Statut</th>
                  <th className="p-2 text-right">Montant TTC</th>
                </tr>
              </thead>
              <tbody>
                {factures.map((f: any) => (
                  <tr key={f.id} className="border-b last:border-b-0">
                    <td className="p-2">{f.number || <span className="opacity-60">—</span>}</td>
                    <td className="p-2">{f.client?.name || <span className="opacity-60">—</span>}</td>
                    <td className="p-2">{f.date}</td>
                    <td className="p-2">
                      {f.status === "proforma" && <span className="text-yellow-600">Proforma</span>}
                      {f.status === "validated" && <span className="text-green-600">Validée</span>}
                      {f.status === "final" && <span className="text-blue-700 font-medium">Finale</span>}
                      {f.status === "paid" && <span className="text-green-700 font-bold">Payée</span>}
                      {f.status === "cancelled" && <span className="text-red-700">Annulée</span>}
                    </td>
                    <td className="p-2 text-right">{Number(f.total_amount).toLocaleString()} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow mt-3 flex flex-col items-center">
            <FileDown size={48} className="text-gray-300 mb-3" />
            <div className="text-gray-700 text-lg mb-2">Aucune facture encore créée.</div>
            <div className="text-gray-500 text-sm mb-2">Créez votre première facture ci-dessus pour démarrer.</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Factures;
