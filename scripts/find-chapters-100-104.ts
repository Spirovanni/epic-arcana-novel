import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * Finds existing chapters 100-104 and checks for scenes
 */

async function main() {
  console.log('🔍 Finding existing chapters 100-104...\n');

  const chapterNumbers = [100, 101, 102, 103, 104];

  for (const chapterNum of chapterNumbers) {
    const chapterList = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, chapterNum));

    console.log(`\n📖 Chapter ${chapterNum}:`);
    if (chapterList.length === 0) {
      console.log('   ❌ No chapter found');
    } else {
      for (const chapter of chapterList) {
        console.log(`   ✅ Found: ${chapter.title}`);
        console.log(`      ID: ${chapter.id}`);
        console.log(`      Unique Identifier: ${chapter.uniqueIdentifier || 'N/A'}`);

        // Check for existing scenes
        const existingScenes = await db
          .select()
          .from(scenes)
          .where(eq(scenes.chapterId, chapter.id));

        console.log(`      Existing scenes: ${existingScenes.length}`);
      }
    }
  }

  console.log('\n✅ Search complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
