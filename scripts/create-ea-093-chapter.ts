import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-093: Illumination (Book 3, Chapter 13)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-093'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-093 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-093',
    title: 'Illumination',
    chapterNumber: 93,
    novelBook: 3,
    epicNovelPages: 'Pages 181 - 195',
    epicChapterFocus: 'The Crossing of the Threshold',
    epicNovelChapterFocus: 'Scene V: The Crossing of the Threshold',
    tarotFamily: 'Major Arcana',
    tarotCardItem: 'The Hierophant',
    colorName: 'Medium Violet Red',
    hexCode: '#CC1A99',
    heroJourneyBeat: truncate('The Crossing of the Threshold', 99),
    saveTheCatBeat: truncate('The Crossing of the Threshold', 100),
    summary: 'Francisco spends days in the library, writing. He calls the group. He explains that they are not just fighting a war; they are protecting the timeline. He performs a rite of \'Illumination,\' sharing a deep vision of the time stream with them. It is overwhelming but beautiful. They swear an oath. The Hierophant imagery—keys, instruction, tradition. He is no longer just Francisco; he is the Magus.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-093 (ID: ${newChapter.id})`);
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
