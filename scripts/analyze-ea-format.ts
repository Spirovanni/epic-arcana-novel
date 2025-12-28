import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

async function main() {
  console.log('🔍 Analyzing EA-001 to EA-022 format...\n');

  // Get chapters 1-22
  const earlyChapters = await db
    .select()
    .from(chapters)
    .where(and(
      gte(chapters.chapterNumber, 1),
      lte(chapters.chapterNumber, 22)
    ))
    .orderBy(chapters.chapterNumber);

  console.log(`📖 Found ${earlyChapters.length} chapters\n`);

  // Analyze Chapter fields
  console.log('📊 CHAPTER FIELD ANALYSIS:');
  console.log('='.repeat(80));

  const chapterFieldStats: Record<string, number> = {};
  const sampleChapter = earlyChapters[0];

  if (sampleChapter) {
    const chapterKeys = Object.keys(sampleChapter) as (keyof typeof sampleChapter)[];

    for (const key of chapterKeys) {
      const populated = earlyChapters.filter(ch => ch[key] !== null && ch[key] !== undefined && ch[key] !== '').length;
      chapterFieldStats[key] = populated;

      const percentage = ((populated / earlyChapters.length) * 100).toFixed(0);
      const status = populated === earlyChapters.length ? '✅' : populated > 0 ? '⚠️ ' : '❌';
      console.log(`${status} ${key.padEnd(35)} ${populated}/${earlyChapters.length} (${percentage}%)`);
    }
  }

  // Get scenes from chapters 1-22
  console.log('\n📊 SCENE FIELD ANALYSIS:');
  console.log('='.repeat(80));

  const chapterIds = earlyChapters.map(ch => ch.id);
  const earlyScenes = await db
    .select()
    .from(scenes)
    .where(
      // We need to check if chapterId is in the list
      // Drizzle doesn't have a simple 'in' for arrays in all contexts, so we'll fetch all and filter
    );

  // Filter scenes that belong to chapters 1-22
  const filteredScenes = earlyScenes.filter(s => chapterIds.includes(s.chapterId));

  console.log(`🎬 Analyzing ${filteredScenes.length} scenes from chapters 1-22\n`);

  const sceneFieldStats: Record<string, number> = {};
  const sampleScene = filteredScenes[0];

  if (sampleScene) {
    const sceneKeys = Object.keys(sampleScene) as (keyof typeof sampleScene)[];

    for (const key of sceneKeys) {
      const populated = filteredScenes.filter(sc => {
        const value = sc[key];
        return value !== null && value !== undefined && value !== '';
      }).length;
      sceneFieldStats[key] = populated;

      const percentage = ((populated / filteredScenes.length) * 100).toFixed(0);
      const status = populated === filteredScenes.length ? '✅' : populated > filteredScenes.length * 0.5 ? '⚠️ ' : '❌';
      console.log(`${status} ${key.padEnd(35)} ${populated}/${filteredScenes.length} (${percentage}%)`);
    }
  }

  // Now check EA-023
  console.log('\n📊 EA-023 CURRENT STATE:');
  console.log('='.repeat(80));

  const chapter23 = await db
    .select()
    .from(chapters)
    .where(eq(chapters.chapterNumber, 23))
    .limit(1);

  if (chapter23.length > 0) {
    const ch = chapter23[0];
    const chapterKeys = Object.keys(ch) as (keyof typeof ch)[];

    console.log('\nChapter 23 Fields:');
    for (const key of chapterKeys) {
      const value = ch[key];
      const isEmpty = value === null || value === undefined || value === '';
      const status = isEmpty ? '❌ MISSING' : '✅ HAS DATA';
      console.log(`${status} ${key.padEnd(35)} ${isEmpty ? '' : '(has value)'}`);
    }

    const scenes23 = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, ch.id));

    console.log(`\nChapter 23 Scenes (${scenes23.length} total):`);
    if (scenes23.length > 0) {
      const sceneKeys = Object.keys(scenes23[0]) as (keyof typeof scenes23[0])[];

      for (const key of sceneKeys) {
        const populated = scenes23.filter(s => {
          const value = s[key];
          return value !== null && value !== undefined && value !== '';
        }).length;

        const status = populated === scenes23.length ? '✅ ALL' : populated > 0 ? '⚠️  PARTIAL' : '❌ NONE';
        console.log(`${status} ${key.padEnd(35)} ${populated}/${scenes23.length}`);
      }
    }
  }

  console.log('\n✅ Analysis complete!');
  console.log('\nNext step: Fill in missing fields based on EA-001 to EA-022 patterns');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
