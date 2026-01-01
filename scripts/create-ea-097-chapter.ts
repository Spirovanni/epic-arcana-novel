import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-097: Triumph (Book 3, Chapter 17)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-097'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-097 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-097',
    title: 'Triumph',
    chapterNumber: 97,
    novelBook: 3,
    epicNovelPages: 'Pages 241 - 255',
    epicChapterFocus: 'Old world contrast (resolution)',
    epicNovelChapterFocus: 'Scene VII: The Road of Trials',
    tarotFamily: 'Cups',
    tarotCardItem: 'Nine',
    colorName: 'Deep Cerise',
    hexCode: '#D633AD',
    heroJourneyBeat: truncate('Old world contrast (resolution)', 99),
    saveTheCatBeat: truncate('Old world contrast (resolution)', 100),
    summary: 'The expedition reaches the Crypt. It\'s underwater (partially). They use \'Mental Agility\' to breathe. They navigate the traps. They reach the central chamber. There, floating in a stasis field, is the Keystone. It hums with power. Francisco laughs. It is the laugh of \'Triumph.\' He toasts the Nine of Cups (figuratively). \'We have won,\' he says. \'It\'s just a matter of time.\' They retreat to plan the extraction, high on success.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-097 (ID: ${newChapter.id})`);
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
