import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-068: Methodical (Book 2, Chapter 28)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-068'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-068 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-068',
    title: 'Methodical',
    chapterNumber: 68,
    novelBook: 2,
    epicNovelPages: 'Pages 406 - 420',
    epicChapterFocus: 'Pinch (event/conflict)',
    epicNovelChapterFocus: 'Scene XI: The Abyss',
    tarotFamily: 'Swords',
    tarotCardItem: 'King',
    colorName: 'Steel Blue',
    hexCode: '#4682B4',
    heroJourneyBeat: truncate('The Road Back', 99),
    saveTheCatBeat: truncate('Dark Night of the Soul', 100),
    summary: 'The \'Wild Idea\' is go. Now comes the hard part. The device needs to be built in 4 hours using scrap parts. Francisco creates a \'Checklist Manifesto\' environment. He breaks the impossible task into micro-tasks. He assigns teams. He removes bottlenecks. He is \'Methodical\' (King of Swords). There is no drama, no speeches—just the grinding, beautiful noise of competence. They hit a snag; a missing component. Instead of panicking, they \'slow down to speed up\' (Thinking, Fast and Slow). They find a logical workaround. The device is finished with seconds to spare.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-068 (ID: ${newChapter.id})`);
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
