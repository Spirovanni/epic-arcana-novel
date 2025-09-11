CREATE TABLE "arc_visualization_scenes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"camera_position" jsonb,
	"camera_target" jsonb,
	"lighting_config" jsonb,
	"environment_settings" jsonb,
	"character_filters" jsonb,
	"is_default" boolean DEFAULT false,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chapter_writing_guidance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapter_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"chapter_number" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"pov_type" varchar(100),
	"pov_character" varchar(255),
	"tense" varchar(50),
	"why_this_pov_and_tense" text,
	"summary" text,
	"key_plot_developments" jsonb,
	"narrative_function" jsonb,
	"tone_and_visual_prompts" jsonb,
	"tips_for_writing" jsonb,
	"full_text" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "story_arc_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_arc_id" uuid NOT NULL,
	"theme" varchar(100) NOT NULL,
	"chapter_number" integer NOT NULL,
	"scene_number" integer,
	"goal_description" text NOT NULL,
	"measurement_criteria" text,
	"arc_development_note" text,
	"is_completed" boolean DEFAULT false,
	"position_in_3d" jsonb,
	"visual_properties" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "story_cards" (
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
--> statement-breakpoint
ALTER TABLE "chapter_details" RENAME TO "character_arc_relationships";--> statement-breakpoint
ALTER TABLE "character_arc_relationships" RENAME COLUMN "chapter_id" TO "source_character_id";--> statement-breakpoint
ALTER TABLE "character_arc_relationships" DROP CONSTRAINT "chapter_details_chapter_id_unique";--> statement-breakpoint
ALTER TABLE "character_arc_relationships" DROP CONSTRAINT "chapter_details_chapter_id_chapters_id_fk";
--> statement-breakpoint
ALTER TABLE "character_arc_relationships" ADD COLUMN "target_character_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "character_arc_relationships" ADD COLUMN "relationship_type" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "character_arc_relationships" ADD COLUMN "strength" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "character_arc_relationships" ADD COLUMN "chapters_active" jsonb;--> statement-breakpoint
ALTER TABLE "character_arc_relationships" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "character_arc_relationships" ADD COLUMN "visual_style" jsonb;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "pov" varchar(100);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "tense" varchar(50);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "core_emotion" varchar(255);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "scene_tone" varchar(255);--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "image_prompt" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "open_art_link" varchar(500);--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "custom_setting" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "image_url" varchar(255);--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "other_names" jsonb;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "sensory_description" text;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "type" varchar(100);--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "notable_features" text;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "lore" text;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "affiliation" varchar(200);--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "linked_arcana" varchar(100);--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "ai_image_prompt" text;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "image_url" varchar(500);--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "setup" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "sensory_detail" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "internal_conflict" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "beat_goal" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "symbolism" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "timeline_date" varchar(50);--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "timeline_variant" varchar(100);--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "location" varchar(255);--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "pov" varchar(100);--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "tense" varchar(100);--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "core_emotion" varchar(255);--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "scene_tone" varchar(255);--> statement-breakpoint
ALTER TABLE "chapter_writing_guidance" ADD CONSTRAINT "chapter_writing_guidance_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_writing_guidance" ADD CONSTRAINT "chapter_writing_guidance_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_arc_goals" ADD CONSTRAINT "story_arc_goals_character_arc_id_character_arcs_id_fk" FOREIGN KEY ("character_arc_id") REFERENCES "public"."character_arcs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_cards" ADD CONSTRAINT "story_cards_character_arc_id_character_arcs_id_fk" FOREIGN KEY ("character_arc_id") REFERENCES "public"."character_arcs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_arc_relationships" ADD CONSTRAINT "character_arc_relationships_source_character_id_characters_id_fk" FOREIGN KEY ("source_character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_arc_relationships" ADD CONSTRAINT "character_arc_relationships_target_character_id_characters_id_fk" FOREIGN KEY ("target_character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_arc_relationships" DROP COLUMN "pov_type";--> statement-breakpoint
ALTER TABLE "character_arc_relationships" DROP COLUMN "pov_character_name";--> statement-breakpoint
ALTER TABLE "character_arc_relationships" DROP COLUMN "tense";--> statement-breakpoint
ALTER TABLE "character_arc_relationships" DROP COLUMN "why_pov_and_tense";--> statement-breakpoint
ALTER TABLE "character_arc_relationships" DROP COLUMN "summary";--> statement-breakpoint
ALTER TABLE "character_arc_relationships" DROP COLUMN "key_plot_developments";--> statement-breakpoint
ALTER TABLE "character_arc_relationships" DROP COLUMN "narrative_function";--> statement-breakpoint
ALTER TABLE "character_arc_relationships" DROP COLUMN "tone_and_visual_prompts";--> statement-breakpoint
ALTER TABLE "character_arc_relationships" DROP COLUMN "tips_for_writing";--> statement-breakpoint
ALTER TABLE "character_arc_relationships" DROP COLUMN "full_text";