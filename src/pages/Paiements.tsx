import React from "react";
import Header from "@/components/Header";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import LoadingState from "@/components/ui/loading-state";
import ExportButton from "@/components/ExportButton";
import PaymentDialog from "@/components/PaymentDialog";
import ReminderPanel from "@/components/ReminderPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Wallet, TrendingUp, Clock, Receipt, PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePayments } from "@/hooks/usePayments";
import { formatAmount, paymentMethodLabel, computeAmounts, effectiveStatus, statusMeta } from "@/lib/invoiceStatus";

const Paiements = () => {
  const [search, setSearch] = React.useState("");
  const [selectedInvoice, setSelectedInvoice] = React.useState<any>(null);

  const { data: payments = [], isLoading } = usePayments();

  const { data: openInvoices = [] } = useQuery({
    queryKey: ["invoices", "open"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("id, number, date, due_date, status, total_amount, tva_total, ttc_amount, amount_paid, clients(name)")
        .neq("status", "cancelled")
        .order("date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const outstanding = openInvoices.filter((i: any) => computeAmounts(i).due > 0);
  const totalReceived = payments.reduce((s: number, p: any) => s + Number(p.amount), 0);
  const totalDue = outstanding.reduce((s: number, i: any) => s + computeAmounts(i).due, 0);
  const overdueCount = outstanding.filter((i: any) => effectiveStatus(i) === "overdue").length;

  const filtered = payments.filter((p: any) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.invoices?.number?.toLowerCase().includes(q) ||
      p.invoices?.clients?.name?.toLowerCase().includes(q) ||
      p.payment_reference?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <TopNav />
      <main className="max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 flex-1">
        <div className="flex items-center gap-2 mb-4"><BackButton /></div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Paiements</h1>
            <p className="text-sm text-muted-foreground">Encaissements, paiements partiels et suivi des impayés.</p>
          </div>
          <ExportButton
            data={payments.map((p: any) => ({
              date: new Date(p.paid_at).toLocaleDateString("fr-FR"),
              invoice: p.invoices?.number || "",
              client: p.invoices?.clients?.name || "",
              method: paymentMethodLabel(p.payment_method),
              reference: p.payment_reference || "",
              amount: Number(p.amount),
            }))}
            columns={[
              { key: "date", label: "Date" },
              { key: "invoice", label: "Facture" },
              { key: "client", label: "Client" },
              { key: "method", label: "Méthode" },
              { key: "reference", label: "Référence" },
              { key: "amount", label: "Montant" },
            ]}
            filename="paiements.csv"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
          <div className="bg-card p-3 sm:p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Total encaissé</span>
            </div>
            <div className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalReceived.toLocaleString("fr-FR")}
            </div>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Restant à recevoir</span>
            </div>
            <div className="text-base sm:text-xl font-bold text-amber-600 dark:text-amber-400">
              {totalDue.toLocaleString("fr-FR")}
            </div>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Paiements</span>
            </div>
            <div className="text-base sm:text-xl font-bold text-foreground">{payments.length}</div>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">En retard</span>
            </div>
            <div className="text-base sm:text-xl font-bold text-destructive">{overdueCount}</div>
          </div>
        </div>

        {/* Factures à encaisser */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-3">Factures à encaisser ({outstanding.length})</h2>
          {outstanding.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <Wallet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucun montant en attente. Tout est réglé.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {outstanding.slice(0, 8).map((inv: any) => {
                const a = computeAmounts(inv);
                const meta = statusMeta(effectiveStatus(inv));
                const progress = a.total > 0 ? Math.round((a.paid / a.total) * 100) : 0;
                return (
                  <div key={inv.id} className="bg-card rounded-xl border border-border p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[11px] text-muted-foreground">{inv.number || "—"}</span>
                          <Badge variant="outline" className={`text-[10px] ${meta.className}`}>{meta.label}</Badge>
                        </div>
                        <p className="font-semibold text-sm text-foreground truncate mt-0.5">{inv.clients?.name || "—"}</p>
                        <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {formatAmount(a.paid)} payé sur {formatAmount(a.total)} — restant {formatAmount(a.due)}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => setSelectedInvoice(inv)} className="shrink-0">
                        <PlusCircle className="h-4 w-4 sm:mr-1.5" />
                        <span className="hidden sm:inline">Encaisser</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Historique */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">Historique des paiements</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par facture, client ou référence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <LoadingState type="table" count={6} />
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <Receipt className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucun paiement enregistré pour le moment.</p>
            </div>
          ) : (
            <>
              <div className="hidden sm:block bg-card rounded-xl border border-border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-semibold">Date</TableHead>
                      <TableHead className="text-xs font-semibold">Facture</TableHead>
                      <TableHead className="text-xs font-semibold">Client</TableHead>
                      <TableHead className="text-xs font-semibold">Méthode</TableHead>
                      <TableHead className="text-xs font-semibold">Référence</TableHead>
                      <TableHead className="text-right text-xs font-semibold">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p: any) => (
                      <TableRow key={p.id} className="hover:bg-muted/30">
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(p.paid_at).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{p.invoices?.number || "—"}</TableCell>
                        <TableCell className="text-sm font-medium">{p.invoices?.clients?.name || "—"}</TableCell>
                        <TableCell className="text-sm">{paymentMethodLabel(p.payment_method)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.payment_reference || "—"}</TableCell>
                        <TableCell className="text-right font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                          {formatAmount(Number(p.amount), p.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="sm:hidden flex flex-col gap-2.5">
                {filtered.map((p: any) => (
                  <div key={p.id} className="bg-card rounded-xl border border-border p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] text-muted-foreground">{p.invoices?.number || "—"}</p>
                        <p className="font-semibold text-sm truncate text-foreground">{p.invoices?.clients?.name || "—"}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {paymentMethodLabel(p.payment_method)} • {new Date(p.paid_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        {formatAmount(Number(p.amount), p.currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <PaymentDialog
        open={!!selectedInvoice}
        onOpenChange={(o) => !o && setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />

      <Footer />
      <div className="h-16 lg:hidden" />
    </div>
  );
};

export default Paiements;
