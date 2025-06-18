
-- 1. Création d'un type enum pour les rôles utilisateur
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Table de liaison utilisateurs <-> rôles
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- 3. Table des entreprises
CREATE TABLE public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    address text,
    phone text,
    email text,
    logo_url text,
    signature_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (user_id)
);

-- 4. Table des clients
CREATE TABLE public.clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    address text,
    phone text,
    email text,
    created_at timestamptz DEFAULT now()
);

-- 5. Table des produits/services
CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    tva numeric DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- 6. Table des factures (inclut proforma, finale, etc.)
CREATE TYPE public.invoice_status AS ENUM ('proforma', 'validated', 'final', 'paid', 'cancelled');

CREATE TABLE public.invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    client_id uuid NOT NULL REFERENCES public.clients(id),
    company_id uuid NOT NULL REFERENCES public.companies(id),
    status invoice_status NOT NULL DEFAULT 'proforma',
    number text,
    date date NOT NULL DEFAULT CURRENT_DATE,
    total_amount numeric NOT NULL DEFAULT 0,
    tva_total numeric NOT NULL DEFAULT 0,
    comments text,
    created_at timestamptz DEFAULT now()
);

-- 7. Table des lignes de facture
CREATE TABLE public.invoice_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id),
    description text,
    quantity numeric NOT NULL,
    unit_price numeric NOT NULL,
    tva numeric DEFAULT 0,
    total numeric NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 8. Table des devis générés automatiquement
CREATE TABLE public.quotes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    number text,
    date date DEFAULT CURRENT_DATE,
    total_amount numeric NOT NULL DEFAULT 0,
    comments text,
    created_at timestamptz DEFAULT now()
);

-- 9. Table des bons de livraison générés automatiquement
CREATE TABLE public.delivery_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    number text,
    date date DEFAULT CURRENT_DATE,
    comments text,
    created_at timestamptz DEFAULT now()
);

-- 10. Création du bucket de stockage pour les assets d'entreprise
INSERT INTO storage.buckets (id, name, public) 
VALUES ('company-assets', 'company-assets', true);

-- 11. Fonction sécurité pour vérifier le rôle d'un utilisateur (évite récursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- 12. Activation de Row Level Security (RLS) sur toutes les tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_notes ENABLE ROW LEVEL SECURITY;

-- 13. Policies pour user_roles
CREATE POLICY "User can manage own roles"
    ON public.user_roles
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
    ON public.user_roles
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 14. Policies pour companies
CREATE POLICY "Users can manage their company profile" 
    ON public.companies
    FOR ALL
    USING (user_id = auth.uid()) 
    WITH CHECK (user_id = auth.uid());

-- 15. Policies pour clients
CREATE POLICY "Users can manage their clients" 
    ON public.clients
    FOR ALL
    USING (user_id = auth.uid()) 
    WITH CHECK (user_id = auth.uid());

-- 16. Policies pour products
CREATE POLICY "Users can manage their products" 
    ON public.products
    FOR ALL
    USING (user_id = auth.uid()) 
    WITH CHECK (user_id = auth.uid());

-- 17. Policies pour invoices
CREATE POLICY "Users can manage their invoices" 
    ON public.invoices
    FOR ALL
    USING (user_id = auth.uid()) 
    WITH CHECK (user_id = auth.uid());

-- 18. Policies pour invoice_items
CREATE POLICY "Users can manage their invoice items" 
    ON public.invoice_items
    FOR ALL
    USING (
      invoice_id IN (
        SELECT id FROM public.invoices WHERE user_id = auth.uid()
      )
    )
    WITH CHECK (
      invoice_id IN (
        SELECT id FROM public.invoices WHERE user_id = auth.uid()
      )
    );

-- 19. Policies pour quotes
CREATE POLICY "Users can manage their quotes" 
    ON public.quotes
    FOR ALL
    USING (user_id = auth.uid()) 
    WITH CHECK (user_id = auth.uid());

-- 20. Policies pour delivery_notes
CREATE POLICY "Users can manage their delivery notes" 
    ON public.delivery_notes
    FOR ALL
    USING (user_id = auth.uid()) 
    WITH CHECK (user_id = auth.uid());

-- 21. Policies pour storage.objects (bucket company-assets)
CREATE POLICY "Users can upload their own company assets"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'company-assets' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own company assets"
    ON storage.objects FOR SELECT
    USING (
      bucket_id = 'company-assets' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own company assets"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'company-assets' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own company assets"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'company-assets' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
