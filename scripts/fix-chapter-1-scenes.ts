import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';
import { config } from 'dotenv';

config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(connectionString);
const db = drizzle(sql);

// The wrong Chapter 1 ID that has the scenes
const WRONG_CHAPTER_ID = "11230e4b-1d53-4655-b86a-62feaa90833e";
// The correct Book 1 Chapter 1 ID 
const CORRECT_CHAPTER_ID = "26f367f2-0cf8-4b79-a5c5-e53f1980cde5";

async function fixChapter1Scenes() {
  try {
    console.log('🔄 Fixing Chapter 1 scenes...');
    
    // Get the scenes from the wrong chapter
    const wrongScenes = await db.select()
      .from(scenes)
      .where(eq(scenes.chapterId, WRONG_CHAPTER_ID));
    
    console.log(`📖 Found ${wrongScenes.length} scenes in wrong Chapter 1`);
    
    if (wrongScenes.length === 0) {
      console.log('❌ No scenes found to move');
      return;
    }
    
    // Update each scene to point to the correct chapter
    for (const scene of wrongScenes) {
      await db.update(scenes)
        .set({
          chapterId: CORRECT_CHAPTER_ID,
          updatedAt: new Date()
        })
        .where(eq(scenes.id, scene.id));
      
      console.log(`✅ Moved Scene ${scene.sceneNumber}: "${scene.title}"`);
    }
    
    console.log('🎉 Successfully moved all scenes to correct Chapter 1!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

fixChapter1Scenes();