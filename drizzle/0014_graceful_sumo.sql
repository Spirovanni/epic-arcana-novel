CREATE TABLE "app_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"email" varchar(255) DEFAULT '' NOT NULL,
	"first_name" varchar(255) DEFAULT '' NOT NULL,
	"last_name" varchar(255) DEFAULT '' NOT NULL,
	"image_url" varchar(500) DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "app_users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "pos_assessment_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"question_id" varchar(100) NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pos_assessment_answers_assessment_question_unique" UNIQUE("assessment_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "pos_assessment_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"domain_scores" jsonb NOT NULL,
	"facet_scores" jsonb NOT NULL,
	"insights" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pos_assessment_results_assessment_unique" UNIQUE("assessment_id")
);
--> statement-breakpoint
CREATE TABLE "pos_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"assessment_key" varchar(50) DEFAULT 'pos60' NOT NULL,
	"version" varchar(20) DEFAULT 'v1' NOT NULL,
	"status" "assessment_status" DEFAULT 'in_progress' NOT NULL,
	"is_retake" boolean DEFAULT false NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_clerkId_unique";--> statement-breakpoint
ALTER TABLE "scenes" DROP CONSTRAINT "scenes_tarot_card_id_trionfi_cards_id_fk";
--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "chapter_unique_identifier" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_suspended" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_locked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_phone_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_premium" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_trial" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_trial_expired" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_trial_started" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_trial_ended" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "credits_used" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "credits_remaining" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "credits_exhausted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "credits_exhausted_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "credits_exhausted_reason" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "credits_exhausted_reason_description" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image_url" varchar(500) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_assessment_answers" ADD CONSTRAINT "pos_assessment_answers_assessment_id_pos_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."pos_assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_assessment_results" ADD CONSTRAINT "pos_assessment_results_assessment_id_pos_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."pos_assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_assessments" ADD CONSTRAINT "pos_assessments_user_id_app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "app_users_email_idx" ON "app_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "pos_assessment_answers_assessment_idx" ON "pos_assessment_answers" USING btree ("assessment_id");--> statement-breakpoint
CREATE INDEX "pos_assessments_user_status_idx" ON "pos_assessments" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "pos_assessments_user_created_idx" ON "pos_assessments" USING btree ("user_id","created_at");--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "tarot_symbolism";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "hero_journey_stage";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "primary_tarot_card";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "secondary_tarot_cards";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "tarot_card_id";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "tarot_narrative_role";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "francisco_tarot_connection";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "la_signora_tarot_connection";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "dagon_tarot_connection";--> statement-breakpoint

ALTER TABLE "scenes" DROP COLUMN "card_reversal_significance";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "historical_date";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "story_timeline_date";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "historical_event_ids";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "temporal_divergence_point";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "alternate_timeline_variant";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isVerified";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isActive";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isDeleted";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isSuspended";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isLocked";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isEmailVerified";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isPhoneVerified";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isPremium";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isTrial";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isTrialExpired";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isTrialStarted";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isTrialEnded";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "creditsUsed";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "creditsRemaining";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "creditsExhausted";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "creditsExhaustedAt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "creditsExhaustedReason";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "creditsExhaustedReasonDescription";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "clerkId";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "firstName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "lastName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "imageUrl";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerkId_unique" UNIQUE("clerk_id");