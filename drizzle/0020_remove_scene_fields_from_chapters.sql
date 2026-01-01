-- Migration to remove scene-specific fields from chapters table
-- These fields belong in the scenes table, not the chapters table

ALTER TABLE chapters 
  DROP COLUMN IF EXISTS pov,
  DROP COLUMN IF EXISTS tense,
  DROP COLUMN IF EXISTS core_emotion,
  DROP COLUMN IF EXISTS scene_tone,
  DROP COLUMN IF EXISTS scene_number,
  DROP COLUMN IF EXISTS hero_journey_beat,
  DROP COLUMN IF EXISTS hero_journey_beat_objective,
  DROP COLUMN IF EXISTS plot_beat,
  DROP COLUMN IF EXISTS save_the_cat_beat,
  DROP COLUMN IF EXISTS save_the_cat_beat_goal,
  DROP COLUMN IF EXISTS location_details,
  DROP COLUMN IF EXISTS series_connections,
  DROP COLUMN IF EXISTS task_master_key,
  DROP COLUMN IF EXISTS major_task_group_key,
  DROP COLUMN IF EXISTS specific_task_group_key;

