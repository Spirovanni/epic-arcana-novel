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
      iconPath: chapters.iconPath,
      colorName: chapters.colorName,
      hexCode: chapters.hexCode,
      red: chapters.red,
      green: chapters.green,
      blue: chapters.blue
    }).from(chapters).where(eq(chapters.bookId, bookId)).orderBy(asc(chapters.chapterNumber));

    if (bookChapters.length === 0) {
      return new NextResponse('No Chapters Found', { status: 404 });
    }

    // Format chapters with color theme and group by chapter number
    // Filter out chapters with invalid/missing IDs
    const formattedChapters = bookChapters
      .filter(chapter => chapter.id && chapter.id.trim() !== '')
      .map(chapter => ({
        ...chapter,
        // Use the colorTheme from database or provide fallback
        colorTheme: {
          name: chapter.colorName || 'Orange',
          hex: chapter.hexCode || '#FFA500',
          rgb: { 
            red: chapter.red, 
            green: chapter.green, 
            blue: chapter.blue 
          }
        },
      }));

    // Use deduplication logic for all books
    const chaptersByNumber = new Map();
    formattedChapters.forEach(chapter => {
      const existing = chaptersByNumber.get(chapter.chapterNumber);
      if (!existing) {
        chaptersByNumber.set(chapter.chapterNumber, chapter);
      } else {
        // Prefer entries with shorter titles (likely to be proper chapter titles vs descriptions)
        if (chapter.title && chapter.title.length < existing.title.length) {
          chaptersByNumber.set(chapter.chapterNumber, chapter);
        }
      }
    });
    const uniqueChapters = Array.from(chaptersByNumber.values()).sort((a, b) => a.chapterNumber - b.chapterNumber);

    // Add book theme color based on book number
    const getBookTheme = (bookNumber: number) => {
      switch (bookNumber) {
        case 1:
          return { color: '#FFA500', name: 'Orange' };
        case 2:
          return { color: '#E34234', name: 'Vermillion' };
        case 3:
          return { color: '#FF00FF', name: 'Magenta' };
        case 4:
          return { color: '#800080', name: 'Purple' };
        case 5:
          return { color: '#7F00FF', name: 'Violet' };
        case 6:
          return { color: '#008080', name: 'Teal' };
        case 7:
          return { color: '#008000', name: 'Green' };
        case 8:
          return { color: '#7FFF00', name: 'Chartreuse' };
        case 9:
          return { color: '#FFBF00', name: 'Amber' };
        default:
          return { color: '#6366f1', name: 'Indigo' };
      }
    };

    const bookTheme = getBookTheme(book[0].bookNumber);
    const bookWithTheme = {
      ...book[0],
      primaryColor: bookTheme.color,
      primaryColorName: bookTheme.name
    };

    // Return both book info and chapters
    return NextResponse.json({
      book: bookWithTheme,
      chapters: uniqueChapters
    });
  } catch (error) {
    console.error(`Error fetching chapters for book ${params.bookId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
