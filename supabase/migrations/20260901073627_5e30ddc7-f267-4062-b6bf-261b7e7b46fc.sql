CREATE TABLE public.invoice_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  level text NOT NULL DEFAULT 'courtesy',
  channel text NOT NULL DEFAULT 'whatsapp',
  message text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_reminders TO authenticated;
GRANT ALL ON public.invoice_reminders TO service_role;

ALTER TABLE public.invoice_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their invoice reminders"
ON public.invoice_reminders FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid() AND invoice_id IN (SELECT id FROM public.invoices WHERE user_id = auth.uid()));

CREATE INDEX idx_invoice_reminders_invoice ON public.invoice_reminders(invoice_id);
CREATE INDEX idx_invoice_reminders_user ON public.invoice_reminders(user_id, sent_at DESC);