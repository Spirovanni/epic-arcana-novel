import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chapters, scenes, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';
import { config } from 'dotenv';

config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(connectionString);
const db = drizzle(sql);

async function debugDetailedBookScenes() {
  try {
    console.log('🔍 Debugging detailed book and scene data...');
    
    // Get all books
    const allBooks = await db.select().from(books);
    console.log(`📚 Found ${allBooks.length} total books\n`);
    
    for (const book of allBooks) {
      console.log(`📖 Book ${book.bookNumber}: "${book.title}"`);
      console.log(`   ID: ${book.id}`);
      
      // Get chapters for this book
      const bookChapters = await db.select()
        .from(chapters)
        .where(eq(chapters.bookId, book.id));
      
      console.log(`   Chapters: ${bookChapters.length}`);
      
      let totalScenes = 0;
      for (const chapter of bookChapters) {
        const chapterScenes = await db.select()
          .from(scenes)
          .where(eq(scenes.chapterId, chapter.id));
        
        totalScenes += chapterScenes.length;
        
        if (chapterScenes.length > 0) {
          console.log(`   - Ch${chapter.chapterNumber}: "${chapter.title}" (${chapterScenes.length} scenes)`);
          console.log(`     Chapter ID: ${chapter.id}`);
          console.log(`     Unique ID: ${chapter.uniqueIdentifier}`);
        }
      }
      
      console.log(`   TOTAL SCENES: ${totalScenes}\n`);
    }
    
    // Specifically check the chapter with scenes
    console.log('🔍 Detailed analysis of chapter with scenes:');
    const sceneChapter = await db.select()
      .from(chapters)
      .where(eq(chapters.uniqueIdentifier, 'STG 1.1.1.1'));
    
    if (sceneChapter.length > 0) {
      const chapter = sceneChapter[0];
      console.log(`Chapter: "${chapter.title}"`);
      console.log(`Book ID: ${chapter.bookId}`);
      console.log(`Chapter ID: ${chapter.id}`);
      
      const chapterScenes = await db.select()
        .from(scenes)
        .where(eq(scenes.chapterId, chapter.id));
      
      console.log(`Scenes (${chapterScenes.length}):`);
      chapterScenes.forEach(scene => {
        console.log(`  - Scene ${scene.sceneNumber}: "${scene.title}"`);
        console.log(`    Description: ${scene.description?.substring(0, 100)}...`);
        console.log(`    POV: ${scene.pov}`);
        console.log(`    Location: ${scene.location}`);
        console.log(`    Timeline: ${scene.timeline_date}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

debugDetailedBookScenes();