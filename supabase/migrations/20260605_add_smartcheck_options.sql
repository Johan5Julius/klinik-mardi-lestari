-- Add support for custom scoring options on Smart Check questions
ALTER TABLE smartcheck_questions
  ADD COLUMN IF NOT EXISTS options JSONB NOT NULL DEFAULT '[]'::jsonb;
