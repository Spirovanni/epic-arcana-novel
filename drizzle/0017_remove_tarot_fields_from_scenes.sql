BEGIN;

-- Remove foreign key tied to the tarot card reference before dropping the column
ALTER TABLE "scenes" DROP CONSTRAINT IF EXISTS "scenes_tarot_card_id_trionfi_cards_id_fk";

-- Drop legacy tarot/timeline columns while keeping the existing title field
ALTER TABLE "scenes"
  DROP COLUMN IF EXISTS "tarot_symbolism",
  DROP COLUMN IF EXISTS "hero_journey_stage",
  DROP COLUMN IF EXISTS "primary_tarot_card",
  DROP COLUMN IF EXISTS "secondary_tarot_cards",
  DROP COLUMN IF EXISTS "tarot_card_id",
  DROP COLUMN IF EXISTS "tarot_narrative_role",
  DROP COLUMN IF EXISTS "francisco_tarot_connection",
  DROP COLUMN IF EXISTS "la_signora_tarot_connection",
  DROP COLUMN IF EXISTS "dagon_tarot_connection",
  DROP COLUMN IF EXISTS "card_reversal_significance",
  DROP COLUMN IF EXISTS "historical_date",
  DROP COLUMN IF EXISTS "story_timeline_date",
  DROP COLUMN IF EXISTS "historical_event_ids",
  DROP COLUMN IF EXISTS "temporal_divergence_point",
  DROP COLUMN IF EXISTS "alternate_timeline_variant",
  DROP COLUMN IF EXISTS "scene_title";

COMMIT;
