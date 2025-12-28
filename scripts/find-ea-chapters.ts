import { db } from '../src/lib/db';
import { chapters } from '../src/lib/schema';
import { like, eq } from 'drizzle-orm';

async function main() {
  // Find all EA chapters
  const eaChapters = await db
    .select()
    .from(chapters)
    .where(like(chapters.uniqueIdentifier, 'EA-%'));

  console.log(`\n📊 Found ${eaChapters.length} EA chapters\n`);

  // Sort by unique identifier
  const sorted = eaChapters.sort((a, b) => {
    const aNum = parseInt(a.uniqueIdentifier?.split('-')[1] || '0');
    const bNum = parseInt(b.uniqueIdentifier?.split('-')[1] || '0');
    return aNum - bNum;
  });

  // Show the last 5 and determine pattern
  const last10 = sorted.slice(-10);
  console.log('Last 10 EA chapters:');
  for (const ch of last10) {
    console.log(`  ${ch.uniqueIdentifier}: Book ${ch.bookId?.substring(0, 8)}..., Ch${ch.chapterNumber} - ${ch.title}`);
  }

  // Find EA-040 specifically
  const ea040 = sorted.find(ch => ch.uniqueIdentifier === 'EA-040');
  if (ea040) {
    console.log(`\n✅ EA-040 Details:`);
    console.log(`   Book ID: ${ea040.bookId}`);
    console.log(`   Chapter Number: ${ea040.chapterNumber}`);
    console.log(`   Title: ${ea040.title}`);

    // Find the next chapter number in the SAME book
    const nextInSameBook = await db
      .select()
      .from(chapters)
      .where(eq(chapters.bookId, ea040.bookId!))
      .where(eq(chapters.chapterNumber, ea040.chapterNumber! + 1));

    console.log(`\n📍 Next chapter (${ea040.chapterNumber! + 1}) in same book:`);
    if (nextInSameBook.length > 0) {
      for (const ch of nextInSameBook) {
        console.log(`   Ch${ch.chapterNumber}: ${ch.title} ${ch.uniqueIdentifier ? `(${ch.uniqueIdentifier})` : '(no unique_identifier)'}`);
      }
    } else {
      console.log(`   No chapter ${ea040.chapterNumber! + 1} found in book ${ea040.bookId?.substring(0, 8)}...`);
    }
  } else {
    console.log('\n❌ EA-040 not found');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
