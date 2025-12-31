import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-083: Introspection (Book 3, Chapter 3)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-083'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-083 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-083',
    title: 'Introspection',
    chapterNumber: 83,
    novelBook: 3,
    epicNovelPages: 'Pages 31 - 45',
    epicChapterFocus: 'The Ordinary World',
    epicNovelChapterFocus: 'Scene I: The Ordinary World',
    tarotFamily: 'Cups',
    tarotCardItem: 'Eight',
    colorName: 'Hot Magenta',
    hexCode: '#FF00CC',
    heroJourneyBeat: truncate('The Ordinary World', 99),
    saveTheCatBeat: truncate('Setup - Eight of Cups journey', 100),
    summary: 'Night falls again. Francisco walks the city. He visits the tavern where he laughed with friends. He visits the lecture hall. He stacks these memories (Cups) and then turns away. It is an act of \'Introspection\'. He realizes he was seeking validation in these things. Now he seeks Truth. He meets \'Dante\' (his subconscious projection) by the Towers. Dante nods. \'The way up is the way down.\' Francisco is ready to descend into the Vatican\'s underworld.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-083 (ID: ${newChapter.id})`);
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
