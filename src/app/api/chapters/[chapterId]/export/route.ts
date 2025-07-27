import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters, books, chapterPages } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    
    // Get chapter with book information
    const chapterData = await db
      .select({
        chapter: chapters,
        book: books
      })
      .from(chapters)
      .leftJoin(books, eq(chapters.bookId, books.id))
      .where(eq(chapters.id, chapterId))
      .limit(1);
    
    if (chapterData.length === 0) {
      return new NextResponse('Chapter Not Found', { status: 404 });
    }

    const { chapter, book } = chapterData[0];
    
    if (!book) {
      return new NextResponse('Book Not Found', { status: 404 });
    }

    // Get all pages for the chapter, ordered by page number
    const pages = await db
      .select()
      .from(chapterPages)
      .where(eq(chapterPages.chapterId, chapterId))
      .orderBy(asc(chapterPages.pageNumber));

    // Ensure we have exactly 15 pages and they're in order
    const orderedPages = Array.from({ length: 15 }, (_, index) => {
      const pageNumber = index + 1;
      const existingPage = pages.find(p => p.pageNumber === pageNumber);
      return existingPage || {
        id: `placeholder-${pageNumber}`,
        pageNumber,
        content: '',
        chapterId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    // Strip HTML tags and format the content for plain text export
    const stripHtml = (html: string): string => {
      return html
        .replace(/<h[1-6][^>]*>/gi, '\n\n')
        .replace(/<\/h[1-6]>/gi, '\n')
        .replace(/<p[^>]*>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<blockquote[^>]*>/gi, '\n"')
        .replace(/<\/blockquote>/gi, '"\n')
        .replace(/<strong[^>]*>|<\/strong>/gi, '**')
        .replace(/<em[^>]*>|<\/em>/gi, '*')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
    };

    // Format the complete chapter content
    let formattedContent = `${book.title}\n`;
    formattedContent += `Chapter ${chapter.chapterNumber}: ${chapter.title}\n`;
    formattedContent += `${'='.repeat(50)}\n\n`;
    
    if (chapter.description) {
      formattedContent += `${chapter.description}\n\n`;
    }

    // Add all pages with their content
    orderedPages.forEach((page) => {
      if (page.content && page.content.trim()) {
        formattedContent += `Page ${page.pageNumber}\n`;
        formattedContent += `${'-'.repeat(20)}\n`;
        formattedContent += `${stripHtml(page.content)}\n\n`;
      }
    });

    return NextResponse.json({
      chapter: {
        id: chapter.id,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        description: chapter.description
      },
      book: {
        title: book.title,
        bookNumber: book.bookNumber
      },
      pages: orderedPages.map(page => ({
        pageNumber: page.pageNumber,
        content: page.content || '',
        plainText: stripHtml(page.content || '')
      })),
      formattedContent,
      stats: {
        totalPages: orderedPages.length,
        pagesWithContent: orderedPages.filter(p => p.content && p.content.trim()).length,
        totalWords: orderedPages.reduce((count, page) => {
          const plainText = stripHtml(page.content || '');
          return count + plainText.split(/\s+/).filter(word => word.length > 0).length;
        }, 0)
      }
    });
  } catch (error) {
    console.error('Error exporting chapter:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}