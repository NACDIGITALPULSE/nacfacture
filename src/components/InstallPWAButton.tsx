import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "nacfacture-pwa-install-dismissed";

const InstallPWAButton = () => {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as any).standalone === true;
    if (standalone) return;

    const dismissed = localStorage.getItem(DISMISS_KEY);
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua);
    setIsIOS(ios);

    // iOS n'expose pas beforeinstallprompt → afficher l'aide manuelle
    if (ios && !dismissed) {
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      if (!dismissed) setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installed = () => {
      setVisible(false);
      setDeferred(null);
      toast({ title: "Application installée", description: "nacFacture est désormais sur votre écran d'accueil." });
    };
    window.addEventListener("appinstalled", installed);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSHelp(true);
      return;
    }
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
    }
    setDeferred(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setShowIOSHelp(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-card border border-border shadow-xl rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg shrink-0">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-card-foreground text-sm">Installer nacFacture</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isIOS
                ? "Ajoutez l'app à votre écran d'accueil pour un accès rapide."
                : "Accédez à l'app comme une application native, même hors connexion."}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground p-1"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {showIOSHelp && isIOS && (
          <div className="text-xs bg-muted rounded-lg p-3 text-muted-foreground space-y-1">
            <p>1. Appuyez sur <span className="font-semibold">Partager</span> dans Safari</p>
            <p>2. Choisissez <span className="font-semibold">« Sur l'écran d'accueil »</span></p>
            <p>3. Confirmez avec <span className="font-semibold">Ajouter</span></p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleInstall} size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            {isIOS ? "Comment installer" : "Installer l'app"}
          </Button>
          <Button onClick={handleDismiss} size="sm" variant="ghost">
            Plus tard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWAButton;