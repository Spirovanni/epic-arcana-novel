-- Add chapter_id column to chapters table
-- This column will store the EA-001, EA-002, etc. identifiers from l_outline.json "id" field
ALTER TABLE "chapters" ADD COLUMN IF NOT EXISTS "chapter_id" varchar(50);

