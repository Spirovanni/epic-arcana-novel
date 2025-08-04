# Gemini Context: lore

This directory contains the JSON files that define the lore of the "Epic Arcana Novel". This data is used to seed the database and is the single source of truth for the story's content.

## Structure

The `lore` directory is organized by data type:

-   `characters/`: Information about characters.
-   `locations/`: Descriptions of locations.
-   `misc/`: Miscellaneous information, like military orders and symbolic objects.
-   `storyline/`: Outlines, character arcs, and inspirations.
-   `time_travel/`: Concepts related to time travel in the story.
-   `timelines/`: The main story timeline.
-   `trionfi_cards/`: Information about the Trionfi cards, a core element of the story.

## Guidelines

-   **Data Integrity:** When modifying these files, ensure that the JSON format is valid.
-   **Seeding:** The data in these files is seeded into the database using the `scripts/seed-lore.mjs` script. If you add a new file, you may need to update the seed script to include it.
