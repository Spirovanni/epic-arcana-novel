-- Add image URL field to characters table
-- Run this manually in your database

ALTER TABLE characters ADD COLUMN IF NOT EXISTS image_url varchar(255);