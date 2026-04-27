-- Supabase Migration: enforce one active appointment per day
-- Active = endiente o por confirmar, las citas canceladas se pueden reagendar

CREATE UNIQUE INDEX IF NOT EXISTS uq_applications_active_date
  ON public.applications (date)
  WHERE status IN ('pending', 'confirmed');
