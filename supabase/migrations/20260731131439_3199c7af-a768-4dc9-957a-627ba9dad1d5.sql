DROP POLICY IF EXISTS "Utilisateurs authentifiés peuvent voir tous les messages" ON public.chat_messages;

CREATE POLICY "Users read own chat messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));