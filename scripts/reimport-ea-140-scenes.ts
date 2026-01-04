import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔄 Re-importing EA-140 scenes...\n');

  // Find the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.chapterNumber, 140))
    .limit(1);

  if (!chapter) {
    console.log('❌ Chapter 140 not found');
    return;
  }

  console.log(`📖 Found chapter: ${chapter.title} (ID: ${chapter.id})`);

  // Delete existing scenes
  console.log('\n🗑️  Deleting existing scenes...');
  await db
    .delete(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  console.log(`   ✅ Deleted existing scenes`);

  console.log('\n✅ Ready for re-import. Run: npx tsx scripts/import-scenes-to-existing-chapters.ts 140');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
