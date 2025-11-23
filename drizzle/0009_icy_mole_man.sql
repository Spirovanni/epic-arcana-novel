CREATE TABLE "assignment_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"personality_type" varchar(100) NOT NULL,
	"enneagram_type" integer,
	"day_of_year" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"daily_theme" varchar(255) NOT NULL,
	"personality_focus" varchar(255) NOT NULL,
	"reflection_prompt" text NOT NULL,
	"practice_exercise" text NOT NULL,
	"journal_prompt" text NOT NULL,
	"action_item" text NOT NULL,
	"book_chapter" varchar(100),
	"chapter_focus" varchar(255),
	"tags" jsonb,
	"difficulty" varchar(20) DEFAULT 'medium',
	"estimated_time_minutes" integer DEFAULT 15,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "templates_type_day_unique" UNIQUE("personality_type","day_of_year")
);
--> statement-breakpoint
CREATE TABLE "strengths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"canonical_id" varchar(20) NOT NULL,
	"profile_key" varchar(50),
	"unique_identifier" varchar(50),
	"specific_task_group_title" text,
	"chapter_title" text,
	"display_name" text,
	"theme" text,
	"strength_index" integer NOT NULL,
	"strength_text" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_calendar_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_journey_id" uuid NOT NULL,
	"day_of_year" integer NOT NULL,
	"assignment_date" timestamp NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"daily_theme" varchar(255) NOT NULL,
	"personality_focus" varchar(255) NOT NULL,
	"reflection_prompt" text NOT NULL,
	"practice_exercise" text NOT NULL,
	"journal_prompt" text NOT NULL,
	"action_item" text NOT NULL,
	"book_chapter" varchar(100),
	"chapter_focus" varchar(255),
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"user_notes" text,
	"user_rating" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_assignments_journey_day_unique" UNIQUE("user_journey_id","day_of_year")
);
--> statement-breakpoint
CREATE TABLE "user_journeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"assessment_result_id" uuid NOT NULL,
	"journey_start_date" timestamp NOT NULL,
	"calendar_year" integer NOT NULL,
	"current_day" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_journeys_user_year_unique" UNIQUE("user_id","calendar_year")
);
--> statement-breakpoint
ALTER TABLE "user_calendar_assignments" ADD CONSTRAINT "user_calendar_assignments_user_journey_id_user_journeys_id_fk" FOREIGN KEY ("user_journey_id") REFERENCES "public"."user_journeys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_journeys" ADD CONSTRAINT "user_journeys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_journeys" ADD CONSTRAINT "user_journeys_assessment_result_id_user_assessment_results_id_fk" FOREIGN KEY ("assessment_result_id") REFERENCES "public"."user_assessment_results"("id") ON DELETE cascade ON UPDATE no action;