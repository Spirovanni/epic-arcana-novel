import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-087: Ingenuity (Book 3, Chapter 7)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-087'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-087 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-087',
    title: 'Ingenuity',
    chapterNumber: 87,
    novelBook: 3,
    epicNovelPages: 'Pages 91 - 105',
    epicChapterFocus: 'Action',
    epicNovelChapterFocus: 'Scene III: Refusal of the Call',
    tarotFamily: 'Disks',
    tarotCardItem: 'Two',
    colorName: 'Torch Red',
    hexCode: '#FF0033',
    heroJourneyBeat: truncate('Action', 99),
    saveTheCatBeat: truncate('Action', 100),
    summary: 'Francisco and La Signora enter the village. The church bell rings 12. A cart crashes. A dog barks. Then... silence. The bell rings 12 again. The cart crashes again. Francisco watches, taking notes. \'It\'s a two-body problem,\' he says. Two timelines crashing into each other. He must juggle them. He sets up a counter-frequency. He stands in the square, channeling the Two of Disks (balance). He nudges the cart. It misses the wall. The loop breaks. The villagers are confused but safe. Francisco feels a dry satisfaction.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-087 (ID: ${newChapter.id})`);
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
