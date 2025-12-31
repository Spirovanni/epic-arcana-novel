import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-079: Quicken (Book 2, Chapter 39)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-079'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-079 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-079',
    title: 'Quicken',
    chapterNumber: 79,
    novelBook: 2,
    epicNovelPages: 'Pages 571 - 585',
    epicChapterFocus: 'Resolution',
    epicNovelChapterFocus: 'Scene XV: Master of Two Worlds',
    tarotFamily: 'Wands',
    tarotCardItem: 'Eight',
    colorName: 'Red',
    hexCode: '#FF0000',
    heroJourneyBeat: truncate('Return with the Elixir', 99),
    saveTheCatBeat: truncate('Finale - escape Book 2', 100),
    summary: 'The sky screams. Rescue ships descend. The Drones panic. The timeline begins to delaminate (reality breaking apart). Francisco yells \'Move!\' They sprint. It is the Eight of Wands: speed, arrows in flight, direct action. There is no time for plans. They rely on muscle memory (Habits). They dodge falling rocks. They jump gaps. They reach the Sky Bridge. It is crumbling. They have to jump. Francisco throws Novella across. Then he jumps. He is caught in mid-air by a tractor beam. They are pulled up. The timeline implodes below them. They are out.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-079 (ID: ${newChapter.id})`);
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
