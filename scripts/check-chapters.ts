import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);

async function checkChapters() {
  try {
    console.log('🔍 Checking chapters in database...');
    
    const result = await sql`
      SELECT id, chapter_number, title, pov, tense, core_emotion, scene_tone
      FROM chapters 
      WHERE book_id = (
        SELECT id FROM books 
        WHERE book_number = 1 
        AND series_id = (SELECT id FROM novel_series WHERE title = 'Epic Arcana')
      )
      ORDER BY chapter_number
      LIMIT 10;
    `;
    
    console.log('Book 1 chapters:');
    result.forEach(row => {
      console.log(`  Chapter ${row.chapter_number}: ${row.title || 'Untitled'}`);
      console.log(`    ID: ${row.id}`);
      console.log(`    POV: ${row.pov || 'Not set'}`);
      console.log(`    Metadata: ${row.core_emotion || 'Not set'}`);
      console.log('');
    });
    
    // Check scenes for the first chapter
    if (result.length > 0) {
      console.log(`🔍 Checking scenes for first chapter (${result[0].id})...`);
      
      const scenesResult = await sql`
        SELECT scene_number, title, setup, symbolism
        FROM scenes 
        WHERE chapter_id = ${result[0].id}
        ORDER BY scene_number;
      `;
      
      console.log(`Found ${scenesResult.length} scenes:`);
      scenesResult.forEach(scene => {
        console.log(`  Scene ${scene.scene_number}: ${scene.title}`);
        console.log(`    Setup: ${scene.setup ? scene.setup.substring(0, 100) + '...' : 'Not set'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking chapters:', error);
  } finally {
    await sql.end();
  }
}

checkChapters();