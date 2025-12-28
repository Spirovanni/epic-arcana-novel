import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('📋 Listing all EA chapter identifiers in scenes table...\n');

  const result = await db.execute(sql`
    SELECT
      c.unique_identifier,
      COUNT(s.id) as scene_count
    FROM chapters c
    LEFT JOIN scenes s ON s.chapter_id = c.id
    WHERE c.unique_identifier LIKE 'EA-%'
    GROUP BY c.unique_identifier
    ORDER BY c.unique_identifier
  `);

  console.log(`Found ${result.rows.length} EA chapters with scenes:\n`);

  let ea043Found = false;

  for (const row of result.rows) {
    const marker = row.unique_identifier === 'EA-043' ? ' ⬅️ THIS IS EA-043' : '';
    console.log(`${row.unique_identifier}: ${row.scene_count} scenes${marker}`);

    if (row.unique_identifier === 'EA-043') {
      ea043Found = true;
    }
  }

  if (ea043Found) {
    console.log('\n✅ EA-043 IS in the database with scenes');
    console.log('\n💡 If you don\'t see it in Neon UI, try:');
    console.log('   1. Refresh the browser page (Ctrl+R or Cmd+R)');
    console.log('   2. Clear any table filters');
    console.log('   3. Change pagination size to 100 or more');
    console.log('   4. Re-sort the table by chapter_unique_identifier');
  } else {
    console.log('\n❌ EA-043 NOT found in the list');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
