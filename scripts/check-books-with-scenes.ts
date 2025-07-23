import 'dotenv/config';
import { db } from '../src/lib/db';
import { books, chapters, scenes } from '../src/lib/schema';
import { eq, count, inArray } from 'drizzle-orm';

async function checkBooksWithScenes() {
  try {
    console.log('🔍 Checking which books have scenes...\n');

    // First, get all books
    const allBooks = await db
      .select({
        id: books.id,
        bookNumber: books.bookNumber,
        title: books.title,
        fictionNovelTitle: books.fictionNovelTitle,
      })
      .from(books)
      .orderBy(books.bookNumber);

    console.log(`📚 Total books in database: ${allBooks.length}\n`);

    // Get books that have chapters with scenes
    const booksWithScenes = await db
      .select({
        bookId: books.id,
        bookNumber: books.bookNumber,
        title: books.title,
        fictionNovelTitle: books.fictionNovelTitle,
        sceneCount: count(scenes.id)
      })
      .from(books)
      .innerJoin(chapters, eq(chapters.bookId, books.id))
      .innerJoin(scenes, eq(scenes.chapterId, chapters.id))
      .groupBy(books.id, books.bookNumber, books.title, books.fictionNovelTitle)
      .orderBy(books.bookNumber);

    console.log('📋 Books with scenes:');
    console.log('==================');
    
    if (booksWithScenes.length === 0) {
      console.log('❌ No books have scenes yet.');
    } else {
      booksWithScenes.forEach(book => {
        console.log(`📖 Book ${book.bookNumber}: ${book.fictionNovelTitle || book.title}`);
        console.log(`   ID: ${book.bookId}`);
        console.log(`   Scene count: ${book.sceneCount}`);
        console.log('');
      });
    }

    // Get books without scenes
    const bookIdsWithScenes = booksWithScenes.map(book => book.bookId);
    const booksWithoutScenes = allBooks.filter(book => !bookIdsWithScenes.includes(book.id));

    console.log('\n📋 Books WITHOUT scenes:');
    console.log('========================');
    
    if (booksWithoutScenes.length === 0) {
      console.log('✅ All books have scenes!');
    } else {
      booksWithoutScenes.forEach(book => {
        console.log(`📖 Book ${book.bookNumber}: ${book.fictionNovelTitle || book.title}`);
        console.log(`   ID: ${book.id}`);
        console.log('');
      });
    }

    // Summary for testing
    console.log('\n🎯 TESTING SUMMARY:');
    console.log('==================');
    console.log(`Books suitable for testing scenes tab: ${booksWithScenes.length}`);
    
    if (booksWithScenes.length > 0) {
      console.log('\n🧪 To test the scenes functionality, use these book IDs:');
      booksWithScenes.forEach(book => {
        console.log(`- Book ${book.bookNumber}: ${book.bookId} (${book.sceneCount} scenes)`);
      });
      
      console.log('\n🌐 Test URLs:');
      booksWithScenes.forEach(book => {
        console.log(`- http://localhost:3000/books/${book.bookId}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking books with scenes:', error);
  } finally {
    process.exit(0);
  }
}

checkBooksWithScenes();