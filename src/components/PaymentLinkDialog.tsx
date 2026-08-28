import React from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Check, MessageCircle, Download, Link2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { paymentLink, formatAmount } from "@/lib/invoiceStatus";

interface PaymentLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: {
    number?: string | null;
    public_token?: string | null;
    amount_due?: number;
    client_name?: string | null;
    client_phone?: string | null;
  } | null;
  currency?: string;
}

const PaymentLinkDialog: React.FC<PaymentLinkDialogProps> = ({ open, onOpenChange, invoice, currency = "FCFA" }) => {
  const [copied, setCopied] = React.useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);

  if (!invoice?.public_token) return null;
  const url = paymentLink(invoice.public_token);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "Lien copié", description: "Le lien de paiement est dans le presse-papiers." });
    setTimeout(() => setCopied(false), 2000);
  };

  const sendWhatsApp = () => {
    const message =
      `Bonjour ${invoice.client_name || ""},\n\n` +
      `Veuillez trouver votre facture ${invoice.number || ""}.\n\n` +
      `Montant à payer : ${formatAmount(invoice.amount_due ?? 0, currency)}\n\n` +
      `Vous pouvez consulter et payer votre facture ici :\n${url}\n\nMerci.`;
    const phone = (invoice.client_phone || "").replace(/\D/g, "");
    const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
    window.open(`${base}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const downloadQr = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `QR-${invoice.number || "facture"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" /> Lien de paiement sécurisé
          </DialogTitle>
          <DialogDescription>
            Partagez ce lien ou ce QR Code avec votre client. Aucune connexion n'est requise de sa part.
          </DialogDescription>
        </DialogHeader>

        <div ref={qrRef} className="flex justify-center rounded-xl border border-border bg-white p-5">
          <QRCodeCanvas value={url} size={190} level="M" includeMargin />
        </div>

        <div className="flex gap-2">
          <Input readOnly value={url} className="font-mono text-xs" onFocus={(e) => e.currentTarget.select()} />
          <Button variant="outline" size="icon" onClick={copy} className="shrink-0">
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={downloadQr}>
            <Download className="h-4 w-4 mr-2" /> QR Code
          </Button>
          <Button onClick={sendWhatsApp}>
            <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentLinkDialog;
