import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-095: Focused Anguish (Book 3, Chapter 15)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-095'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-095 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-095',
    title: 'Focused Anguish',
    chapterNumber: 95,
    novelBook: 3,
    epicNovelPages: 'Pages 211 - 225',
    epicChapterFocus: 'New world (set-up)',
    epicNovelChapterFocus: 'Scene VI: Guardians and Gatekeepers',
    tarotFamily: 'Swords',
    tarotCardItem: 'Nine',
    colorName: 'Tea Rose',
    hexCode: '#E57DCA',
    heroJourneyBeat: truncate('New world (set-up)', 99),
    saveTheCatBeat: truncate('New world (set-up)', 100),
    summary: 'Francisco wakes up screaming. The Nine of Swords. He cannot sleep. He wanders the Sanctuary. He sees flaws in the defense that no one else sees. He wakes the guards. He insists on drills. The order grumbles. \'He is losing it.\' But that night, shadows creep over the wall. Francisco is there waiting. He repels the scout. The Order realizes: his burden keeps them safe. \'I sleep so you don\'t have to,\' he doesn\'t say, but they know.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-095 (ID: ${newChapter.id})`);
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
