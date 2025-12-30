import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-067: Open Minded (Book 2, Chapter 27)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-067'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-067 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-067',
    title: 'Open Minded',
    chapterNumber: 67,
    novelBook: 2,
    epicNovelPages: 'Pages 391 - 405',
    epicChapterFocus: 'Trials (set-up)',
    epicNovelChapterFocus: 'Scene XI: The Abyss',
    tarotFamily: 'Wands',
    tarotCardItem: 'Knight',
    colorName: 'Wild Strawberry',
    hexCode: '#FF3399',
    heroJourneyBeat: truncate('The Road Back', 99),
    saveTheCatBeat: truncate('Dark Night of the Soul', 100),
    summary: 'The reflection in the previous chapter yielded clarity: they cannot win by conventional means. Dagon knows their playbook. They need a new game. Francisco gathers his war council. The experts offer defeatist stats. A low-ranking engineer (The Knight of Rings) sheepishly suggests a \'wild\' idea: converting the Redoubt\'s shields into a focused offensive beam, burning out the generator in the process. It\'s suicide if it fails. The experts mock it. Francisco, applying the \'Open Minded\' theme, shuts them down. He listens. He connects the engineer\'s tech with his own magic. He approves the plan. \'We don\'t need to be safe. We need to be right.\'',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-067 (ID: ${newChapter.id})`);
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
