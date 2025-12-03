import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters, books, chapterPages, majorTaskGroups, taskMasters, characterArcs, characters, scenes, learningResources, learningResourceChapters, connectionPoints, terminalLearningObjectives } from '@/lib/schema';
import { eq, asc, and } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    
    // Log the chapter ID being requested for debugging
    console.log(`API: Fetching chapter with ID: ${chapterId}`);
    
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
      console.error(`API: No chapter found with ID: ${chapterId}`);
      return new NextResponse('Chapter Not Found', { status: 404 });
    }

    const { chapter, book } = chapterData[0];
    
    if (!book) {
      return new NextResponse('Book Not Found', { status: 404 });
    }

    // Get all chapters for the book to find next/previous
    const allBookChapters = await db
      .select({
        id: chapters.id,
        chapterNumber: chapters.chapterNumber,
      })
      .from(chapters)
      .where(eq(chapters.bookId, book.id))
      .orderBy(asc(chapters.chapterNumber));

    const currentIndex = allBookChapters.findIndex(c => c.id === chapterId);
    const previousChapterId = currentIndex > 0 ? allBookChapters[currentIndex - 1].id : null;
    const nextChapterId = currentIndex < allBookChapters.length - 1 ? allBookChapters[currentIndex + 1].id : null;
    
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

    // Get scenes for the chapter
    const chapterScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapterId))
      .orderBy(asc(scenes.sceneNumber));

    // Get learning resources for this chapter
    const linkedResources = await db
      .select({
        id: learningResources.id,
        resourceId: learningResources.resourceId,
        title: learningResources.title,
        author: learningResources.author,
        specificTaskGroupTitle: learningResources.specificTaskGroupTitle,
        focusArea: learningResources.focusArea,
        tagline: learningResources.tagline,
      })
      .from(learningResourceChapters)
      .innerJoin(learningResources, eq(learningResourceChapters.learningResourceId, learningResources.id))
      .where(eq(learningResourceChapters.chapterId, chapterId));

    // For each learning resource, fetch its connection points and objectives
    const learningResourcesWithData = await Promise.all(
      linkedResources.map(async (resource) => {
        const points = await db
          .select({
            pointNumber: connectionPoints.pointNumber,
            description: connectionPoints.description,
          })
          .from(connectionPoints)
          .where(
            and(
              eq(connectionPoints.learningResourceId, resource.id),
              eq(connectionPoints.chapterId, chapterId)
            )
          )
          .orderBy(asc(connectionPoints.pointNumber));

        const objectives = await db
          .select({
            objectiveNumber: terminalLearningObjectives.objectiveNumber,
            description: terminalLearningObjectives.description,
            bloomLevel: terminalLearningObjectives.bloomLevel,
          })
          .from(terminalLearningObjectives)
          .where(
            and(
              eq(terminalLearningObjectives.learningResourceId, resource.id),
              eq(terminalLearningObjectives.chapterId, chapterId)
            )
          )
          .orderBy(asc(terminalLearningObjectives.objectiveNumber));

        console.log(`[API] Resource: ${resource.title} | Points: ${points.length} | Objectives: ${objectives.length}`);

        return {
          ...resource,
          connectionPoints: points,
          objectives,
        };
      })
    );

    // Calculate word count from pages
    const totalWordCount = pages.reduce((count, page) => {
      return count + (page.content?.split(/\s+/).filter(word => word.length > 0).length || 0);
    }, 0);

    // Get all character arcs and filter them client-side for now
    // Wrapped in try-catch to handle schema mismatches gracefully
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let characterArcsData: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chapterCharacterGuidance: any[] = [];
    
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
            
            const stages = arc.stages as Record<string, { book_pages?: { book: number; chapter: number }[] }>;
            let relevantStage = null;
            let relevantBookPage = null;

            // Find the stage and book page that matches this chapter
            for (const [stageKey, stageData] of Object.entries(stages || {})) {
              if (stageData && typeof stageData === 'object' && 'book_pages' in stageData) {
                const bookPages = stageData.book_pages;
                if (Array.isArray(bookPages)) {
                  const matchingPage = bookPages.find((page: { book: number; chapter: number }) => 
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
    }

    // Format the response with all available chapter data
    const responseData = {
      chapter: {
        id: chapter.id,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        description: chapter.specificTaskGroupDescription || chapter.description,
        focus: chapter.focus,
        focusArea: chapter.focusArea,
        tagline: chapter.specificTaskGroupTagline || 'No tagline set',
        epicNovelPages: chapter.epicNovelPages,
        epicChapterFocus: chapter.epicChapterFocus,
        epicNovelChapterFocus: chapter.epicNovelChapterFocus,
        epicNovelSectionName: chapter.epicNovelSectionName,
        tarotCardLink: chapter.tarotCardLink,
        tarotFamily: chapter.tarotFamily,
        tarotCardItem: chapter.tarotCardItem,
        connectionToMajorTaskGroup: chapter.connectionToMajorTaskGroup || 'No connection specified',
        terminalLearningObjectives: chapter.terminalLearningObjectives,
        booksInfluencedBy: chapter.specificTaskGroupBooksInfluencedBy,
        summary: chapter.summary,
        colorTheme: {
          name: chapter.colorName || 'Orange',
          hex: chapter.hexCode || '#FFA500',  
          rgb: [chapter.red || 255, chapter.green || 165, chapter.blue || 0]
        },
        iconPath: chapter.iconPath,
        previousChapterId,
        nextChapterId,
      },
      book,
      majorTaskGroup: majorTaskGroupData?.majorTaskGroup || null,
      taskMaster: majorTaskGroupData?.taskMaster || null,
      scenes: chapterScenes,
      learningResources: learningResourcesWithData,
      taskGroups: {
        major: [],
        specific: [],
        all: []
      },
      pages,
      characterGuidance: chapterCharacterGuidance,
      stats: {
        sceneCount: chapterScenes.length,
        taskGroupCount: 0,
        majorTaskGroupCount: majorTaskGroupData ? 1 : 0,
        specificTaskGroupCount: 0,
        pageCount: pages.length,
        wordCount: totalWordCount,
        characterArcsCount: chapterCharacterGuidance.length
      }
    };
    
    
    return NextResponse.json(responseData);
  } catch (error) {
    const { chapterId: errorChapterId } = await params;
    console.error(`Error fetching chapter ${errorChapterId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    const body = await request.json();

    // Map frontend field names to database column names for chapters
    const updateData: Partial<typeof chapters.$inferInsert> = {};
    
    const chapterFieldMappings: { [key: string]: keyof typeof chapters.$inferInsert } = {
      'title': 'title',
      'description': 'description',
      'focus': 'focus',
      'focusArea': 'focusArea',
      'pov': 'pov',
      'tense': 'tense',
      'coreEmotion': 'coreEmotion',
      'sceneTone': 'sceneTone',
      'epicNovelPages': 'epicNovelPages',
      'epicChapterFocus': 'epicChapterFocus',
      'epicNovelChapterFocus': 'epicNovelChapterFocus',
      'epicNovelSectionName': 'epicNovelSectionName',
      'tarotCardLink': 'tarotCardLink',
      'tarotFamily': 'tarotFamily',
      'tarotCardItem': 'tarotCardItem',
      'connectionToMajorTaskGroup': 'connectionToMajorTaskGroup',
      'terminalLearningObjectives': 'terminalLearningObjectives',
      'specificTaskGroupTagline': 'specificTaskGroupTagline',
      'specificTaskGroupDescription': 'specificTaskGroupDescription',
      'specificTaskGroupBooksInfluencedBy': 'specificTaskGroupBooksInfluencedBy',
      'summary': 'summary',
      'colorName': 'colorName',
      'hexCode': 'hexCode',
      'red': 'red',
      'green': 'green',
      'blue': 'blue',
      // New fields for story structure
      'sceneNumber': 'sceneNumber',
      'heroJourneyBeat': 'heroJourneyBeat',
      'heroJourneyBeatObjective': 'heroJourneyBeatObjective',
      'plotBeat': 'plotBeat',
      'saveTheCatBeat': 'saveTheCatBeat',
      'saveTheCatBeatGoal': 'saveTheCatBeatGoal',
      'characterArcs': 'characterArcs',
      'storyGapsAddressed': 'storyGapsAddressed',
      'locationDetails': 'locationDetails',
      'seriesConnections': 'seriesConnections',
      'taskMasterKey': 'taskMasterKey',
      'majorTaskGroupKey': 'majorTaskGroupKey',
      'specificTaskGroupKey': 'specificTaskGroupKey',
      'epicPreliminarySceneFocus': 'epicPreliminarySceneFocus',
      'epicPreliminarySceneDescription': 'epicPreliminarySceneDescription',
      'newTarotFamily': 'newTarotFamily'
    };

    // Only include fields that are defined in the schema
    for (const [frontendField, dbField] of Object.entries(chapterFieldMappings)) {
      if (body[frontendField] !== undefined) {
        updateData[dbField] = body[frontendField];
      }
    }

    const updatedChapter = await db
      .update(chapters)
      .set(updateData)
      .where(eq(chapters.id, chapterId))
      .returning();

    if (updatedChapter.length === 0) {
      return new NextResponse('Chapter Not Found', { status: 404 });
    }

    return NextResponse.json(updatedChapter[0]);
  } catch (error) {
    const { chapterId: errorChapterId } = await params;
    console.error(`Error updating chapter ${errorChapterId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}