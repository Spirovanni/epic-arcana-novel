import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-085: Severing Ties (Book 3, Chapter 5)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-085'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-085 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-085',
    title: 'Severing Ties',
    chapterNumber: 85,
    novelBook: 3,
    epicNovelPages: 'Pages 61 - 75',
    epicChapterFocus: 'Reaction',
    epicNovelChapterFocus: 'Scene II: The Call to Adventure',
    tarotFamily: 'Swords',
    tarotCardItem: 'Ten',
    colorName: 'Fuchsia',
    hexCode: '#CC33CC',
    heroJourneyBeat: truncate('Reaction', 99),
    saveTheCatBeat: truncate('Reaction - identity erasure ritual', 100),
    summary: 'Francisco moves like a ghost. He enters the University at night to leave his resignation. He clears his desk. The Ten of Swords is about hitting bottom so you can rise. He goes to the riverbank at dawn. He burns his journals, his research, and the letter to his parents. As the smoke rises, he feels the heavy swords of responsibility pinning him down, but also a strange relief. The worst has happened. He is free.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-085 (ID: ${newChapter.id})`);
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
