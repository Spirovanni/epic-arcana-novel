ALTER TABLE "characters" ADD COLUMN "slug" varchar(255);--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_slug_unique" UNIQUE("slug");