-- Migration: Add image_url column to events
-- Created: 2026-05-31

BEGIN;

-- Add a nullable text column to store the public URL of the event image
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMIT;
