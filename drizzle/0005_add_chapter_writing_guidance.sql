CREATE TABLE IF NOT EXISTS "chapter_writing_guidance" (
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
DO $$ BEGIN
 ALTER TABLE "chapter_writing_guidance" ADD CONSTRAINT "chapter_writing_guidance_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "chapter_writing_guidance" ADD CONSTRAINT "chapter_writing_guidance_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$; 