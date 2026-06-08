-- Create smartcheck_categories table for risk threshold configuration
CREATE TABLE IF NOT EXISTS smartcheck_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  low_threshold INTEGER NOT NULL DEFAULT 40,
  medium_threshold INTEGER NOT NULL DEFAULT 70,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_smartcheck_categories_name ON smartcheck_categories(name);
