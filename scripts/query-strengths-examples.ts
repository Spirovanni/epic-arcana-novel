/**
 * Example queries for the strengths table
 *
 * Usage: npx tsx scripts/query-strengths-examples.ts
 */

import { db } from '../src/lib/db';
import { strengths } from '../src/lib/schema';
import { eq, like, sql } from 'drizzle-orm';

async function runExampleQueries() {
  console.log('📚 Strengths Table Query Examples\n');
  console.log('═'.repeat(80) + '\n');

  // Example 1: Get all strengths for a specific personality
  console.log('Example 1: Get all strengths for EA-001');
  console.log('─'.repeat(80));
  const profile001 = await db
    .select()
    .from(strengths)
    .where(eq(strengths.canonicalId, 'EA-001'))
    .orderBy(strengths.strengthIndex);

  console.log(`Found ${profile001.length} strengths for EA-001 - ${profile001[0]?.displayName}`);
  profile001.forEach((s) => {
    console.log(`  ${s.strengthIndex}. ${s.strengthText}`);
  });

  // Example 2: Search for strengths containing a keyword
  console.log('\n\nExample 2: Find personalities with "introspection" strength');
  console.log('─'.repeat(80));
  const introspectionResults = await db
    .select({
      canonicalId: strengths.canonicalId,
      displayName: strengths.displayName,
      strengthText: strengths.strengthText,
    })
    .from(strengths)
    .where(like(strengths.strengthText, '%introspection%'))
    .limit(5);

  introspectionResults.forEach((r) => {
    console.log(`  ${r.canonicalId} - ${r.displayName}`);
    console.log(`    → ${r.strengthText}`);
  });

  // Example 3: Get strengths by task group
  console.log('\n\nExample 3: Strengths from "Despair" task group');
  console.log('─'.repeat(80));
  const despairStrengths = await db.execute(sql`
    SELECT DISTINCT canonical_id, display_name, COUNT(*) as strength_count
    FROM strengths
    WHERE specific_task_group_title = 'Despair'
    GROUP BY canonical_id, display_name
    ORDER BY canonical_id
    LIMIT 5
  `);

  despairStrengths.rows.forEach((row: any) => {
    console.log(`  ${row.canonical_id} - ${row.display_name} (${row.strength_count} strengths)`);
  });

  // Example 4: Find personalities with the most strengths
  console.log('\n\nExample 4: Personalities with most strengths (top 5)');
  console.log('─'.repeat(80));
  const topStrengths = await db.execute(sql`
    SELECT canonical_id, display_name, COUNT(*) as strength_count
    FROM strengths
    WHERE canonical_id IS NOT NULL AND canonical_id != ''
    GROUP BY canonical_id, display_name
    ORDER BY strength_count DESC
    LIMIT 5
  `);

  topStrengths.rows.forEach((row: any, idx: number) => {
    console.log(`  ${idx + 1}. ${row.canonical_id} - ${row.display_name} (${row.strength_count} strengths)`);
  });

  // Example 5: Get random personality with all their strengths
  console.log('\n\nExample 5: Random personality with all strengths');
  console.log('─'.repeat(80));
  const randomProfile = await db.execute(sql`
    SELECT canonical_id, display_name, specific_task_group_title, chapter_title, theme
    FROM strengths
    WHERE canonical_id IS NOT NULL AND canonical_id != ''
    ORDER BY RANDOM()
    LIMIT 1
  `);

  if (randomProfile.rows.length > 0) {
    const profile = randomProfile.rows[0] as any;
    console.log(`  Profile: ${profile.canonical_id} - ${profile.display_name}`);
    console.log(`  Task Group: ${profile.specific_task_group_title}`);
    console.log(`  Chapter: ${profile.chapter_title}`);
    console.log(`  Theme: ${profile.theme?.substring(0, 80)}...`);

    const allStrengths = await db
      .select()
      .from(strengths)
      .where(eq(strengths.canonicalId, profile.canonical_id))
      .orderBy(strengths.strengthIndex);

    console.log(`\n  Strengths:`);
    allStrengths.forEach((s) => {
      console.log(`    ${s.strengthIndex}. ${s.strengthText}`);
    });
  }

  // Example 6: Find unique task groups
  console.log('\n\nExample 6: Unique task groups (first 10)');
  console.log('─'.repeat(80));
  const taskGroups = await db.execute(sql`
    SELECT DISTINCT specific_task_group_title, COUNT(*) as count
    FROM strengths
    WHERE specific_task_group_title IS NOT NULL
    GROUP BY specific_task_group_title
    ORDER BY count DESC
    LIMIT 10
  `);

  taskGroups.rows.forEach((row: any) => {
    console.log(`  ${row.specific_task_group_title}: ${row.count} strength records`);
  });

  console.log('\n\n' + '═'.repeat(80));
  console.log('✅ Example queries completed!\n');
}

// Run the examples
runExampleQueries()
  .then(() => {
    console.log('👋 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
