CREATE TABLE "timeline_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_key" varchar(50) NOT NULL,
	"label" varchar(255) NOT NULL,
	"year" integer,
	"era" varchar(100) NOT NULL,
	"historical" integer NOT NULL,
	"summary" text NOT NULL,
	"month" varchar(20),
	"day" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "timeline_events_event_key_unique" UNIQUE("event_key")
);
