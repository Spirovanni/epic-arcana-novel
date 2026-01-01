import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-091: Courage (Book 3, Chapter 11)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-091'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-091 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-091',
    title: 'Courage',
    chapterNumber: 91,
    novelBook: 3,
    epicNovelPages: 'Pages 151 - 165',
    epicChapterFocus: 'Pinch',
    epicNovelChapterFocus: 'Scene IV: Allies, Mentors, and Helpers',
    tarotFamily: 'Swords',
    tarotCardItem: 'Seven',
    colorName: 'Magenta',
    hexCode: '#FF00FF',
    heroJourneyBeat: truncate('Pinch', 99),
    saveTheCatBeat: truncate('Pinch', 100),
    summary: 'Francisco needs the Vatican\'s troop movements. He enters Bologna in disguise (Priest). He slips into the Cathedral. The Seven of Swords vibe—looking over his shoulder, holding the stolen goods. He encounters Captain Reyes but bluffs his way past. He reaches the archives. He steals the scroll. The tension is high. He escapes by the skin of his teeth, realizing that \'Courage\' is not just fighting, but daring to act when terrified.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-091 (ID: ${newChapter.id})`);
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
