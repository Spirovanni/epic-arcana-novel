import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-084: Trauma (Book 3, Chapter 4)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-084'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-084 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book3.id,
    uniqueIdentifier: 'EA-084',
    title: 'Trauma',
    chapterNumber: 84,
    novelBook: 3,
    epicNovelPages: 'Pages 46 - 60',
    epicChapterFocus: 'Immediate Reaction',
    epicNovelChapterFocus: 'Scene II: The Call to Adventure',
    tarotFamily: 'Cups',
    tarotCardItem: 'Five',
    colorName: 'Hollywood Cerise',
    hexCode: '#FF0099',
    heroJourneyBeat: truncate('Refusal of the Call', 99),
    saveTheCatBeat: truncate('Catalyst - brother jealousy trauma', 100),
    summary: 'Francisco enters his family home. Gherardo is waiting in the dark. He holds the Ace fragment. \'You kept this for yourself.\' The accusation. The Rage. Gherardo lashes out. A physical brawl. A vase is smashed (Five of Cups imagery). Gherardo tries to stab him. Francisco uses magic to stop him—forcefully. Gherardo looks at him with pure hate. \'Monster.\' Francisco realizes the bridge is burned. He looks at the three spilt cups (relationship destroyed) but takes the two standing (his mission and Novella). He leaves the house forever.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-084 (ID: ${newChapter.id})`);
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
