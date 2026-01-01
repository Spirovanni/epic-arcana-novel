import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-098: Focus (Book 3, Chapter 18)...\n');

  // Get Book 3 ID
  const [book3] = await db
    .select()
    .from(books)
    .where(eq(books.bookNumber, 3))
    .limit(1);

  if (!book3) {
    console.error('❌ Book 3 not found in database');
    process.exit(1);
  }

  console.log(`✅ Found Book 3 (ID: ${book3.id})\n`);

  // Check if chapter already exists
  const [existing] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-098'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-098 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-098',
    title: 'Focus',
    chapterNumber: 98,
    novelBook: 3,
    epicNovelPages: 'Pages 256 - 270',
    epicChapterFocus: 'Build-up (set-up)',
    epicNovelChapterFocus: 'Scene VII: The Road of Trials',
    tarotFamily: 'Swords',
    tarotCardItem: 'Ace',
    colorName: 'Medium Violet Red',
    hexCode: '#CC0099',
    heroJourneyBeat: truncate('Build-up (set-up)', 99),
    saveTheCatBeat: truncate('Build-up (set-up)', 100),
    summary: 'Days pass. Francisco is a ghost. The Ace of Swords demands total clarity. He achieves \'Deep Work,\' but it is toxic. He figures out how to bypass the Keystone\'s ward. La Signora breaks down his door. \'We are starving,\' she says (metaphorically and literally). He looks at her with cold eyes. \'I am saving the world. Eat less.\' It is a shocking moment of cruelty born of \'Focus.\' He has the spell, but he may have lost the people.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-098 (ID: ${newChapter.id})`);
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
