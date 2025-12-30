import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-063: Strong Leadership (Book 2, Chapter 23)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-063'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-063 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-063',
    title: 'Strong Leadership',
    chapterNumber: 63,
    novelBook: 2,
    epicNovelPages: 'Pages 331 - 345',
    epicChapterFocus: 'The Supreme Ordeal',
    epicNovelChapterFocus: 'Scene IX: The Meeting with a Goddess',
    tarotFamily: 'Wands',
    tarotCardItem: 'Three',
    colorName: 'Vermilion',
    hexCode: '#D84315',
    heroJourneyBeat: truncate('The Ordeal', 99),
    saveTheCatBeat: truncate('Bad Guys Close In', 100),
    summary: 'The Alliance is splintering. Without a clear enemy to fight right now, they are fighting each other. The Hawks want to attack; the Doves want to hide. Francisco is paralyzed by the validity of both arguments. La Signora takes him to the Spire. She shows him the Void outside the Sanctuary. \'You are looking at the walls,\' she says. \'Look at the space.\' She unlocks the Three of Wands archetype: Vision. Francisco realizes they don\'t have to defend or attack. They can *expand*. He returns to the Council with a new plan: \'Seeding\'. They will create decoy timelines to split Dagon\'s focus. It is a plan so audacious it unites the room.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-063 (ID: ${newChapter.id})`);
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
