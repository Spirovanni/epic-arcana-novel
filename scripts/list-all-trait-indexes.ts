import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function listAllIndexes() {
  console.log('📋 All Indexes on Trait Tables\n');
  console.log('═'.repeat(80) + '\n');

  // Strengths indexes
  const strengthsIndexes = await db.execute(sql`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = 'strengths'
    ORDER BY indexname
  `);

  console.log('💪 STRENGTHS TABLE INDEXES:');
  console.log('─'.repeat(80));
  strengthsIndexes.rows.forEach((row: any) => {
    console.log(`\n✓ ${row.indexname}`);
    console.log(`  ${row.indexdef}`);
  });

  // Shadow indexes
  const shadowIndexes = await db.execute(sql`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = 'shadow'
    ORDER BY indexname
  `);

  console.log('\n\n🌑 SHADOW TABLE INDEXES:');
  console.log('─'.repeat(80));
  shadowIndexes.rows.forEach((row: any) => {
    console.log(`\n✓ ${row.indexname}`);
    console.log(`  ${row.indexdef}`);
  });

  console.log('\n\n' + '═'.repeat(80));
  console.log(`✅ Total indexes: ${strengthsIndexes.rows.length + shadowIndexes.rows.length}`);
  console.log(`   Strengths: ${strengthsIndexes.rows.length} indexes`);
  console.log(`   Shadow: ${shadowIndexes.rows.length} indexes`);
}

listAllIndexes().then(() => process.exit(0));
