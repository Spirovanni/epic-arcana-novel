import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    const result = await db.execute(sql`SELECT chapter_unique_identifier, title FROM scenes WHERE chapter_unique_identifier IS NOT NULL LIMIT 5`);
    console.log('Scenes sample:', result.rows);
    process.exit(0);
}

main();
