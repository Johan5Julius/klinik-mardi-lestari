-- Add background image to facilities
ALTER TABLE facilities
  ADD COLUMN IF NOT EXISTS background_image_url TEXT;

-- Link doctors to a primary facility
ALTER TABLE doctors
  ADD COLUMN IF NOT EXISTS facility_id BIGINT REFERENCES facilities(id) ON DELETE SET NULL;
