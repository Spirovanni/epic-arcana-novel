import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('Checking app_users table...');
    try {
        const result = await db.execute(sql`SELECT * FROM app_users LIMIT 5`);
        console.log('app_users rows:', result.rows);
    } catch (error) {
        console.error('Error querying app_users:', error);
    }
    process.exit(0);
}

main();
