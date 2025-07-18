import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import fs from 'fs';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

async function runMigration() {
  try {
    console.log('🔄 Running database migration...');
    
    // Read and execute the migration
    const migrationSQL = fs.readFileSync(
      '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/drizzle/0007_add_scenes_symbolism_and_chapter_metadata.sql', 
      'utf8'
    );
    
    // Split by lines and execute each statement
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.trim()}`);
        await sql.unsafe(statement.trim());
      }
    }
    
    console.log('✅ Migration completed successfully');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();