import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function findChaptersWithoutId() {
  const allChapters = await db.select({ 
    id: chapters.id,
    bookId: chapters.bookId, 
    chapterNumber: chapters.chapterNumber,
    chapterId: chapters.chapterId,
    title: chapters.title
  }).from(chapters);

  const allBooks = await db.select({ id: books.id, bookNumber: books.bookNumber }).from(books);
  const bookIdToNumber = new Map(allBooks.map(b => [b.id, b.bookNumber]));

  const withoutId = allChapters.filter(c => !c.chapterId);
  
  console.log(`📊 Chapters without chapter_id: ${withoutId.length}`);
  console.log('');
  
  if (withoutId.length > 0) {
    console.log('📋 First 20 chapters without chapter_id:');
    for (const chapter of withoutId.slice(0, 20)) {
      const bookNum = bookIdToNumber.get(chapter.bookId) || '?';
      console.log(`   Book ${bookNum}, Chapter ${chapter.chapterNumber}: ${chapter.title || '(no title)'}`);
    }
  }

  process.exit(0);
}

findChaptersWithoutId().catch(console.error);

