import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-074: Problem Solving (Book 2, Chapter 34)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-074'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-074 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-074',
    title: 'Problem Solving',
    chapterNumber: 74,
    novelBook: 2,
    epicNovelPages: 'Pages 496 - 510',
    epicChapterFocus: 'Converge (resolution)',
    epicNovelChapterFocus: 'Scene XIII: Flight',
    tarotFamily: 'Swords',
    tarotCardItem: 'Queen',
    colorName: 'Cerise',
    hexCode: '#CC3366',
    heroJourneyBeat: truncate('The Road Back', 99),
    saveTheCatBeat: truncate('Break into 3', 100),
    summary: 'The convoy is in the Slipstream, guided by the Traders. Suddenly, they stop. A \'Temporal Minefield\' blocks the path. It\'s Dagon\'s last card. If they touch a mine, they are erased. Panic erupts on the bridge. The Council shouts contradictory orders. Francisco silences them. He enters \'Queen of Swords\' mode. He uses the \'Four-Step Method\'. He analyzes the mine pattern. He realizes it\'s not random; it\'s a logic gate based on fear. If you move fast, it explodes. If you move slow (Methodical), it opens. He orders the fleet to \'crawl\'. It is counter-intuitive with an enemy behind them, but it is the only way.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-074 (ID: ${newChapter.id})`);
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
