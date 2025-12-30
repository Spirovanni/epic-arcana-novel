import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-071: Legacy Building (Book 2, Chapter 31)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-071'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-071 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-071',
    title: 'Legacy Building',
    chapterNumber: 71,
    novelBook: 2,
    epicNovelPages: 'Pages 451 - 465',
    epicChapterFocus: 'Power within (set-up)',
    epicNovelChapterFocus: 'Scene XII: The Ultimate Boon',
    tarotFamily: 'Disks',
    tarotCardItem: 'Ten',
    colorName: 'Brilliant Rose',
    hexCode: '#FF6699',
    heroJourneyBeat: truncate('Resurrection', 99),
    saveTheCatBeat: truncate('Break into Three', 100),
    summary: 'The walls are strong (EA-070), but the society is fragile. Factions are bickering over resources. Francisco realizes his \'Great Man\' leadership style is a single point of failure. He needs \'Legacy\'. He convenes the first Council. He proposes a constitution. It is boring work compared to fighting, but vital. He faces resistance from those who want him to be a King. He refuses. \'Kings die. Systems last.\' He embodies the Ten of Disks—wealth, stability, and inheritance. He creates the \'Flywheel\' of governance.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-071 (ID: ${newChapter.id})`);
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
