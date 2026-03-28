import React from "react";
import logoImg from "@/assets/logo-nacfacture.png";

const Logo = ({
  className = ""
}: {
  className?: string;
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img src={logoImg} alt="nacFacture" className="h-8 sm:h-10 object-contain" draggable="false" />
  </div>
);

export default Logo;
