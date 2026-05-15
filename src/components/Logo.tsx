import React from "react";
import logoImg from "@/assets/logo-nacfacture.png";
import { useBranding } from "@/contexts/BrandingProvider";

const Logo = ({
  className = ""
}: {
  className?: string;
}) => {
  const { branding } = useBranding();
  const src = branding.logo_url || logoImg;
  const name = branding.app_name || "nacFacture";
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={src} alt={name} className="h-20 sm:h-24 object-contain" draggable="false" />
    </div>
  );
};

export default Logo;
