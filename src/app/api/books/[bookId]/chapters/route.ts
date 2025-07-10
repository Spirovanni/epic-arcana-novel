import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters, books } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { bookId: string } }) {
  try {
    const { bookId } = await params;
    
    // Get book information first
    const book = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
    if (book.length === 0) {
      return new NextResponse('Book Not Found', { status: 404 });
    }
    
    // Get chapters for the book with color information
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

    if (bookChapters.length === 0) {
      return new NextResponse('No Chapters Found', { status: 404 });
    }

    // Format chapters with color theme and group by chapter number
    const formattedChapters = bookChapters.map(chapter => ({
      ...chapter,
      colorTheme: {
        name: chapter.colorName,
        hex: chapter.hexCode,
        rgb: [chapter.red, chapter.green, chapter.blue]
      }
    }));

    // Group chapters by chapter number and take the first one of each
    const chaptersByNumber = new Map();
    formattedChapters.forEach(chapter => {
      if (!chaptersByNumber.has(chapter.chapterNumber)) {
        chaptersByNumber.set(chapter.chapterNumber, chapter);
      }
    });

    const uniqueChapters = Array.from(chaptersByNumber.values()).sort((a, b) => a.chapterNumber - b.chapterNumber);

    // Return both book info and chapters
    return NextResponse.json({
      book: book[0],
      chapters: uniqueChapters
    });
  } catch (error) {
    console.error(`Error fetching chapters for book ${params.bookId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
