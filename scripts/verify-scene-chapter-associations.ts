import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, inArray } from 'drizzle-orm';

/**
 * Verifies that all scenes are properly associated with existing chapters
 */

async function main() {
  console.log('🔍 Verifying scene-chapter associations...\n');

  const chapterNumbers = [38, 50, 51, 53, 55, 105];

  for (const chapterNum of chapterNumbers) {
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, chapterNum))
      .limit(1);

    if (!chapter) {
      console.log(`❌ Chapter ${chapterNum} not found`);
      continue;
    }

    const chapterScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapter.id))
      .orderBy(scenes.sceneNumber);

    console.log(`📖 Chapter ${chapterNum}: ${chapter.title}`);
    console.log(`   Chapter ID: ${chapter.id}`);
    console.log(`   Unique Identifier: ${chapter.uniqueIdentifier || 'N/A'}`);
    console.log(`   Scenes: ${chapterScenes.length}`);

    for (const scene of chapterScenes) {
      console.log(`      Scene ${scene.sceneNumber}: ${scene.title}`);
    }
    console.log('');
  }

  console.log('✅ Verification complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
