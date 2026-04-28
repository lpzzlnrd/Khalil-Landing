-- Fix: the unique index was on (date) only, blocking multiple slots per day.
-- It should be on (date, time) to allow different time slots on the same day.

DROP INDEX IF EXISTS uq_applications_active_date;

CREATE UNIQUE INDEX uq_applications_active_date_time
  ON public.applications (date, time)
  WHERE status IN ('pending', 'confirmed');
