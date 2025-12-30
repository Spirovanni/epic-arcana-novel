import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-055: Creative Force (Book 2, Chapter 15)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-055'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-055 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-055',
    title: 'Creative Force',
    chapterNumber: 55,
    novelBook: 2,
    epicNovelPages: 'Pages 211 - 225',
    epicChapterFocus: 'New world (set-up)',
    epicNovelChapterFocus: 'Scene VI: Guardians and Gatekeepers',
    tarotFamily: 'Cups',
    tarotCardItem: 'King',
    heroJourneyBeat: truncate('Tests, Allies, Enemies', 99),
    saveTheCatBeat: truncate('Fun and Games', 100),
    summary: 'Facing a \'dead zone\' where Dagon\'s agents have erased a timeline, Francisco realizes that tactical adaptation is insufficient against non-existence. He must channel the King of Cups—mastery of the unconscious and creative force—to build a stable pocket reality. By anchoring this new space in the collective positive emotions of the Council, he creates a fortress that the loveless Faceless agents cannot breach, proving that creation is the ultimate counter to destruction.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-055 (ID: ${newChapter.id})`);
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
