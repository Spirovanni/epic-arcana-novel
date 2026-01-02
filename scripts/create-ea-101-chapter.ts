import { db } from '../src/lib/db';
import { books, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * Creates chapter EA-101 (Mutual Respect) in the database
 */

async function main() {
  console.log('📖 Creating Chapter EA-101: Mutual Respect...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-101'))
    .limit(1);

  if (existingChapter.length > 0) {
    console.log('⚠️  Chapter EA-101 already exists. Skipping creation.');
    console.log(`   Chapter ID: ${existingChapter[0].id}`);
    return;
  }

  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-101',
    title: 'The Reward of Solidarity',
    chapterNumber: 101,
    novelBook: 3,
    epicNovelPages: 'Pages 301 - 315',
    epicChapterFocus: 'Reversal (resolution)',
    epicPreliminarySceneFocus: 'The Reward',
    epicPreliminarySceneDescription: truncate(
      'Having weathered inner conflict, the Daughter discovers new bonds of mutual trust that fortify her vision.',
      500
    ),
    epicNovelChapterFocus: 'Scene VIII: The Supreme Ordeal',
    epicNovelSectionName: 'Part II: Children of the Voice',
    specificTaskGroupTitle: 'Mutual Respect',
    tarotFamily: 'Cups',
    tarotCardItem: 'Two',
    colorName: 'Tyrian Purple',
    hexCode: '#68004E',
    red: 104,
    green: 0,
    blue: 78,
    heroJourneyBeat: truncate('Reversal (resolution) - Reward after the Ordeal', 99),
    saveTheCatBeat: truncate('Reversal (resolution) - Strengthened by survival', 100),
    summary: truncate(
      'Having weathered the supreme temptation of Dagon\'s offer, Francisco discovers that his resistance has forged deeper bonds of mutual trust with his allies. Where he expected isolation after facing the ordeal alone, he finds celebration and strengthened solidarity. His community rallies around him, not because he succeeded, but because his choice to refuse individual power in favor of collective good proves his commitment to their shared values. Through three movements of deepening connection, Francisco learns that mutual respect and interpersonal trust are the true rewards of moral courage. The Two of Cups represents partnership and mutual recognition, showing that authentic relationships are forged through shared trials and proven reliability.',
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
