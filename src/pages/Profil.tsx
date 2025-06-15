import React from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import CompanyProfileForm from "@/components/CompanyProfileForm";

const ProfilPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto pt-6">
      <CompanyProfileForm />
    </div>
  );
};

export default ProfilPage;
