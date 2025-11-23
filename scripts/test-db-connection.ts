import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    const result = await db.execute(sql`
      SELECT current_database() as database_name,
             (SELECT COUNT(*) FROM strengths) as strengths_count,
             (SELECT COUNT(*) FROM shadow) as shadow_count
    `);

    const row = result.rows[0] as any;
    console.log('✅ Database connection successful!');
    console.log(`📊 Connected to database: ${row.database_name}`);
    console.log(`📊 Strengths records: ${row.strengths_count}`);
    console.log(`📊 Shadow records: ${row.shadow_count}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

testConnection().then(() => process.exit(0)).catch(() => process.exit(1));
