import { db } from '../src/lib/db';
import { chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * Finds existing chapters 71-75
 */

async function main() {
  console.log('🔍 Finding existing chapters 71-75...\n');

  const chapterNumbers = [71, 72, 73, 74, 75];

  for (const chapterNum of chapterNumbers) {
    const chapterList = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, chapterNum));

    console.log(`\n📖 Chapter ${chapterNum}:`);
    if (chapterList.length === 0) {
      console.log('   ❌ No chapter found');
    } else {
      for (const chapter of chapterList) {
        console.log(`   ✅ Found: ${chapter.title}`);
        console.log(`      ID: ${chapter.id}`);
        console.log(`      Unique Identifier: ${chapter.uniqueIdentifier || 'N/A'}`);
        console.log(`      Book: ${chapter.novelBook || chapter.bookId}`);
      }
    }
  }

  console.log('\n✅ Search complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
