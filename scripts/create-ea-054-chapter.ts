import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-054: Adaptable (Book 2, Chapter 14)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-054'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-054 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-054',
    title: 'Adaptable',
    chapterNumber: 54,
    novelBook: 2,
    epicNovelPages: 'Pages 196 - 210',
    epicChapterFocus: 'Push',
    epicNovelChapterFocus: 'Scene VI: Guardians and Gatekeepers',
    tarotFamily: 'Swords',
    tarotCardItem: 'Seven',
    heroJourneyBeat: truncate('Tests, Allies, Enemies', 99),
    saveTheCatBeat: truncate('Fun and Games', 100),
    summary: 'The Unity Council\'s first operation is sabotaged by Dagon\'s \'Faceless\' agents, who exploit the factions\' rigid protocols. Francisco realizes that standard responses play into the enemy\'s hands. Drawing on the Seven of Swords, he devises an unorthodox plan that requires the stiff Byzantines and logical Alexandrians to swap roles and embrace unpredictability, turning the tide by becoming unreadable to their enemies.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-054 (ID: ${newChapter.id})`);
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
