import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-086: Apathy (Book 3, Chapter 6)...\n');

  // Get Book 3 ID
  const [book3] = await db
    .select()
    .from(books)
    .where(eq(books.bookNumber, 3))
    .limit(1);

  if (!book3) {
    console.error('❌ Book 3 not found in database');
    process.exit(1);
  }

  console.log(`✅ Found Book 3 (ID: ${book3.id})\n`);

  // Check if chapter already exists
  const [existing] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-086'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-086 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-086',
    title: 'Apathy',
    chapterNumber: 86,
    novelBook: 3,
    epicNovelPages: 'Pages 76 - 90',
    epicChapterFocus: 'The Call to Adventure',
    epicNovelChapterFocus: 'Scene II: The Call to Adventure',
    tarotFamily: 'Cups',
    tarotCardItem: 'Four',
    colorName: 'Razzmatazz',
    hexCode: '#FF0066',
    heroJourneyBeat: truncate('The Call to Adventure', 99),
    saveTheCatBeat: truncate('Call to Adventure - child saves awakening', 100),
    summary: 'Francisco sits in the dark. La Signora enters with food and news. He ignores both. He feels nothing. \'You saved the city,\' she says. \'I lost my brother,\' he replies. This is the Four of Cups stagnation. He goes for a walk in the disguise of a beggar. He sees a child playing near a temporal rift (a foreshadowing of the paradox). The child is in danger. Francisco feels a flicker of fear. That fear leads to action. He saves the child. The numbness cracks.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-086 (ID: ${newChapter.id})`);
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
