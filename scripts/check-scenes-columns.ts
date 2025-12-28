#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function checkColumns() {
    console.log('🔍 Checking scenes table columns...\n');

    const columns = await db.execute(sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'scenes'
    ORDER BY ordinal_position;
  `);

    console.log('📋 Scenes table columns:');
    columns.rows.forEach((col: any) => {
        console.log(`  - ${col.column_name} (${col.data_type})${col.is_nullable === 'YES' ? ' NULL' : ' NOT NULL'}`);
    });
}

checkColumns()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
