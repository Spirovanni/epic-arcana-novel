import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔍 Checking EA-043 field completion...\n');

  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-043'))
    .limit(1);

  if (!chapter) {
    console.error('❌ EA-043 not found');
    process.exit(1);
  }

  const chapterScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  const allFields = [
    // Enhanced fields (18)
    'pages', 'description', 'focus', 'chapterSceneFocus', 'preliminarySceneFocus',
    'preliminarySceneDescription', 'narrativeFunction', 'sensoryDetail', 'internalConflict',
    'characterGrowthElement', 'seriesConnectionResonance', 'sceneCardProgression',
    'realWorldContext', 'timelineSignificance', 'saveTheCatBeat', 'sudowriteMetadata',
    'learningObjectives', 'foreshadowingElements',
    // Outline fields (12)
    'sceneNumber', 'title', 'setup', 'symbolism', 'beatGoal', 'pov', 'tense',
    'coreEmotion', 'sceneTone', 'timelineDate', 'timelineVariant', 'location',
  ];

  for (const scene of chapterScenes.sort((a, b) => (a.sceneNumber || 0) - (b.sceneNumber || 0))) {
    console.log(`\n📋 Scene ${scene.sceneNumber}: ${scene.title}`);

    const missingFields: string[] = [];
    const presentFields: string[] = [];

    for (const field of allFields) {
      const value = scene[field as keyof typeof scene];
      if (value === null || value === undefined) {
        missingFields.push(field);
      } else {
        presentFields.push(field);
      }
    }

    console.log(`   ✅ Present: ${presentFields.length}/${allFields.length}`);
    console.log(`   ❌ Missing: ${missingFields.length}/${allFields.length}`);

    if (missingFields.length > 0) {
      console.log(`   Missing fields: ${missingFields.join(', ')}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
