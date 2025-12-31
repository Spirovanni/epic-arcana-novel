import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-081: Radiance (Book 3, Chapter 1)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-081'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-081 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-081',
    title: 'Radiance',
    chapterNumber: 81,
    novelBook: 3,
    epicNovelPages: 'Pages 1 - 15',
    epicChapterFocus: 'Intro',
    epicNovelChapterFocus: 'Scene I: The Ordinary World',
    tarotFamily: 'Wands',
    tarotCardItem: 'Ace',
    colorName: 'Neon Pink',
    hexCode: '#FF66CC',
    heroJourneyBeat: truncate('The Ordinary World', 99),
    saveTheCatBeat: truncate('Opening Image - Book 3 begins', 100),
    summary: 'It has been six months since the Rescue. Francisco is back at the University. He is teaching \'Temporal Theory\'. But it\'s not theory anymore; it\'s practice. He speaks with \'Radiance\'. The Ace of Wands energy fills the room. Students hang on his every word. He touches a chalkboard, and the chalk writes itself (a small slip of control). He is high on his own supply. Novella warns him: \'You are glowing too bright.\' He laughs. But in the shadows, Colonna sees the glow and smiles. The weapon is ready.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-081 (ID: ${newChapter.id})`);
  console.log(`   Title: ${newChapter.title}`);
  console.log(`   Chapter: ${newChapter.chapterNumber}`);
  console.log(`   Book: ${newChapter.novelBook}`);
  console.log(`   Tarot: ${newChapter.tarotFamily} - ${newChapter.tarotCardItem}`);
  console.log(`\n🎉 BOOK 3 BEGINS! Welcome to Francisco\'s new Ordinary World.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
