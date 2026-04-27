-- Migration: Add meeting_link and answers to applications
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS meeting_link text;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS answers jsonb DEFAULT '{}'::jsonb;
