CREATE TABLE "calendar_settings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "calendar_settings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "calendar_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "day_override" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "day_override_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"day_of_year" integer NOT NULL,
	"title" varchar(255),
	"description" text,
	"ritual" text,
	"tags" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "day_override_day_of_year_unique" UNIQUE("day_of_year")
);
--> statement-breakpoint
CREATE TABLE "day_sign" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "day_sign_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"index0" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"glyph" varchar(255),
	"color" varchar(7),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "day_sign_index0_unique" UNIQUE("index0")
);
--> statement-breakpoint
CREATE TABLE "day_sign_mapping" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "day_sign_mapping_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"day_sign_id" integer NOT NULL,
	"archetype" varchar(255) NOT NULL,
	"theme" varchar(255) NOT NULL,
	"reflection" text NOT NULL,
	"ritual" text NOT NULL,
	"keywords" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "day_sign_mapping" ADD CONSTRAINT "day_sign_mapping_day_sign_id_day_sign_id_fk" FOREIGN KEY ("day_sign_id") REFERENCES "public"."day_sign"("id") ON DELETE cascade ON UPDATE no action;