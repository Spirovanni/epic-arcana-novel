/**
 * Add indexes to strengths table for better query performance
 *
 * Usage: npx tsx scripts/add-strengths-indexes.ts
 */

import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function addIndexes() {
  console.log('🔧 Adding indexes to strengths table...\n');

  try {
    // Index 1: canonical_id for profile lookups
    console.log('Creating index on canonical_id...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_strengths_canonical_id
      ON strengths(canonical_id)
    `);
    console.log('✓ idx_strengths_canonical_id created');

    // Index 2: profile_key for alternative lookups
    console.log('Creating index on profile_key...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_strengths_profile_key
      ON strengths(profile_key)
    `);
    console.log('✓ idx_strengths_profile_key created');

    // Index 3: specific_task_group_title for task group filtering
    console.log('Creating index on specific_task_group_title...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_strengths_task_group
      ON strengths(specific_task_group_title)
    `);
    console.log('✓ idx_strengths_task_group created');

    // Index 4: Full-text search on strength_text
    console.log('Creating full-text search index on strength_text...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_strengths_text_search
      ON strengths USING gin(to_tsvector('english', strength_text))
    `);
    console.log('✓ idx_strengths_text_search created (GIN index for fast text search)');

    console.log('\n✅ All indexes created successfully!');
    console.log('\n📊 Performance improvements:');
    console.log('  • Fast lookups by canonical_id (profile queries)');
    console.log('  • Fast lookups by profile_key (alternative key)');
    console.log('  • Fast filtering by task group');
    console.log('  • Fast full-text search on strength descriptions');

  } catch (error) {
    console.error('\n❌ Error creating indexes:', error);
    throw error;
  }
}

// Run the index creation
addIndexes()
  .then(() => {
    console.log('\n👋 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed to create indexes:', error);
    process.exit(1);
  });
