
-- Table de branding global de la plateforme (White Label)
CREATE TABLE IF NOT EXISTS public.app_branding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name text NOT NULL DEFAULT 'nacFacture',
  tagline text DEFAULT 'Gestion de facturation simple et professionnelle',
  logo_url text,
  favicon_url text,
  primary_color text NOT NULL DEFAULT '221 83% 53%',
  secondary_color text NOT NULL DEFAULT '215 28% 17%',
  accent_color text NOT NULL DEFAULT '24 95% 53%',
  support_email text,
  support_phone text,
  custom_domain text,
  electron_enabled boolean NOT NULL DEFAULT false,
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read branding"
  ON public.app_branding FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert branding"
  ON public.app_branding FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update branding"
  ON public.app_branding FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_app_branding_updated_at
  BEFORE UPDATE ON public.app_branding
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insère la ligne par défaut
INSERT INTO public.app_branding (app_name) VALUES ('nacFacture')
ON CONFLICT DO NOTHING;

-- Extension table companies pour branding par tenant
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS brand_primary text,
  ADD COLUMN IF NOT EXISTS brand_secondary text,
  ADD COLUMN IF NOT EXISTS brand_app_name text;

-- Realtime
ALTER TABLE public.app_branding REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_branding;
