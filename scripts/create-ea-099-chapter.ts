import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-099: Ambition (Book 3, Chapter 19)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-099'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-099 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-099',
    title: 'Ambition',
    chapterNumber: 99,
    novelBook: 3,
    epicNovelPages: 'Pages 271 - 285',
    epicChapterFocus: 'The Road of Trials',
    epicNovelChapterFocus: 'Scene VII: The Road of Trials',
    tarotFamily: 'Disks',
    tarotCardItem: 'Eight',
    colorName: 'Eggplant',
    hexCode: '#A3007A',
    heroJourneyBeat: truncate('The Road of Trials', 99),
    saveTheCatBeat: truncate('The Road of Trials', 100),
    summary: 'The Sanctuary becomes a factory. The Eight of Disks energy—hammering, crafting, repeating. Francisco inspects every detail. \'Ambition is not a dream,\' he tells them. \'It is a discipline.\' He checks the enchanting of the containment box. He corrects a novice\'s pronunciation. He is relentless. The mood is serious, professional. They are no longer refugees; they are an army. But they are tired. They are ready to launch the mission to the Crypt (EA-097 location) to finish the job.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-099 (ID: ${newChapter.id})`);
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
