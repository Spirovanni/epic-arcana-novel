import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-060: Backbone (Book 2, Chapter 20)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-060'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-060 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-060',
    title: 'Backbone',
    chapterNumber: 60,
    novelBook: 2,
    epicNovelPages: 'Pages 286 - 300',
    epicChapterFocus: 'Midpoint',
    epicNovelChapterFocus: 'Scene VIII: The Supreme Ordeal',
    tarotFamily: 'Wands',
    tarotCardItem: 'Nine',
    colorName: 'Carmine Red',
    hexCode: '#FF0000',
    heroJourneyBeat: truncate('Approach to the Inmost Cave', 99),
    saveTheCatBeat: truncate('Midpoint', 100),
    summary: 'The Midpoint Climax. Dagon breaches the Sanctuary, not with an army, but personally. He freezes time for everyone except Francisco. He engages Francisco in a duel of structure—trying to unmake the reality Francisco built. Francisco realizes he cannot win a contest of power. Instead, he channels the \'Nine of Rings\' (Fortitude). He turns himself into a living anchor, absorbing the stress of the timeline. The pain is immense. Dagon is intrigued by this \'illogical\' endurance and withdraws, leaving the Sanctuary damaged but standing. Francisco collapses, alive only because he refused to break.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-060 (ID: ${newChapter.id})`);
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
