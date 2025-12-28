import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-046: Gracious (Book 2, Chapter 6)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-046'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-046 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-046',
    title: 'Gracious',
    chapterNumber: 46,
    novelBook: 2,
    epicNovelPages: 'Pages 76 - 90',
    epicChapterFocus: 'The Call to Adventure',
    epicNovelChapterFocus: 'Scene II: The Call to Adventure',
    tarotFamily: 'Disks',
    tarotCardItem: 'Queen',
    colorName: 'Bittersweet',
    hexCode: '#FF6666',
    heroJourneyBeat: truncate('Tests, Allies, Enemies', 99),
    saveTheCatBeat: truncate('Fun and Games', 100),
    summary: 'A spark of possibility compels Francisco to move beyond familiar comforts as he encounters the first Timeline Terminal. Despite initial fear, he learns to cultivate gratitude for both the wonders and dangers of temporal travel. Other travelers share their stories, revealing both the promise and peril of timeline manipulation.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-046 (ID: ${newChapter.id})`);
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
