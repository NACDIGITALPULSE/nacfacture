import React from "react";
import logoImg from "@/assets/logo-nacfacture.png";

const Footer = () => (
  <footer className="bg-card border-t border-border py-4 mt-auto">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <img src={logoImg} alt="nacFacture" className="h-16 sm:h-20 object-contain" draggable="false" />
      </div>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} nacFacture. Tous droits réservés.
      </p>
    </div>
  </footer>
);

export default Footer;
