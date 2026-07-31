import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink } from "lucide-react";

export const IPAY_URL = "https://i-pay.money/merchant_payment_desks/489661832415";

interface IPayButtonProps {
  label?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
  onPaid?: () => void;
}

/**
 * Bouton de paiement sécurisé iPay.
 * Ouvre le guichet marchand iPay dans un nouvel onglet isolé
 * (noopener/noreferrer pour éviter tout accès au contexte de l'app).
 */
const IPayButton = ({ label = "Payer avec i-Pay", className = "", size = "lg", onPaid }: IPayButtonProps) => {
  const handleClick = () => {
    window.open(IPAY_URL, "_blank", "noopener,noreferrer");
    onPaid?.();
  };

  return (
    <Button
      type="button"
      size={size}
      onClick={handleClick}
      className={`w-full font-semibold ${className}`}
    >
      <CreditCard className="h-5 w-5 mr-2 flex-shrink-0" />
      {label}
      <ExternalLink className="h-4 w-4 ml-2 opacity-70 flex-shrink-0" />
    </Button>
  );
};

export default IPayButton;
