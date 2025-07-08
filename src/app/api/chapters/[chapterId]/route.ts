import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters, books, scenes, taskGroups } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { chapterId: string } }) {
  try {
    const chapterId = params.chapterId;
    
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
    
    // Get scenes for the chapter
    const chapterScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapterId))
      .orderBy(asc(scenes.sceneNumber));

    // Get task groups for the chapter
    const chapterTaskGroups = await db
      .select()
      .from(taskGroups)
      .where(eq(taskGroups.chapterId, chapterId))
      .orderBy(asc(taskGroups.title));

    // Group task groups by type
    const majorTaskGroups = chapterTaskGroups.filter(tg => tg.type === 'Major Task Group');
    const specificTaskGroups = chapterTaskGroups.filter(tg => tg.type === 'Specific Task Group');

    return NextResponse.json({
      chapter,
      book,
      scenes: chapterScenes,
      taskGroups: {
        major: majorTaskGroups,
        specific: specificTaskGroups,
        all: chapterTaskGroups
      },
      stats: {
        sceneCount: chapterScenes.length,
        taskGroupCount: chapterTaskGroups.length,
        majorTaskGroupCount: majorTaskGroups.length,
        specificTaskGroupCount: specificTaskGroups.length
      }
    });
  } catch (error) {
    console.error(`Error fetching chapter ${params.chapterId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}