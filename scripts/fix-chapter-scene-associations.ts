import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, like } from 'drizzle-orm';

/**
 * Fixes chapter-scene associations by:
 * 1. Finding scenes associated with EA-* chapters
 * 2. Re-routing them to the correct existing chapters (by chapter number)
 * 3. Deleting the EA-* chapters
 */

async function main() {
  console.log('🔧 Fixing chapter-scene associations...\n');

  // Find all EA-* chapters that were incorrectly created
  const eaChapters = await db
    .select()
    .from(chapters)
    .where(like(chapters.uniqueIdentifier, 'EA-%'));

  console.log(`Found ${eaChapters.length} EA-* chapters to process:\n`);

  for (const eaChapter of eaChapters) {
    console.log(`\n📖 Processing ${eaChapter.uniqueIdentifier} (Chapter ${eaChapter.chapterNumber})`);

    // Find the correct existing chapter by chapter number
    const correctChapters = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, eaChapter.chapterNumber));

    // Filter out the EA-* chapter itself
    const correctChapter = correctChapters.find(ch => !ch.uniqueIdentifier?.startsWith('EA-'));

    if (!correctChapter) {
      console.log(`   ❌ No existing chapter found for chapter number ${eaChapter.chapterNumber}`);
      continue;
    }

    console.log(`   ✅ Found existing chapter: ${correctChapter.title} (ID: ${correctChapter.id})`);

    // Find all scenes associated with the EA-* chapter
    const associatedScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, eaChapter.id));

    console.log(`   📝 Found ${associatedScenes.length} scenes to re-route`);

    // Update each scene to point to the correct chapter
    for (const scene of associatedScenes) {
      await db
        .update(scenes)
        .set({
          chapterId: correctChapter.id,
        })
        .where(eq(scenes.id, scene.id));

      console.log(`      ✅ Re-routed Scene ${scene.sceneNumber}: ${scene.title}`);
    }

    // Delete the EA-* chapter
    await db.delete(chapters).where(eq(chapters.id, eaChapter.id));
    console.log(`   🗑️  Deleted EA-* chapter: ${eaChapter.uniqueIdentifier}`);
  }

  console.log('\n✅ Fix complete!');
  console.log('\n📊 Summary:');
  console.log(`   - Processed ${eaChapters.length} EA-* chapters`);
  console.log(`   - Re-routed scenes to existing chapters`);
  console.log(`   - Deleted all EA-* chapters`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
