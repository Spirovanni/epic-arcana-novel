import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-061: Steady Force (Book 2, Chapter 21)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-061'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-061 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-061',
    title: 'Steady Force',
    chapterNumber: 61,
    novelBook: 2,
    epicNovelPages: 'Pages 301 - 315',
    epicChapterFocus: 'Reversal (resolution)',
    epicNovelChapterFocus: 'Scene VIII: The Supreme Ordeal',
    tarotFamily: 'Wands',
    tarotCardItem: 'Queen',
    colorName: 'Falu Red',
    hexCode: '#821A1A',
    heroJourneyBeat: truncate('Approach to the Inmost Cave', 99),
    saveTheCatBeat: truncate('Midpoint', 100),
    summary: 'The morning after the duel with Dagon. The Sanctuary is still standing, but barely. Francisco wakes up unable to move (Ten of Wands exhaustion). The Council is debating evacuation. It would be easier to run. But running means admitting Dagon was right—that their creation was flawed. Francisco, supported by La Signora, orders the repair. It is a chapter of heavy lifting, clearing rubble, and stabilizing field generators. There is no glory here, only dust and fatigue. But as they work, they realize that they are healing themselves by healing the place. They earn their home a second time.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-061 (ID: ${newChapter.id})`);
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
