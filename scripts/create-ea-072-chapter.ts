import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-072: Seek Prosperity (Book 2, Chapter 32)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-072'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-072 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-072',
    title: 'Seek Prosperity',
    chapterNumber: 72,
    novelBook: 2,
    epicNovelPages: 'Pages 466 - 480',
    epicChapterFocus: 'The Ultimate Boon',
    epicNovelChapterFocus: 'Scene XII: The Ultimate Boon',
    tarotFamily: 'Disks',
    tarotCardItem: 'Nine',
    colorName: 'Lipstick',
    hexCode: '#993366',
    heroJourneyBeat: truncate('Resurrection', 99),
    saveTheCatBeat: truncate('Break into 3', 100),
    summary: 'The Redoubt is secure (EA-070) and organized (EA-071). Now, it becomes rich. Word spreads that it is a safe haven. Caravans from other timeline pockets arrive. They bring \'The Ultimate Boon\' in the form of exotic tech and supplies. Francisco stands in the new Market. He feels the pull of the Nine of Disks—luxury, rest, the enjoyment of his labor. He realizes that \'Prosperity\' is a test too. He must use \'The Abundance Code\' to multiply these resources, not just consume them. He invests in the community. He turns the base into a thriving city-state.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-072 (ID: ${newChapter.id})`);
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
