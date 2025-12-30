import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-056: Adversity (Book 2, Chapter 16)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-056'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-056 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-056',
    title: 'Adversity',
    chapterNumber: 56,
    novelBook: 2,
    epicNovelPages: 'Pages 226 - 240',
    epicChapterFocus: 'Fun and games (event/conflict)',
    epicNovelChapterFocus: 'Scene VI: Guardians and Gatekeepers',
    tarotFamily: 'Disks',
    tarotCardItem: 'Five',
    heroJourneyBeat: truncate('Tests, Allies, Enemies', 99),
    saveTheCatBeat: truncate('Fun and Games', 100),
    summary: 'The euphoria of creating the Sanctuary is short-lived as Dagon cuts the temporal supply lines, effectively placing the Council under siege. Plunged into the harsh reality of the Five of Disks—cold, poverty, and isolation—old factional fault lines reopen. Francisco must apply the philosophy that \'The Obstacle Is the Way,\' showing them that their reliance on external energy was a weakness. By cannibalizing their own redundant tech and magical artifacts (\'Stone Soup\'), they create a self-sustaining loop, proving they are antifragile and cannot be starved out.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-056 (ID: ${newChapter.id})`);
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
