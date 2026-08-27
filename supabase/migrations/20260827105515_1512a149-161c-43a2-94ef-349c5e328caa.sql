-- 1. Enum extensions
ALTER TYPE public.invoice_status ADD VALUE IF NOT EXISTS 'sent';
ALTER TYPE public.invoice_status ADD VALUE IF NOT EXISTS 'partially_paid';
ALTER TYPE public.invoice_status ADD VALUE IF NOT EXISTS 'overdue';

-- 2. Invoice extensions
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS due_date date,
  ADD COLUMN IF NOT EXISTS amount_paid numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS allow_partial_payment boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS public_token text;

UPDATE public.invoices SET public_token = encode(gen_random_bytes(24), 'hex') WHERE public_token IS NULL;
ALTER TABLE public.invoices ALTER COLUMN public_token SET DEFAULT encode(gen_random_bytes(24), 'hex');
CREATE UNIQUE INDEX IF NOT EXISTS invoices_public_token_key ON public.invoices(public_token);

-- 3. Quote extensions
ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS expires_at date,
  ADD COLUMN IF NOT EXISTS converted_invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL;

-- 4. Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'FCFA',
  payment_method text NOT NULL DEFAULT 'cash',
  provider text,
  provider_transaction_id text,
  status text NOT NULL DEFAULT 'success',
  payment_reference text,
  notes text,
  paid_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage payments of their invoices" ON public.payments
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND invoice_id IN (SELECT id FROM public.invoices WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS payments_invoice_id_idx ON public.payments(invoice_id);
CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_tx_key ON public.payments(provider, provider_transaction_id) WHERE provider_transaction_id IS NOT NULL;

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Receipts
CREATE TABLE IF NOT EXISTS public.receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  payment_id uuid NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  number text,
  amount numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.receipts TO authenticated;
GRANT ALL ON public.receipts TO service_role;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their receipts" ON public.receipts
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 6. Recompute invoice totals + status on payment change
CREATE OR REPLACE FUNCTION public.recalc_invoice_payment_state()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _invoice_id uuid;
  _paid numeric;
  _total numeric;
  _due date;
  _status text;
BEGIN
  _invoice_id := COALESCE(NEW.invoice_id, OLD.invoice_id);

  SELECT COALESCE(SUM(amount), 0) INTO _paid
  FROM public.payments WHERE invoice_id = _invoice_id AND status = 'success';

  SELECT COALESCE(ttc_amount, total_amount + tva_total), due_date, status::text
    INTO _total, _due, _status
  FROM public.invoices WHERE id = _invoice_id;

  IF _status NOT IN ('cancelled', 'proforma') THEN
    IF _paid >= _total AND _total > 0 THEN
      _status := 'paid';
    ELSIF _paid > 0 THEN
      _status := 'partially_paid';
    ELSIF _due IS NOT NULL AND _due < CURRENT_DATE THEN
      _status := 'overdue';
    ELSIF _status IN ('paid', 'partially_paid', 'overdue') THEN
      _status := 'sent';
    END IF;
  END IF;

  UPDATE public.invoices
    SET amount_paid = _paid,
        status = _status::public.invoice_status
  WHERE id = _invoice_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.recalc_invoice_payment_state() FROM anon, authenticated;

CREATE TRIGGER payments_recalc_invoice
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.recalc_invoice_payment_state();

-- 7. Public payment page lookup by secure token
CREATE OR REPLACE FUNCTION public.get_public_invoice(_token text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT jsonb_build_object(
    'invoice_number', i.number,
    'date', i.date,
    'due_date', i.due_date,
    'status', i.status,
    'currency', COALESCE(co.currency, 'FCFA'),
    'total', COALESCE(i.ttc_amount, i.total_amount + i.tva_total),
    'amount_paid', i.amount_paid,
    'amount_due', GREATEST(COALESCE(i.ttc_amount, i.total_amount + i.tva_total) - i.amount_paid, 0),
    'allow_partial_payment', i.allow_partial_payment,
    'company', jsonb_build_object('name', co.name, 'logo_url', co.logo_url, 'email', co.email, 'phone', co.phone),
    'client', jsonb_build_object('name', cl.name)
  )
  FROM public.invoices i
  JOIN public.companies co ON co.id = i.company_id
  JOIN public.clients cl ON cl.id = i.client_id
  WHERE i.public_token = _token
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_invoice(text) TO anon, authenticated;