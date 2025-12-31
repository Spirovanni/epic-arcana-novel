import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-077: Intellectual Dynamo (Book 2, Chapter 37)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-077'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-077 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-077',
    title: 'Intellectual Dynamo',
    chapterNumber: 77,
    novelBook: 2,
    epicNovelPages: 'Pages 541 - 555',
    epicChapterFocus: 'Climax',
    epicNovelChapterFocus: 'Scene XIV: Rescue from Without',
    tarotFamily: 'Swords',
    tarotCardItem: 'Knight',
    colorName: 'Radical Red',
    hexCode: '#990066',
    heroJourneyBeat: truncate('Rescue from Without (Part 2)', 99),
    saveTheCatBeat: truncate('Finale - rapid innovation triumphs', 100),
    summary: 'The Hunter lands. It is a sleek, black killing machine. It absorbs their laser fire and fires back. The shield is failing (EA-075\'s wall). Francisco calls a \'huddle\'. \'Stop shooting. It learns from shots. We need something it hasn\'t seen.\' He manages an \'Intellectual Dynamo\' session in the middle of a firefight. Someone suggests using the Beacon\'s power core to overload the local gravity. It\'s insane. It might kill them all. Francisco says \'Do it.\' They rig the device. They fire. It crushes the Hunter into foil. Innovation wins.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-077 (ID: ${newChapter.id})`);
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
