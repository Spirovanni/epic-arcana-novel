import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-058: Empathy (Book 2, Chapter 18)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-058'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-058 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-058',
    title: 'Empathy',
    chapterNumber: 58,
    novelBook: 2,
    epicNovelPages: 'Pages 256 - 270',
    epicChapterFocus: 'Build-up (set-up)',
    epicNovelChapterFocus: 'Scene VII: The Road of Trials',
    tarotFamily: 'Cups',
    tarotCardItem: 'Queen',
    colorName: 'Cinnabar',
    hexCode: '#FF3333',
    heroJourneyBeat: truncate('Tests, Allies, Enemies', 99),
    saveTheCatBeat: truncate('Fun and Games', 100),
    summary: 'With the Venetian alliance secured, the real work begins. The romance of rebellion is replaced by the grind of logistics. Supply lines must be fortified, protocols established, and egos managed. Francisco struggles with the monotony (Knight of Pentacles) until a subtle sabotage threatens the supply chain. It\'s not a dramatic attack, but a slow corrosion. Francisco catches it not through brilliance, but through checking the logs. He realizes that \'Patient Leads\'—the willingness to do the unglamorous work—is the only way to sustain a movement. He ends the chapter standing guard, content in the quiet duty.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-058 (ID: ${newChapter.id})`);
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
