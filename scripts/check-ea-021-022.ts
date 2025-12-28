import { eq, or } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🔍 Checking EA-021 and EA-022 current state...\n');

  // Find EA-021 and EA-022
  const targetChapters = await db
    .select()
    .from(chapters)
    .where(
      or(
        eq(chapters.uniqueIdentifier, 'EA-021'),
        eq(chapters.uniqueIdentifier, 'EA-022')
      )
    );

  console.log(`Found ${targetChapters.length} chapters\n`);

  for (const chapter of targetChapters) {
    console.log('='.repeat(80));
    console.log(`\n📖 ${chapter.uniqueIdentifier}: ${chapter.title}`);
    console.log(`   Chapter Number: ${chapter.chapterNumber}`);
    console.log(`   ID: ${chapter.id}\n`);

    // Get scenes
    const chapterScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapter.id));

    console.log(`🎬 ${chapterScenes.length} scenes found\n`);

    // Check the specific fields
    const fieldsToCheck = [
      'focus',
      'pages',
      'characterGrowthElement',
      'sceneCardProgression',
      'realWorldContext',
      'timelineSignificance',
    ];

    for (const scene of chapterScenes) {
      console.log(`Scene ${scene.sceneNumber}: ${scene.title || 'Untitled'}`);

      for (const field of fieldsToCheck) {
        const value = scene[field as keyof typeof scene];
        const status = value ? '✅' : '❌';
        console.log(`   ${status} ${field}: ${value ? 'HAS DATA' : 'MISSING'}`);
      }
      console.log('');
    }
  }

  console.log('='.repeat(80));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
