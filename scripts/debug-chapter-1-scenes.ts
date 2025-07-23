import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';
import { config } from 'dotenv';

config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(connectionString);
const db = drizzle(sql);

const BOOK_ID = "3e26f59f-da2d-4f26-acd6-f68ed1a4af8d";

async function debugChapter1Scenes() {
  try {
    console.log('🔍 Debugging Chapter 1 scenes...');
    
    // Find all Chapter 1 entries
    const chapter1s = await db.select()
      .from(chapters)
      .where(eq(chapters.bookId, BOOK_ID))
      .where(eq(chapters.chapterNumber, 1));
    
    console.log(`📖 Found ${chapter1s.length} Chapter 1 entries:`);
    
    for (const chapter of chapter1s) {
      console.log(`  - ID: ${chapter.id}`);
      console.log(`  - Title: ${chapter.title}`);
      console.log(`  - Unique ID: ${chapter.uniqueIdentifier}`);
      
      // Check scenes for this chapter
      const chapterScenes = await db.select()
        .from(scenes)
        .where(eq(scenes.chapterId, chapter.id));
      
      console.log(`  - Scenes: ${chapterScenes.length}`);
      
      if (chapterScenes.length > 0) {
        chapterScenes.forEach(scene => {
          console.log(`    * Scene ${scene.sceneNumber}: "${scene.title}"`);
        });
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

debugChapter1Scenes();