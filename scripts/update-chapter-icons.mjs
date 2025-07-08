import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import path from 'path';
import * as schema from '../src/lib/schema.ts';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function updateChapterIcons() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('Starting chapter icon path updates...');

  try {
    // First, add the column if it doesn't exist (this might fail if column already exists)
    try {
      await pool.query('ALTER TABLE "chapters" ADD COLUMN "icon_path" varchar(255);');
      console.log('Added icon_path column to chapters table');
    } catch (error) {
      console.log('Column might already exist, continuing...');
    }

    // Get all books and their chapters
    const allBooks = await db.select().from(schema.books);
    
    for (const book of allBooks) {
      console.log(`Processing book ${book.bookNumber}...`);
      
      const chapters = await db.select().from(schema.chapters).where(eq(schema.chapters.bookId, book.id));
      
      for (const chapter of chapters) {
        const iconPath = `chapters/book${book.bookNumber}/chapter${chapter.chapterNumber}.png`;
        
        await db.update(schema.chapters)
          .set({ iconPath: iconPath })
          .where(eq(schema.chapters.id, chapter.id));
          
        console.log(`Updated chapter ${chapter.chapterNumber} with icon path: ${iconPath}`);
      }
    }

    console.log('Chapter icon path updates completed successfully!');
  } catch (error) {
    console.error('Error updating chapter icons:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function main() {
  try {
    await updateChapterIcons();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

main();