import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-020: The Crucible of Consistency (Book 1, Chapter 20)...\n');

  // Get Book 1 ID
  const [book1] = await db
    .select()
    .from(books)
    .where(eq(books.bookNumber, 1))
    .limit(1);

  if (!book1) {
    console.error('❌ Book 1 not found in database');
    process.exit(1);
  }

  console.log(`✅ Found Book 1 (ID: ${book1.id})\n`);

  // Check if chapter already exists
  const [existing] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-020'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-020 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data
  const chapterData = {
    bookId: book1.id,
    uniqueIdentifier: 'EA-020',
    title: 'The Crucible of Consistency',
    chapterNumber: 20,
    novelBook: 1,
    epicNovelPages: 'Pages 286 - 300',
    epicChapterFocus: 'Approach to the Innermost Cave - Sustained Mastery',
    epicNovelChapterFocus: 'Scene V: Approach to the Innermost Cave',
    tarotFamily: 'Wands',
    tarotCardItem: 'Eight',
    colorName: 'Burnt Orange',
    hexCode: '#CC5500',
    heroJourneyBeat: truncate('Approach to the Innermost Cave - Final preparation through discipline and consistency', 99),
    saveTheCatBeat: truncate('Approaching the Inmost Cave - Proving readiness through sustained performance', 100),
    summary: 'Fresh from the exhilaration of creative manifestation, Francisco and Zara face the Guardians\' final pre-Ordeal test: the Crucible of Consistency. For seven days, they must maintain perfect execution of increasingly complex magical operations while enduring escalating distractions, fatigue, and pressure.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-020 (ID: ${newChapter.id})`);
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
