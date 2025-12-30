import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-066: Reflective Energy (Book 2, Chapter 26)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-066'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-066 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-066',
    title: 'Reflective Energy',
    chapterNumber: 66,
    novelBook: 2,
    epicNovelPages: 'Pages 376 - 390',
    epicChapterFocus: 'Atonement with the Father',
    epicNovelChapterFocus: 'Scene X: Atonement with the Father',
    tarotFamily: 'Cups',
    tarotCardItem: 'Queen',
    colorName: 'Royal Blue',
    hexCode: '#4169E1',
    heroJourneyBeat: truncate('Reward (Seizing the Sword)', 99),
    saveTheCatBeat: truncate('All Is Lost', 100),
    summary: 'The siege of the Redoubt holds, but the cost was high. In the eerie silence following the attack, Francisco withdraws. He cannot lead effectively until he understands what just happened. He enters a state of deep reflection (Queen of Cups). Guided by La Signora, he looks into the \'Mirror\' of his actions. He realizes his fear in the previous chapter wasn\'t a weakness—it was the data he needed to understand his enemy. He transforms the trauma into \'Reflective Energy\', emerging not just as a brave fighter, but as a wise king in waiting.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-066 (ID: ${newChapter.id})`);
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
