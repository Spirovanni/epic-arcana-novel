import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chapters } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import { config } from 'dotenv';

// Load environment variables
config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(connectionString);
const db = drizzle(sql);

const BOOK_ID = "3e26f59f-da2d-4f26-acd6-f68ed1a4af8d"; // Book 1 ID

const newTitles = [
  { chapterNumber: 1, title: "The Scholar's Despair" },
  { chapterNumber: 2, title: "The Unveiled Truth" },
  { chapterNumber: 3, title: "The Restless Current" },
  { chapterNumber: 4, title: "The Spark Ignites" },
  { chapterNumber: 5, title: "The Forge of Will" },
  { chapterNumber: 6, title: "The Threshold Guardian" },
  { chapterNumber: 7, title: "The Choice of Paths" },
  { chapterNumber: 8, title: "The Weight of Change" }
];

async function updateChapterTitles() {
  try {
    console.log('🔄 Starting Chapters 1-8 title updates...');

    for (const { chapterNumber, title } of newTitles) {
      // Find the chapter
      const existingChapters = await db.select()
        .from(chapters)
        // @ts-ignore
        .where(and(
          eq(chapters.bookId, BOOK_ID),
          eq(chapters.chapterNumber, chapterNumber)
        ));

      if (existingChapters.length === 0) {
        console.log(`⚠️ No Chapter ${chapterNumber} found, skipping...`);
        continue;
      }

      const existingChapter = existingChapters[0];
      console.log(`📖 Found Chapter ${chapterNumber}: "${existingChapter.title}"`);

      // Update the chapter title
      await db.update(chapters)
        .set({
          title: title,
          updatedAt: new Date()
        })
        .where(eq(chapters.id, existingChapter.id));

      console.log(`✅ Updated Chapter ${chapterNumber} to: "${title}"`);
    }

    console.log('🎉 All chapter titles updated successfully!');
    console.log('📊 Summary of new titles:');
    newTitles.forEach(({ chapterNumber, title }) => {
      console.log(`  Chapter ${chapterNumber}: "${title}"`);
    });

  } catch (error) {
    console.error('❌ Error updating chapter titles:', error);
  } finally {
    await sql.end();
  }
}

updateChapterTitles();