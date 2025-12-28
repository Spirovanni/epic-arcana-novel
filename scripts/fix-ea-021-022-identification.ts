import { eq, and } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters } from '../src/lib/schema';

async function main() {
  console.log('🔍 Identifying correct EA-021 and EA-022...\n');

  // First, find EA-023 to determine which book we're working with
  const ea023 = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-023'))
    .limit(1);

  if (ea023.length === 0) {
    console.error('❌ EA-023 not found - need this to identify the correct book');
    process.exit(1);
  }

  const bookId = ea023[0].bookId;
  console.log(`✅ Found EA-023 in book: ${bookId}`);
  console.log(`   Title: ${ea023[0].title}`);
  console.log(`   Chapter Number: ${ea023[0].chapterNumber}\n`);

  // Now find chapters 21 and 22 from the SAME book
  console.log(`🔍 Finding chapters 21 and 22 from the same book...\n`);

  const ch21 = await db
    .select()
    .from(chapters)
    .where(and(eq(chapters.bookId, bookId), eq(chapters.chapterNumber, 21)))
    .limit(1);

  const ch22 = await db
    .select()
    .from(chapters)
    .where(and(eq(chapters.bookId, bookId), eq(chapters.chapterNumber, 22)))
    .limit(1);

  if (ch21.length === 0 || ch22.length === 0) {
    console.error('❌ Could not find chapters 21 or 22 in the same book as EA-023');
    process.exit(1);
  }

  console.log(`✅ Found Chapter 21: ${ch21[0].title}`);
  console.log(`   Current Unique ID: ${ch21[0].uniqueIdentifier || 'NULL'}`);
  console.log(`   ID: ${ch21[0].id}\n`);

  console.log(`✅ Found Chapter 22: ${ch22[0].title}`);
  console.log(`   Current Unique ID: ${ch22[0].uniqueIdentifier || 'NULL'}`);
  console.log(`   ID: ${ch22[0].id}\n`);

  // First, clear any existing EA-021 and EA-022 identifiers
  console.log('🧹 Clearing existing EA-021 and EA-022 identifiers...');

  await db
    .update(chapters)
    .set({ uniqueIdentifier: null })
    .where(eq(chapters.uniqueIdentifier, 'EA-021'));

  await db
    .update(chapters)
    .set({ uniqueIdentifier: null })
    .where(eq(chapters.uniqueIdentifier, 'EA-022'));

  console.log('✅ Cleared\n');

  // Now set the correct ones
  console.log('✏️  Setting correct EA-021 and EA-022...');

  await db
    .update(chapters)
    .set({ uniqueIdentifier: 'EA-021' })
    .where(eq(chapters.id, ch21[0].id));

  await db
    .update(chapters)
    .set({ uniqueIdentifier: 'EA-022' })
    .where(eq(chapters.id, ch22[0].id));

  console.log('✅ Set\n');

  // Verify
  console.log('🔍 Final Verification:\n');

  const verifyEA021 = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-021'))
    .limit(1);

  const verifyEA022 = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-022'))
    .limit(1);

  const verifyEA023 = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-023'))
    .limit(1);

  console.log(`EA-021: ${verifyEA021[0]?.title || 'NOT FOUND'} (Chapter ${verifyEA021[0]?.chapterNumber}, Book ${verifyEA021[0]?.bookId})`);
  console.log(`EA-022: ${verifyEA022[0]?.title || 'NOT FOUND'} (Chapter ${verifyEA022[0]?.chapterNumber}, Book ${verifyEA022[0]?.bookId})`);
  console.log(`EA-023: ${verifyEA023[0]?.title || 'NOT FOUND'} (Chapter ${verifyEA023[0]?.chapterNumber}, Book ${verifyEA023[0]?.bookId})`);

  const allSameBook =
    verifyEA021[0]?.bookId === verifyEA023[0]?.bookId &&
    verifyEA022[0]?.bookId === verifyEA023[0]?.bookId;

  console.log(`\n${allSameBook ? '✅' : '❌'} All three chapters in same book: ${allSameBook}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
