-- Create assessment enums
CREATE TYPE "public"."assessment_status" AS ENUM('in_progress', 'completed', 'abandoned');
CREATE TYPE "public"."question_type" AS ENUM('situational', 'preference', 'behavioral', 'personality');

-- Create assessments table
CREATE TABLE "assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"status" "assessment_status" DEFAULT 'in_progress' NOT NULL,
	"current_question_index" integer DEFAULT 0 NOT NULL,
	"total_questions" integer NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Create assessment_questions table
CREATE TABLE "assessment_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"question_id" varchar(100) NOT NULL,
	"question_type" "question_type" NOT NULL,
	"question_text" text NOT NULL,
	"question_data" jsonb NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Create assessment_answers table
CREATE TABLE "assessment_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"question_id" varchar(100) NOT NULL,
	"selected_option_index" integer NOT NULL,
	"selected_option_text" text NOT NULL,
	"scoring_data" jsonb NOT NULL,
	"answered_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Create user_assessment_results table
CREATE TABLE "user_assessment_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"assessment_id" uuid NOT NULL,
	"primary_player_type" varchar(100) NOT NULL,
	"secondary_player_type" varchar(100),
	"big_five_scores" jsonb NOT NULL,
	"enneagram_type" integer,
	"hero_journey_stage" varchar(100),
	"color_cycle_position" integer DEFAULT 1,
	"trionfi_card" varchar(100),
	"personality_profile" jsonb NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE "assessment_answers" ADD CONSTRAINT "assessment_answers_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user_assessment_results" ADD CONSTRAINT "user_assessment_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user_assessment_results" ADD CONSTRAINT "user_assessment_results_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;
