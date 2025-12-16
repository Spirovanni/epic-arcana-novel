import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    const result = await db.execute(sql`SELECT unique_identifier, title, type FROM task_groups LIMIT 5`);
    console.log('Task Groups sample:', result.rows);

    process.exit(0);
}

main();
