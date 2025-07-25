import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { config } from 'dotenv';

config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(connectionString);
const db = drizzle(sql);

const BOOK_ID = "3e26f59f-da2d-4f26-acd6-f68ed1a4af8d";

async function checkChapters567Scenes() {
  try {
    console.log('🔍 Checking Chapters 5-7 scenes...');
    
    // Find Chapters 5, 6, 7
    const targetChapters = await db.select()
      .from(chapters)
      .where(and(
        eq(chapters.bookId, BOOK_ID),
        inArray(chapters.chapterNumber, [5, 6, 7])
      ));
    
    console.log(`📖 Found ${targetChapters.length} chapters (5-7):`);
    
    for (const chapter of targetChapters) {
      console.log(`\n--- Chapter ${chapter.chapterNumber}: "${chapter.title}" ---`);
      console.log(`ID: ${chapter.id}`);
      console.log(`Summary: ${chapter.summary?.substring(0, 200)}...`);
      
      // Check scenes for this chapter
      const chapterScenes = await db.select()
        .from(scenes)
        .where(eq(scenes.chapterId, chapter.id));
      
      console.log(`📝 Scenes: ${chapterScenes.length}`);
      
      if (chapterScenes.length > 0) {
        chapterScenes.forEach(scene => {
          console.log(`  Scene ${scene.sceneNumber}: "${scene.title}"`);
          console.log(`    Description: ${scene.description?.substring(0, 150)}...`);
          console.log(`    Beat Goal: ${scene.beatGoal || 'N/A'}`);
          console.log(`    Hero Journey Stage: ${scene.heroJourneyStage || 'N/A'}`);
          console.log(`    Primary Tarot Card: ${scene.primaryTarotCard || 'N/A'}`);
          console.log('');
        });
      } else {
        console.log('    No scenes found for this chapter.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

checkChapters567Scenes();