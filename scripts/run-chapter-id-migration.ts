import postgres from 'postgres';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(DATABASE_URL);

async function main() {
  try {
    console.log('🔄 Running migration: add chapter_id column to chapters table...\n');

    // Read the migration SQL file
    const migrationPath = resolve(__dirname, '../drizzle/0018_add_chapter_id_column.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    // Execute the migration
    await sql.unsafe(migrationSQL.trim());

    console.log('✅ Migration applied successfully!');
    console.log('   Added column: chapter_id (varchar(50))');
    
  } catch (error) {
    console.error('❌ Error applying migration:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();

