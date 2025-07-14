import { db } from './src/lib/db';
import { chapters, books } from './src/lib/schema';

async function debugChapters() {
  console.log('=== DEBUG: Checking chapters in database ===');
  
  try {
    // Check all chapters
    const allChapters = await db.select({
      id: chapters.id,
      chapterNumber: chapters.chapterNumber,
      title: chapters.title,
      bookId: chapters.bookId
    }).from(chapters);
    
    console.log('Total chapters found:', allChapters.length);
    console.log('Chapters:', allChapters);
    
    // Check all books
    const allBooks = await db.select({
      id: books.id,
      title: books.title,
      bookNumber: books.bookNumber
    }).from(books);
    
    console.log('\nTotal books found:', allBooks.length);
    console.log('Books:', allBooks);
    
    // Check chapters with book details
    const chaptersWithBooks = await db.select({
      chapterId: chapters.id,
      chapterNumber: chapters.chapterNumber,
      chapterTitle: chapters.title,
      bookId: books.id,
      bookTitle: books.title,
      bookNumber: books.bookNumber
    })
    .from(chapters)
    .leftJoin(books, (table) => table.eq(chapters.bookId, books.id));
    
    console.log('\nChapters with book details:');
    chaptersWithBooks.forEach(chapter => {
      console.log(`Chapter ${chapter.chapterNumber}: ${chapter.chapterTitle} (ID: ${chapter.chapterId}) - Book: ${chapter.bookTitle} (ID: ${chapter.bookId})`);
    });
    
  } catch (error) {
    console.error('Error querying database:', error);
  }
}

debugChapters().then(() => {
  console.log('Debug complete');
  process.exit(0);
}).catch(err => {
  console.error('Debug failed:', err);
  process.exit(1);
});