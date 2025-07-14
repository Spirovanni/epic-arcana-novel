import { db } from './src/lib/db';
import { chapters, books } from './src/lib/schema';
import { eq, asc } from 'drizzle-orm';

async function testChapterAPI() {
  console.log('=== TESTING CHAPTER API LOGIC ===');
  
  // Test with a known chapter ID
  const testChapterId = '0bae977b-6bcb-4390-9a01-a01f62799dd9';
  
  try {
    console.log(`Testing chapter ID: ${testChapterId}`);
    
    // Get chapter with book information (same logic as API)
    const chapterData = await db
      .select({
        chapter: chapters,
        book: books
      })
      .from(chapters)
      .leftJoin(books, eq(chapters.bookId, books.id))
      .where(eq(chapters.id, testChapterId))
      .limit(1);
    
    console.log(`Query result length: ${chapterData.length}`);
    
    if (chapterData.length === 0) {
      console.log('❌ Chapter Not Found - This would return 404');
      return;
    }

    const { chapter, book } = chapterData[0];
    console.log('✅ Chapter found:');
    console.log(`  ID: ${chapter.id}`);
    console.log(`  Title: ${chapter.title}`);
    console.log(`  Chapter Number: ${chapter.chapterNumber}`);
    console.log(`  Book ID: ${chapter.bookId}`);
    console.log(`  Book Title: ${book?.title}`);
    
    // Test what the chapters API at /api/books/[bookId]/chapters would return
    console.log('\n=== TESTING BOOK CHAPTERS API ===');
    const bookId = chapter.bookId;
    
    const bookChapters = await db.select({
      id: chapters.id,
      title: chapters.title,
      chapterNumber: chapters.chapterNumber,
      description: chapters.specificTaskGroupDescription,
      colorName: chapters.colorName,
      hexCode: chapters.hexCode,
      red: chapters.red,
      green: chapters.green,
      blue: chapters.blue,
      iconPath: chapters.iconPath
    }).from(chapters).where(eq(chapters.bookId, bookId)).orderBy(asc(chapters.chapterNumber));

    console.log(`Found ${bookChapters.length} chapters for book ${bookId}`);
    console.log('Sample chapters:');
    bookChapters.slice(0, 5).forEach(ch => {
      console.log(`  Chapter ${ch.chapterNumber}: ${ch.title} (ID: ${ch.id})`);
    });
    
  } catch (error) {
    console.error('Error testing chapter API:', error);
  }
}

testChapterAPI().then(() => {
  console.log('Test complete');
  process.exit(0);
}).catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});