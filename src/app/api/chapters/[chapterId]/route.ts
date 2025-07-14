import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters, books, chapterPages, majorTaskGroups, taskMasters, characterArcs, characters } from '@/lib/schema';
import { eq, asc, and, sql } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { chapterId: string } }) {
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
    
    // Get major task group information
    let majorTaskGroupData = null;
    if (chapter.majorTaskGroupId) {
      const majorTaskGroupResult = await db
        .select({
          majorTaskGroup: majorTaskGroups,
          taskMaster: taskMasters
        })
        .from(majorTaskGroups)
        .leftJoin(taskMasters, eq(majorTaskGroups.taskMasterId, taskMasters.id))
        .where(eq(majorTaskGroups.id, chapter.majorTaskGroupId))
        .limit(1);
      
      if (majorTaskGroupResult.length > 0) {
        majorTaskGroupData = majorTaskGroupResult[0];
      }
    }

    // Get chapter pages for writing
    const pages = await db
      .select()
      .from(chapterPages)
      .where(eq(chapterPages.chapterId, chapterId))
      .orderBy(asc(chapterPages.pageNumber));

    // Calculate word count from pages
    const totalWordCount = pages.reduce((count, page) => {
      return count + (page.content?.split(/\s+/).filter(word => word.length > 0).length || 0);
    }, 0);

    // Get all character arcs and filter them client-side for now
    // Wrapped in try-catch to handle schema mismatches gracefully
    let characterArcsData = [];
    let chapterCharacterGuidance = [];
    
    try {
      characterArcsData = await db
        .select({
          character: characters,
          arc: characterArcs
        })
        .from(characterArcs)
        .leftJoin(characters, eq(characterArcs.characterId, characters.id));

      // Process character arc data to extract relevant information for this chapter
      chapterCharacterGuidance = characterArcsData
        .map(({ character, arc }) => {
          try {
            if (!arc || !arc.stages) return null;
            
            const stages = arc.stages as any;
            let relevantStage = null;
            let relevantBookPage = null;

            // Find the stage and book page that matches this chapter
            for (const [stageKey, stageData] of Object.entries(stages || {})) {
              if (stageData && typeof stageData === 'object' && 'book_pages' in stageData) {
                const bookPages = (stageData as any).book_pages;
                if (Array.isArray(bookPages)) {
                  const matchingPage = bookPages.find((page: any) => 
                    page.book === book?.bookNumber && page.chapter === chapter.chapterNumber
                  );
                  if (matchingPage) {
                    relevantStage = stageKey;
                    relevantBookPage = matchingPage;
                    break;
                  }
                }
              }
            }

            // Only return if we found relevant development for this chapter
            if (!relevantBookPage) return null;

            return {
              character: {
                id: character?.id,
                name: character?.name,
                description: character?.description
              },
              arc: {
                id: arc.id,
                arcType: arc.arcType,
                triumphTheme: arc.triumphTheme,
                stage: relevantStage,
                development: relevantBookPage
              }
            };
          } catch (error) {
            console.error('Error processing character arc:', error);
            return null;
          }
        })
        .filter(item => item !== null); // Remove null entries
    } catch (error) {
      console.error('Error fetching character arcs (schema mismatch - continuing without character guidance):', error);
      // Continue without character guidance rather than failing the entire API call
      characterArcsData = [];
      chapterCharacterGuidance = [];
    }

    // Format the response with all available chapter data
    return NextResponse.json({
      chapter: {
        id: chapter.id,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        description: chapter.specificTaskGroupDescription || chapter.description,
        focus: chapter.focus,
        focusArea: chapter.focusArea,
        tagline: chapter.specificTaskGroupTagline,
        epicNovelPages: chapter.epicNovelPages,
        epicChapterFocus: chapter.epicChapterFocus,
        epicNovelChapterFocus: chapter.epicNovelChapterFocus,
        epicNovelSectionName: chapter.epicNovelSectionName,
        tarotCardLink: chapter.tarotCardLink,
        tarotFamily: chapter.tarotFamily,
        tarotCardItem: chapter.tarotCardItem,
        connectionToMajorTaskGroup: chapter.connectionToMajorTaskGroup,
        terminalLearningObjectives: chapter.terminalLearningObjectives,
        booksInfluencedBy: chapter.specificTaskGroupBooksInfluencedBy,
        colorTheme: {
          name: chapter.colorName,
          hex: chapter.hexCode,
          rgb: [chapter.red, chapter.green, chapter.blue]
        },
        iconPath: chapter.iconPath
      },
      book,
      majorTaskGroup: majorTaskGroupData?.majorTaskGroup || null,
      taskMaster: majorTaskGroupData?.taskMaster || null,
      scenes: [], // Empty for now, but keeping for compatibility
      taskGroups: {
        major: [],
        specific: [],
        all: []
      },
      pages,
      characterGuidance: chapterCharacterGuidance,
      stats: {
        sceneCount: 0,
        taskGroupCount: 0,
        majorTaskGroupCount: majorTaskGroupData ? 1 : 0,
        specificTaskGroupCount: 0,
        pageCount: pages.length,
        wordCount: totalWordCount,
        characterArcsCount: chapterCharacterGuidance.length
      }
    });
  } catch (error) {
    console.error(`Error fetching chapter ${params.chapterId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}