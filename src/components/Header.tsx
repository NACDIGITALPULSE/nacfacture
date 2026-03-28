
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User, Menu, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Logo from "./Logo";
import NotificationCenter from "./NotificationCenter";
import MobileNavDrawer from "./MobileNavDrawer";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = location.pathname === "/";

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="bg-card shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-1">
            {/* Back button - mobile only, not on home */}
            {!isHome && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            {/* Hamburger menu - mobile only */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Logo />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <>
                <NotificationCenter />
                <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="max-w-[150px] truncate">{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs sm:text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <MobileNavDrawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </header>
  );
};

export default Header;
