import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { books } from '../src/lib/schema';
import { asc } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/epic_arcana';
const sql = postgres(connectionString);
const db = drizzle(sql);

async function checkBookIds() {
  try {
    console.log('🔍 Checking book IDs and titles...');
    
    const booksData = await db
      .select({
        id: books.id,
        bookNumber: books.bookNumber,
        title: books.title,
        fictionNovelTitle: books.fictionNovelTitle
      })
      .from(books)
      .orderBy(asc(books.bookNumber));
    
    console.log('Books in database:');
    booksData.forEach(book => {
      console.log(`Book ${book.bookNumber}: ${book.fictionNovelTitle || book.title}`);
      console.log(`  ID: ${book.id}`);
      console.log(`  URL should be: /books/${book.id}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking book IDs:', error);
  } finally {
    await sql.end();
  }
}

checkBookIds();