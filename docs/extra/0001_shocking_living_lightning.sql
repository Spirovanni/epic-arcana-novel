CREATE TYPE "public"."station_type" AS ENUM('major_hub', 'minor_stop');--> statement-breakpoint
CREATE TYPE "public"."train_component_type" AS ENUM('locomotive', 'passenger_car', 'observation_car');--> statement-breakpoint
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
CREATE TABLE "zanetti_train_components" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "train_component_type" NOT NULL,
	"details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
