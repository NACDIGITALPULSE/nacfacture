
-- 1. Création d'un type enum pour les rôles utilisateur
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Table de liaison utilisateurs <-> rôles
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- 3. Activer Row Level Security sur user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Fonction sécurité pour vérifier le rôle d'un utilisateur (évite récursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- 5. Policies : chaque utilisateur peut voir/modifier ses rôles (sauf les admins qui voient tout)
CREATE POLICY "User can manage own roles"
    ON public.user_roles
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
    ON public.user_roles
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
