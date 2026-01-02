import { db } from '../src/lib/db';
import { books, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * Creates chapter EA-102 (Known Options) in the database
 */

async function main() {
  console.log('📖 Creating Chapter EA-102: Known Options...\n');

  // Get Book 3
  const [book3] = await db
    .select()
    .from(books)
    .where(eq(books.bookNumber, 3))
    .limit(1);

  if (!book3) {
    throw new Error('Book 3 not found in database');
  }

  console.log(`✅ Found Book 3: ${book3.title} (ID: ${book3.id})\n`);

  // Truncate helper
  const truncate = (str: string, maxLen: number) =>
    str.length > maxLen ? str.substring(0, maxLen) : str;

  // Check if chapter already exists
  const existingChapter = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-102'))
    .limit(1);

  if (existingChapter.length > 0) {
    console.log('⚠️  Chapter EA-102 already exists. Skipping creation.');
    console.log(`   Chapter ID: ${existingChapter[0].id}`);
    return;
  }

  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-102',
    title: 'The Chalice of Choices',
    chapterNumber: 102,
    novelBook: 3,
    epicNovelPages: 'Pages 316 - 330',
    epicChapterFocus: 'Reaction (set-up)',
    epicPreliminarySceneFocus: 'The Reward',
    epicPreliminarySceneDescription: truncate(
      'Faced with multiple paths forward, the Daughter must weigh her options before committing to the next phase.',
      500
    ),
    epicNovelChapterFocus: 'Scene VIII: The Supreme Ordeal',
    epicNovelSectionName: 'Part II: Children of the Voice',
    specificTaskGroupTitle: 'Known Options',
    tarotFamily: 'Cups',
    tarotCardItem: 'Seven',
    colorName: 'Tyrian Purple',
    hexCode: '#53003E',
    red: 83,
    green: 0,
    blue: 62,
    heroJourneyBeat: truncate('Reaction (set-up) - Weighing options after the ordeal', 99),
    saveTheCatBeat: truncate('Reaction (set-up) - Preparing for the next phase', 100),
    summary: truncate(
      'With his community strengthened through the ordeal but new threats emerging in response to his resistance, Francisco faces the Seven of Cups challenge: multiple paths forward, each appearing promising yet potentially illusory. Sophisticated enemies adapt their strategies while cautious allies offer conditional support. Through three deliberations, Francisco must map possibilities, evaluate trade-offs, and select his next strategic move with clarity. The Seven of Cups reveals that not all opportunities are real—some are distractions, some are traps, and only careful discernment reveals which path serves the collective good. Francisco learns that success creates new dangers and that strategic caution demonstrates mature courage rather than timidity.',
      1000
    ),
  };

  const [newChapter] = await db.insert(chapters).values(chapterData).returning();

  console.log('✅ Chapter created successfully!');
  console.log(`   Chapter ID: ${newChapter.id}`);
  console.log(`   Title: ${newChapter.title}`);
  console.log(`   Chapter Number: ${newChapter.chapterNumber}`);
  console.log(`   Unique Identifier: ${newChapter.uniqueIdentifier}`);
  console.log(`   Tarot: ${newChapter.tarotCardItem} of ${newChapter.tarotFamily}`);
  console.log(`   Color: ${newChapter.colorName} (${newChapter.hexCode})`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
