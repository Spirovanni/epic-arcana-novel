import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { books } from '../src/lib/schema';
import { asc } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/epic_arcana';
const sql = postgres(connectionString);
const db = drizzle(sql);

async function testNavbarLinks() {
  try {
    console.log('🔗 Testing navbar book links...');
    
    // Test API endpoint
    const response = await fetch('http://localhost:3000/api/books');
    if (!response.ok) {
      throw new Error(`API failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ API returned ${data.books.length} books`);
    
    // Test each book link
    for (const book of data.books) {
      console.log(`📖 Book ${book.bookNumber}: ${book.fictionNovelTitle}`);
      console.log(`   Link: /books/${book.id}`);
      console.log(`   ID: ${book.id}`);
      
      // Test if book detail page exists
      const bookResponse = await fetch(`http://localhost:3000/api/books/${book.id}`);
      if (bookResponse.ok) {
        console.log(`   ✅ Book detail API working`);
      } else {
        console.log(`   ⚠️  Book detail API failed: ${bookResponse.status}`);
      }
    }
    
    console.log('\n🎯 Navbar links should now correctly point to:');
    data.books.forEach((book: any) => {
      console.log(`  - ${book.fictionNovelTitle} → /books/${book.id}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing navbar links:', error);
  } finally {
    await sql.end();
  }
}

testNavbarLinks();