-- Add chapter metadata fields to learning_resources table
ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS specific_task_group_title VARCHAR(255);
ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS focus_area VARCHAR(255);
ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS tagline TEXT;
