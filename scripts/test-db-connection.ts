import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    const result = await db.execute(sql`SELECT count(*) as count FROM users`);
    console.log('✅ Database connection successful!');
    console.log(`📊 Users count: ${result.rows[0].count}`);
  } catch (error) {
    console.error('❌ Database connection/query failed:', error);
    throw error;
  }
}

testConnection().then(() => process.exit(0)).catch(() => process.exit(1));
