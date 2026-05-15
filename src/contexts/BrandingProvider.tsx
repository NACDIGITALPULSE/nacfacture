import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AppBranding {
  id?: string;
  app_name: string;
  tagline: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  support_email: string | null;
  support_phone: string | null;
  custom_domain: string | null;
  electron_enabled: boolean;
}

const DEFAULT_BRANDING: AppBranding = {
  app_name: "nacFacture",
  tagline: "Gestion de facturation simple et professionnelle",
  logo_url: null,
  favicon_url: null,
  primary_color: "221.2 83.2% 53.3%",
  secondary_color: "215 28% 17%",
  accent_color: "24 95% 53%",
  support_email: null,
  support_phone: null,
  custom_domain: null,
  electron_enabled: false,
};

const STORAGE_KEY = "app_branding_cache_v1";

interface Ctx {
  branding: AppBranding;
  loading: boolean;
  refresh: () => Promise<void>;
}

const BrandingContext = createContext<Ctx>({
  branding: DEFAULT_BRANDING,
  loading: true,
  refresh: async () => {},
});

function applyBranding(b: AppBranding) {
  const root = document.documentElement;
  if (b.primary_color) root.style.setProperty("--primary", b.primary_color);
  if (b.secondary_color) root.style.setProperty("--secondary", b.secondary_color);
  if (b.accent_color) root.style.setProperty("--accent", b.accent_color);
  if (b.app_name) document.title = b.app_name;
  if (b.favicon_url) {
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = b.favicon_url;
  }
}

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const cached = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_BRANDING, ...JSON.parse(raw) } : DEFAULT_BRANDING;
    } catch {
      return DEFAULT_BRANDING;
    }
  })();

  const [branding, setBranding] = useState<AppBranding>(cached);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applyBranding(cached);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    const { data } = await (supabase as any)
      .from("app_branding")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (data) {
      const merged = { ...DEFAULT_BRANDING, ...data } as AppBranding;
      setBranding(merged);
      applyBranding(merged);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {}
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    const channel = (supabase as any)
      .channel("app_branding_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_branding" },
        () => refresh()
      )
      .subscribe();
    return () => {
      (supabase as any).removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrandingContext.Provider value={{ branding, loading, refresh }}>
      {children}
    </BrandingContext.Provider>
  );
}

export const useBranding = () => useContext(BrandingContext);