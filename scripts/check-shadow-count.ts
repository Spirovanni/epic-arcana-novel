import { db } from '../src/lib/db';
import { shadow } from '../src/lib/schema';
import { sql } from 'drizzle-orm';

async function checkCount() {
  const result = await db.select({ count: sql<number>`count(*)::int` }).from(shadow);
  const count = result[0]?.count || 0;
  console.log(`Shadow records in database: ${count}`);
  console.log(`Expected total: 1914`);
  console.log(`Remaining: ${1914 - count}`);
}

checkCount().then(() => process.exit(0));
