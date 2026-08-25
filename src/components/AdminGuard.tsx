import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";

/**
 * Protège les routes d'administration.
 * Le rôle est vérifié côté serveur (fonction has_role + RLS) via AuthProvider.
 */
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin, adminChecked } = useAuth();

  if (loading || (user && !adminChecked)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin-login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminGuard;
