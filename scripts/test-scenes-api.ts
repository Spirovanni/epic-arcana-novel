import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema: { scenes } });

async function testScenesAPI() {
  try {
    console.log('🔍 Testing scenes API with node-postgres adapter...');
    
    const chapterId = '584fe4c2-5ce2-4c89-b7c6-8db324f40ec5';
    
    const chapterScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapterId))
      .orderBy(scenes.sceneNumber);

    console.log(`✅ Found ${chapterScenes.length} scenes for chapter ${chapterId}`);
    
    chapterScenes.forEach(scene => {
      console.log(`  Scene ${scene.sceneNumber}: ${scene.title}`);
      console.log(`    Setup: ${scene.setup ? scene.setup.substring(0, 100) + '...' : 'Not set'}`);
      console.log(`    Symbolism: ${scene.symbolism ? scene.symbolism.substring(0, 50) + '...' : 'Not set'}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing scenes API:', error);
  } finally {
    await pool.end();
  }
}

testScenesAPI();