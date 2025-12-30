import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-053: Unity (Book 2, Chapter 13)...\n');

  // Get Book 2 ID
  const [book2] = await db
    .select()
    .from(books)
    .where(eq(books.bookNumber, 2))
    .limit(1);

  if (!book2) {
    console.error('❌ Book 2 not found in database');
    process.exit(1);
  }

  console.log(`✅ Found Book 2 (ID: ${book2.id})\n`);

  // Check if chapter already exists
  const [existing] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-053'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-053 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-053',
    title: 'Unity',
    chapterNumber: 53,
    novelBook: 2,
    epicNovelPages: 'Pages 181 - 195',
    epicChapterFocus: 'The Crossing of the Threshold',
    epicNovelChapterFocus: 'Scene V: The Crossing of the Threshold',
    tarotFamily: 'Major Arcana',
    tarotCardItem: 'The Empress',
    heroJourneyBeat: truncate('Crossing the Threshold', 99),
    saveTheCatBeat: truncate('Break into Two', 100),
    summary: 'Having proven his abilities and processed his grief, Francisco steps fully into his role as a temporal leader. He unites the disparate timeline factions under a shared vision of responsible temporal stewardship, laying the groundwork for collective action against the true threat - the timeline collapse that Dagon has been orchestrating from the shadows.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-053 (ID: ${newChapter.id})`);
  console.log(`   Title: ${newChapter.title}`);
  console.log(`   Chapter: ${newChapter.chapterNumber}`);
  console.log(`   Book: ${newChapter.novelBook}`);
  console.log(`   Tarot: ${newChapter.tarotFamily} - ${newChapter.tarotCardItem}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
