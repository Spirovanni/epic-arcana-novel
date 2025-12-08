-- Migration to add enhanced scene fields for chapters 36-47
-- These fields support the detailed scene blueprints for Sudowrite/NovelCrafter

ALTER TABLE scenes
ADD COLUMN IF NOT EXISTS scene_title varchar(255),
ADD COLUMN IF NOT EXISTS setup text,
ADD COLUMN IF NOT EXISTS symbolism text,
ADD COLUMN IF NOT EXISTS beat_goal text,
ADD COLUMN IF NOT EXISTS pov varchar(100),
ADD COLUMN IF NOT EXISTS tense varchar(100),
ADD COLUMN IF NOT EXISTS core_emotion varchar(255),
ADD COLUMN IF NOT EXISTS scene_tone varchar(255),
ADD COLUMN IF NOT EXISTS timeline_date varchar(100),
ADD COLUMN IF NOT EXISTS timeline_variant varchar(255),
ADD COLUMN IF NOT EXISTS location varchar(500);

-- Add index for efficient querying by chapter
CREATE INDEX IF NOT EXISTS idx_scenes_chapter_id ON scenes(chapter_id);

-- Add index for scene number within chapters
CREATE INDEX IF NOT EXISTS idx_scenes_chapter_scene ON scenes(chapter_id, scene_number);

-- Update timestamp
UPDATE scenes SET updated_at = now() WHERE id IN (
  SELECT s.id FROM scenes s
  JOIN chapters c ON s.chapter_id = c.id
  WHERE c.chapter_number BETWEEN 36 AND 47
);

