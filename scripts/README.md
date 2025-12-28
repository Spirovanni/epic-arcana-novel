# Scene Importer Scripts

These scripts handle importing scenes from `data/l_outline.json` into the PostgreSQL database using Drizzle ORM.

## Overview

The scene importer is designed to process scenes **one at a time** from the outline JSON, maintaining correct story progression through`story_sequence` tracking and a persistent state file.

## Usage

### Import One Scene (Default Mode)

```bash
yarn import:scene
```

This processes the next unimported scene in outline order.

### Dry Run (Preview Without Importing)

```bash
yarn import:scene --dry-run
```

Shows which scene would be imported and what data would be written, without actually writing to the database.

### Import With Specific Chapter

```bash
# By chapter ID (UUID)
yarn import:scene --chapter-id 1d524e45-469a-4709-bfcd-456d6486177c

# By chapter title/label
yarn import:scene --chapter "Chapter 1"
```

### Import All Remaining Scenes

```bash
yarn import:scene --run-all
```

Processes all remaining scenes sequentially, one at a time, until all are imported.

### Import With Limit

```bash
yarn import:scene --run-all --limit 10
```

Process up to 10 scenes, then stop. Only works with `--run-all`.

### Force Overwrite Existing Data

```bash
yarn import:scene --force
```

Overwrites existing scene data even if fields are already filled. Without `--force`, only NULL/blank fields are updated.

### Skip Existing Scenes

```bash
yarn import:scene --skip-existing
```

Only insert new scenes, never update existing ones (even if they have blank fields).

### Reset State File

```bash
yarn import:scene --reset-state
```

Deletes `.scene-import-state.json` and starts fresh. Useful if state gets out of sync with database.

### Combine Flags

```bash
# Dry run the next 5 scenes for a specific chapter
yarn import:scene --dry-run --run-all --limit 5 --chapter-id 1d524e45-469a-4709-bfcd-456d6486177c

# Force reimport all scenes in Chapter 41
yarn import:scene --run-all --force --chapter-id 1d524e45-469a-4709-bfcd-456d6486177c
```

## How It Works

### Story Progression Tracking

Each scene receives a unique `story_sequence` number that never decreases. The importer:

1. Checks the current maximum `story_sequence` in the database
2. Compares with the last sequence in `.scene-import-state.json`
3. Uses whichever is higher as the starting point
4. Increments by 1 for each new scene processed

### Chronological Sequence

- By default, `chronological_sequence = story_sequence`
- If timeline divergence is detected (e.g., `timeline_variant` field present), special handling applies
- Timeline fields are NEVER invented - they come from the outline or remain NULL

### Scene Selection Order

Scenes are processed in **outline order**:

1. Ordered by chapter appearance in `l_outline.json`
2. Then by `scene_number` within each chapter
3. Then by stable input order

### Chapter Resolution

For each scene, the chapter is resolved by trying (in order):

1. **Unique Identifier** (`unique_identifier` field)
2. **Chapter Number** (numeric `chapter_number`)
3. **Title Match** (`chapter_title`)

If chapter doesn't exist, the script will use safe defaults for creation if possible.

### Field Mapping

Fields are mapped from the outline with the following priorities:

- **pages**: `pages` → `epic_novel_pages`
- **focus**: `focus` → `focus_area` → `epic_chapter_focus`
- **preliminarySceneFocus**: `epic_preliminary_scene_focus`
- **description**: `epic_preliminary_scene_description` → other description fields
- **narrativeFunction**: `connection_to_the_major_task_group`

### Creative Fills

When fields are missing in BOTH the outline and existing database row:

- **Basic narrative fields** are filled deterministically using templates
- **Timeline/temporal fields** are NEVER filled - they remain NULL unless present in outline
- All fills are **deterministic** based on a seed `${chapterId}:${sceneNumber}`

Timeline-related fields that are never invented:
- `timeline_variant`
- `timeline_date`
- `timeline_significance`
- `temporalPowerManifested`
- `temporal_divergence_point`

### Update Strategy

- **New scenes**: Full insert with all mapped fields
- **Existing scenes**:
  - With `--skip-existing`: No update
  - With `--force`: Overwrite all fields
  - Default: Only update NULL/blank fields ("fill gaps")

### JSONB Field Validation

The script validates that all JSONB fields contain valid JSON before insertion:

- `sudowrite_metadata`: POV, tense, tone, style notes, etc.
- `learning_objectives`: Array of objective strings
- `foreshadowing_elements`: Array of foreshadowing hints

### State File

`.scene-import-state.json` (repo root) tracks:

```json
{
  "lastProcessed": {
    "chapterId": "uuid-here",
    "sceneNumber": 3
  },
  "lastStorySequence": 127
}
```

This ensures:
- No duplicate `story_sequence` values
- Resumable imports if interrupted
- Consistent ordering across multiple runs

## Example Output

### Single Scene Import

```bash
$ yarn import:scene

✅ Imported Scene 1 (EA-041) -> story_sequence 128
Notes: Timeline divergence indicators detected in outline data
```

### Dry Run

```bash
$ yarn import:scene --dry-run

--- DRY RUN ---
Next scene: Chapter EA-041 (1d524e45-469a-4709-bfcd-456d6486177c) Scene 1
story_sequence -> 129
chronological_sequence -> 129
payload: {
  "chapterId": "1d524e45-469a-4709-bfcd-456d6486177c",
  "sceneNumber": 1,
  "title": "The Abandoned Workspace",
  "focus": "Mental Health",
  ...
}
notes: []
```

### Batch Import

```bash
$ yarn import:scene --run-all --limit 5

✅ Imported Scene 1 (EA-041) -> story_sequence 128
✅ Imported Scene 2 (EA-041) -> story_sequence 129
✅ Imported Scene 3 (EA-041) -> story_sequence 130
✅ Imported Scene 4 (EA-041) -> story_sequence 131
ℹ️  Scene 5 already up to date for chapter EA-042.
Finished processing 4 scene(s).
```

## Troubleshooting

### "No scenes found in outline"

- Check that `data/l_outline.json` exists and has valid JSON
- Verify scenes are nested under chapters with `scenes` arrays
- Try without filters: `yarn import:scene --dry-run`

### "Unable to resolve chapter"

- Chapter doesn't exist in database
- Check `unique_identifier`, `chapter_number`, or `title` match
- Consider creating the chapter first or adjusting outline data

### "No eligible scenes were processed"

- All scenes already imported and up-to-date
- Try with `--force` to reimport
- Check filters (`--chapter`, `--chapter-id`)

### State File Out of Sync

```bash
# Reset and reimport
yarn import:scene --reset-state --run-all
```

### Story Sequence Gaps

The system automatically handles gaps by using `max(db_sequence, state_sequence)` on each run.

## Architecture

### Files

- **`scripts/importNextSceneFromOutline.ts`**: Main CLI script
- **`scripts/lib/outlineToScenes.ts`**: Field mapping & parsing logic
- **`scripts/lib/importState.ts`**: State file management
- **`src/lib/db.ts`**: Drizzle DB connection
- **`src/lib/schema.ts`**: Table schemas

### Key Functions

- `loadOutlineScenes()`: Parse JSON and extract scenes in order
- `buildSceneValuesFromOutline()`: Map outline data to scene columns
- `resolveChapterId()`: Match outline chapter to DB chapter
- `computeUpdates()`: Determine which fields to update
- `deriveMissingFields()`: Deterministic creative fills

## Database Schema

The `scenes` table key fields:

- `id`: UUID primary key (auto-generated)
- `chapter_id`: FK to chapters table (NOT NULL)
- `scene_number`: Int, must be positive (NOT NULL)
- `story_sequence`: Int, determines reading order
- `chronological_sequence`: Int, may differ for timeline variants
- `timeline_variant`, `timeline_date`, etc.: Timeline metadata
- `sudowrite_metadata`, `learning_objectives`, `foreshadowing_elements`: JSONB

**Note**: There is NO unique constraint on `(chapter_id, scene_number)`, so conflicts are handled in application code.

## Best Practices

1. **Always dry-run first** when working with new chapters
2. **Use `--force` sparingly** - it overwrites existing data
3. **Check state file** if imports seem out of order
4. **Process systematically** - one chapter at a time with `--chapter-id`
5. **Verify in database** after bulk imports with `--run-all`

## Related Scripts

- `scripts/verify-scenes-schema.ts`: Check constraints and current state
- `scripts/check_data.ts`: Validate scene data integrity
- Various `sync-*` scripts: Legacy importers (prefer this one)
