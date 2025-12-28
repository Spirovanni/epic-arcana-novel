import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-051: Swiftness (Book 2, Chapter 11)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-051'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-051 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-051',
    title: 'Swiftness',
    chapterNumber: 51,
    novelBook: 2,
    epicNovelPages: 'Pages 151 - 165',
    epicChapterFocus: 'Pinch',
    epicNovelChapterFocus: 'Scene IV: Allies, Mentors, and Helpers',
    tarotFamily: 'Wands',
    tarotCardItem: 'Eight',
    colorName: 'Vermillion',
    hexCode: '#FF4D00',
    heroJourneyBeat: truncate('Tests, Allies, Enemies', 99),
    saveTheCatBeat: truncate('Fun and Games', 100),
    summary: 'At a crucial pinch point, internal and external pressures converge as Francisco discovers Roger de Flor\'s first death. The revelation that his ally can die and be reborn across timelines forces Francisco to act with unprecedented speed to save his friend\'s life in this reality, while learning about the nature of temporal mortality.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-051 (ID: ${newChapter.id})`);
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
