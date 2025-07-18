import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chapters, scenes, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/epic_arcana';
const sql = postgres(connectionString);
const db = drizzle(sql);

async function testScenesData() {
  try {
    console.log('🔍 Testing scenes data...');
    
    // Count total scenes
    const scenesCount = await db.select().from(scenes);
    console.log(`Total scenes in database: ${scenesCount.length}`);
    
    // Get first few scenes with chapter info
    const samplesScenes = await db
      .select({
        sceneId: scenes.id,
        sceneTitle: scenes.title,
        chapterId: scenes.chapterId,
        chapterTitle: chapters.title,
        bookTitle: books.title
      })
      .from(scenes)
      .leftJoin(chapters, eq(scenes.chapterId, chapters.id))
      .leftJoin(books, eq(chapters.bookId, books.id))
      .limit(5);
    
    console.log('Sample scenes:');
    samplesScenes.forEach(scene => {
      console.log(`- ${scene.sceneTitle} (Chapter: ${scene.chapterTitle}, Book: ${scene.bookTitle})`);
      console.log(`  Scene ID: ${scene.sceneId}, Chapter ID: ${scene.chapterId}`);
    });
    
    // Test API endpoint with first chapter
    if (samplesScenes.length > 0) {
      const testChapterId = samplesScenes[0].chapterId;
      console.log(`\n🌐 Testing API with chapter ID: ${testChapterId}`);
      
      const response = await fetch(`http://localhost:3000/api/chapters/${testChapterId}/scenes`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API returned ${data.scenes?.length || 0} scenes`);
      } else {
        console.log(`❌ API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.log(`Error details: ${errorText}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing scenes data:', error);
  } finally {
    await sql.end();
  }
}

testScenesData();