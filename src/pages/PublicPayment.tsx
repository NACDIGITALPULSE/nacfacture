import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import IPayButton from "@/components/IPayButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatAmount, statusMeta } from "@/lib/invoiceStatus";

interface PublicInvoice {
  invoice_number: string | null;
  date: string;
  due_date: string | null;
  status: string;
  currency: string;
  total: number;
  amount_paid: number;
  amount_due: number;
  allow_partial_payment: boolean;
  company: { name: string; logo_url: string | null; email: string | null; phone: string | null };
  client: { name: string };
}

const PublicPayment = () => {
  const { token } = useParams<{ token: string }>();
  const [partial, setPartial] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["public-invoice", token],
    enabled: !!token,
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)("get_public_invoice", { _token: token });
      if (error) throw error;
      return (data as PublicInvoice) ?? null;
    },
  });

  React.useEffect(() => {
    if (data) {
      document.title = `Paiement facture ${data.invoice_number ?? ""} — ${data.company.name}`;
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Lien de paiement introuvable</h1>
          <p className="text-muted-foreground text-sm">
            Ce lien est invalide ou a été révoqué. Contactez l'émetteur de la facture.
          </p>
        </div>
      </div>
    );
  }

  const meta = statusMeta(data.status);
  const isPaid = data.amount_due <= 0;

  const validatePartial = () => {
    const value = Number(partial);
    if (!partial) return true;
    if (value <= 0) { setError("Le montant doit être supérieur à 0."); return false; }
    if (value > data.amount_due) { setError("Le montant dépasse le restant dû."); return false; }
    setError(null);
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 max-w-lg w-full mx-auto">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500" /> Paiement sécurisé
        </span>
        <ThemeToggle />
      </header>

      <main className="flex-1 px-4 pb-10">
        <div className="max-w-lg mx-auto bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          <div className="p-6 text-center border-b border-border">
            {data.company.logo_url ? (
              <img
                src={data.company.logo_url}
                alt={`Logo ${data.company.name}`}
                className="h-16 mx-auto object-contain mb-3"
                loading="lazy"
              />
            ) : null}
            <h1 className="text-lg font-bold text-foreground">{data.company.name}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Facture <span className="font-mono">{data.invoice_number || "—"}</span>
            </p>
            <Badge variant="outline" className={`mt-2 ${meta.className}`}>{meta.label}</Badge>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Client</span>
              <span className="font-medium text-foreground">{data.client.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date d'échéance</span>
              <span className="font-medium text-foreground">
                {data.due_date ? new Date(data.due_date).toLocaleDateString("fr-FR") : "—"}
              </span>
            </div>

            <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">Montant total</span>
                <span className="font-semibold text-foreground">{formatAmount(data.total, data.currency)}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">Déjà payé</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatAmount(data.amount_paid, data.currency)}
                </span>
              </div>
              <div className="flex justify-between px-4 py-4 bg-muted/50">
                <span className="text-sm font-semibold text-foreground">Montant restant</span>
                <span className="text-xl font-bold text-primary">
                  {formatAmount(data.amount_due, data.currency)}
                </span>
              </div>
            </div>

            {isPaid ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                  Cette facture est intégralement réglée. Merci !
                </p>
              </div>
            ) : (
              <>
                {data.allow_partial_payment && (
                  <div className="space-y-1.5">
                    <Label htmlFor="partial">Payer un montant partiel (optionnel)</Label>
                    <Input
                      id="partial"
                      type="number"
                      min="1"
                      max={data.amount_due}
                      placeholder=""
                      value={partial}
                      onChange={(e) => { setPartial(e.target.value); setError(null); }}
                      onBlur={validatePartial}
                    />
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <p className="text-[11px] text-muted-foreground">
                      Laissez vide pour régler la totalité du restant dû.
                    </p>
                  </div>
                )}

                <IPayButton
                  label={`Payer ${formatAmount(partial ? Number(partial) : data.amount_due, data.currency)}`}
                  onPaid={validatePartial}
                />

                <p className="text-[11px] text-center text-muted-foreground">
                  Après paiement, conservez votre référence de transaction. Votre reçu vous sera transmis
                  dès confirmation par {data.company.name}.
                </p>
              </>
            )}
          </div>

          {(data.company.email || data.company.phone) && (
            <footer className="px-6 py-4 border-t border-border text-center text-xs text-muted-foreground">
              Une question ? {data.company.email} {data.company.phone ? `• ${data.company.phone}` : ""}
            </footer>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublicPayment;
