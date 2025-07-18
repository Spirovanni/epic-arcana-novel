-- Add symbolism field to scenes table
ALTER TABLE "scenes" ADD COLUMN "symbolism" text;

-- Add chapter-level metadata fields to chapters table
ALTER TABLE "chapters" ADD COLUMN "pov" varchar(100);
ALTER TABLE "chapters" ADD COLUMN "tense" varchar(50);
ALTER TABLE "chapters" ADD COLUMN "core_emotion" varchar(255);
ALTER TABLE "chapters" ADD COLUMN "scene_tone" varchar(255);