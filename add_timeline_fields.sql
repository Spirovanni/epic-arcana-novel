-- Add timeline and context fields to scenes table safely
-- These are all nullable fields so no data loss risk

ALTER TABLE scenes 
ADD COLUMN IF NOT EXISTS timeline_date VARCHAR(50),
ADD COLUMN IF NOT EXISTS timeline_variant VARCHAR(100),
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS pov VARCHAR(100),
ADD COLUMN IF NOT EXISTS tense VARCHAR(100),
ADD COLUMN IF NOT EXISTS core_emotion VARCHAR(255),
ADD COLUMN IF NOT EXISTS scene_tone VARCHAR(255);