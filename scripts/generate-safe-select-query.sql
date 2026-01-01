-- Safe SELECT query for Neon DB table view
-- This query only selects columns that actually exist in the chapters table

SELECT 
  "id",
  "book_id",
  "major_task_group_id",
  "chapter_number",
  "chapter_id",
  "unique_identifier",
  "title",
  "focus",
  "epic_novel_pages",
  "epic_chapter_focus",
  "epic_novel_chapter_focus",
  "epic_novel_section_name",
  "description",
  "tarot_card_link",
  "tarot_family",
  "tarot_card_item",
  "color_theme",
  "created_at",
  "updated_at",
  "icon_path",
  "type",
  "color_name",
  "hex_code",
  "red",
  "green",
  "blue",
  "focus_area",
  "connection_to_major_task_group",
  "specific_task_group_description",
  "specific_task_group_tagline",
  "specific_task_group_books_influenced_by",
  "terminal_learning_objectives",
  "chapter_title",
  "summary",
  "character_arcs",
  "story_gaps_addressed",
  "epic_preliminary_scene_focus",
  "epic_preliminary_scene_description",
  "new_tarot_family"
FROM "chapters"
ORDER BY "chapters"."id"
LIMIT 50;

