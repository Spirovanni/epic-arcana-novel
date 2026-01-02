import { db } from '../src/lib/db';
import { books, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * Creates chapter EA-105 (Surrender) in the database
 */

async function main() {
  console.log('📖 Creating Chapter EA-105: Surrender...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-105'))
    .limit(1);

  if (existingChapter.length > 0) {
    console.log('⚠️  Chapter EA-105 already exists. Skipping creation.');
    console.log(`   Chapter ID: ${existingChapter[0].id}`);
    return;
  }

  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-105',
    title: 'The Sword\'s Surrender',
    chapterNumber: 105,
    novelBook: 3,
    epicNovelPages: 'Pages 361 - 375',
    epicChapterFocus: 'Dedication (resolution)',
    epicPreliminarySceneFocus: 'All is Lost',
    epicPreliminarySceneDescription: truncate(
      'Faced with overwhelming odds, the Daughter learns the power of surrendering control to higher purpose.',
      500
    ),
    epicNovelChapterFocus: 'Scene X: Atonement with the Father',
    epicNovelSectionName: 'Part II: Children of the Voice',
    specificTaskGroupTitle: 'Surrender',
    tarotFamily: 'Swords',
    tarotCardItem: 'Five',
    colorName: 'Violet Blue',
    hexCode: '#AA44AA',
    red: 170,
    green: 68,
    blue: 170,
    heroJourneyBeat: truncate('Dedication (resolution) - Surrender as deeper commitment', 99),
    saveTheCatBeat: truncate('Dedication (resolution) - Power through letting go', 100),
    summary: truncate(
      'Fresh from building empire through servant leadership, Francisco faces the Five of Swords\' ultimate lesson: some battles cannot be won through strength, strategy, or will—they require surrender to forces beyond personal control. When enemies exploit his rebuilt network and threaten cosmic balance itself, Francisco discovers that his desperate attempts to protect and control are actually preventing the higher-order solution from manifesting. Through three movements of progressive letting go, he learns that surrender is not defeat but profound dedication to purpose beyond ego. The Five of Swords represents the wisdom of knowing when to stop fighting—not from weakness but from recognition that personal will must yield to cosmic intelligence. Francisco accesses resources and allies he could never command through force of will, discovering that true power flows through those who release control to serve higher purpose.',
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
