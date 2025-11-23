import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function addIndexes() {
  try {
    console.log('🚀 Adding indexes to growth_focus table...\n');

    // Index 1: B-tree on canonical_id for fast lookups
    console.log('📊 Creating index on canonical_id...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_growth_focus_canonical_id
      ON growth_focus(canonical_id)
    `);
    console.log('✅ Index on canonical_id created\n');

    // Index 2: B-tree on profile_key for fast lookups
    console.log('📊 Creating index on profile_key...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_growth_focus_profile_key
      ON growth_focus(profile_key)
    `);
    console.log('✅ Index on profile_key created\n');

    // Index 3: B-tree on specific_task_group_title for filtering
    console.log('📊 Creating index on specific_task_group_title...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_growth_focus_task_group
      ON growth_focus(specific_task_group_title)
    `);
    console.log('✅ Index on specific_task_group_title created\n');

    // Index 4: Composite index on canonical_id + growth_index for ordering
    console.log('📊 Creating composite index on canonical_id + growth_index...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_growth_focus_canonical_idx
      ON growth_focus(canonical_id, growth_index)
    `);
    console.log('✅ Composite index on canonical_id + growth_index created\n');

    // Index 5: Full-text search on growth_text using GIN
    console.log('📊 Creating full-text search index on growth_text...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_growth_focus_text_search
      ON growth_focus USING GIN (to_tsvector('english', growth_text))
    `);
    console.log('✅ Full-text search index on growth_text created\n');

    console.log('✅ All indexes created successfully!');
    console.log('\n📊 Total indexes: 5');
    console.log('  1. idx_growth_focus_canonical_id (B-tree)');
    console.log('  2. idx_growth_focus_profile_key (B-tree)');
    console.log('  3. idx_growth_focus_task_group (B-tree)');
    console.log('  4. idx_growth_focus_canonical_idx (B-tree composite)');
    console.log('  5. idx_growth_focus_text_search (GIN full-text)');

  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  }
}

addIndexes().then(() => process.exit(0)).catch(() => process.exit(1));
