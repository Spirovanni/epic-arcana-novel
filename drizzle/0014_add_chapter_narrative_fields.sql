-- Add story structure and narrative fields to chapters table
ALTER TABLE chapters ADD COLUMN scene_number integer;
ALTER TABLE chapters ADD COLUMN hero_journey_beat varchar(100);
ALTER TABLE chapters ADD COLUMN hero_journey_beat_objective text;
ALTER TABLE chapters ADD COLUMN plot_beat varchar(100);
ALTER TABLE chapters ADD COLUMN save_the_cat_beat varchar(100);
ALTER TABLE chapters ADD COLUMN save_the_cat_beat_goal text;

-- Add JSON metadata fields for complex data
ALTER TABLE chapters ADD COLUMN character_arcs jsonb;
ALTER TABLE chapters ADD COLUMN story_gaps_addressed jsonb;
ALTER TABLE chapters ADD COLUMN location_details jsonb;
ALTER TABLE chapters ADD COLUMN series_connections jsonb;

-- Add relationship identifier fields
ALTER TABLE chapters ADD COLUMN task_master_key varchar(50);
ALTER TABLE chapters ADD COLUMN major_task_group_key varchar(50);
ALTER TABLE chapters ADD COLUMN specific_task_group_key varchar(50);

-- Add alternative/supplementary fields
ALTER TABLE chapters ADD COLUMN epic_preliminary_scene_focus varchar(255);
ALTER TABLE chapters ADD COLUMN epic_preliminary_scene_description text;
ALTER TABLE chapters ADD COLUMN new_tarot_family varchar(50);
