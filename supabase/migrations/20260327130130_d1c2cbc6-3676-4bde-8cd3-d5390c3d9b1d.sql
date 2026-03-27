
-- Drop existing triggers if any to avoid conflicts
DROP TRIGGER IF EXISTS update_invoice_ttc_trigger ON public.invoices;
DROP TRIGGER IF EXISTS on_invoice_notification ON public.invoices;
DROP TRIGGER IF EXISTS on_client_notification ON public.clients;
DROP TRIGGER IF EXISTS update_suppliers_updated_at ON public.suppliers;
DROP TRIGGER IF EXISTS update_invoice_templates_updated_at ON public.invoice_templates;
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON public.user_subscriptions;

-- Trigger: update TTC on invoices
CREATE TRIGGER update_invoice_ttc_trigger
  BEFORE INSERT OR UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_invoice_ttc();

-- Trigger: notifications on invoices
CREATE TRIGGER on_invoice_notification
  AFTER INSERT OR UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.create_notification();

-- Trigger: notifications on clients
CREATE TRIGGER on_client_notification
  AFTER INSERT ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.create_notification();

-- Trigger: updated_at on suppliers
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: updated_at on invoice_templates
CREATE TRIGGER update_invoice_templates_updated_at
  BEFORE UPDATE ON public.invoice_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: updated_at on user_subscriptions
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime (ignore if already added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;
