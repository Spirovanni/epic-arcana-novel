import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-094: Goal Setting (Book 3, Chapter 14)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-094'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-094 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-094',
    title: 'Goal Setting',
    chapterNumber: 94,
    novelBook: 3,
    epicNovelPages: 'Pages 196 - 210',
    epicChapterFocus: 'Push',
    epicNovelChapterFocus: 'Scene VI: Guardians and Gatekeepers',
    tarotFamily: 'Disks',
    tarotCardItem: 'Page',
    colorName: 'Lavender Rose',
    hexCode: '#EA97D5',
    heroJourneyBeat: truncate('Push', 99),
    saveTheCatBeat: truncate('Push', 100),
    summary: 'The morning after the oath. Francisco unrolls the stolen scroll (from EA-091) and the old maps. He embodies \'Goal Setting.\' He teaches the Page of Disks lesson: Vision requires concrete steps. They breakdown the mission. 1. Decrypt the Scroll. 2. Locate the Keystone. 3. Retrieve it before Dagon. They assign teams. The mood is industrious, focused, grounded. The outcome is a clear path forward.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-094 (ID: ${newChapter.id})`);
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
