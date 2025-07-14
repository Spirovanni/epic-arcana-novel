CREATE TABLE "chapter_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapter_id" uuid NOT NULL,
	"pov_type" varchar(255),
	"pov_character_name" varchar(255),
	"tense" varchar(50),
	"why_pov_and_tense" text,
	"summary" text,
	"key_plot_developments" jsonb,
	"narrative_function" jsonb,
	"tone_and_visual_prompts" jsonb,
	"tips_for_writing" jsonb,
	"full_text" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "chapter_details_chapter_id_unique" UNIQUE("chapter_id")
);
--> statement-breakpoint
ALTER TABLE "chapter_details" ADD CONSTRAINT "chapter_details_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;