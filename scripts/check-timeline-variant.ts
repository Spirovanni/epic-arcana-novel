import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { sql } from 'drizzle-orm';

async function checkTimeline() {
    const result = await db.execute(sql`
    SELECT id, title, scene_number, timeline_variant 
    FROM scenes 
    WHERE chapter_id = 'e18fc010-c4d7-4c0e-b72a-eb32aa296a43' 
    ORDER BY scene_number
  `);

    console.log(JSON.stringify(result.rows, null, 2));
    process.exit(0);
}

checkTimeline();
