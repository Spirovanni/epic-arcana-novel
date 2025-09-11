CREATE TYPE "public"."assessment_status" AS ENUM('in_progress', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('situational', 'preference', 'behavioral', 'personality');--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"role" varchar(255) DEFAULT 'user' NOT NULL,
	"status" varchar(255) DEFAULT 'active' NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"isSuspended" boolean DEFAULT false NOT NULL,
	"isLocked" boolean DEFAULT false NOT NULL,
	"isEmailVerified" boolean DEFAULT false NOT NULL,
	"isPhoneVerified" boolean DEFAULT false NOT NULL,
	"isPremium" boolean DEFAULT false NOT NULL,
	"isTrial" boolean DEFAULT false NOT NULL,
	"isTrialExpired" boolean DEFAULT false NOT NULL,
	"isTrialStarted" boolean DEFAULT false NOT NULL,
	"isTrialEnded" boolean DEFAULT false NOT NULL,
	"credits" integer DEFAULT 0 NOT NULL,
	"creditsUsed" integer DEFAULT 0 NOT NULL,
	"creditsRemaining" integer DEFAULT 0 NOT NULL,
	"creditsExhausted" boolean DEFAULT false NOT NULL,
	"creditsExhaustedAt" timestamp,
	"creditsExhaustedReason" varchar(255) DEFAULT '' NOT NULL,
	"creditsExhaustedReasonDescription" varchar(255) DEFAULT '' NOT NULL,
	"clerkId" varchar(255) NOT NULL,
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_clerkId_unique" UNIQUE("clerkId")
);
--> statement-breakpoint
ALTER TABLE "assessment_answers" ADD CONSTRAINT "assessment_answers_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_assessment_results" ADD CONSTRAINT "user_assessment_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_assessment_results" ADD CONSTRAINT "user_assessment_results_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;