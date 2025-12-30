import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-059: Loyalty (Book 2, Chapter 19)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-059'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-059 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-059',
    title: 'Loyalty',
    chapterNumber: 59,
    novelBook: 2,
    epicNovelPages: 'Pages 270 - 283',
    epicChapterFocus: 'Relationship dynamic (twist)',
    epicNovelChapterFocus: 'Scene VII: The Road of Trials',
    tarotFamily: 'Cups',
    tarotCardItem: 'Page',
    colorName: 'Persian Red',
    hexCode: '#FF2929',
    heroJourneyBeat: truncate('Tests, Allies, Enemies', 99),
    saveTheCatBeat: truncate('Fun and Games', 100),
    summary: 'Cracks begin to show in the Sanctuary. Some of the new recruits seem "too perfect"—always agreeable, never complaining, never making mistakes. Francisco suspects they are Dagon\'s "Perfect Citizens" (emotionally lobotomized sleeper agents). He arranges a "test of vulnerability," a moment where he feigns a breakdown, shows weakness. The real allies rally around him. The infiltrators stay neutral—they lack the emotional capacity to respond authentically. Francisco exposes them through empathy. The Queen of Swords moment: cutting away the false with precision. It is a bitter lesson—loyalty is not proven through perfection but through the willingness to show, and hold, flaws.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-059 (ID: ${newChapter.id})`);
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
