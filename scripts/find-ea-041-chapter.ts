import { db } from '../src/lib/db';
import { chapters } from '../src/lib/schema';

async function main() {
  // Get all chapters
  const allChapters = await db.select().from(chapters).limit(100);

  console.log('\n📊 Chapter Analysis:\n');

  // Group by book_id
  const byBook: Record<string, any[]> = {};
  for (const ch of allChapters) {
    const bookId = ch.bookId || 'unknown';
    if (!byBook[bookId]) byBook[bookId] = [];
    byBook[bookId].push(ch);
  }

  console.log(`Total chapters: ${allChapters.length}`);
  console.log(`Total books: ${Object.keys(byBook).length}\n`);

  for (const [bookId, chapters] of Object.entries(byBook)) {
    console.log(`\n📖 Book ID: ${bookId}`);
    console.log(`   Chapters: ${chapters.length}`);

    // Show first 3 and last 3 chapters
    const sorted = chapters.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
    const first3 = sorted.slice(0, 3);
    const last3 = sorted.slice(-3);

    console.log(`   First chapters:`);
    for (const ch of first3) {
      console.log(`     Ch${ch.chapterNumber}: ${ch.title} ${ch.uniqueIdentifier ? `(${ch.uniqueIdentifier})` : ''}`);
    }

    if (sorted.length > 6) {
      console.log(`     ... (${sorted.length - 6} more chapters)`);
    }

    console.log(`   Last chapters:`);
    for (const ch of last3) {
      console.log(`     Ch${ch.chapterNumber}: ${ch.title} ${ch.uniqueIdentifier ? `(${ch.uniqueIdentifier})` : ''}`);
    }
  }

  // Find EA-040
  const ea040 = allChapters.find(ch => ch.uniqueIdentifier === 'EA-040');
  if (ea040) {
    console.log(`\n✅ Found EA-040: Book ${ea040.bookId}, Chapter ${ea040.chapterNumber}`);

    // Find chapters with chapter_number = 41 or 1
    const ch41s = allChapters.filter(ch => ch.chapterNumber === 41);
    const ch1s = allChapters.filter(ch => ch.chapterNumber === 1);

    console.log(`\n📍 Potential EA-041 locations:`);
    console.log(`   Chapters with number 41: ${ch41s.length}`);
    for (const ch of ch41s) {
      console.log(`     Book ${ch.bookId}, Ch${ch.chapterNumber}: ${ch.title}`);
    }

    console.log(`   Chapters with number 1 (for Book 2): ${ch1s.length}`);
    for (const ch of ch1s) {
      console.log(`     Book ${ch.bookId}, Ch${ch.chapterNumber}: ${ch.title}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
