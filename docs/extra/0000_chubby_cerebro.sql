CREATE TYPE "public"."affinity_type" AS ENUM('secondary', 'forbidden');--> statement-breakpoint
CREATE TYPE "public"."arcana_type" AS ENUM('major', 'minor');--> statement-breakpoint
CREATE TYPE "public"."character_type" AS ENUM('historical', 'mythic', 'fantasy');--> statement-breakpoint
CREATE TYPE "public"."suit" AS ENUM('Temporalis', 'Animae', 'Stellae', 'Materiae');--> statement-breakpoint
CREATE TABLE "character_affinities" (
	"character_id" uuid NOT NULL,
	"card_id" uuid NOT NULL,
	"affinity_type" "affinity_type" NOT NULL
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
ALTER TABLE "character_affinities" ADD CONSTRAINT "character_affinities_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_affinities" ADD CONSTRAINT "character_affinities_card_id_trionfi_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."trionfi_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_primary_affinity_id_trionfi_cards_id_fk" FOREIGN KEY ("primary_affinity_id") REFERENCES "public"."trionfi_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unique_combination_cards" ADD CONSTRAINT "unique_combination_cards_combination_id_unique_combinations_id_fk" FOREIGN KEY ("combination_id") REFERENCES "public"."unique_combinations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unique_combination_cards" ADD CONSTRAINT "unique_combination_cards_card_id_trionfi_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."trionfi_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unique_combinations" ADD CONSTRAINT "unique_combinations_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;