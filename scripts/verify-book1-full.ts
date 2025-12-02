/**
 * Verify Book 1 Learning System Data - Full Report
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
  console.log('Verifying Book 1 Learning Data (Chapters 1-22)');
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
      .select({ id: chapters.id, chapterNumber: chapters.chapterNumber, title: chapters.title })
      .from(chapters)
      .where(eq(chapters.bookId, book1Id));

    // Chapters that should have data (1-22 except 13)
    const expectedChapters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22];

    let totalResources = 0;
    let totalConnectionPoints = 0;
    let totalObjectives = 0;
    let chaptersWithResources = 0;

    console.log('Chapter-by-chapter breakdown:\n');

    for (const chapterNum of expectedChapters) {
      const chapter = book1Chapters.find((c) => c.chapterNumber === chapterNum);
      if (!chapter) {
        console.log(`Chapter ${chapterNum}: NOT FOUND IN DATABASE`);
        continue;
      }

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
        const status = resources.length === 3 && connectionPts.length === 3 && objectives.length === 3 ? '✓' : '⚠';
        console.log(
          `${status} Chapter ${chapterNum.toString().padStart(2)} (${chapter.title.padEnd(25)}): ${resources.length} resources, ${connectionPts.length} connection points, ${objectives.length} objectives`
        );
      } else {
        console.log(`✗ Chapter ${chapterNum.toString().padStart(2)} (${chapter.title.padEnd(25)}): NO DATA`);
      }
    }

    console.log('\n====================================');
    console.log('Summary:');
    console.log(`Chapters with resources: ${chaptersWithResources}/${expectedChapters.length}`);
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
