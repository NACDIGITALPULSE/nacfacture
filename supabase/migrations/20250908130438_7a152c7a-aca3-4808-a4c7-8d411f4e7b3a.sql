-- Ajouter les super administrateurs
INSERT INTO public.user_roles (user_id, role) 
SELECT 
  auth.users.id,
  'admin'::app_role
FROM auth.users 
WHERE auth.users.email IN ('nouredinechekaraou@live.fr', 'support@nacdigitalpulse.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- Créer la table des messages de chat
CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  sender_name text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_admin boolean DEFAULT false
);

-- Activer RLS sur la table des messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour les messages de chat
CREATE POLICY "Utilisateurs authentifiés peuvent voir tous les messages"
ON public.chat_messages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Utilisateurs authentifiés peuvent créer des messages"
ON public.chat_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Activer les mises à jour en temps réel pour les tables nécessaires
ALTER TABLE public.user_subscriptions REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Ajouter les tables à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;