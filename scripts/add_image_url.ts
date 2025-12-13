import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function migrate() {
    try {
        console.log('Adding missing columns to users table...');
        await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS image_url varchar(500) DEFAULT '' NOT NULL,
      ADD COLUMN IF NOT EXISTS last_seen_at timestamp,
      ADD COLUMN IF NOT EXISTS clerk_user_id varchar(255);
    `);
        console.log('✅ Migration successful!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

migrate().then(() => process.exit(0)).catch(() => process.exit(1));
