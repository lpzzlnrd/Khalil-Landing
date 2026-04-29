-- Track which reminders have been sent to avoid duplicates
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS reminder_2h_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_30m_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_now_sent boolean NOT NULL DEFAULT false;
