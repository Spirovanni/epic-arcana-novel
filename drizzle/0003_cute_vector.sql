CREATE TABLE "major_task_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_master_id" uuid NOT NULL,
	"unique_identifier" varchar(50),
	"type" varchar(50),
	"color_name" varchar(100),
	"hex_code" varchar(7),
	"red" integer,
	"green" integer,
	"blue" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"tagline" text,
	"books_influenced_by" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_masters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"unique_identifier" varchar(50),
	"type" varchar(50),
	"color_name" varchar(100),
	"hex_code" varchar(7),
	"red" integer,
	"green" integer,
	"blue" integer,
	"title" varchar(255) NOT NULL,
	"tagline" text,
	"description" text,
	"fiction_novel_section_title" varchar(255),
	"fiction_novel_section_description" text,
	"fiction_novel_section_tagline" text,
	"fiction_novel_section_books_influenced_by" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "epic_novel_plot" varchar(255);--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "unique_theme" varchar(255);--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "business_model_generation" varchar(100);--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "business_model_you" varchar(255);--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "type" varchar(50);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "major_task_group_id" uuid;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "type" varchar(50);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "color_name" varchar(100);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "hex_code" varchar(7);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "red" integer;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "green" integer;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "blue" integer;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "focus_area" varchar(100);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "connection_to_major_task_group" text;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "specific_task_group_description" text;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "specific_task_group_tagline" text;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "specific_task_group_books_influenced_by" jsonb;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "terminal_learning_objectives" jsonb;--> statement-breakpoint
ALTER TABLE "major_task_groups" ADD CONSTRAINT "major_task_groups_task_master_id_task_masters_id_fk" FOREIGN KEY ("task_master_id") REFERENCES "public"."task_masters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_masters" ADD CONSTRAINT "task_masters_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_major_task_group_id_major_task_groups_id_fk" FOREIGN KEY ("major_task_group_id") REFERENCES "public"."major_task_groups"("id") ON DELETE no action ON UPDATE no action;