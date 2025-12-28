import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎯 EA-021 AND EA-022 VERIFICATION REPORT\n');
  console.log('='.repeat(80));

  for (const eaId of ['EA-021', 'EA-022']) {
    const ch = await db
      .select()
      .from(chapters)
      .where(eq(chapters.uniqueIdentifier, eaId))
      .limit(1);

    if (ch.length === 0) {
      console.error(`❌ ${eaId} not found`);
      continue;
    }

    const chapter = ch[0];

    console.log(`\n📖 CHAPTER: ${chapter.title}`);
    console.log(`   Unique ID: ${chapter.uniqueIdentifier}`);
    console.log(`   Chapter Number: ${chapter.chapterNumber}\n`);

    // Get scenes
    const chapterScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapter.id));

    console.log(`🎬 SCENES: ${chapterScenes.length} total\n`);

    const fieldsToCheck = ['focus', 'pages', 'characterGrowthElement', 'sceneCardProgression', 'realWorldContext', 'timelineSignificance'];

    for (const scene of chapterScenes) {
      console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
      console.log('-'.repeat(80));

      const missingFields: string[] = [];

      for (const field of fieldsToCheck) {
        const value = scene[field as keyof typeof scene];
        const isEmpty = value === null || value === undefined;

        if (isEmpty) {
          missingFields.push(field);
        } else {
          console.log(`✅ ${field}: ${typeof value === 'object' ? 'JSON' : typeof value === 'number' ? value : 'populated'}`);
        }
      }

      if (missingFields.length > 0) {
        console.log(`⚠️  Missing fields: ${missingFields.join(', ')}`);
      }
      console.log('');
    }

    console.log('='.repeat(80));
  }

  console.log('\n🎉 Verification complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
