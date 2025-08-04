# Timelines JSON Directory

This folder contains timeline data files for the novel project. Each file represents a structured timeline of historical, mythic, and fictional events relevant to the story world.

## main_story_timeline.json
- **Purpose:** Serves as the canonical timeline for the main narrative, including mythic, historical, and fictional events.
- **Schema:**
  - `timeline`: Array of timeline events, each with:
    - `id` (string): Unique event identifier (e.g., "hist-48bce-001")
    - `label` (string): Short event title
    - `year` (number|null): Year of the event (negative for BCE, null if not applicable)
    - `era` (string): Era or period (e.g., "Mythic", "Late Roman Republic")
    - `historical` (boolean): True if the event is historical, false if mythic/fictional
    - `summary` (string): Brief description of the event
    - (optional) `month` (string|number): Month of the event
    - (optional) `day` (string|number): Day of the event

## Usage
- Use these files to seed timeline visualizations, narrative logic, or worldbuilding tools.
- Extend with additional timelines as needed for alternate histories, character arcs, etc. 