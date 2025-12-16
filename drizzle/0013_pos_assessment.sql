CREATE TABLE "app_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL DEFAULT '',
	"first_name" varchar(255) NOT NULL DEFAULT '',
	"last_name" varchar(255) NOT NULL DEFAULT '',
	"image_url" varchar(500) NOT NULL DEFAULT '',
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "app_users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE INDEX "app_users_email_idx" ON "app_users" USING btree ("email");
--> statement-breakpoint
CREATE TABLE "pos_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"assessment_key" varchar(50) NOT NULL DEFAULT 'pos60',
	"version" varchar(20) NOT NULL DEFAULT 'v1',
	"status" "assessment_status" NOT NULL DEFAULT 'in_progress',
	"is_retake" boolean NOT NULL DEFAULT false,
	"started_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp (0) with time zone,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_assessments" ADD CONSTRAINT "pos_assessments_user_id_app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "pos_assessments_user_status_idx" ON "pos_assessments" USING btree ("user_id","status");
--> statement-breakpoint
CREATE INDEX "pos_assessments_user_created_idx" ON "pos_assessments" USING btree ("user_id","created_at");
--> statement-breakpoint
CREATE TABLE "pos_assessment_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"question_id" varchar(100) NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_assessment_answers" ADD CONSTRAINT "pos_assessment_answers_assessment_id_pos_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."pos_assessments"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "pos_assessment_answers_assessment_question_unique" ON "pos_assessment_answers" USING btree ("assessment_id","question_id");
--> statement-breakpoint
CREATE INDEX "pos_assessment_answers_assessment_idx" ON "pos_assessment_answers" USING btree ("assessment_id");
--> statement-breakpoint
CREATE TABLE "pos_assessment_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"domain_scores" jsonb NOT NULL,
	"facet_scores" jsonb NOT NULL,
	"insights" jsonb NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_assessment_results" ADD CONSTRAINT "pos_assessment_results_assessment_id_pos_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."pos_assessments"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "pos_assessment_results_assessment_unique" ON "pos_assessment_results" USING btree ("assessment_id");
