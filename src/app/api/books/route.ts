import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, chapters } from '@/lib/schema';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allBooks = await db.select().from(books).orderBy(asc(books.bookNumber));
    
    // Get the first chapter's color theme for each book
    const booksWithColors = await Promise.all(
      allBooks.map(async (book) => {
        const firstChapter = await db
          .select({ colorTheme: chapters.colorTheme })
          .from(chapters)
          .where(eq(chapters.bookId, book.id))
          .orderBy(asc(chapters.chapterNumber))
          .limit(1);
        
        return {
          ...book,
          colorTheme: firstChapter[0]?.colorTheme || null
        };
      })
    );
    
    return NextResponse.json(booksWithColors);
  } catch (error) {
    console.error('Error fetching books:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
