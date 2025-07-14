-- Add image generation fields to characters table
ALTER TABLE "characters" ADD COLUMN "image_prompt" text;
ALTER TABLE "characters" ADD COLUMN "open_art_link" varchar(500);
ALTER TABLE "characters" ADD COLUMN "custom_setting" text;