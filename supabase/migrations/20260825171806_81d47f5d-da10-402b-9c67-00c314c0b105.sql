CREATE OR REPLACE FUNCTION public.guard_subscription_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF public.has_role(auth.uid(), 'admin') OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  IF EXISTS (SELECT 1 FROM public.user_subscriptions s WHERE s.user_id = NEW.user_id) THEN
    RAISE EXCEPTION 'Un abonnement existe deja pour cet utilisateur';
  END IF;
  NEW.subscription_status := 'active';
  NEW.activated_at := now();
  NEW.expires_at := now() + INTERVAL '1 month';
  RETURN NEW;
END;
$function$;