import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-076: Ambitious Circle (Book 2, Chapter 36)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-076'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-076 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-076',
    title: 'Ambitious Circle',
    chapterNumber: 76,
    novelBook: 2,
    epicNovelPages: 'Pages 526 - 540',
    epicChapterFocus: 'Battle (set-up)',
    epicNovelChapterFocus: 'Scene XIV: Rescue from Without',
    tarotFamily: 'Disks',
    tarotCardItem: 'Knight',
    colorName: 'Red',
    hexCode: '#FF0000',
    heroJourneyBeat: truncate('Resurrection', 99),
    saveTheCatBeat: truncate('Finale', 100),
    summary: 'Survival is stable. Now, Escape. Francisco gathers his \'Ambitious Circle\'. He puts the Knight of Disks card on the table: hard work, reliability, detail. He breaks the problem (No Signal) into sub-problems (Power, Frequency, Encryption). He assigns micro-teams. \'Eyes on, hands off.\' He trusts them to execute. They build a Beacon from scrap. Tensions rise as the work is grindingly hard. But the structure holds. They fire the signal. It punches through the static. A voice answers: \'We hear you. We are coming.\'',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-076 (ID: ${newChapter.id})`);
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
