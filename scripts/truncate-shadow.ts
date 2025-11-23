import { db } from '../src/lib/db';
import { shadow } from '../src/lib/schema';
import { sql } from 'drizzle-orm';

async function truncateShadow() {
  console.log('🗑️  Truncating shadow table...');
  await db.execute(sql`TRUNCATE TABLE shadow`);
  console.log('✓ Table truncated');

  const count = await db.select({ count: sql`count(*)::int` }).from(shadow);
  console.log(`Current count: ${count[0].count}`);
}

truncateShadow().then(() => process.exit(0));
