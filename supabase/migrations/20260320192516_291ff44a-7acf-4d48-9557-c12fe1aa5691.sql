
-- Attach trigger for new user subscription on signup
CREATE OR REPLACE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- Attach trigger for notifications on invoices
CREATE OR REPLACE TRIGGER on_invoice_change_notification
  AFTER INSERT OR UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.create_notification();

-- Attach trigger for notifications on clients
CREATE OR REPLACE TRIGGER on_client_insert_notification
  AFTER INSERT ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.create_notification();

-- Admin RLS on user_subscriptions: allow admins to view all
CREATE POLICY "Admins can view all subscriptions"
  ON public.user_subscriptions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin RLS on user_subscriptions: allow admins to update all
CREATE POLICY "Admins can update all subscriptions"
  ON public.user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
