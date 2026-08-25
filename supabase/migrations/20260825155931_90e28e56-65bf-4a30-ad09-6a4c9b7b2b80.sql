CREATE OR REPLACE FUNCTION public.guard_chat_message_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _is_admin boolean;
BEGIN
  _is_admin := public.has_role(auth.uid(), 'admin');
  NEW.is_admin := COALESCE(_is_admin, false);
  IF NOT COALESCE(_is_admin, false) AND NEW.sender_name = 'Support NAC' THEN
    NEW.sender_name := 'Utilisateur';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.guard_chat_message_insert() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS guard_chat_message_insert_trg ON public.chat_messages;
CREATE TRIGGER guard_chat_message_insert_trg
BEFORE INSERT ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION public.guard_chat_message_insert();