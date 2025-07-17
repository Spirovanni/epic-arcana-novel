import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema.ts';
import { eq, and, gte, lte } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    // Get Book 2
    const [book2] = await db.select().from(schema.books)
      .where(eq(schema.books.bookNumber, 2));
    
    if (!book2) {
      throw new Error('Book 2 not found');
    }

    // Get chapters 32-40
    const chapters = await db.select({
      chapterNumber: schema.chapters.chapterNumber,
      title: schema.chapters.title,
      colorName: schema.chapters.colorName,
      hexCode: schema.chapters.hexCode,
      red: schema.chapters.red,
      green: schema.chapters.green,
      blue: schema.chapters.blue
    }).from(schema.chapters)
    .where(and(
      eq(schema.chapters.bookId, book2.id),
      gte(schema.chapters.chapterNumber, 32),
      lte(schema.chapters.chapterNumber, 40)
    ))
    .orderBy(schema.chapters.chapterNumber);

    console.log('Book 2 Chapters 32-40 Colors:');
    console.log('================================');
    
    chapters.forEach(ch => {
      console.log(`Chapter ${ch.chapterNumber}: ${ch.title}`);
      console.log(`  Color: ${ch.colorName} (${ch.hexCode})`);
      console.log(`  RGB: (${ch.red}, ${ch.green}, ${ch.blue})`);
      console.log('');
    });

    console.log(`Total chapters found: ${chapters.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);