DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'affinity_type') THEN CREATE TYPE "public"."affinity_type" AS ENUM('secondary', 'forbidden'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'arcana_type') THEN CREATE TYPE "public"."arcana_type" AS ENUM('major', 'minor'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'character_type') THEN CREATE TYPE "public"."character_type" AS ENUM('historical', 'mythic', 'fantasy'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'station_type') THEN CREATE TYPE "public"."station_type" AS ENUM('major_hub', 'minor_stop'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'suit') THEN CREATE TYPE "public"."suit" AS ENUM('Temporalis', 'Animae', 'Stellae', 'Materiae'); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'train_component_type') THEN CREATE TYPE "public"."train_component_type" AS ENUM('locomotive', 'passenger_car', 'observation_car'); END IF; END $$;
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"series_id" uuid NOT NULL,
	"book_number" integer NOT NULL,
	"unique_identifier" varchar(50),
	"title" varchar(255) NOT NULL,
	"fiction_novel_title" varchar(255),
	"subject" varchar(100),
	"focus" varchar(255),
	"tagline" text,
	"logline" text,
	"description" text,
	"themes" jsonb,
	"key_themes" jsonb,
	"triumph" varchar(100),
	"military_component" varchar(100),
	"business_model" varchar(100),
	"personality_type" varchar(100),
	"enneagram_type" varchar(100),
	"enneagram_description" text,
	"covey_habit" varchar(100),
	"associated_sin" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chapter_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapter_id" uuid NOT NULL,
	"page_number" integer NOT NULL,
	"content" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"chapter_number" integer NOT NULL,
	"unique_identifier" varchar(50),
	"title" varchar(255),
	"focus" varchar(255),
	"epic_novel_pages" varchar(50),
	"epic_chapter_focus" varchar(255),
	"epic_novel_chapter_focus" varchar(255),
	"epic_novel_section_name" varchar(255),
	"description" text,
	"tarot_card_link" varchar(100),
	"tarot_family" varchar(50),
	"tarot_card_item" varchar(50),
	"color_theme" jsonb,
	"icon_path" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "character_affinities" (
	"character_id" uuid NOT NULL,
	"card_id" uuid NOT NULL,
	"affinity_type" "affinity_type" NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "characters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"character_type" character_type NOT NULL,
	"pronouns" varchar(50),
	"relation" varchar(255),
	"personality" text,
	"background" text,
	"physical_description" text,
	"dialogue_style" text,
	"role" varchar(255),
	"goal" text,
	"birth_year" varchar(50),
	"died" varchar(50),
	"story_year" varchar(50),
	"story_age" varchar(50),
	"groups" jsonb,
	"description" text,
	"birth_place" varchar(255),
	"birth_place_description" text,
	"death_place" varchar(255),
	"death_place_description" text,
	"aka" varchar(255),
	"primary_affinity_id" uuid,
	"evolution" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "characters_name_unique" UNIQUE("name")
);
--> statement-breakpoint
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
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"arcana" varchar(50),
	"coordinates" jsonb,
	"faction" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "military_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255),
	"origin" varchar(255),
	"description" text,
	"lore" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "military_orders_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "novel_series" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"tagline" varchar(255),
	"logline" text,
	"synopsis" text,
	"secondary_synopsis" text,
	"description" text,
	"summary" text,
	"genres" jsonb,
	"themes" jsonb,
	"key_themes" jsonb,
	"positioning" jsonb,
	"tone" jsonb,
	"style" jsonb,
	"target_audience" jsonb,
	"keywords" jsonb,
	"tropes" jsonb,
	"cover_theme_concepts" jsonb,
	"settings" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "novel_series_title_unique" UNIQUE("title")
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
CREATE TABLE "scenes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapter_id" uuid NOT NULL,
	"scene_number" integer NOT NULL,
	"title" varchar(255),
	"focus" varchar(255),
	"preliminary_scene_focus" varchar(255),
	"preliminary_scene_description" text,
	"description" text,
	"tarot_symbolism" text,
	"hero_journey_stage" varchar(100),
	"pages" varchar(50),
	"primary_tarot_card" varchar(100),
	"secondary_tarot_cards" jsonb,
	"tarot_card_id" uuid,
	"tarot_narrative_role" varchar(255),
	"francisco_tarot_connection" text,
	"la_signora_tarot_connection" text,
	"dagon_tarot_connection" text,
	"temporal_power_manifested" text,
	"character_growth_element" text,
	"scene_card_progression" integer,
	"card_reversal_significance" text,
	"historical_date" varchar(50),
	"story_timeline_date" varchar(50),
	"historical_event_ids" jsonb,
	"temporal_divergence_point" text,
	"real_world_context" text,
	"alternate_timeline_variant" varchar(100),
	"chronological_sequence" integer,
	"story_sequence" integer,
	"timeline_significance" text,
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
CREATE TABLE "symbolic_objects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255),
	"theme" varchar(255),
	"description" text,
	"lore" text,
	"origin" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "symbolic_objects_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "task_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapter_id" uuid,
	"parent_task_group_id" uuid,
	"unique_identifier" varchar(50),
	"type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"tagline" text,
	"focus_area" varchar(100),
	"connection_to_major_task_group" text,
	"influenced_by_books" jsonb,
	"learning_objectives" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "temporal_economy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100),
	"description" text,
	"details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "temporal_economy_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "temporal_education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100),
	"description" text,
	"details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "temporal_education_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "temporal_law" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100),
	"description" text,
	"details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "temporal_law_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "temporal_stations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "station_type" NOT NULL,
	"features" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "temporal_stations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "temporal_technology" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100),
	"description" text,
	"details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "temporal_technology_name_unique" UNIQUE("name")
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
CREATE TABLE "timeline_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_key" varchar(50) NOT NULL,
	"label" varchar(255) NOT NULL,
	"year" integer,
	"era" varchar(100) NOT NULL,
	"historical" integer NOT NULL,
	"summary" text NOT NULL,
	"month" varchar(20),
	"day" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "timeline_events_event_key_unique" UNIQUE("event_key")
);
--> statement-breakpoint
CREATE TABLE "trionfi_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"arcana_type" "arcana_type" NOT NULL,
	"suit" "suit",
	"power_level" varchar(100),
	"description" text,
	"temporal_impact" text,
	"essence" text,
	"divine_aspect" text,
	"human_aspect" text,
	"interpretations" jsonb,
	"special_ability" text,
	"domain" text,
	"element" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "trionfi_cards_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "unique_combination_cards" (
	"combination_id" uuid NOT NULL,
	"card_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unique_combinations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"effect" text,
	"cost" text
);
--> statement-breakpoint
CREATE TABLE "zanetti_train_components" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "train_component_type" NOT NULL,
	"details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_series_id_novel_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."novel_series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_pages" ADD CONSTRAINT "chapter_pages_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_affinities" ADD CONSTRAINT "character_affinities_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_affinities" ADD CONSTRAINT "character_affinities_card_id_trionfi_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."trionfi_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_arcs" ADD CONSTRAINT "character_arcs_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_arcs" ADD CONSTRAINT "character_arcs_primary_book_id_books_id_fk" FOREIGN KEY ("primary_book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_thematic_elements" ADD CONSTRAINT "character_thematic_elements_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_triumph_mapping" ADD CONSTRAINT "character_triumph_mapping_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_primary_affinity_id_trionfi_cards_id_fk" FOREIGN KEY ("primary_affinity_id") REFERENCES "public"."trionfi_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "historical_character_mapping" ADD CONSTRAINT "historical_character_mapping_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene_timeline_mapping" ADD CONSTRAINT "scene_timeline_mapping_scene_id_scenes_id_fk" FOREIGN KEY ("scene_id") REFERENCES "public"."scenes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene_timeline_mapping" ADD CONSTRAINT "scene_timeline_mapping_timeline_event_id_timeline_events_id_fk" FOREIGN KEY ("timeline_event_id") REFERENCES "public"."timeline_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenes" ADD CONSTRAINT "scenes_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenes" ADD CONSTRAINT "scenes_tarot_card_id_trionfi_cards_id_fk" FOREIGN KEY ("tarot_card_id") REFERENCES "public"."trionfi_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_groups" ADD CONSTRAINT "task_groups_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unique_combination_cards" ADD CONSTRAINT "unique_combination_cards_combination_id_unique_combinations_id_fk" FOREIGN KEY ("combination_id") REFERENCES "public"."unique_combinations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unique_combination_cards" ADD CONSTRAINT "unique_combination_cards_card_id_trionfi_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."trionfi_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unique_combinations" ADD CONSTRAINT "unique_combinations_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;