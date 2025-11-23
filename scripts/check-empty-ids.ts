import { db } from '../src/lib/db';
import { strengths } from '../src/lib/schema';
import { sql } from 'drizzle-orm';

async function checkEmptyIds() {
  const emptyIds = await db.execute(sql`
    SELECT profile_key, display_name, specific_task_group_title, strength_index, strength_text
    FROM strengths
    WHERE canonical_id IS NULL OR canonical_id = ''
    LIMIT 10
  `);

  console.log('Records with empty canonical_id:');
  console.log(JSON.stringify(emptyIds.rows, null, 2));
}

checkEmptyIds().then(() => process.exit(0));
