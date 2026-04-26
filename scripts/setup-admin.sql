-- ============================================================
-- SETUP ADMIN: Ejecuta este script en el SQL Editor de Supabase
-- ============================================================
--
-- Cambia los valores de abajo por tu email y contraseña:
--

DELETE FROM public.admin_users;

INSERT INTO public.admin_users (email, password_hash)
VALUES (
  '',                          -- <-- Cambia esto
  crypt('', gen_salt('bf'))            -- <-- Cambia esto
);

-- Verifica que se creó correctamente:
SELECT id, email, created_at FROM public.admin_users;
