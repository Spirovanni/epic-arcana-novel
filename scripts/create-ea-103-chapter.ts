import { db } from '../src/lib/db';
import { books, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * Creates chapter EA-103 (Imagination) in the database
 */

async function main() {
  console.log('📖 Creating Chapter EA-103: Imagination...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-103'))
    .limit(1);

  if (existingChapter.length > 0) {
    console.log('⚠️  Chapter EA-103 already exists. Skipping creation.');
    console.log(`   Chapter ID: ${existingChapter[0].id}`);
    return;
  }

  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-103',
    title: 'The Knight\'s Vision',
    chapterNumber: 103,
    novelBook: 3,
    epicNovelPages: 'Pages 331 - 345',
    epicChapterFocus: 'The Supreme Ordeal',
    epicPreliminarySceneFocus: 'The Reward',
    epicPreliminarySceneDescription: truncate(
      'Having mastered her inner voice, the Daughter now envisions bold new possibilities beyond known limits.',
      500
    ),
    epicNovelChapterFocus: 'Scene IX: The Meeting with a Goddess',
    epicNovelSectionName: 'Part II: Children of the Voice',
    specificTaskGroupTitle: 'Imagination',
    tarotFamily: 'Cups',
    tarotCardItem: 'Knight',
    colorName: 'Medium Red Violet',
    hexCode: '#B02F8F',
    red: 176,
    green: 47,
    blue: 143,
    heroJourneyBeat: truncate('The Supreme Ordeal - Visionary transformation', 99),
    saveTheCatBeat: truncate('The Supreme Ordeal - Creative breakthrough', 100),
    summary: truncate(
      'Having chosen the fourth path with clarity and commitment, Francisco now experiences the Knight of Cups\' gift: imaginative vision that transcends current reality. Through a profound encounter with creative possibility, he glimpses futures ranging from utopian harmony to apocalyptic collapse—all dependent on humanity\'s collective imagination and will. The vision reveals that limitation exists primarily in constrained thinking, and that bold creativity can reshape reality itself. Francisco learns to see beyond the seen, understanding that his role isn\'t just protecting timelines but expanding what timelines are possible. The Knight of Cups rides forward with romantic idealism tempered by strategic wisdom, showing that visionary imagination grounded in values creates transformative power.',
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
