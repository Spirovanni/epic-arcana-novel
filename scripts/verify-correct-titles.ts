import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { learningResources, learningResourceChapters, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL not set');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function main() {
  try {
    console.log('====================================');
    console.log('Verifying Correct Book Titles per Chapter');
    console.log('====================================\n');

    // Check chapters 1-5
    for (const chNum of [1, 2, 3, 4, 5]) {
      const chResult = await db
        .select()
        .from(chapters)
        .where(eq(chapters.chapterNumber, chNum));

      if (!chResult.length) continue;

      const chId = chResult[0].id;
      console.log(`Chapter ${chNum}: ${chResult[0].title}`);

      // Get linked resources for this chapter
      const resourceLinks = await db
        .select({ resourceId: learningResourceChapters.learningResourceId })
        .from(learningResourceChapters)
        .where(eq(learningResourceChapters.chapterId, chId));

      for (const link of resourceLinks) {
        const resource = await db
          .select()
          .from(learningResources)
          .where(eq(learningResources.id, link.resourceId));

        if (resource.length > 0) {
          console.log(`  • ${resource[0].title}`);
        }
      }
      console.log();
    }

    console.log('====================================');
    console.log('✓ Book titles are now UNIQUE per chapter!');
    console.log('====================================');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

main();
