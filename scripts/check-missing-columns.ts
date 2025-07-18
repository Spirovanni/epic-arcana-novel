import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);

async function checkColumns() {
  try {
    console.log('🔍 Checking existing columns in scenes table...');
    
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'scenes' 
      ORDER BY column_name;
    `;
    
    console.log('Existing columns in scenes table:');
    result.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    console.log('\n🔍 Checking existing columns in chapters table...');
    
    const chaptersResult = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'chapters' 
      ORDER BY column_name;
    `;
    
    console.log('Existing columns in chapters table:');
    chaptersResult.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    // Check for missing columns
    const scenesColumns = result.map(r => r.column_name);
    const chaptersColumns = chaptersResult.map(r => r.column_name);
    
    console.log('\n🔍 Checking for missing columns...');
    
    const requiredScenesColumns = ['setup', 'symbolism'];
    const requiredChaptersColumns = ['pov', 'tense', 'core_emotion', 'scene_tone'];
    
    const missingInScenes = requiredScenesColumns.filter(col => !scenesColumns.includes(col));
    const missingInChapters = requiredChaptersColumns.filter(col => !chaptersColumns.includes(col));
    
    if (missingInScenes.length > 0) {
      console.log(`Missing in scenes table: ${missingInScenes.join(', ')}`);
      
      for (const col of missingInScenes) {
        console.log(`Adding missing column: ${col}`);
        if (col === 'setup') {
          await sql`ALTER TABLE "scenes" ADD COLUMN "setup" text`;
        } else if (col === 'symbolism') {
          await sql`ALTER TABLE "scenes" ADD COLUMN "symbolism" text`;
        }
      }
    } else {
      console.log('✅ All required scenes columns exist');
    }
    
    if (missingInChapters.length > 0) {
      console.log(`Missing in chapters table: ${missingInChapters.join(', ')}`);
      
      for (const col of missingInChapters) {
        console.log(`Adding missing column: ${col}`);
        if (col === 'pov') {
          await sql`ALTER TABLE "chapters" ADD COLUMN "pov" varchar(100)`;
        } else if (col === 'tense') {
          await sql`ALTER TABLE "chapters" ADD COLUMN "tense" varchar(50)`;
        } else if (col === 'core_emotion') {
          await sql`ALTER TABLE "chapters" ADD COLUMN "core_emotion" varchar(255)`;
        } else if (col === 'scene_tone') {
          await sql`ALTER TABLE "chapters" ADD COLUMN "scene_tone" varchar(255)`;
        }
      }
    } else {
      console.log('✅ All required chapters columns exist');
    }
    
    console.log('✅ Column check and update complete');
    
  } catch (error) {
    console.error('❌ Error checking columns:', error);
  } finally {
    await sql.end();
  }
}

checkColumns();