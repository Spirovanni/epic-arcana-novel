import { db } from '../src/lib/db';
import { books, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * Creates chapter EA-104 (Empire) in the database
 */

async function main() {
  console.log('📖 Creating Chapter EA-104: Empire...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-104'))
    .limit(1);

  if (existingChapter.length > 0) {
    console.log('⚠️  Chapter EA-104 already exists. Skipping creation.');
    console.log(`   Chapter ID: ${existingChapter[0].id}`);
    return;
  }

  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-104',
    title: 'The King\'s Dominion',
    chapterNumber: 104,
    novelBook: 3,
    epicNovelPages: 'Pages 346 - 360',
    epicChapterFocus: 'Action (conflict)',
    epicPreliminarySceneFocus: 'All is Lost',
    epicPreliminarySceneDescription: truncate(
      'In the wasteland of setbacks, the Daughter rallies dwindling resources to reclaim her purpose.',
      500
    ),
    epicNovelChapterFocus: 'Scene X: Atonement with the Father',
    epicNovelSectionName: 'Part II: Children of the Voice',
    specificTaskGroupTitle: 'Empire',
    tarotFamily: 'Disks',
    tarotCardItem: 'King',
    colorName: 'Magenta',
    hexCode: '#FF00FF',
    red: 255,
    green: 0,
    blue: 255,
    heroJourneyBeat: truncate('Action (conflict) - Rising from devastation through leadership', 99),
    saveTheCatBeat: truncate('All is Lost - Discovering true leadership power in ruins', 100),
    summary: truncate(
      'When Francisco\'s enemies launch a coordinated assault that destroys the Resource Web, scatters his community, and undermines his fourth-path strategy, he faces the King of Disks\' trial: building empire not through conquest but through sustainable influence that survives catastrophe. In the wasteland of apparent defeat, Francisco discovers that his true power lies not in his temporal abilities or strategic brilliance but in his capacity to inspire others to hope and action despite overwhelming odds. Through two crucial movements, he learns that empire-building means creating systems and inspiring people who can sustain purpose without his constant presence. The King of Disks represents mastery of material reality and practical wisdom—leadership that builds lasting structures rather than dependent followers. Francisco transforms from individual hero to empire-builder who multiplies impact through ethical authority and strategic vision that empowers collective resilience.',
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
