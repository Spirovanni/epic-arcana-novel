ALTER TABLE "scenes" ADD COLUMN "primary_tarot_card" varchar(100);--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "secondary_tarot_cards" jsonb;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "tarot_card_id" uuid;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "tarot_narrative_role" varchar(255);--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "francisco_tarot_connection" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "la_signora_tarot_connection" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "dagon_tarot_connection" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "temporal_power_manifested" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "character_growth_element" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "scene_card_progression" integer;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "card_reversal_significance" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD CONSTRAINT "scenes_tarot_card_id_trionfi_cards_id_fk" FOREIGN KEY ("tarot_card_id") REFERENCES "public"."trionfi_cards"("id") ON DELETE no action ON UPDATE no action;