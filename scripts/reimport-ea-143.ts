import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔄 Preparing to reimport EA-143 scenes...\n');

  // Find chapter 143
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.chapterNumber, 143))
    .limit(1);

  if (!chapter) {
    console.log('❌ Chapter 143 not found');
    return;
  }

  console.log(`Found chapter: ${chapter.title}`);

  // Delete existing scenes
  await db.delete(scenes).where(eq(scenes.chapterId, chapter.id));

  console.log('✅ Deleted existing scenes for chapter 143');
  console.log('Ready for fresh import!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
