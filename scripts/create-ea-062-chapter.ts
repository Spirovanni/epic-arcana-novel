import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Creating EA-062: Resolve (Book 2, Chapter 22)...\n');

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
    .where(eq(chapters.uniqueIdentifier, 'EA-062'))
    .limit(1);

  if (existing) {
    console.log(`✅ EA-062 already exists (ID: ${existing.id})`);
    console.log(`   Title: ${existing.title}`);
    return;
  }

  // Chapter data from outline
  const chapterData = {
    bookId: book2.id,
    uniqueIdentifier: 'EA-062',
    title: 'Resolve',
    chapterNumber: 62,
    novelBook: 2,
    epicNovelPages: 'Pages 316 - 330',
    epicChapterFocus: 'Reaction (set-up)',
    epicNovelChapterFocus: 'Scene VIII: The Supreme Ordeal',
    tarotFamily: 'Disks',
    tarotCardItem: 'Seven',
    colorName: 'Burnt Umber',
    hexCode: '#8A3324',
    heroJourneyBeat: truncate('Approach to the Inmost Cave', 99),
    saveTheCatBeat: truncate('Midpoint', 100),
    summary: 'The dust has settled. Now comes the accounting. Francisco reviews the resource manifests. The battle with Dagon consumed 60% of their raw timeline-matter. They cannot sustain their current operations. He calls a meeting not to rally the troops, but to cut them. The Seven of Disks governs this moment: unstoppably honest assessment. He shuts down the \'Heritage Project\' (preserving lost art) to prioritize the \'Shield Generator\'. Novella hates it. Francisco hates it. But he does it. The Reward is not happiness; it is the ability to survive the next winter.',
  };

  const [newChapter] = await db
    .insert(chapters)
    .values(chapterData)
    .returning();

  console.log(`✅ Created EA-062 (ID: ${newChapter.id})`);
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
