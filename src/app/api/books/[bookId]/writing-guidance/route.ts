import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapterWritingGuidance, chapters, books } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ bookId: string }> }) {
  try {
    const { bookId } = await params;

    // Get book information
    const book = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
    if (book.length === 0) {
      return new NextResponse('Book Not Found', { status: 404 });
    }

    // Get all writing guidance for the book with chapter details
    const guidanceData = await db
      .select({
        guidance: chapterWritingGuidance,
        chapter: {
          id: chapters.id,
          title: chapters.title,
          chapterNumber: chapters.chapterNumber,
          description: chapters.description,
          iconPath: chapters.iconPath,
          colorName: chapters.colorName,
          hexCode: chapters.hexCode,
        }
      })
      .from(chapterWritingGuidance)
      .leftJoin(chapters, eq(chapterWritingGuidance.chapterId, chapters.id))
      .where(eq(chapterWritingGuidance.bookId, bookId))
      .orderBy(asc(chapterWritingGuidance.chapterNumber));

    // Transform the data into a more usable format
    const formattedGuidance = guidanceData.map(({ guidance, chapter }) => ({
      id: guidance.id,
      chapterId: guidance.chapterId,
      chapterNumber: guidance.chapterNumber,
      title: guidance.title,
      chapter: chapter ? {
        id: chapter.id,
        title: chapter.title,
        description: chapter.description,
        iconPath: chapter.iconPath,
        colorTheme: {
          name: chapter.colorName,
          hex: chapter.hexCode
        }
      } : null,
      writingDetails: {
        povType: guidance.povType,
        povCharacter: guidance.povCharacter,
        tense: guidance.tense,
        whyThisPovAndTense: guidance.whyThisPovAndTense,
        summary: guidance.summary,
        keyPlotDevelopments: guidance.keyPlotDevelopments as string[] || [],
        narrativeFunction: guidance.narrativeFunction as string[] || [],
        toneAndVisualPrompts: guidance.toneAndVisualPrompts as string[] || [],
        tipsForWriting: guidance.tipsForWriting as string[] || [],
        fullText: guidance.fullText
      },
      writingProgress: {
        isStarted: false, // This would come from actual writing data
        wordCount: 0, // This would come from actual writing data
        completionRate: 0, // This would come from actual writing data
        lastUpdated: guidance.updatedAt
      }
    }));

    // Calculate overall book writing statistics
    const stats = {
      totalChapters: formattedGuidance.length,
      chaptersStarted: 0, // Would be calculated from actual writing data
      chaptersCompleted: 0, // Would be calculated from actual writing data
      totalWords: 0, // Would be calculated from actual writing data
      averageChapterLength: 0, // Would be calculated from actual writing data
      estimatedCompletionTime: formattedGuidance.length * 2 // Rough estimate in hours
    };

    return NextResponse.json({
      book: book[0],
      guidance: formattedGuidance,
      stats
    });

  } catch (error) {
    console.error(`Error fetching writing guidance for book ${params.bookId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 