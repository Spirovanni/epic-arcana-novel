import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-070: Regeneration (Book 2, Chapter 30)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-070'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-070 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-070',
    title: 'Regeneration',
    chapterNumber: 70,
    novelBook: 2,
    epicNovelPages: 'Pages 436 - 450',
    epicChapterFocus: 'Darkest moment (resolution)',
    epicNovelChapterFocus: 'Scene XII: The Ultimate Boon',
    tarotFamily: 'Wands',
    tarotCardItem: 'Nine',
    colorName: 'Radical Red',
    hexCode: '#FF3366',
    heroJourneyBeat: truncate('Resurrection', 99),
    saveTheCatBeat: truncate('Break into Three', 100),
    summary: 'The dust settles on the \'Last Man\' stand (EA-065). Francisco wakes up in the Infirmary. The battle is won, but the Redoubt is a ruin. 30% casualties. The mood is brittle. Francisco refuses to let them wallow. He initiates \'Regeneration\'. He leads the Triage not just of bodies, but of the base itself. He uses the debris of the enemy legion to reinforce the walls—literal \'Antifragile\' building. He holds a ritual for the fallen, turning grief into purpose. They end the chapter scarred, but harder.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-070 (ID: ${newChapter.id})`);
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
