import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function reimportEA244() {
    console.log('🔄 Re-importing EA-244 scenes...\n');

    const chapterNumber = 244;

    try {
        // Find the chapter
        const [chapter] = await db
            .select()
            .from(chapters)
            .where(eq(chapters.chapterNumber, chapterNumber))
            .limit(1);

        if (!chapter) {
            console.error('❌ Chapter 244 not found');
            return;
        }

        console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})`);

        // Delete existing scenes
        const deleteResult = await db
            .delete(scenes)
            .where(eq(scenes.chapterId, chapter.id));

        console.log(`✅ Deleted existing scenes for chapter ${chapterNumber}\n`);

        console.log('Now run: npx tsx scripts/import-scenes-to-existing-chapters.ts 244');

    } catch (error) {
        console.error('❌ Re-import preparation failed:', error);
        throw error;
    } finally {
        process.exit(0);
    }
}

reimportEA244();
