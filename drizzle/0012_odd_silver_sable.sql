CREATE TYPE "public"."membership_tier" AS ENUM('free', 'basic', 'premium', 'ultimate');--> statement-breakpoint
CREATE TABLE "assessment_answers_v2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"question_key" text NOT NULL,
	"answer_type" varchar(20) DEFAULT 'likert' NOT NULL,
	"value" jsonb NOT NULL,
	"answered_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "assessment_answers_v2_session_question_unique" UNIQUE("session_id","question_key")
);
--> statement-breakpoint
CREATE TABLE "assessment_results_v2" (
	"session_id" uuid PRIMARY KEY NOT NULL,
	"result" jsonb NOT NULL,
	"computed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessment_sessions_v2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'in_progress' NOT NULL,
	"is_retake" boolean DEFAULT false NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapter_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapter_id" uuid NOT NULL,
	"task_id" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"user_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "chapter_task_unique" UNIQUE("chapter_id","task_id")
);
--> statement-breakpoint
CREATE TABLE "connection_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"learning_resource_id" uuid NOT NULL,
	"chapter_id" uuid NOT NULL,
	"point_number" integer NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "connection_points_unique" UNIQUE("learning_resource_id","chapter_id","point_number")
);
--> statement-breakpoint
CREATE TABLE "guilds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "learning_resource_chapters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"learning_resource_id" uuid NOT NULL,
	"chapter_id" uuid NOT NULL,
	"order_index" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "learning_resource_chapters_unique" UNIQUE("learning_resource_id","chapter_id")
);
--> statement-breakpoint
CREATE TABLE "learning_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resource_id" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255),
	"section_of_focus" varchar(255),
	"section_description" text,
	"connection_focus_area" text,
	"specific_task_group_title" varchar(255),
	"focus_area" varchar(255),
	"tagline" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "learning_resources_resource_id_unique" UNIQUE("resource_id")
);
--> statement-breakpoint
CREATE TABLE "occupations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(20),
	"description" text,
	"parent_id" uuid,
	"vocation_id" uuid,
	"guild_id" uuid,
	"daily_wage" integer,
	"sample_titles" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "occupations_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "terminal_learning_objectives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"learning_resource_id" uuid NOT NULL,
	"chapter_id" uuid NOT NULL,
	"objective_number" integer NOT NULL,
	"description" text NOT NULL,
	"bloom_level" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "terminal_learning_objectives_unique" UNIQUE("learning_resource_id","chapter_id","objective_number")
);
--> statement-breakpoint
CREATE TABLE "vocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar(255) NOT NULL,
	"event_type" varchar(255) NOT NULL,
	"processed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "webhook_events_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "scene_number" integer;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "hero_journey_beat" varchar(100);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "hero_journey_beat_objective" text;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "plot_beat" varchar(100);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "save_the_cat_beat" varchar(100);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "save_the_cat_beat_goal" text;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "character_arcs" jsonb;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "story_gaps_addressed" jsonb;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "location_details" jsonb;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "series_connections" jsonb;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "task_master_key" varchar(50);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "major_task_group_key" varchar(50);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "specific_task_group_key" varchar(50);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "epic_preliminary_scene_focus" varchar(255);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "epic_preliminary_scene_description" text;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "new_tarot_family" varchar(50);--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "ai_prompt" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_seen_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "membership_tier" "membership_tier" DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "membership_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_user_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "imageUrl" varchar(500) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "assessment_answers_v2" ADD CONSTRAINT "assessment_answers_v2_session_id_assessment_sessions_v2_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."assessment_sessions_v2"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_results_v2" ADD CONSTRAINT "assessment_results_v2_session_id_assessment_sessions_v2_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."assessment_sessions_v2"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_sessions_v2" ADD CONSTRAINT "assessment_sessions_v2_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_tasks" ADD CONSTRAINT "chapter_tasks_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection_points" ADD CONSTRAINT "connection_points_learning_resource_id_learning_resources_id_fk" FOREIGN KEY ("learning_resource_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection_points" ADD CONSTRAINT "connection_points_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_resource_chapters" ADD CONSTRAINT "learning_resource_chapters_learning_resource_id_learning_resources_id_fk" FOREIGN KEY ("learning_resource_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_resource_chapters" ADD CONSTRAINT "learning_resource_chapters_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "occupations" ADD CONSTRAINT "occupations_vocation_id_vocations_id_fk" FOREIGN KEY ("vocation_id") REFERENCES "public"."vocations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "occupations" ADD CONSTRAINT "occupations_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "terminal_learning_objectives" ADD CONSTRAINT "terminal_learning_objectives_learning_resource_id_learning_resources_id_fk" FOREIGN KEY ("learning_resource_id") REFERENCES "public"."learning_resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "terminal_learning_objectives" ADD CONSTRAINT "terminal_learning_objectives_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assessment_answers_v2_session_idx" ON "assessment_answers_v2" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "assessment_sessions_v2_user_status_idx" ON "assessment_sessions_v2" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "connection_points_resource_chapter_idx" ON "connection_points" USING btree ("learning_resource_id","chapter_id");--> statement-breakpoint
CREATE INDEX "connection_points_chapter_idx" ON "connection_points" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX "learning_resource_chapters_chapter_idx" ON "learning_resource_chapters" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX "learning_resource_chapters_resource_idx" ON "learning_resource_chapters" USING btree ("learning_resource_id");--> statement-breakpoint
CREATE INDEX "terminal_learning_objectives_resource_chapter_idx" ON "terminal_learning_objectives" USING btree ("learning_resource_id","chapter_id");--> statement-breakpoint
CREATE INDEX "terminal_learning_objectives_chapter_idx" ON "terminal_learning_objectives" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX "terminal_learning_objectives_bloom_idx" ON "terminal_learning_objectives" USING btree ("bloom_level");--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "image_prompt";--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "open_art_link";--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "custom_setting";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerkUserId_unique" UNIQUE("clerk_user_id");