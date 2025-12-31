import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-080: Isolation (Book 2, Chapter 40)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-080'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-080 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-080',
    title: 'Isolation',
    chapterNumber: 80,
    novelBook: 2,
    epicNovelPages: 'Pages 586 - 600',
    epicChapterFocus: 'Master of Two Worlds',
    epicNovelChapterFocus: 'Scene XV: Master of Two Worlds',
    tarotFamily: 'Disks',
    tarotCardItem: 'Four',
    colorName: 'Old Rose',
    hexCode: '#BB3D4E',
    heroJourneyBeat: truncate('Final Image', 99),
    saveTheCatBeat: truncate('Final Image - Book 2 epilogue', 100),
    summary: 'The rescue is successful. But safety brings silence. Francisco is placed in quarantine for \'temporal decontamination\'. He sits alone. He holds the Four of Disks energy: holding on tight. He reviews the mission logs. He deletes the data about the \'Ace of Disks\' seed he found. Some things are too dangerous for the Generals. He decides to keep the core of his power secret. He looks in the mirror. The student is gone. The Magus remains. He steps out of the airlock, ready to lie to everyone he serves.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-080 (ID: ${newChapter.id})`);
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
