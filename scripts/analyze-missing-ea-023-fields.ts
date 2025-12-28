import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { and, gte, lte, isNotNull } from 'drizzle-orm';

async function main() {
  console.log('🔍 Analyzing format of missing fields in EA-001 to EA-022...\n');

  // Get chapters 1-22
  const earlyChapters = await db
    .select()
    .from(chapters)
    .where(and(gte(chapters.chapterNumber, 1), lte(chapters.chapterNumber, 22)))
    .orderBy(chapters.chapterNumber);

  const chapterIds = earlyChapters.map((ch) => ch.id);

  // Get all scenes from chapters 1-22
  const allScenes = await db.select().from(scenes);
  const earlyScenes = allScenes.filter((s) => chapterIds.includes(s.chapterId));

  console.log(`📊 Analyzing ${earlyScenes.length} scenes from chapters 1-22\n`);

  // Analyze each field
  const fieldsToAnalyze = [
    'sceneCardProgression',
    'realWorldContext',
    'timelineSignificance',
    'sudowrite_metadata',
    'learning_objectives',
    'foreshadowing_elements',
  ];

  for (const field of fieldsToAnalyze) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Field: ${field}`);
    console.log('='.repeat(80));

    const scenesWithField = earlyScenes.filter((s) => {
      const value = s[field as keyof typeof s];
      return value !== null && value !== undefined;
    });

    console.log(`Populated: ${scenesWithField.length}/${earlyScenes.length} scenes`);

    if (scenesWithField.length > 0) {
      console.log('\nSample values:\n');

      // Show 3 examples
      for (let i = 0; i < Math.min(3, scenesWithField.length); i++) {
        const scene = scenesWithField[i];
        const value = scene[field as keyof typeof scene];

        console.log(`Example ${i + 1}:`);
        console.log(`  Scene: ${scene.title || 'Untitled'}`);

        if (typeof value === 'object') {
          console.log(`  Type: JSON/Object`);
          console.log(`  Value: ${JSON.stringify(value, null, 2).substring(0, 500)}...`);
        } else if (typeof value === 'number') {
          console.log(`  Type: Number`);
          console.log(`  Value: ${value}`);
        } else {
          console.log(`  Type: ${typeof value}`);
          console.log(`  Value: ${String(value).substring(0, 200)}...`);
        }
        console.log('');
      }
    } else {
      console.log('  ❌ No populated examples found');
    }
  }

  console.log('\n✅ Analysis complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
