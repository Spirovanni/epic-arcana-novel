import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function checkStatus() {
  const allBooks = await db.select({ id: books.id, bookNumber: books.bookNumber }).from(books);
  console.log('📚 Books in database:', allBooks.map(b => `Book ${b.bookNumber}`).join(', '));
  console.log('');

  const allChapters = await db.select({ 
    bookId: chapters.bookId, 
    chapterNumber: chapters.chapterNumber,
    chapterId: chapters.chapterId,
    uniqueIdentifier: chapters.uniqueIdentifier
  }).from(chapters);

  console.log('📊 Chapter Statistics:');
  console.log(`   Total chapters: ${allChapters.length}`);
  console.log(`   With chapter_id: ${allChapters.filter(c => c.chapterId).length}`);
  console.log(`   With unique_identifier: ${allChapters.filter(c => c.uniqueIdentifier).length}`);
  console.log('');

  // Group by book
  const bookIdToNumber = new Map(allBooks.map(b => [b.id, b.bookNumber]));
  const chaptersByBook = new Map<number, number>();
  
  for (const chapter of allChapters) {
    const bookNumber = bookIdToNumber.get(chapter.bookId);
    if (bookNumber) {
      chaptersByBook.set(bookNumber, (chaptersByBook.get(bookNumber) || 0) + 1);
    }
  }

  console.log('📖 Chapters per book:');
  for (const [bookNum, count] of Array.from(chaptersByBook.entries()).sort()) {
    console.log(`   Book ${bookNum}: ${count} chapters`);
  }

  process.exit(0);
}

checkStatus().catch(console.error);

