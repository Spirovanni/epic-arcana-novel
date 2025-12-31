import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-075: New Business (Book 2, Chapter 35)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-075'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-075 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-075',
    title: 'New Business',
    chapterNumber: 75,
    novelBook: 2,
    epicNovelPages: 'Pages 511 - 525',
    epicChapterFocus: 'Flight',
    epicNovelChapterFocus: 'Scene XIII: Flight',
    tarotFamily: 'Disks',
    tarotCardItem: 'Ace',
    colorName: 'Tyrian Purple',
    hexCode: '#660033',
    heroJourneyBeat: truncate('Return with the Elixir', 99),
    saveTheCatBeat: truncate('Finale', 100),
    summary: 'The convoy crashes. The ships are wrecked. The environment is \'Raw\'—matter that hasn\'t decided what to be yet. It is the Ace of Disks: pure potential but zero structure. Panic sets in. Francisco takes charge. He doesn\'t have a plan; he has a process. \'Build-Measure-Learn\'. They build a shelter. It collapses. They learn. They build another. It holds. He treats survival as a startup. They iterate their way to safety. By the end, they have a \'Minimum Viable Base\' (MVB).',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-075 (ID: ${newChapter.id})`);
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
