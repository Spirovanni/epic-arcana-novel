import { db } from '../src/lib/db';
import { books, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * Creates chapter EA-038 (The High Priestess Awakened) in the database
 */

async function main() {
  console.log('📖 Creating Chapter EA-038: The High Priestess Awakened...\n');

  // Get Book 1
  const [book1] = await db
    .select()
    .from(books)
    .where(eq(books.bookNumber, 1))
    .limit(1);

  if (!book1) {
    throw new Error('Book 1 not found in database');
  }

  console.log(`✅ Found Book 1: ${book1.title} (ID: ${book1.id})\n`);

  // Truncate helper
  const truncate = (str: string, maxLen: number) =>
    str.length > maxLen ? str.substring(0, maxLen) : str;

  // Check if chapter already exists
  const existingChapter = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-038'))
    .limit(1);

  if (existingChapter.length > 0) {
    console.log('⚠️  Chapter EA-038 already exists. Skipping creation.');
    console.log(`   Chapter ID: ${existingChapter[0].id}`);
    return;
  }

  const chapterData = {
    bookId: book1.id,
    uniqueIdentifier: 'EA-038',
    title: 'The High Priestess Awakened',
    chapterNumber: 38,
    novelBook: 1,
    epicNovelPages: 'Pages 556 - 570',
    epicChapterFocus: 'Rescue from Without',
    epicPreliminarySceneFocus: 'Finale',
    epicPreliminarySceneDescription: truncate('', 500),
    epicNovelChapterFocus: 'Scene XIV: Rescue from Without',
    epicNovelSectionName: 'Part III: Priestess of the Silver Star',
    specificTaskGroupTitle: 'Inner Knowledge',
    tarotFamily: 'Major Arcana',
    tarotCardItem: 'The High Priestess',
    colorName: 'Black',
    hexCode: '#000000',
    red: 0,
    green: 0,
    blue: 0,
    heroJourneyBeat: truncate('The Return with the Elixir - Inner Knowledge Integration', 99),
    saveTheCatBeat: truncate('The Return with the Elixir', 100),
    summary: truncate(
      'Francisco and Zara must process and integrate their transformation experience, understanding what their new cosmic powers mean and how to use their inner knowledge to guide others through similar awakenings. Through contemplative silence in the Inner Sanctum of Wisdom, they access profound layers of transformational wisdom. They discover their roles as threshold guardians who perceive each seeker\'s readiness and unique path. Finally, they open the Wisdom Temple, offering the true elixir: not instructions for power, but a living map of the inner transformation required to access it. The High Priestess archetype represents sacred inner knowledge and self-awareness that enables authentic teaching and service to others\' growth.',
      1000
    ),
  };

  const [newChapter] = await db.insert(chapters).values(chapterData).returning();

  console.log('✅ Chapter created successfully!');
  console.log(`   Chapter ID: ${newChapter.id}`);
  console.log(`   Title: ${newChapter.title}`);
  console.log(`   Chapter Number: ${newChapter.chapterNumber}`);
  console.log(`   Unique Identifier: ${newChapter.uniqueIdentifier}`);
  console.log(`   Tarot: ${newChapter.tarotCardItem}`);
  console.log(`   Color: ${newChapter.colorName} (${newChapter.hexCode})`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
