import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters, books } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { bookId: string } }) {
  try {
    const bookId = params.bookId;
    
    // Get book information first
    const book = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
    if (book.length === 0) {
      return new NextResponse('Book Not Found', { status: 404 });
    }
    
    // Get chapters for the book
    const bookChapters = await db.select().from(chapters).where(eq(chapters.bookId, bookId)).orderBy(asc(chapters.chapterNumber));

    if (bookChapters.length === 0) {
      return new NextResponse('No Chapters Found', { status: 404 });
    }

    // Return both book info and chapters
    return NextResponse.json({
      book: book[0],
      chapters: bookChapters
    });
  } catch (error) {
    console.error(`Error fetching chapters for book ${params.bookId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
