CREATE TABLE "shadow" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"canonical_id" varchar(20) NOT NULL,
	"profile_key" varchar(50),
	"unique_identifier" varchar(50),
	"specific_task_group_title" text,
	"chapter_title" text,
	"display_name" text,
	"theme" text,
	"shadow_index" integer NOT NULL,
	"shadow_text" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
