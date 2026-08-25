-- 1. Lock down SECURITY DEFINER functions: trigger functions must not be callable via the API
REVOKE ALL ON FUNCTION public.create_notification() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_chat_message_insert() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_subscription_insert() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_subscription_update() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user_subscription() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.update_invoice_ttc() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;

-- 2. Helper functions: signed-in users only (anon must not probe roles/subscriptions)
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.has_active_subscription(uuid) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid) TO authenticated;