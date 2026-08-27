import React from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Trash2, Wallet } from "lucide-react";
import { useInvoicePayments, useRecordPayment, useDeletePayment } from "@/hooks/usePayments";
import { PAYMENT_METHODS, paymentMethodLabel, formatAmount, computeAmounts } from "@/lib/invoiceStatus";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: {
    id: string;
    number?: string | null;
    ttc_amount?: number | null;
    total_amount?: number | null;
    tva_total?: number | null;
    amount_paid?: number | null;
  } | null;
  currency?: string;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onOpenChange, invoice, currency = "FCFA" }) => {
  const { data: payments = [] } = useInvoicePayments(invoice?.id);
  const recordPayment = useRecordPayment();
  const deletePayment = useDeletePayment();

  const [amount, setAmount] = React.useState("");
  const [method, setMethod] = React.useState<string>("cash");
  const [reference, setReference] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const amounts = invoice ? computeAmounts(invoice) : { total: 0, paid: 0, due: 0 };

  React.useEffect(() => {
    if (open) {
      setAmount("");
      setReference("");
      setNotes("");
      setMethod("cash");
    }
  }, [open, invoice?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;
    recordPayment.mutate(
      {
        invoice_id: invoice.id,
        amount: Number(amount),
        currency,
        payment_method: method,
        payment_reference: reference,
        notes,
      },
      { onSuccess: () => { setAmount(""); setReference(""); setNotes(""); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Paiements — {invoice?.number || "Facture"}
          </DialogTitle>
          <DialogDescription>
            Enregistrez un paiement total ou partiel. Les montants et le statut sont recalculés automatiquement.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="text-[11px] text-muted-foreground">Total</p>
            <p className="text-sm font-bold text-foreground">{formatAmount(amounts.total, currency)}</p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
            <p className="text-[11px] text-muted-foreground">Payé</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatAmount(amounts.paid, currency)}</p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-[11px] text-muted-foreground">Restant dû</p>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{formatAmount(amounts.due, currency)}</p>
          </div>
        </div>

        {amounts.due > 0 && (
          <form onSubmit={handleSubmit} className="space-y-3 border-t border-border pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pay-amount">Montant *</Label>
                <Input
                  id="pay-amount"
                  type="number"
                  min="1"
                  max={amounts.due}
                  step="any"
                  required
                  placeholder=""
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  type="button"
                  className="text-[11px] text-primary hover:underline"
                  onClick={() => setAmount(String(amounts.due))}
                >
                  Solder la facture ({formatAmount(amounts.due, currency)})
                </button>
              </div>
              <div className="space-y-1.5">
                <Label>Méthode *</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pay-ref">Référence de transaction</Label>
              <Input id="pay-ref" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="N° de reçu, transaction Mobile Money..." />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pay-notes">Notes</Label>
              <Textarea id="pay-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <Button type="submit" className="w-full" disabled={recordPayment.isPending || !amount}>
              {recordPayment.isPending ? "Enregistrement..." : "Enregistrer le paiement"}
            </Button>
          </form>
        )}

        <div className="border-t border-border pt-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Historique des paiements ({payments.length})
          </p>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Aucun paiement enregistré.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {payments.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{formatAmount(Number(p.amount), p.currency)}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {paymentMethodLabel(p.payment_method)} • {new Date(p.paid_at).toLocaleDateString("fr-FR")}
                      {p.payment_reference ? ` • ${p.payment_reference}` : ""}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive shrink-0"
                    onClick={() => deletePayment.mutate(p.id)}
                    disabled={deletePayment.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
