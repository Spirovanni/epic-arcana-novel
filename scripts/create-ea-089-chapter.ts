import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-089: Calming Guidance (Book 3, Chapter 9)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-089'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-089 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-089',
    title: 'Calming Guidance',
    chapterNumber: 89,
    novelBook: 3,
    epicNovelPages: 'Pages 121 - 135',
    epicChapterFocus: 'Refusal of the Call',
    epicNovelChapterFocus: 'Scene III: Refusal of the Call',
    tarotFamily: 'Swords',
    tarotCardItem: 'Six',
    colorName: 'Séance',
    hexCode: '#663366',
    heroJourneyBeat: truncate('Refusal of the Call', 99),
    saveTheCatBeat: truncate('Refusal of the Call', 100),
    summary: 'Night on the river. The boat glides silently. Francisco sits with the refugee family. The mother is sick from temporal displacement. Francisco uses his magic not to fight, but to soothe. He teaches her a breathing exercise (Calming Guidance). The water is smooth (Six of Swords). He realizes that running away isn\'t cowardice if you are guiding others to safety. He accepts his role as a protector.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-089 (ID: ${newChapter.id})`);
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
