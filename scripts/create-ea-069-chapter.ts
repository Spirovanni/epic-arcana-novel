import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-069: Excitable Curiosity (Book 2, Chapter 29)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-069'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-069 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-069',
    title: 'Excitable Curiosity',
    chapterNumber: 69,
    novelBook: 2,
    epicNovelPages: 'Pages 421 - 435',
    epicChapterFocus: 'The Abyss',
    epicNovelChapterFocus: 'Scene XI: The Abyss',
    tarotFamily: 'Wands',
    tarotCardItem: 'Page',
    colorName: 'Deep Cerise',
    hexCode: '#CC3399',
    heroJourneyBeat: truncate('The Road Back', 99),
    saveTheCatBeat: truncate('Dark Night of the Soul', 100),
    summary: 'The device is built (EA-068), but the final simulation shows a 1% variance that will kill them all. The experts are tearing their hair out. Francisco wanders away. He goes to the signal room. He listens to the enemy\'s jamming frequency. He asks a simple, \'childish\' question: \'Why is it in B-flat?\' The experts dismiss him. But he persists. He is \'Curious\' (Page of Wands). He traces the signal. He finds that the jamming isn\'t random; it\'s a carrier wave. Dagon is *broadcasting* his position. The \'flaw\' is actually a map. They don\'t need to overpower the jamming; they just need to surf it. The plan shifts from \'Checkmate\' to \'High Dive\'.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-069 (ID: ${newChapter.id})`);
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
