import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { promises as fs } from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';

// Manually import tables needed for seeding
import {
  novelSeries,
  books,
  chapters,
  taskGroups,
  scenes,
  characterArcs
} from './src/lib/schema.ts';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const LORE_PATH = path.join(process.cwd(), 'lore', 'json');

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  if (filePath.endsWith('laurasia_outline.json')) {
    const splitMarker = '}\n}\n\n\n\n{';
    if (data.includes(splitMarker)) {
      const parts = data.split(splitMarker);
      return JSON.parse(parts[0] + '}\n}');
    }
  }
  return JSON.parse(data);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema: { novelSeries, books, chapters, taskGroups, scenes, characterArcs } });

  console.log('Starting database seeding...');

  // 1. Clear existing data
  console.log('Clearing old data...');
  await db.delete(taskGroups);
  await db.delete(scenes);
  await db.delete(characterArcs);
  await db.delete(chapters);
  await db.delete(books);
  await db.delete(novelSeries);
  console.log('Old data cleared.');

  // 2. Seed from laurasia_outline.json
  const outlineData = await loadJSON(path.join(LORE_PATH, 'storyline', 'laurasia_outline.json'));
  const seriesData = outlineData.epic_novel_series;

  console.log('Seeding novel series...');
  const seriesResult = await db.insert(novelSeries).values({
    title: seriesData.title,
    // Add other series fields if necessary
  }).returning({ id: novelSeries.id });
  const seriesId = seriesResult[0].id;
  console.log('Novel series seeded.');

  console.log('Seeding books and chapters from outline...');
  for (const [bookKey, bookData] of Object.entries(seriesData.Books)) {
    const bookNumber = parseInt(bookKey.replace('Book', ''));
    const insertedBook = await db.insert(books).values({
      seriesId: seriesId,
      bookNumber: bookNumber,
      title: bookData.title,
      fictionNovelTitle: bookData.fiction_novel_title,
      // Add other book fields if necessary
    }).returning({ id: books.id });
    const bookId = insertedBook[0].id;

    if (bookData.task_masters) {
        for (const taskMaster of Object.values(bookData.task_masters)) {
            const processMajorGroup = async (majorGroup) => {
                if (majorGroup.Specific_task_groups) {
                    for (const specificTaskGroup of Object.values(majorGroup.Specific_task_groups)) {
                        await db.insert(chapters).values({
                            bookId: bookId,
                            chapterNumber: parseInt(specificTaskGroup.chapter.replace('Chapter ', '')),
                            uniqueIdentifier: specificTaskGroup.unique_identifier,
                            title: specificTaskGroup.specific_task_group_title || 'Untitled',
                            description: specificTaskGroup.specific_task_group_description || '',
                            colorTheme: {
                                name: specificTaskGroup.color_name,
                                hex: specificTaskGroup.hex_code,
                            }
                        });
                    }
                }
            };
            if (taskMaster.major_task_groups) {
                for (const majorTaskGroup of Object.values(taskMaster.major_task_groups)) {
                    await processMajorGroup(majorTaskGroup);
                }
            }
            for (const key in taskMaster) {
                if (key.startsWith('major_activity_theme_')) {
                    await processMajorGroup(taskMaster[key]);
                }
            }
        }
    }
  }
   console.log('Seeding from outline complete.');

  // 3. Seed from individual book files (like book_1.json)
  console.log('Seeding from individual book files...');
  const bookFiles = await fs.readdir(path.join(LORE_PATH, 'books'));
  for (const bookFile of bookFiles) {
      if (bookFile.endsWith('.json')) {
          const bookData = await loadJSON(path.join(LORE_PATH, 'books', bookFile));
          const bookNumber = parseInt(bookData.id);
          
          // Find the book in the DB
          const bookInDb = await db.query.books.findFirst({ where: (books, { eq }) => eq(books.bookNumber, bookNumber) });

          if (bookInDb) {
              // Clear existing chapters for this book before seeding new ones
              await db.delete(chapters).where(eq(chapters.bookId, bookInDb.id));

              for (const chapterData of bookData.chapters) {
                  await db.insert(chapters).values({
                      bookId: bookInDb.id,
                      chapterNumber: chapterData.chapter_number,
                      title: chapterData.title,
                      description: chapterData.summary,
                  });
              }
              console.log(`Seeded chapters for Book ${bookNumber} from ${bookFile}`);
          }
      }
  }


  console.log('Database seeding completed successfully!');
  await pool.end();
}

main().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});