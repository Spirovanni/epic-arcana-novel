-- Add scene structure fields to scenes table
-- Run this manually in your database if needed

ALTER TABLE scenes ADD COLUMN IF NOT EXISTS setup text;
ALTER TABLE scenes ADD COLUMN IF NOT EXISTS sensory_detail text;
ALTER TABLE scenes ADD COLUMN IF NOT EXISTS internal_conflict text;
ALTER TABLE scenes ADD COLUMN IF NOT EXISTS beat_goal text;