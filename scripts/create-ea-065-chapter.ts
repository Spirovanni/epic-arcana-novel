import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-065: Valor (Book 2, Chapter 25)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-065'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-065 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-065',
    title: 'Valor',
    chapterNumber: 65,
    novelBook: 2,
    epicNovelPages: 'Pages 361 - 375',
    epicChapterFocus: 'Dedication (resolution)',
    epicNovelChapterFocus: 'Scene X: Atonement with the Father',
    tarotFamily: 'Wands',
    tarotCardItem: 'Seven',
    colorName: 'Burnt Sienna',
    hexCode: '#E97451',
    heroJourneyBeat: truncate('Reward (Seizing the Sword)', 99),
    saveTheCatBeat: truncate('All Is Lost', 100),
    summary: 'The \'Game\' is over. The Legion breaches the perimeter—a tidal wave of grey, faceless soldiers. The evacuation is chaotic. Francisco realizes the choke point at Sector 7 is the only thing stopping a massacre. He sends Novella and the others through the Gate, despite her screams. He stays back. Standing atop a pile of rubble (symbolizing the Seven of Wands\' high ground), he faces the horde. He fights with wand, fists, and sheer will. He holds for 43 minutes. He is cut, burned, and exhausted, but he refuses to yield. Finally, as the Gate closes, he detonates the ceiling supports, burying the Legion and himself in darkness, with only a sliver of hope for survival.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-065 (ID: ${newChapter.id})`);
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
