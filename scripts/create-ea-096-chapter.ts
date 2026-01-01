import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-096: Mental Agility (Book 3, Chapter 16)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-096'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-096 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-096',
    title: 'Mental Agility',
    chapterNumber: 96,
    novelBook: 3,
    epicNovelPages: 'Pages 226 - 240',
    epicChapterFocus: 'Fun and games (event/conflict)',
    epicNovelChapterFocus: 'Scene VI: Guardians and Gatekeepers',
    tarotFamily: 'Swords',
    tarotCardItem: 'Page',
    colorName: 'Free Speech Magenta',
    hexCode: '#DE5CBD',
    heroJourneyBeat: truncate('Fun and games (event/conflict)', 99),
    saveTheCatBeat: truncate('Fun and games (event/conflict)', 100),
    summary: 'The Scouts report suspicious activity at the bridge. Francisco goes to investigate. It feels wrong. The birds are too quiet. He realizes it\'s an ambush designed for a \'frontal\' thinker. He shifts to \'Page of Swords\' mode. He climbs a tree. He sees the glint of a rune trap. Instead of retreating, he throws a rock to trigger it early. The trap explodes. The enemy is revealed, confused. Francisco mocks them (Page of Swords wit) and leads his team away through the river, covering their tracks. \'Be like water,\' he teaches them.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-096 (ID: ${newChapter.id})`);
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
