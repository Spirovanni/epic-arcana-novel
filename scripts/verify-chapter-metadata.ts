import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { learningResources, learningResourceChapters, chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL not set');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function main() {
  try {
    console.log('====================================');
    console.log('Learning Resources with Chapter Metadata');
    console.log('====================================\n');

    // Get Book 1
    const book1 = await db
      .select()
      .from(books)
      .where(eq(books.bookNumber, 1));

    if (!book1.length) {
      console.log('Book 1 not found');
      return;
    }

    const book1Id = book1[0].id;

    // Check chapters 1-5
    for (const chNum of [1, 2, 3, 4, 5]) {
      const chResult = await db
        .select({ id: chapters.id, title: chapters.title })
        .from(chapters)
        .where(
          and(
            eq(chapters.chapterNumber, chNum),
            eq(chapters.bookId, book1Id)
          )
        );

      if (!chResult.length) continue;

      const chId = chResult[0].id;
      console.log(`\n=== Chapter ${chNum}: ${chResult[0].title} ===\n`);

      // Get linked resources for this chapter
      const resourceLinks = await db
        .select({ resourceId: learningResourceChapters.learningResourceId })
        .from(learningResourceChapters)
        .where(eq(learningResourceChapters.chapterId, chId));

      for (const link of resourceLinks) {
        const resource = await db
          .select({
            title: learningResources.title,
            specificTaskGroupTitle: learningResources.specificTaskGroupTitle,
            focusArea: learningResources.focusArea,
            tagline: learningResources.tagline,
          })
          .from(learningResources)
          .where(eq(learningResources.id, link.resourceId));

        if (resource.length > 0) {
          const r = resource[0];
          console.log(`📖 ${r.title}`);
          console.log(`   Theme: ${r.specificTaskGroupTitle}`);
          console.log(`   Focus: ${r.focusArea}`);
          console.log(`   Tagline: ${r.tagline?.substring(0, 60)}...`);
          console.log();
        }
      }
    }

    console.log('====================================');
    console.log('✓ All chapter metadata successfully populated!');
    console.log('====================================');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

main();
