import React from "react";
const Logo = ({
  className = ""
}: {
  className?: string;
}) => <div className={`flex flex-col items-center gap-1 mb-4 ${className}`}>
    <img src="/placeholder.svg" alt="Facture 227" className="h-12 w-12 rounded-full shadow" draggable="false" />
    <span className="font-extrabold tracking-wide text-blue-700 text-xl">FACTURE DIGITAL</span>
  </div>;
export default Logo;