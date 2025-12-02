/**
 * Verify Book 1 Learning System Data
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  learningResourceChapters,
  connectionPoints,
  terminalLearningObjectives,
  chapters,
  books,
} from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function main() {
  console.log('====================================');
  console.log('Verifying Book 1 Learning Data');
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
    console.log(`Book 1 ID: ${book1Id}`);
    console.log(`Book 1 Title: ${book1[0].title}\n`);

    // Get all chapters in Book 1
    const book1Chapters = await db
      .select({ id: chapters.id, chapterNumber: chapters.chapterNumber, title: chapters.title })
      .from(chapters)
      .where(eq(chapters.bookId, book1Id));

    console.log(`Total chapters in Book 1: ${book1Chapters.length}\n`);

    // For each chapter, count resources, connection points, and objectives
    let totalResources = 0;
    let totalConnectionPoints = 0;
    let totalObjectives = 0;
    let chaptersWithResources = 0;

    for (const chapter of book1Chapters.slice(0, 10)) {
      // Check first 10 chapters
      const resources = await db
        .select({ id: learningResourceChapters.id })
        .from(learningResourceChapters)
        .where(eq(learningResourceChapters.chapterId, chapter.id));

      const connectionPts = await db
        .select({ id: connectionPoints.id })
        .from(connectionPoints)
        .where(eq(connectionPoints.chapterId, chapter.id));

      const objectives = await db
        .select({ id: terminalLearningObjectives.id })
        .from(terminalLearningObjectives)
        .where(eq(terminalLearningObjectives.chapterId, chapter.id));

      totalResources += resources.length;
      totalConnectionPoints += connectionPts.length;
      totalObjectives += objectives.length;

      if (resources.length > 0) {
        chaptersWithResources++;
      }

      console.log(
        `Chapter ${chapter.chapterNumber} (${chapter.title}): ${resources.length} resources, ${connectionPts.length} connection points, ${objectives.length} objectives`
      );
    }

    console.log('\n====================================');
    console.log('Summary (first 10 chapters):');
    console.log(`Chapters with resources: ${chaptersWithResources}/10`);
    console.log(`Total resource connections: ${totalResources}`);
    console.log(`Total connection points: ${totalConnectionPoints}`);
    console.log(`Total learning objectives: ${totalObjectives}`);
    console.log('====================================');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

main();
