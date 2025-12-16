import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('Starting scenes table update...');

    try {
        // 1. Add column if not exists
        console.log('Checking if column exists...');
        await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scenes' AND column_name='chapter_unique_identifier') THEN
          ALTER TABLE scenes ADD COLUMN chapter_unique_identifier varchar(50);
          RAISE NOTICE 'Added chapter_unique_identifier column';
        ELSE
          RAISE NOTICE 'Column chapter_unique_identifier already exists';
        END IF;
      END
      $$;
    `);
        console.log('Column ensuring step done.');

        // 2. Populate data
        console.log('Populating chapter_unique_identifier...');
        // We update all records just to be sure, or specifically those that are null
        const result = await db.execute(sql`
      UPDATE scenes
      SET chapter_unique_identifier = c.unique_identifier
      FROM chapters c
      WHERE scenes.chapter_id = c.id
    `);
        // rowCount is available in result usually
        console.log('Update complete. (Result details might vary by driver)');

    } catch (err) {
        console.error('Error updating scenes table:', err);
        process.exit(1);
    }

    process.exit(0);
}

main();
