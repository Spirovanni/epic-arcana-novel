import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    const result = await db.execute(sql`
      SELECT t.typname, e.enumlabel
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname = 'assessment_status'
      ORDER BY t.typname, e.enumsortorder;
    `);

    console.log('✅ Database connection successful!');
    console.log('📋 Enum definitions:', result.rows);
  } catch (error) {
    console.error('❌ Database connection/query failed:', error);
    throw error;
  }
}

testConnection().then(() => process.exit(0)).catch(() => process.exit(1));
