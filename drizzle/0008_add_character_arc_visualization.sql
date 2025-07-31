-- Migration for Character Arc 3D Visualization tables
-- Adding support for editable story cards with 3D positioning

-- Story Cards table for organizing character arc stages
CREATE TABLE IF NOT EXISTS "story_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_arc_id" uuid NOT NULL,
	"stage_name" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"chapter_references" jsonb,
	"scene_goals" jsonb,
	"arc_development" text,
	"position_x" real DEFAULT 0,
	"position_y" real DEFAULT 0,
	"position_z" real DEFAULT 0,
	"rotation_x" real DEFAULT 0,
	"rotation_y" real DEFAULT 0,
	"rotation_z" real DEFAULT 0,
	"scale" real DEFAULT 1,
	"color" varchar(7) DEFAULT '#6366f1',
	"display_order" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Character Arc Relationships for visualizing connections
CREATE TABLE IF NOT EXISTS "character_arc_relationships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_character_id" uuid NOT NULL,
	"target_character_id" uuid NOT NULL,
	"relationship_type" varchar(100) NOT NULL, -- 'alliance', 'conflict', 'romance', 'mentorship', etc.
	"strength" integer DEFAULT 1, -- 1-10 scale
	"chapters_active" jsonb, -- which chapters this relationship is active
	"description" text,
	"visual_style" jsonb, -- line color, thickness, animation
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- 3D Scene Configuration for the visualization
CREATE TABLE IF NOT EXISTS "arc_visualization_scenes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"camera_position" jsonb, -- {x, y, z}
	"camera_target" jsonb, -- {x, y, z}
	"lighting_config" jsonb,
	"environment_settings" jsonb,
	"character_filters" jsonb, -- which characters to show
	"is_default" boolean DEFAULT false,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Story Arc Goals with specific chapter/scene tracking
CREATE TABLE IF NOT EXISTS "story_arc_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_arc_id" uuid NOT NULL,
	"theme" varchar(100) NOT NULL, -- 'power', 'knowledge', 'love', etc.
	"chapter_number" integer NOT NULL,
	"scene_number" integer,
	"goal_description" text NOT NULL,
	"measurement_criteria" text,
	"arc_development_note" text,
	"is_completed" boolean DEFAULT false,
	"position_in_3d" jsonb, -- {x, y, z} for 3D positioning
	"visual_properties" jsonb, -- color, size, animation
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "story_cards" ADD CONSTRAINT "story_cards_character_arc_id_character_arcs_id_fk" FOREIGN KEY ("character_arc_id") REFERENCES "character_arcs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "character_arc_relationships" ADD CONSTRAINT "character_arc_relationships_source_character_id_characters_id_fk" FOREIGN KEY ("source_character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "character_arc_relationships" ADD CONSTRAINT "character_arc_relationships_target_character_id_characters_id_fk" FOREIGN KEY ("target_character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "story_arc_goals" ADD CONSTRAINT "story_arc_goals_character_arc_id_character_arcs_id_fk" FOREIGN KEY ("character_arc_id") REFERENCES "character_arcs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_story_cards_character_arc_id" ON "story_cards"("character_arc_id");
CREATE INDEX IF NOT EXISTS "idx_story_cards_display_order" ON "story_cards"("display_order");
CREATE INDEX IF NOT EXISTS "idx_character_arc_relationships_source" ON "character_arc_relationships"("source_character_id");
CREATE INDEX IF NOT EXISTS "idx_character_arc_relationships_target" ON "character_arc_relationships"("target_character_id");
CREATE INDEX IF NOT EXISTS "idx_story_arc_goals_character_arc_id" ON "story_arc_goals"("character_arc_id");
CREATE INDEX IF NOT EXISTS "idx_story_arc_goals_chapter" ON "story_arc_goals"("chapter_number");