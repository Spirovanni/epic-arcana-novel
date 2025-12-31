import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-073: Benevolence (Book 2, Chapter 33)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-073'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-073 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-073',
    title: 'Benevolence',
    chapterNumber: 73,
    novelBook: 2,
    epicNovelPages: 'Pages 481 - 495',
    epicChapterFocus: 'Action (conflict)',
    epicNovelChapterFocus: 'Scene XIII: Flight',
    tarotFamily: 'Disks',
    tarotCardItem: 'Six',
    colorName: 'Ruby',
    hexCode: '#CC0066',
    heroJourneyBeat: truncate('The Road Back', 99),
    saveTheCatBeat: truncate('Break into Three', 100),
    summary: 'The \'Golden Hour\' (EA-072) ends. Dagon attacks with overwhelming force. They cannot hold the Redoubt forever. They need to relocate. The only exit is through the Boundary Lands, controlled by the hostile Grey Traders. The Council wants to fight them. Francisco refuses. He meets the Trader Captain. He sees their camp is starving. Instead of demanding passage, he offers the Redoubt\'s food surplus (from EA-072). He gives it freely, asking nothing. This \'Six of Disks\' act—giving to the scales—shocks the Traders. They not only grant passage; they offer to guide them. Generosity opened the door that force would have sealed.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-073 (ID: ${newChapter.id})`);
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
