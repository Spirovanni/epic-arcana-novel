import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-088: Judgement (Book 3, Chapter 8)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-088'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-088 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-088',
    title: 'Judgement',
    chapterNumber: 88,
    novelBook: 3,
    epicNovelPages: 'Pages 106 - 120',
    epicChapterFocus: 'Consequence',
    epicNovelChapterFocus: 'Scene III: Refusal of the Call',
    tarotFamily: 'Swords',
    tarotCardItem: 'Eight',
    colorName: 'Dark Magenta',
    hexCode: '#990099',
    heroJourneyBeat: truncate('Consequence', 99),
    saveTheCatBeat: truncate('Consequence', 100),
    summary: 'Consequence: The temporal flare from EA-087 alerted everyone. Vatican agents (The Swords) and Dagon\'s spies encircle Francisco. He is captured/cornered. Not in a jail, but in a \'diplomatic\' bind. They judge his actions. The Eight of Swords imagery—bound and blindfolded. He realizes the trap is legalistic/mental. He must judge *them* to break free.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-088 (ID: ${newChapter.id})`);
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
