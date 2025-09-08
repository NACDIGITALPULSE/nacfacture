-- Ajouter le super admin pour la validation des abonnements
-- Récupérer l'ID utilisateur pour nouredinechekaraou@live.fr depuis auth.users et l'ajouter comme admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'nouredinechekaraou@live.fr'
ON CONFLICT (user_id, role) DO NOTHING;