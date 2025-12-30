import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-057: Optimism (Book 2, Chapter 17)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-057'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-057 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-057',
    title: 'Optimism',
    chapterNumber: 57,
    novelBook: 2,
    epicNovelPages: 'Pages 241 - 255',
    epicChapterFocus: 'Old world contrast (resolution)',
    epicNovelChapterFocus: 'Scene VII: The Road of Trials',
    tarotFamily: 'Wands',
    tarotCardItem: 'Queen',
    colorName: 'Bittersweet',
    hexCode: '#FF5C5C',
    heroJourneyBeat: truncate('Tests, Allies, Enemies', 99),
    saveTheCatBeat: truncate('Fun and Games', 100),
    summary: 'To secure the resources needed for the Sanctuary (EA-056 fallout), Francisco enters the lion\'s den: a diplomatic summit with Doge Venier of the Venetian Temporal Fleet. The Doge intends to humiliate and absorb Francisco\'s movement. Francisco applies the lesson of \'Optimism\' and the Two of Cups (Union). He refuses to be provoked, instead finding the hidden emotional need of the Doge—legacy. By offering a partnership that honors Venice\'s history rather than threatening it, he turns a hostile negotiation into a powerful alliance, proving that shared interest is stronger than coercion.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-057 (ID: ${newChapter.id})`);
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
