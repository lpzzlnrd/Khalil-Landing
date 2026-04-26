-- Supabase Migration: Create applications table
-- Run this in your Supabase SQL editor or via supabase db push

CREATE TABLE IF NOT EXISTS public.applications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text NOT NULL,
  date        date NOT NULL,
  time        time NOT NULL,
  status      text NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);

-- Index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications (created_at DESC);

-- Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow insert from anyone (public landing form)
CREATE POLICY "Allow public insert"
  ON public.applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow select/update only for authenticated (admin)
CREATE POLICY "Allow admin select"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin update"
  ON public.applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (status IN ('pending', 'confirmed', 'cancelled'));
