-- Supabase Migration: Create verify_admin RPC function
-- funcion para validar las credenciales desde el front

CREATE OR REPLACE FUNCTION public.verify_admin(p_email text, p_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = p_email
      AND password_hash = crypt(p_password, password_hash)
  );
END;
$$;

-- Only service_role can execute this function
REVOKE ALL ON FUNCTION public.verify_admin(text, text) FROM public;
REVOKE ALL ON FUNCTION public.verify_admin(text, text) FROM anon;
REVOKE ALL ON FUNCTION public.verify_admin(text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin(text, text) TO service_role;
