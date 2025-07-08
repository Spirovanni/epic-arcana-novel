import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { promises as fs } from 'fs';
import path from 'path';
import * as schema from './src/lib/schema.ts';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

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
  const db = drizzle(pool, { schema });

  console.log('Starting database seeding...');

  // 1. Clear existing data
  console.log('Clearing old data...');
  await db.delete(schema.taskGroups);
  await db.delete(schema.scenes);
  await db.delete(schema.characterArcs);
  await db.delete(schema.chapters);
  await db.delete(schema.books);
  await db.delete(schema.novelSeries);
  console.log('Old data cleared.');

  // 2. Seed from laurasia_outline.json
  const outlineData = await loadJSON(path.join(LORE_PATH, 'storyline', 'laurasia_outline.json'));
  const seriesData = outlineData.epic_novel_series;

  console.log('Seeding novel series...');
  const seriesResult = await db.insert(schema.novelSeries).values({
    title: seriesData.title,
  }).returning({ id: schema.novelSeries.id });
  const seriesId = seriesResult[0].id;
  console.log('Novel series seeded.');

  console.log('Seeding books and chapters from outline...');
  for (const [bookKey, bookData] of Object.entries(seriesData.Books)) {
    const bookNumber = parseInt(bookKey.replace('Book', ''));
    const insertedBook = await db.insert(schema.books).values({
      seriesId: seriesId,
      bookNumber: bookNumber,
      title: bookData.title,
      fictionNovelTitle: bookData.fiction_novel_title,
    }).returning({ id: schema.books.id });
    const bookId = insertedBook[0].id;

    if (bookData.task_masters) {
        for (const taskMaster of Object.values(bookData.task_masters)) {
            const processMajorGroup = async (majorGroup) => {
                if (majorGroup.Specific_task_groups) {
                    for (const specificTaskGroup of Object.values(majorGroup.Specific_task_groups)) {
                        await db.insert(schema.chapters).values({
                            bookId: bookId,
                            chapterNumber: parseInt(specificTaskGroup.chapter.replace('Chapter ', '')),
                            uniqueIdentifier: specificTaskGroup.unique_identifier,
                            title: specificTaskGroup.specific_task_group_title || 'Untitled',
                            description: specificTaskGroup.specific_task_group_description || '',
                            colorTheme: {
                                name: specificTaskGroup.color_name,
                                hex: specificTaskGroup.hex_code,
                                rgb: [specificTaskGroup.red, specificTaskGroup.green, specificTaskGroup.blue]
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

  console.log('Database seeding completed successfully!');
  await pool.end();
}

main().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});