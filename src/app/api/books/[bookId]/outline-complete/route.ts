import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters, scenes, books } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ bookId: string }> }) {
  try {
    const { bookId } = await params;
    
    // Get book information
    const book = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
    if (book.length === 0) {
      return new NextResponse('Book Not Found', { status: 404 });
    }
    
    // Get all chapters for the book
    const bookChapters = await db.select({
      id: chapters.id,
      title: chapters.title,
      chapterNumber: chapters.chapterNumber,
      description: chapters.description,
      summary: chapters.summary,
      focus: chapters.focus,
      focusArea: chapters.focusArea,
      colorName: chapters.colorName,
      hexCode: chapters.hexCode,
      red: chapters.red,
      green: chapters.green,
      blue: chapters.blue,
      tarotFamily: chapters.tarotFamily,
      tarotCardLink: chapters.tarotCardLink
    }).from(chapters).where(eq(chapters.bookId, bookId)).orderBy(asc(chapters.chapterNumber));

    // Get all scenes for all chapters
    if (bookChapters.length === 0) {
      return NextResponse.json({
        book: book[0],
        chapters: [],
        totalScenes: 0
      });
    }

    const chapterIds = bookChapters.map(c => c.id);
    
    // Get scenes for all chapters
    const scenesByChapter = new Map();
    for (const chapterId of chapterIds) {
      const chapterScenes = await db.select({
        id: scenes.id,
        chapterId: scenes.chapterId,
        sceneNumber: scenes.sceneNumber,
        title: scenes.title,
        description: scenes.description,
        setup: scenes.setup,
        beatGoal: scenes.beatGoal,
        tarotSymbolism: scenes.tarotSymbolism,
        timeline_date: scenes.timeline_date,
        timeline_variant: scenes.timeline_variant,
        location: scenes.location,
        pov: scenes.pov,
        core_emotion: scenes.core_emotion,
        scene_tone: scenes.scene_tone
      }).from(scenes).where(eq(scenes.chapterId, chapterId)).orderBy(asc(scenes.sceneNumber));
      
      scenesByChapter.set(chapterId, chapterScenes);
    }

    // Combine chapters with their scenes
    const chaptersWithScenes = bookChapters.map(chapter => ({
      ...chapter,
      colorTheme: {
        name: chapter.colorName || 'Orange',
        hex: chapter.hexCode || '#FFA500',
        rgb: { 
          red: chapter.red || 255, 
          green: chapter.green || 165, 
          blue: chapter.blue || 0 
        }
      },
      scenes: scenesByChapter.get(chapter.id) || []
    }));

    // Calculate statistics
    const totalScenes = Array.from(scenesByChapter.values()).reduce((sum, scenes) => sum + scenes.length, 0);
    const completedChapters = chaptersWithScenes.filter(c => c.title && c.summary && c.scenes.length > 0).length;
    const completedScenes = Array.from(scenesByChapter.values()).reduce((sum, scenes) => 
      sum + scenes.filter((s: { title: string | null; setup: string | null }) => s.title && s.setup).length, 0);

    // Get book theme based on book number
    const getBookTheme = (bookNumber: number) => {
      switch (bookNumber) {
        case 1:
          return { color: '#FFA500', name: 'Orange', description: 'Book of Beginning and Transformation' };
        case 2:
          return { color: '#E34234', name: 'Vermillion', description: 'Book of Power and Conflict' };
        case 3:
          return { color: '#FF00FF', name: 'Magenta', description: 'Book of Love and Understanding' };
        default:
          return { color: '#6366f1', name: 'Indigo', description: 'Book of Mystery' };
      }
    };

    const bookTheme = getBookTheme(book[0].bookNumber);

    return NextResponse.json({
      book: {
        ...book[0],
        theme: bookTheme
      },
      chapters: chaptersWithScenes,
      stats: {
        totalChapters: bookChapters.length,
        completedChapters,
        totalScenes,
        completedScenes,
        completionPercentage: Math.round((completedChapters / bookChapters.length) * 100)
      }
    });
  } catch (error) {
    const { bookId: errorBookId } = await params;
    console.error(`Error fetching complete outline for book ${errorBookId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}