REVOKE EXECUTE ON FUNCTION public.create_notification() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_chat_message_insert() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_subscription_insert() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_subscription_update() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_subscription() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalc_invoice_payment_state() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_invoice_ttc() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_active_subscription(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_public_invoice(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_invoice(text) TO anon, authenticated;