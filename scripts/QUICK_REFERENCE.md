# Scene Importer Quick Reference

## Most Common Commands

### 1. Import Next Scene (Default)
```bash
yarn import:scene
```
Processes the next unimported scene in outline order.

### 2. Preview Before Importing (Dry Run)
```bash
yarn import:scene --dry-run
```
Shows what would be imported without writing to database.

### 3. Import Specific Chapter
```bash
# For Chapter 41 (STG 2.1.1.1)
yarn import:scene --chapter-id 1d524e45-469a-4709-bfcd-456d6486177c

# Or by chapter title/label
yarn import:scene --chapter "Chapter 1"
```

### 4. Import All Remaining Scenes
```bash
yarn import:scene --run-all
```

### 5. Import Multiple Scenes with Limit
```bash
yarn import:scene --run-all --limit 10
```

### 6. Force Overwrite Existing Data
```bash
yarn import:scene --force
```
Updates all fields even if already filled.

### 7. Reset and Start Over
```bash
yarn import:scene --reset-state --run-all
```

## Key Files

- **Importer**: `scripts/importNextSceneFromOutline.ts`
- **Field Mapping**: `scripts/lib/outlineToScenes.ts`
- **State Tracking**: `.scene-import-state.json` (repo root)
- **Source Data**: `data/l_outline.json`
- **Documentation**: `scripts/README.md`

## Story Sequence Tracking

The importer maintains strict ordering via:
1. `.scene-import-state.json` tracks last `story_sequence` used
2. Database max checked on each run
3. Whichever is higher becomes the baseline
4. New scenes increment by 1

## Field Mapping Priorities

- `focus`: `raw.focus` → `raw.focus_area` → `chapterContext.epicChapterFocus`
- `pages`: `raw.pages` → `raw.epic_novel_pages` → `chapterContext.epicNovelPages`
- `narrativeFunction`: `raw.narrative_function` → `chapterContext.connectionToMajorTaskGroup`

## Timeline Fields (Never Invented)

These fields are ONLY set if present in outline:
- `timeline_variant`
- `timeline_date`
- `timeline_significance`
- `temporalPowerManifested`

## Troubleshooting

**"No scenes found"**: Check that `data/l_outline.json` exists and has valid structure.

**"Unable to resolve chapter"**: Chapter doesn't exist in DB. Create it first or adjust outline data.

**State out of sync**: Run `yarn import:scene --reset-state`

## Example Workflow

```bash
# 1. Preview what will be imported
yarn import:scene --dry-run --chapter-id <uuid>

# 2. Import the scene
yarn import:scene --chapter-id <uuid>

# 3. Verify in database (run verification script)
tsx scripts/verify-imported-scenes.ts

# 4. Continue with remaining scenes
yarn import:scene --run-all --chapter-id <uuid>
```

## Verification

Check state file:
```bash
cat .scene-import-state.json
```

Check imported scenes:
```bash
tsx scripts/verify-imported-scenes.ts
```

Check database schema:
```bash
tsx scripts/verify-scenes-schema.ts
```
