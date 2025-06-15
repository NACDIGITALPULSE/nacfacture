
import React from "react";

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

const STRENGTHS = [
  { color: "bg-red-400", label: "Faible" },
  { color: "bg-yellow-400", label: "Moyen" },
  { color: "bg-blue-400", label: "Bon" },
  { color: "bg-green-500", label: "Fort" },
];

const PasswordStrength = ({ password }: { password: string }) => {
  if (!password) return null;
  const score = getStrength(password);
  const { color, label } = STRENGTHS[Math.max(0, Math.min(score - 1, 3))];
  return (
    <div className="mt-1 flex items-center gap-2 animate-fade-in">
      <div className={`w-20 h-2 rounded ${color} transition-all`} />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
};

export default PasswordStrength;
