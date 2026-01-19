import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function deleteEA225Scenes() {
    console.log('🗑️  Deleting EA-225 scenes...\n');

    const chapterNumber = 225;

    try {
        // Find the chapter
        const [chapter] = await db
            .select()
            .from(chapters)
            .where(eq(chapters.chapterNumber, chapterNumber))
            .limit(1);

        if (!chapter) {
            console.error('❌ Chapter 225 not found');
            return;
        }

        console.log(`✅ Chapter found: ${chapter.title}`);
        console.log(`   ID: ${chapter.id}\n`);

        // Delete scenes
        const result = await db
            .delete(scenes)
            .where(eq(scenes.chapterId, chapter.id));

        console.log(`✅ Deleted scenes for chapter 225\n`);

    } catch (error) {
        console.error('❌ Deletion failed:', error);
        throw error;
    } finally {
        process.exit(0);
    }
}

deleteEA225Scenes();
