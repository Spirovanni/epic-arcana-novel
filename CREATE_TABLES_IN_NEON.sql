-- ==============================================================================
-- CREATE STRENGTHS AND SHADOW TABLES IN NEON
-- ==============================================================================
-- Run this SQL script in your Neon Console SQL Editor to create both tables
-- in the database branch you're currently viewing.
-- ==============================================================================

-- Create strengths table
CREATE TABLE IF NOT EXISTS "strengths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"canonical_id" varchar(20) NOT NULL,
	"profile_key" varchar(50),
	"unique_identifier" varchar(50),
	"specific_task_group_title" text,
	"chapter_title" text,
	"display_name" text,
	"theme" text,
	"strength_index" integer NOT NULL,
	"strength_text" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Create shadow table
CREATE TABLE IF NOT EXISTS "shadow" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"canonical_id" varchar(20) NOT NULL,
	"profile_key" varchar(50),
	"unique_identifier" varchar(50),
	"specific_task_group_title" text,
	"chapter_title" text,
	"display_name" text,
	"theme" text,
	"shadow_index" integer NOT NULL,
	"shadow_text" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Create indexes for strengths table
CREATE INDEX IF NOT EXISTS idx_strengths_canonical_id ON strengths(canonical_id);
CREATE INDEX IF NOT EXISTS idx_strengths_profile_key ON strengths(profile_key);
CREATE INDEX IF NOT EXISTS idx_strengths_task_group ON strengths(specific_task_group_title);
CREATE INDEX IF NOT EXISTS idx_strengths_text_search ON strengths USING gin(to_tsvector('english', strength_text));

-- Create indexes for shadow table
CREATE INDEX IF NOT EXISTS idx_shadow_canonical_id ON shadow(canonical_id);
CREATE INDEX IF NOT EXISTS idx_shadow_profile_key ON shadow(profile_key);
CREATE INDEX IF NOT EXISTS idx_shadow_task_group ON shadow(specific_task_group_title);
CREATE INDEX IF NOT EXISTS idx_shadow_text_search ON shadow USING gin(to_tsvector('english', shadow_text));

-- Verify tables were created
SELECT 'Tables created successfully!' as status;
SELECT 'strengths' as table_name, COUNT(*) as record_count FROM strengths
UNION ALL
SELECT 'shadow' as table_name, COUNT(*) as record_count FROM shadow;
