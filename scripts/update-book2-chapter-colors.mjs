import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema.ts';
import { eq, and } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    console.log('Updating Book 2 chapters 32-40 with correct colors from outline...');
    
    // Get Book 2
    const [book2] = await db.select().from(schema.books)
      .where(eq(schema.books.bookNumber, 2));
    
    if (!book2) {
      throw new Error('Book 2 not found');
    }

    // Define the correct color data for each chapter from the outline
    const chapterColorUpdates = [
      {
        chapterNumber: 32,
        title: "Seek Prosperity",
        colorName: "Lipstick",
        hexCode: "#993366",
        red: 153,
        green: 51,
        blue: 102
      },
      {
        chapterNumber: 33,
        title: "Benevolence",
        colorName: "Ruby",
        hexCode: "#CC0066",
        red: 204,
        green: 0,
        blue: 102
      },
      {
        chapterNumber: 34,
        title: "Problem Solving",
        colorName: "Cerise",
        hexCode: "#CC3366",
        red: 204,
        green: 51,
        blue: 102
      },
      {
        chapterNumber: 35,
        title: "New Business",
        colorName: "Tyrian Purple",
        hexCode: "#660033",
        red: 102,
        green: 0,
        blue: 51
      },
      {
        chapterNumber: 36,
        title: "Ambitious Circle",
        colorName: "Red",
        hexCode: "#FF0000",
        red: 255,
        green: 0,
        blue: 0
      },
      {
        chapterNumber: 37,
        title: "Intellectual Dynamo",
        colorName: "Radical Red",
        hexCode: "#990066",
        red: 153,
        green: 0,
        blue: 102
      },
      {
        chapterNumber: 38,
        title: "Energy",
        colorName: "Cerise",
        hexCode: "#D03373",
        red: 208,
        green: 51,
        blue: 115
      },
      {
        chapterNumber: 39,
        title: "Quicken",
        colorName: "Red",
        hexCode: "#FF0000",
        red: 255,
        green: 0,
        blue: 0
      },
      {
        chapterNumber: 40,
        title: "Isolation",
        colorName: "Old Rose",
        hexCode: "#BB3D4E",
        red: 187,
        green: 61,
        blue: 78
      }
    ];

    // Update each chapter with correct colors and titles
    for (const chapterUpdate of chapterColorUpdates) {
      await db.update(schema.chapters)
        .set({
          title: chapterUpdate.title,
          colorName: chapterUpdate.colorName,
          hexCode: chapterUpdate.hexCode,
          red: chapterUpdate.red,
          green: chapterUpdate.green,
          blue: chapterUpdate.blue
        })
        .where(and(
          eq(schema.chapters.bookId, book2.id),
          eq(schema.chapters.chapterNumber, chapterUpdate.chapterNumber)
        ));
      
      console.log(`Updated Chapter ${chapterUpdate.chapterNumber}: ${chapterUpdate.title} - ${chapterUpdate.colorName} (${chapterUpdate.hexCode})`);
    }

    console.log('\\nSuccessfully updated all chapter colors!');
    
  } catch (error) {
    console.error('Error updating chapter colors:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);