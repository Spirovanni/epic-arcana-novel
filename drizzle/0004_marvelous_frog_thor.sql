CREATE TABLE "character_arcs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"arc_type" varchar(100) NOT NULL,
	"triumph_theme" varchar(100),
	"primary_book_id" uuid,
	"stages" jsonb,
	"thematic_elements" jsonb,
	"key_moments" jsonb,
	"character_development" jsonb,
	"conflicts" jsonb,
	"resolution" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "character_thematic_elements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"theme" varchar(100) NOT NULL,
	"development" text,
	"key_moments" jsonb,
	"progression_stages" jsonb,
	"triumph_connection" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "character_triumph_mapping" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"triumph_theme" varchar(100) NOT NULL,
	"relationship" varchar(100),
	"development_stage" varchar(100),
	"key_scenes" jsonb,
	"thematic_role" text,
	"arc_progression" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "story_gaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"core_issues" jsonb,
	"development_suggestions" jsonb,
	"key_scenes_to_develop" jsonb,
	"character_questions" jsonb,
	"priority" varchar(20),
	"status" varchar(20),
	"related_book_ids" jsonb,
	"related_character_ids" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "task_groups" DROP CONSTRAINT "task_groups_parent_task_group_id_task_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "character_arcs" ADD CONSTRAINT "character_arcs_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_arcs" ADD CONSTRAINT "character_arcs_primary_book_id_books_id_fk" FOREIGN KEY ("primary_book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_thematic_elements" ADD CONSTRAINT "character_thematic_elements_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_triumph_mapping" ADD CONSTRAINT "character_triumph_mapping_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;