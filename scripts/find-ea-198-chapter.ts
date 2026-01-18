import { db } from '../src/lib/db';
import { chapters } from '../src/lib/schema';
import { eq, like } from 'drizzle-orm';

async function findEA198() {
    try {
        // Search for chapter with unique_identifier MAT 5.3
        const results = await db
            .select()
            .from(chapters)
            .where(eq(chapters.uniqueIdentifier, 'MAT 5.3'))
            .limit(1);
        
        if (results.length > 0) {
            const chapter = results[0];
            console.log('Found EA-198:');
            console.log(`  Chapter Number: ${chapter.chapterNumber}`);
            console.log(`  Title: ${chapter.title}`);
            console.log(`  Unique Identifier: ${chapter.uniqueIdentifier}`);
            console.log(`  ID: ${chapter.id}`);
        } else {
            console.log('EA-198 (MAT 5.3) not found in database');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

findEA198();
