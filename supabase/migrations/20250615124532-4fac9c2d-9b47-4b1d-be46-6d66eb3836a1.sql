
-- Table des entreprises
CREATE TABLE public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    address text,
    phone text,
    email text,
    logo_url text,
    signature_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table des clients
CREATE TABLE public.clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    address text,
    phone text,
    email text,
    created_at timestamptz DEFAULT now()
);

-- Table des produits/services
CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    tva numeric DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Table factures (inclut proforma, finale, etc.)
CREATE TYPE invoice_status AS ENUM ('proforma', 'validated', 'final', 'paid', 'cancelled');

CREATE TABLE public.invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
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

-- Table des lignes de facture
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

-- Table des devis générés automatiquement
CREATE TABLE public.quotes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    number text,
    date date DEFAULT CURRENT_DATE,
    total_amount numeric NOT NULL DEFAULT 0,
    comments text,
    created_at timestamptz DEFAULT now()
);

-- Table des bons de livraison générés automatiquement
CREATE TABLE public.delivery_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    number text,
    date date DEFAULT CURRENT_DATE,
    comments text,
    created_at timestamptz DEFAULT now()
);

-- RLS : chaque utilisateur ne voit que ses propres données (exemple pour la table invoices)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their company profile" ON public.companies
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their clients" ON public.clients
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their products" ON public.products
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their invoices" ON public.invoices
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their invoice items" ON public.invoice_items
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

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their quotes" ON public.quotes
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE public.delivery_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their delivery notes" ON public.delivery_notes
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
