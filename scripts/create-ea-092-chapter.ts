import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-092: Abundance (Book 3, Chapter 12)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-092'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-092 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-092',
    title: 'Abundance',
    chapterNumber: 92,
    novelBook: 3,
    epicNovelPages: 'Pages 166 - 180',
    epicChapterFocus: 'Allies, Mentors, and Helpers',
    epicNovelChapterFocus: 'Scene IV: Allies, Mentors, and Helpers',
    tarotFamily: 'Cups',
    tarotCardItem: 'Three',
    colorName: 'Vivid Violet',
    hexCode: '#993399',
    heroJourneyBeat: truncate('Allies, Mentors, and Helpers', 99),
    saveTheCatBeat: truncate('Allies, Mentors, and Helpers', 100),
    summary: 'Francisco uses the intel to intercept a Vatican convoy. The raid is executed perfectly (showing team competence). They return with wagons of grain, wine, and cloth. The Sanctuary is filled with laughter. They hold a feast. Francisco sits at the head of the table. Three of Cups: Connection, Celebration, Community. He realizes that this—this joy—is what he is fighting for. Not just survival, but life.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-092 (ID: ${newChapter.id})`);
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
