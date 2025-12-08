# Enhanced Scenes Sync for Chapters 36-47

This guide explains how to sync the enhanced scene blueprints for chapters 36-47 to your Neon database.

## What Was Enhanced

12 consecutive chapters (36-47) with **48 total scenes** have been enhanced with:

- ✅ **Vivid, specific scene titles** capturing dramatic essence
- ✅ **Robust 5-7 sentence setups** with clear who/where/when, POV wants, concrete opposition, emotional landings
- ✅ **Focused symbolism** explicitly reflecting chapter themes and Human Framework concepts
- ✅ **Precise beat goals** in present tense stating story function (plot + character + theme)
- ✅ **Additional metadata**: POV, tense, core_emotion, scene_tone, timeline_date, timeline_variant, location

## Enhanced Chapters List

### Book 1 Finale (Chapters 36-40)
- **Chapter 36** - "The Three Convergences" (Collaborations/Partnerships)
- **Chapter 37** - "The Ace Ascendant" (Potentiality/Possibilities)
- **Chapter 38** - "The High Priestess Awakened" (Inner Knowledge/Self-Discovery)
- **Chapter 39** - "The Nine Fulfillments" (Success/Achievement)
- **Chapter 40** - "The Knight Ascendant" (Aspiration/Inspiration)

### Book 2 Beginning (Chapters 41-47)
- **Chapter 41** - "Abandoned Success" (Reflection)
- **Chapter 42** - "Intense Force" (Willpower)
- **Chapter 43** - "Intense Force" continued (Willpower)
- **Chapter 44** - "Thrive" (Resilience)
- **Chapter 45** - "Move Forward" (Progress)
- **Chapter 46** - "Gracious" (Gratitude)
- **Chapter 47** - "Sophisticated" (Discernment)

## Files Created

1. **add_enhanced_scene_fields.sql** - Database migration to add new scene fields
2. **seed-enhanced-scenes-36-47.mjs** - Seed script to sync scenes to database
3. **data/l_outline.json** - Updated with all enhanced scenes (57,533 lines)

## Sync Instructions

### Step 1: Run the Database Migration

First, add the new fields to your scenes table:

```bash
# Connect to your Neon database and run the migration
psql $DATABASE_URL -f add_enhanced_scene_fields.sql

# OR using Drizzle migrations
npm run db:migrate
```

### Step 2: Run the Seed Script

Sync the enhanced scenes to your database:

```bash
# Make sure you have your DATABASE_URL set in .env
node seed-enhanced-scenes-36-47.mjs
```

Expected output:
```
✓ Connected to database
📖 Loading l_outline.json...

🎯 Targeting chapters: 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47

📚 Processing Chapter 36...
  ✓ Found 3 scenes
  📝 Title: The Three Convergences
  ✓ Database chapter ID: [uuid]
    🎬 Scene 1: Pride Yields to Need
      ✓ Updated scene 1
    🎬 Scene 2: Dimensions Clash and Converge
      ✓ Updated scene 2
    ...

============================================================
✅ SEED COMPLETE
============================================================
📊 Total scenes processed: 48
✓  Total scenes updated/inserted: 48
📝 Chapters enhanced: 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47
============================================================
```

## Troubleshooting

### Database Connection Error

If you see: `error: database "xaviermartinez" does not exist`

Check your `.env` file and ensure `DATABASE_URL` is correctly configured:

```bash
# Example Neon connection string
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require
```

### Chapters Not Found in Database

If you see: `Chapter X not found in database - please seed chapters first`

You need to seed the chapters before the scenes:

```bash
node seed-all-books.mjs
# OR
npm run seed:chapters
```

### Missing Dependencies

If you get module errors:

```bash
npm install pg dotenv
# OR
bun install pg dotenv
```

## Verification

After running the seed script, verify the scenes in your database:

```sql
-- Check total scenes for chapters 36-47
SELECT c.all_chapter, c.title, COUNT(s.id) as scene_count
FROM chapters c
LEFT JOIN scenes s ON s.chapter_id = c.id
WHERE c.all_chapter BETWEEN 36 AND 47
GROUP BY c.all_chapter, c.title
ORDER BY c.all_chapter;

-- View enhanced fields for a specific chapter
SELECT 
  scene_number,
  scene_title,
  LEFT(setup, 100) as setup_preview,
  pov,
  core_emotion
FROM scenes s
JOIN chapters c ON s.chapter_id = c.id
WHERE c.all_chapter = 36
ORDER BY scene_number;
```

## Next Steps

After syncing these enhanced scenes, you can:

1. **Export to Sudowrite**: Use the enhanced `setup`, `symbolism`, and `beat_goal` fields as scene prompts
2. **Generate with NovelCrafter**: Import the structured scene data with clear POV, tone, and emotional guidance
3. **Continue Enhancement**: Apply the same enhancement pattern to additional chapters

## Schema Reference

New fields added to `scenes` table:

| Field | Type | Description |
|-------|------|-------------|
| `scene_title` | varchar(255) | Vivid, specific scene title |
| `setup` | text | 5-7 sentence detailed setup with POV wants, opposition, landing |
| `symbolism` | text | Focused symbolic elements reflecting chapter themes |
| `beat_goal` | text | Present-tense story function statement |
| `pov` | varchar(100) | Point of view (e.g., "3rd Person Limited (Francisco)") |
| `tense` | varchar(100) | Narrative tense (e.g., "Past Tense") |
| `core_emotion` | varchar(255) | Primary emotional tone of the scene |
| `scene_tone` | varchar(255) | Overall tone descriptors |
| `timeline_date` | varchar(100) | When the scene occurs in story timeline |
| `timeline_variant` | varchar(255) | Which timeline/reality variant |
| `location` | varchar(500) | Specific location where scene takes place |

## Support

For issues or questions:
- Check the console output for detailed error messages
- Verify your database connection string
- Ensure chapters 36-47 exist in your database before running the scene seed
- Review the `l_outline.json` file to confirm scene data is present

---

**Created**: December 2024  
**Data Source**: `/data/l_outline.json`  
**Target Chapters**: 36-47 (48 scenes total)

