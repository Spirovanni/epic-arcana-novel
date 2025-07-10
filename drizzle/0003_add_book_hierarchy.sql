-- Migration: Add Book Hierarchy and New Fields
-- This migration adds the new hierarchical structure and fields from Book JSON files

-- Step 1: Add new fields to books table
ALTER TABLE "books" ADD COLUMN "epic_novel_plot" varchar(255);
ALTER TABLE "books" ADD COLUMN "unique_theme" varchar(255);
ALTER TABLE "books" ADD COLUMN "business_model_generation" varchar(100);
ALTER TABLE "books" ADD COLUMN "business_model_you" varchar(255);
ALTER TABLE "books" ADD COLUMN "type" varchar(50);

-- Step 2: Create task_masters table
CREATE TABLE "task_masters" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "book_id" uuid NOT NULL REFERENCES "books"("id"),
  "unique_identifier" varchar(50),
  "type" varchar(50),
  "color_name" varchar(100),
  "hex_code" varchar(7),
  "red" integer,
  "green" integer,
  "blue" integer,
  "title" varchar(255) NOT NULL,
  "tagline" text,
  "description" text,
  "fiction_novel_section_title" varchar(255),
  "fiction_novel_section_description" text,
  "fiction_novel_section_tagline" text,
  "fiction_novel_section_books_influenced_by" jsonb,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Step 3: Create major_task_groups table
CREATE TABLE "major_task_groups" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "task_master_id" uuid NOT NULL REFERENCES "task_masters"("id"),
  "unique_identifier" varchar(50),
  "type" varchar(50),
  "color_name" varchar(100),
  "hex_code" varchar(7),
  "red" integer,
  "green" integer,
  "blue" integer,
  "title" varchar(255) NOT NULL,
  "description" text,
  "tagline" text,
  "books_influenced_by" jsonb,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Step 4: Add new fields to chapters table
ALTER TABLE "chapters" ADD COLUMN "major_task_group_id" uuid REFERENCES "major_task_groups"("id");
ALTER TABLE "chapters" ADD COLUMN "type" varchar(50);
ALTER TABLE "chapters" ADD COLUMN "color_name" varchar(100);
ALTER TABLE "chapters" ADD COLUMN "hex_code" varchar(7);
ALTER TABLE "chapters" ADD COLUMN "red" integer;
ALTER TABLE "chapters" ADD COLUMN "green" integer;
ALTER TABLE "chapters" ADD COLUMN "blue" integer;
ALTER TABLE "chapters" ADD COLUMN "focus_area" varchar(100);
ALTER TABLE "chapters" ADD COLUMN "connection_to_major_task_group" text;
ALTER TABLE "chapters" ADD COLUMN "specific_task_group_description" text;
ALTER TABLE "chapters" ADD COLUMN "specific_task_group_tagline" text;
ALTER TABLE "chapters" ADD COLUMN "specific_task_group_books_influenced_by" jsonb;
ALTER TABLE "chapters" ADD COLUMN "terminal_learning_objectives" jsonb;

-- Step 5: Create indexes for better performance
CREATE INDEX "idx_task_masters_book_id" ON "task_masters"("book_id");
CREATE INDEX "idx_major_task_groups_task_master_id" ON "major_task_groups"("task_master_id");
CREATE INDEX "idx_chapters_major_task_group_id" ON "chapters"("major_task_group_id");

-- Step 6: Add comments for documentation
COMMENT ON TABLE "task_masters" IS 'High-level organizational structure for books from JSON data';
COMMENT ON TABLE "major_task_groups" IS 'Intermediate organizational layer between task masters and chapters';
COMMENT ON COLUMN "books"."epic_novel_plot" IS 'Plot type from JSON (e.g., "The Quest & Coming of age")';
COMMENT ON COLUMN "books"."unique_theme" IS 'Unique theme from JSON (e.g., "Combined Directives")';
COMMENT ON COLUMN "chapters"."focus_area" IS 'Focus area from specific task groups (e.g., "Mental Health")';
COMMENT ON COLUMN "chapters"."terminal_learning_objectives" IS 'Learning objectives from specific task groups';