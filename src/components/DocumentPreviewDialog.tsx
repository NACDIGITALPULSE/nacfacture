import React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, X } from "lucide-react";
import { fetchDocumentData } from "@/utils/documentDataFetcher";
import { generateDocumentHTML } from "@/utils/documentHtmlGenerator";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  documentId: string | null;
  documentType: "invoice" | "quote" | "delivery_note";
  documentNumber?: string;
}

const DocumentPreviewDialog: React.FC<Props> = ({ open, onOpenChange, documentId, documentType, documentNumber }) => {
  const [html, setHtml] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (!open || !documentId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchDocumentData(documentId, documentType);
        const generated = generateDocumentHTML(data, documentType, documentNumber || documentId);
        if (!cancelled) setHtml(generated);
      } catch (e: any) {
        toast({ title: "Erreur d'aperçu", description: e.message, variant: "destructive" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open, documentId, documentType, documentNumber]);

  const handlePrint = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-5 py-3 border-b border-border flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base">Aperçu avant impression {documentNumber ? `— ${documentNumber}` : ""}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden bg-muted/30">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              title="Aperçu"
              srcDoc={html}
              className="w-full h-full bg-white border-0"
            />
          )}
        </div>
        <DialogFooter className="px-5 py-3 border-t border-border flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" /> Fermer
          </Button>
          <Button onClick={handlePrint} disabled={loading || !html}>
            <Printer className="h-4 w-4 mr-2" /> Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;