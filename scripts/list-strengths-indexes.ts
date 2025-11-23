import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function listIndexes() {
  const indexes = await db.execute(sql`
    SELECT
      indexname,
      indexdef
    FROM pg_indexes
    WHERE tablename = 'strengths'
    ORDER BY indexname
  `);

  console.log('📋 Indexes on strengths table:\n');
  indexes.rows.forEach((row: any) => {
    console.log(`✓ ${row.indexname}`);
    console.log(`  ${row.indexdef}\n`);
  });
}

listIndexes().then(() => process.exit(0));
