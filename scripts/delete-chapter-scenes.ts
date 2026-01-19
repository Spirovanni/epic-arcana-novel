import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function deleteChapterScenes() {
  const chapterNumber = 231;

  try {
    // Find the chapter
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, chapterNumber))
      .limit(1);

    if (!chapter) {
      console.error(`❌ Chapter ${chapterNumber} not found`);
      process.exit(1);
    }

    console.log(`Found chapter: ${chapter.title} (${chapter.id})`);

    // Delete scenes
    const result = await db
      .delete(scenes)
      .where(eq(scenes.chapterId, chapter.id));

    console.log(`✅ Deleted scenes for chapter ${chapterNumber}`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

deleteChapterScenes();
