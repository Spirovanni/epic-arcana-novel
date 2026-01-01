import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-090: Removal (Book 3, Chapter 10)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-090'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-090 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-090',
    title: 'Removal',
    chapterNumber: 90,
    novelBook: 3,
    epicNovelPages: 'Pages 136 - 150',
    epicChapterFocus: 'Pressure',
    epicNovelChapterFocus: 'Scene IV: Allies, Mentors, and Helpers',
    tarotFamily: 'Swords',
    tarotCardItem: 'Three',
    colorName: 'Mardi Gras',
    hexCode: '#330033',
    heroJourneyBeat: truncate('Pressure', 99),
    saveTheCatBeat: truncate('Pressure', 100),
    summary: 'The Sanctuary is at breaking point. Arguments break out over food. Francisco consults with La Signora: \'We can\'t sustain this.\' He decides to implement \'Removal\' (Essentialism). He gathers the group and speaks hard truths. The Three of Swords pierces the heart of the community. He separates the fighters/scholars from the families and arranges transport for the families to a neutral convent. The goodbyes are tearful. He stands on the dock, watching them leave, feeling the weight of the sword in his own heart. He is left with a lean, mean, fighting force.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-090 (ID: ${newChapter.id})`);
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
