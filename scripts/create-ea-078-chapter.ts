import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-078: Energy (Book 2, Chapter 38)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-078'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-078 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-078',
    title: 'Energy',
    chapterNumber: 78,
    novelBook: 2,
    epicNovelPages: 'Pages 556 - 570',
    epicChapterFocus: 'Rescue from Without',
    epicNovelChapterFocus: 'Scene XIV: Rescue from Without',
    tarotFamily: 'Major Arcana',
    tarotCardItem: 'The Emperor',
    colorName: 'Cerise',
    hexCode: '#D03373',
    heroJourneyBeat: truncate('Resurrection', 99),
    saveTheCatBeat: truncate('Finale - sustain defense buy time', 100),
    summary: 'The Hunter\'s destruction attracts the swarm. Thousands of drones. They don\'t attack all at once; they harass. They deny sleep. It is a siege of exhaustion. The team is breaking. Francisco takes the \'Emperor\' stance. He organizes shift sleeping. He takes the double watch. He stands on the wall, a statue of will. He manages his internal energy to stay awake for 48 hours. He becomes the battery for the entire group. When he finally sleeps, the others fight harder to protect *him*.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-078 (ID: ${newChapter.id})`);
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
