-- Add image detail fields to characters table
-- Run this manually in your database if needed

ALTER TABLE characters ADD COLUMN IF NOT EXISTS image_prompt text;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS open_art_link varchar(500);
ALTER TABLE characters ADD COLUMN IF NOT EXISTS custom_setting text;