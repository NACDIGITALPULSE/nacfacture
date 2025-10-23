-- Fonction pour créer automatiquement un abonnement gratuit d'1 mois lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Créer un abonnement gratuit d'1 mois pour le nouvel utilisateur
  INSERT INTO public.user_subscriptions (
    user_id,
    activated_at,
    expires_at,
    subscription_status,
    payment_method
  )
  VALUES (
    NEW.id,
    NOW(),
    NOW() + INTERVAL '1 month',
    'active',
    'free_trial'
  );
  
  RETURN NEW;
END;
$$;

-- Trigger pour créer automatiquement l'abonnement lors de l'inscription
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- Fonction pour vérifier si un utilisateur a un abonnement actif
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_subscriptions
    WHERE user_id = _user_id
      AND subscription_status = 'active'
      AND expires_at > NOW()
  );
$$;