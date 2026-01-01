import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-013: The Fool\'s Threshold (Book 1, Chapter 13)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-013'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-013 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book1.id,
    uniqueIdentifier: 'EA-013',
    title: 'The Fool\'s Threshold',
    chapterNumber: 13,
    novelBook: 1,
    epicNovelPages: 'Pages 181 - 195',
    epicChapterFocus: 'The Crossing of the Threshold',
    epicNovelChapterFocus: 'Scene V: The Crossing of the Threshold',
    tarotFamily: 'Major Arcana',
    tarotCardItem: 'The Fool',
    colorName: 'Black',
    hexCode: '#000000',
    heroJourneyBeat: truncate('Crossing the Threshold - The protagonist makes the irreversible decision to enter the new world, leaving behind familiar constraints and embracing the unknown.', 99),
    saveTheCatBeat: truncate('Break Into 2 - The protagonist enters a new world with new rules, marking the transition from Act 1 to Act 2.', 100),
    summary: 'At the shimmering threshold gateway that fluctuates between dimensions, Francisco and his companions face their point of no return. The portal before them reflects not what is, but what could be—a mirror of infinite possibility that both terrifies and beckons. As they cross from the sanctuary of the Zanetti Train into Pangaea\'s realm where all timelines converge, Francisco feels his Trionfi cards awakening to the raw potential surrounding them, no longer mere tools but living extensions of cosmic possibility itself.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-013 (ID: ${newChapter.id})`);
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
