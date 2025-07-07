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
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
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
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
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
ALTER TABLE "books" ADD CONSTRAINT "books_series_id_novel_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."novel_series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenes" ADD CONSTRAINT "scenes_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_groups" ADD CONSTRAINT "task_groups_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_groups" ADD CONSTRAINT "task_groups_parent_task_group_id_task_groups_id_fk" FOREIGN KEY ("parent_task_group_id") REFERENCES "public"."task_groups"("id") ON DELETE no action ON UPDATE no action;