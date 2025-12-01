-- Add ai_prompt column to characters table
ALTER TABLE "characters" ADD COLUMN IF NOT EXISTS "ai_prompt" text;

-- Create index on ai_prompt for faster queries
CREATE INDEX IF NOT EXISTS "characters_ai_prompt_idx" ON "characters"("ai_prompt");
