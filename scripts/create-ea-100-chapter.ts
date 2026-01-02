import { db } from '../src/lib/db';
import { books, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * Creates chapter EA-100 (Home Advantage) in the database
 */

async function main() {
  console.log('📖 Creating Chapter EA-100: Home Advantage...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-100'))
    .limit(1);

  if (existingChapter.length > 0) {
    console.log('⚠️  Chapter EA-100 already exists. Skipping creation.');
    console.log(`   Chapter ID: ${existingChapter[0].id}`);
    return;
  }

  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-100',
    title: 'The Ordeal of Dagon\'s Temptation',
    chapterNumber: 100,
    novelBook: 3,
    epicNovelPages: 'Pages 286 - 300',
    epicChapterFocus: 'Midpoint',
    epicPreliminarySceneFocus: 'The Ordeal (Temptation)',
    epicPreliminarySceneDescription: truncate(
      'The Daughter leans on familiar strengths to resist temptation and stay true to her path.',
      500
    ),
    epicNovelChapterFocus: 'Scene VIII: The Supreme Ordeal',
    epicNovelSectionName: 'Part II: Children of the Voice',
    specificTaskGroupTitle: 'Home Advantage',
    tarotFamily: 'Wands',
    tarotCardItem: 'Four',
    colorName: 'Eggplant',
    hexCode: '#820062',
    red: 130,
    green: 0,
    blue: 98,
    heroJourneyBeat: truncate('Approach to the Inmost Cave - The Midpoint Ordeal', 99),
    saveTheCatBeat: truncate('Midpoint - False peak before the real trial', 100),
    summary: truncate(
      'At the story\'s midpoint, Francisco faces his greatest temptation when Dagon offers him ultimate knowledge and power in exchange for his allegiance. Francisco must lean on his familiar strengths—his narrative gift, his deep relationships, and his commitment to collective good—to resist this supreme temptation. Through three crucial confrontations, he discovers that his reliability to principles and people is his greatest strength. The Four of Wands represents celebration and homecoming, reminding Francisco that his true home is among those who share his values, not in the seductive promises of ultimate power.',
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
