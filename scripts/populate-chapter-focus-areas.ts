/**
 * Populate Chapter Focus Areas from Learning Resources
 *
 * This script updates the chapters table with focusArea values
 * extracted from the linked learning resources' focusArea field.
 * Since all 3 resources for a chapter share the same focusArea,
 * we just need to get the first one.
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  chapters,
  learningResources,
  learningResourceChapters,
  books,
} from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function main() {
  console.log('====================================');
  console.log('Populating Chapter Focus Areas');
  console.log('====================================\n');

  try {
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

    // Get all chapters in Book 1
    const book1Chapters = await db
      .select({
        id: chapters.id,
        chapterNumber: chapters.chapterNumber,
        title: chapters.title,
      })
      .from(chapters)
      .where(eq(chapters.bookId, book1Id))
      .orderBy(chapters.chapterNumber);

    let updatedCount = 0;

    for (const chapter of book1Chapters) {
      // Get the first learning resource for this chapter
      const resourceData = await db
        .select({
          focusArea: learningResources.focusArea,
          specificTaskGroupTitle: learningResources.specificTaskGroupTitle,
        })
        .from(learningResourceChapters)
        .innerJoin(
          learningResources,
          eq(learningResourceChapters.learningResourceId, learningResources.id)
        )
        .where(eq(learningResourceChapters.chapterId, chapter.id))
        .limit(1);

      if (resourceData.length > 0) {
        const resource = resourceData[0];
        // Update chapter with focusArea
        await db
          .update(chapters)
          .set({
            focusArea: resource.focusArea,
          })
          .where(eq(chapters.id, chapter.id));

        updatedCount++;
        console.log(
          `✓ Chapter ${chapter.chapterNumber}: "${resource.focusArea}"`
        );
      } else {
        console.log(
          `⚠ Chapter ${chapter.chapterNumber}: No learning resources found`
        );
      }
    }

    console.log(`\n✓ Updated ${updatedCount} chapters with focus areas\n`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
