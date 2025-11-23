import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    console.log('🔍 Testing connection to growth_focus table...\n');

    // Check which database we're connected to
    const dbResult = await db.execute(sql`SELECT current_database(), current_user`);
    const dbInfo = dbResult.rows[0] as any;
    console.log(`📊 Connected to database: ${dbInfo.current_database}`);
    console.log(`👤 Connected as user: ${dbInfo.current_user}\n`);

    // Check if table exists
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'growth_focus'
      ) as table_exists
    `);
    const tableExists = (tableCheck.rows[0] as any).table_exists;
    console.log(`📋 Table 'growth_focus' exists: ${tableExists}\n`);

    if (tableExists) {
      // Count records
      const countResult = await db.execute(sql`SELECT COUNT(*) as count FROM growth_focus`);
      const count = (countResult.rows[0] as any).count;
      console.log(`📊 Total records: ${count}\n`);

      // Get a sample record
      const sampleResult = await db.execute(sql`
        SELECT canonical_id, display_name, growth_text
        FROM growth_focus
        WHERE canonical_id != ''
        LIMIT 1
      `);

      if (sampleResult.rows.length > 0) {
        const sample = sampleResult.rows[0] as any;
        console.log('📝 Sample record:');
        console.log(`  Canonical ID: ${sample.canonical_id}`);
        console.log(`  Display Name: ${sample.display_name}`);
        console.log(`  Growth Text: ${sample.growth_text.substring(0, 80)}...\n`);
      }

      console.log('✅ Connection test successful!');
    } else {
      console.log('❌ Table does not exist!');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error);
    throw error;
  }
}

testConnection().then(() => process.exit(0)).catch(() => process.exit(1));
