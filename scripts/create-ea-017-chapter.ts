import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-017: The Vault of Infinite Resources (Book 1, Chapter 17)...\n');

  // Get Book 1 ID
  const [book1] = await db
    .select()
    .from(books)
    .where(eq(books.bookNumber, 1))
    .limit(1);

  if (!book1) {
    console.error('❌ Book 1 not found in database');
    process.exit(1);
  }

  console.log(`✅ Found Book 1 (ID: ${book1.id})\n`);

  // Check if chapter already exists
  const [existing] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-017'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-017 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data
  const chapterData = {
    bookId: book1.id,
    uniqueIdentifier: 'EA-017',
    title: 'The Vault of Infinite Resources',
    chapterNumber: 17,
    novelBook: 1,
    epicNovelPages: 'Pages 241 - 255',
    epicChapterFocus: 'Tests, Allies and Enemies - Resource Mastery',
    epicNovelChapterFocus: 'Scene IV: Tests, Allies and Enemies',
    tarotFamily: 'Stones',
    tarotCardItem: 'Three',
    colorName: 'Dark Orange',
    hexCode: '#FF8C00',
    heroJourneyBeat: truncate('Tests, Allies and Enemies - Learning to navigate resource dynamics and build sustainable partnerships', 99),
    saveTheCatBeat: truncate('B Story - Developing resource wisdom through relationships', 100),
    summary: 'Francisco and Zara apply their newly developed assertiveness skills to a critical Academy challenge: the Vault of Infinite Resources is failing due to competing factions hoarding knowledge and materials. Through the Three of Stones\' collaborative building energy, they discover that abundance multiplies when resources flow strategically between complementary needs.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-017 (ID: ${newChapter.id})`);
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
