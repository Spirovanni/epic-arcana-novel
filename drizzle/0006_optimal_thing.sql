CREATE TABLE "historical_character_mapping" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"historical_birth_date" varchar(50),
	"historical_death_date" varchar(50),
	"story_age" integer,
	"historical_accuracy" varchar(50),
	"key_life_events" jsonb,
	"contemporary_figures" jsonb,
	"anachronisms" jsonb,
	"historical_role" text,
	"fantasy_role" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scene_timeline_mapping" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scene_id" uuid NOT NULL,
	"timeline_event_id" uuid NOT NULL,
	"relationship_type" varchar(100),
	"temporal_distance" varchar(50),
	"divergence_impact" text,
	"narrative_significance" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "timeline_divergence_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"historical_date" varchar(50),
	"divergence_type" varchar(100),
	"real_timeline_outcome" text,
	"story_timeline_outcome" text,
	"caused_by_scene_ids" jsonb,
	"affects_scene_ids" jsonb,
	"historical_consequences" jsonb,
	"fantasy_justification" text,
	"cascade_effects" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "historical_date" varchar(50);--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "story_timeline_date" varchar(50);--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "historical_event_ids" jsonb;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "temporal_divergence_point" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "real_world_context" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "alternate_timeline_variant" varchar(100);--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "chronological_sequence" integer;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "story_sequence" integer;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "timeline_significance" text;--> statement-breakpoint
ALTER TABLE "historical_character_mapping" ADD CONSTRAINT "historical_character_mapping_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene_timeline_mapping" ADD CONSTRAINT "scene_timeline_mapping_scene_id_scenes_id_fk" FOREIGN KEY ("scene_id") REFERENCES "public"."scenes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene_timeline_mapping" ADD CONSTRAINT "scene_timeline_mapping_timeline_event_id_timeline_events_id_fk" FOREIGN KEY ("timeline_event_id") REFERENCES "public"."timeline_events"("id") ON DELETE no action ON UPDATE no action;