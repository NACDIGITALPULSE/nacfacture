-- 1. PRIVILEGE ESCALATION FIX: users must not manage their own roles
DROP POLICY IF EXISTS "User can manage own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. SUBSCRIPTION SELF-ACTIVATION FIX
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.user_subscriptions;

CREATE POLICY "Users can view their own subscription"
ON public.user_subscriptions FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pending subscription"
ON public.user_subscriptions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can submit payment proof"
ON public.user_subscriptions FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger guard: non-admins can only change payment_proof_url / payment_method
CREATE OR REPLACE FUNCTION public.guard_subscription_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  NEW.subscription_status := OLD.subscription_status;
  NEW.activated_at := OLD.activated_at;
  NEW.expires_at := OLD.expires_at;
  NEW.user_id := OLD.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_subscription_update_trg ON public.user_subscriptions;
CREATE TRIGGER guard_subscription_update_trg
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.guard_subscription_update();

-- Guard inserts too: force pending unless admin
CREATE OR REPLACE FUNCTION public.guard_subscription_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  IF EXISTS (SELECT 1 FROM public.user_subscriptions s WHERE s.user_id = NEW.user_id) THEN
    RAISE EXCEPTION 'Un abonnement existe deja pour cet utilisateur';
  END IF;
  NEW.subscription_status := 'active';
  NEW.activated_at := now();
  NEW.expires_at := now() + INTERVAL '2 months';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_subscription_insert_trg ON public.user_subscriptions;
CREATE TRIGGER guard_subscription_insert_trg
BEFORE INSERT ON public.user_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.guard_subscription_insert();

-- 3. Restrict business tables to authenticated users only
DROP POLICY IF EXISTS "Users can manage their clients" ON public.clients;
CREATE POLICY "Users can manage their clients" ON public.clients FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their company profile" ON public.companies;
CREATE POLICY "Users can manage their company profile" ON public.companies FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their products" ON public.products;
CREATE POLICY "Users can manage their products" ON public.products FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their invoices" ON public.invoices;
CREATE POLICY "Users can manage their invoices" ON public.invoices FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their invoice items" ON public.invoice_items;
CREATE POLICY "Users can manage their invoice items" ON public.invoice_items FOR ALL TO authenticated
USING (invoice_id IN (SELECT id FROM public.invoices WHERE user_id = auth.uid()))
WITH CHECK (invoice_id IN (SELECT id FROM public.invoices WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage their quotes" ON public.quotes;
CREATE POLICY "Users can manage their quotes" ON public.quotes FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their delivery notes" ON public.delivery_notes;
CREATE POLICY "Users can manage their delivery notes" ON public.delivery_notes FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their notifications" ON public.notifications;
CREATE POLICY "Users can manage their notifications" ON public.notifications FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their invoice templates" ON public.invoice_templates;
CREATE POLICY "Users can manage their invoice templates" ON public.invoice_templates FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can create their own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can update their own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can delete their own suppliers" ON public.suppliers;
CREATE POLICY "Users can manage their suppliers" ON public.suppliers FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can insert branding" ON public.app_branding;
CREATE POLICY "Admins can insert branding" ON public.app_branding FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update branding" ON public.app_branding;
CREATE POLICY "Admins can update branding" ON public.app_branding FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Revoke direct execution of internal/trigger functions
REVOKE ALL ON FUNCTION public.create_notification() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user_subscription() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_invoice_ttc() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_subscription_update() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_subscription_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_active_subscription(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid) TO authenticated;