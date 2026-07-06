-- Crée les profils manquants pour les utilisateurs Auth existants
-- (users créés manuellement avant le trigger 002)

INSERT INTO public.profiles (id, username)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1))
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);
