import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function createTable() {
  try {
    console.log('🔍 Checking current database connection...\n');

    // Check which database we're connected to
    const dbResult = await db.execute(sql`SELECT current_database(), current_user`);
    const dbInfo = dbResult.rows[0] as any;
    console.log(`📊 Connected to database: ${dbInfo.current_database}`);
    console.log(`👤 Connected as user: ${dbInfo.current_user}\n`);

    console.log('🚀 Creating growth_focus table...\n');

    // Create the table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS growth_focus (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        canonical_id VARCHAR(20) NOT NULL,
        profile_key VARCHAR(50),
        unique_identifier VARCHAR(50),
        specific_task_group_title TEXT,
        chapter_title TEXT,
        display_name TEXT,
        theme TEXT,
        growth_index INTEGER NOT NULL,
        growth_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Table created successfully!\n');

    // Verify table exists
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'growth_focus'
      ) as table_exists
    `);
    const tableExists = (tableCheck.rows[0] as any).table_exists;
    console.log(`📋 Table 'growth_focus' exists: ${tableExists}\n`);

    console.log('✅ Setup complete! You can now run the import script.');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

createTable().then(() => process.exit(0)).catch(() => process.exit(1));
