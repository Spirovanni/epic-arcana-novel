import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-064: Playfulness (Book 2, Chapter 24)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-064'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-064 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-064',
    title: 'Playfulness',
    chapterNumber: 64,
    novelBook: 2,
    epicNovelPages: 'Pages 346 - 360',
    epicChapterFocus: 'Action (conflict)',
    epicNovelChapterFocus: 'Scene X: Atonement with the Father',
    tarotFamily: 'Cups',
    tarotCardItem: 'Six',
    colorName: 'Rose Pink',
    hexCode: '#FF66B2',
    heroJourneyBeat: truncate('Reward (Seizing the Sword)', 99),
    saveTheCatBeat: truncate('All Is Lost', 100),
    summary: 'The \'Seeding\' operation is grueling. The team is cracking under the pressure. A critical failure occurs: a reality-anchor drops, causing a localized perception glitch where everyone speaks in rhyme. Panic threatens to set in. But Francisco laughs. It is the Six of Cups—innocence and play. He reframes the disaster as a game. The tension breaks. They gamify the operation. Competence skyrockets when fear is removed. Dagon, watching from the void, stays his hand. He recognizes the move. It is the first moment of mutual respect between the God and the Man.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-064 (ID: ${newChapter.id})`);
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
