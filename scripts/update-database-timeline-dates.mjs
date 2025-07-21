import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import path from 'path';
import * as schema from '../src/lib/schema.ts';
import { eq, and } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Timeline mapping for chapters 11-19
const CHAPTER_TIMELINE = {
  11: {
    scenes: [
      { scene: 1, date: "1/23/1320 - Morning" },
      { scene: 2, date: "1/24/1320 - Afternoon" },
      { scene: 3, date: "1/25/1320 - Evening" }
    ]
  },
  12: {
    scenes: [
      { scene: 1, date: "1/26/1320 - Dawn" },
      { scene: 2, date: "1/27/1320 - Midday" },
      { scene: 3, date: "1/28/1320 - Night" }
    ]
  },
  13: {
    scenes: [
      { scene: 1, date: "1/29/1320 - Early Morning" }
    ]
  },
  14: {
    scenes: [
      { scene: 1, date: "2/1/1320 - Morning" },
      { scene: 2, date: "2/2/1320 - Afternoon" },
      { scene: 3, date: "2/3/1320 - Evening" }
    ]
  },
  15: {
    scenes: [
      { scene: 1, date: "2/4/1320 - Dawn" },
      { scene: 2, date: "2/5/1320 - Midday" },
      { scene: 3, date: "2/6/1320 - Sunset" }
    ]
  },
  16: {
    scenes: [
      { scene: 1, date: "2/7/1320 - Morning" },
      { scene: 2, date: "2/8/1320 - Afternoon" },
      { scene: 3, date: "2/9/1320 - Evening" }
    ]
  },
  17: {
    scenes: [
      { scene: 1, date: "2/10/1320 - Early Morning" },
      { scene: 2, date: "2/11/1320 - Morning" },
      { scene: 3, date: "2/12/1320 - Afternoon" }
    ]
  },
  18: {
    scenes: [
      { scene: 1, date: "2/13/1320 - Dawn" },
      { scene: 2, date: "2/13/1320 - Midday" },
      { scene: 3, date: "2/13/1320 - Afternoon" },
      { scene: 4, date: "2/13/1320 - Evening" },
      { scene: 5, date: "2/13/1320 - Night" }
    ]
  },
  19: {
    scenes: [
      { scene: 1, date: "2/14/1320 - Dawn" },
      { scene: 2, date: "2/14/1320 - Morning" },
      { scene: 3, date: "2/14/1320 - Afternoon" }
    ]
  }
};

async function updateDatabaseTimelines() {
  console.log('📅 Updating database with corrected timeline dates...\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema });

  try {
    // Find Book 1
    const book1 = await db.select().from(schema.books).where(eq(schema.books.bookNumber, 1)).limit(1);
    if (book1.length === 0) {
      throw new Error('Book 1 not found in database');
    }
    const book1Id = book1[0].id;

    let totalUpdated = 0;

    // Process each chapter
    for (const [chapterNum, chapterData] of Object.entries(CHAPTER_TIMELINE)) {
      console.log(`🔄 Processing Chapter ${chapterNum}...`);

      // Get the chapter from database
      const chapters = await db
        .select()
        .from(schema.chapters)
        .where(and(
          eq(schema.chapters.bookId, book1Id),
          eq(schema.chapters.chapterNumber, parseInt(chapterNum))
        ));

      if (chapters.length === 0) {
        console.log(`  ⚠️ Chapter ${chapterNum} not found in database`);
        continue;
      }

      const chapterId = chapters[0].id;

      // Process each scene
      for (const sceneData of chapterData.scenes) {
        const { scene, date } = sceneData;

        // Update the scene's timeline date
        const updateResult = await db
          .update(schema.scenes)
          .set({
            historicalDate: date
          })
          .where(and(
            eq(schema.scenes.chapterId, chapterId),
            eq(schema.scenes.sceneNumber, scene)
          ));

        console.log(`    ✅ Scene ${scene}: Updated to "${date}"`);
        totalUpdated++;
      }
    }

    console.log(`\n🎉 Successfully updated ${totalUpdated} scene timeline dates in the database!`);
    
    console.log('\n📊 Updated Database Timeline Summary:');
    console.log('Chapter 10: Ends 1/22/1320');
    console.log('Chapter 11: 1/23/1320 - 1/25/1320 (3 days)');
    console.log('Chapter 12: 1/26/1320 - 1/28/1320 (3 days)');
    console.log('Chapter 13: 1/29/1320 (1 day)');
    console.log('Chapter 14: 2/1/1320 - 2/3/1320 (3 days)');
    console.log('Chapter 15: 2/4/1320 - 2/6/1320 (3 days)');
    console.log('Chapter 16: 2/7/1320 - 2/9/1320 (3 days)');
    console.log('Chapter 17: 2/10/1320 - 2/12/1320 (3 days)');
    console.log('Chapter 18: 2/13/1320 (1 day - Sanctuary training)');
    console.log('Chapter 19: 2/14/1320 (1 day - Forge training)');

  } catch (error) {
    console.error('❌ Error updating database timeline dates:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function main() {
  try {
    await updateDatabaseTimelines();
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();