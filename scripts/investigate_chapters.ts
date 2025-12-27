import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, like, sql } from 'drizzle-orm';

async function investigateChapters() {
    console.log('🔍 Investigating Chapter Identifiers in Database\n');

    try {
        // Check for chapters with similar identifiers
        console.log('Looking for chapters matching EA-004, EA-005, EA-006 patterns...\n');

        const allChapters = await db
            .select({
                id: chapters.id,
                uniqueIdentifier: chapters.uniqueIdentifier,
                title: chapters.title,
                chapterNumber: chapters.chapterNumber,
                bookId: chapters.bookId
            })
            .from(chapters)
            .where(
                sql`${chapters.uniqueIdentifier} LIKE 'EA-%' OR ${chapters.chapterNumber} IN (4, 5, 6)`
            )
            .orderBy(chapters.chapterNumber);

        if (allChapters.length === 0) {
            console.log('❌ No chapters found with EA- pattern or chapter numbers 4-6');
            console.log('\nLet me check what chapters DO exist...\n');

            const sampleChapters = await db
                .select({
                    id: chapters.id,
                    uniqueIdentifier: chapters.uniqueIdentifier,
                    title: chapters.title,
                    chapterNumber: chapters.chapterNumber
                })
                .from(chapters)
                .orderBy(chapters.chapterNumber)
                .limit(10);

            console.log('📋 First 10 chapters in database:');
            sampleChapters.forEach(ch => {
                console.log(`  Chapter ${ch.chapterNumber}: ${ch.uniqueIdentifier || 'NO_ID'} - ${ch.title || 'NO_TITLE'}`);
            });
        } else {
            console.log(`✓ Found ${allChapters.length} matching chapters:\n`);

            for (const chapter of allChapters) {
                console.log(`📖 Chapter ${chapter.chapterNumber}: ${chapter.uniqueIdentifier}`);
                console.log(`   Title: ${chapter.title || 'N/A'}`);
                console.log(`   DB ID: ${chapter.id}`);

                // Count scenes for this chapter
                const sceneCount = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(scenes)
                    .where(eq(scenes.chapterId, chapter.id));

                console.log(`   Scenes: ${sceneCount[0]?.count || 0}`);
                console.log('');
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

investigateChapters();
