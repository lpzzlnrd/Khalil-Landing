-- Supabase Migration: Create admin_users table
-- Run this in your Supabase SQL editor or via supabase db push
--
-- After running this migration, insert your admin credentials:
--
--   INSERT INTO public.admin_users (email, password_hash)
--   VALUES ('tu-email@ejemplo.com', crypt('tu-contraseña-segura', gen_salt('bf')));
--
-- Requires pgcrypto extension (enabled by default in Supabase)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.admin_users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS: no public access
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only service_role can read/write admin_users (used from API routes)
CREATE POLICY "Service role full access"
  ON public.admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
