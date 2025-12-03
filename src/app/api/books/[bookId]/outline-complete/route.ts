import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters, scenes, books, learningResources, learningResourceChapters, connectionPoints, terminalLearningObjectives } from '@/lib/schema';
import { eq, asc, and } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ bookId: string }> }) {
  try {
    const { bookId } = await params;
    
    // Determine if bookId is a number or UUID and query accordingly
    let book;
    if (/^\d+$/.test(bookId)) {
      // If bookId is a number, query by bookNumber
      book = await db.select().from(books).where(eq(books.bookNumber, parseInt(bookId))).limit(1);
    } else {
      // If bookId is a UUID, query by id
      book = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
    }
    if (book.length === 0) {
      return new NextResponse('Book Not Found', { status: 404 });
    }
    
    // Get all chapters for the book using the actual book UUID
    const actualBookId = book[0].id;
    const bookChapters = await db.select({
      id: chapters.id,
      title: chapters.title,
      chapterNumber: chapters.chapterNumber,
      description: chapters.description,
      specificTaskGroupDescription: chapters.specificTaskGroupDescription,
      specificTaskGroupTagline: chapters.specificTaskGroupTagline,
      summary: chapters.summary,
      focus: chapters.focus,
      focusArea: chapters.focusArea,
      epicNovelPages: chapters.epicNovelPages,
      epicChapterFocus: chapters.epicChapterFocus,
      epicNovelChapterFocus: chapters.epicNovelChapterFocus,
      epicNovelSectionName: chapters.epicNovelSectionName,
      epicPreliminarySceneFocus: chapters.epicPreliminarySceneFocus,
      epicPreliminarySceneDescription: chapters.epicPreliminarySceneDescription,
      colorName: chapters.colorName,
      hexCode: chapters.hexCode,
      red: chapters.red,
      green: chapters.green,
      blue: chapters.blue,
      type: chapters.type,
      newTarotFamily: chapters.newTarotFamily,
      tarotFamily: chapters.tarotFamily,
      tarotCardLink: chapters.tarotCardLink,
      tarotCardItem: chapters.tarotCardItem,
      connectionToMajorTaskGroup: chapters.connectionToMajorTaskGroup,
      specificTaskGroupBooksInfluencedBy: chapters.specificTaskGroupBooksInfluencedBy,
      pov: chapters.pov,
      tense: chapters.tense,
      coreEmotion: chapters.coreEmotion,
      sceneTone: chapters.sceneTone,
      // Story structure fields
      sceneNumber: chapters.sceneNumber,
      heroJourneyBeat: chapters.heroJourneyBeat,
      heroJourneyBeatObjective: chapters.heroJourneyBeatObjective,
      plotBeat: chapters.plotBeat,
      saveTheCatBeat: chapters.saveTheCatBeat,
      saveTheCatBeatGoal: chapters.saveTheCatBeatGoal,
      // JSON metadata fields
      characterArcs: chapters.characterArcs,
      storyGapsAddressed: chapters.storyGapsAddressed,
      locationDetails: chapters.locationDetails,
      seriesConnections: chapters.seriesConnections,
      // Relationship identifiers
      taskMasterKey: chapters.taskMasterKey,
      majorTaskGroupKey: chapters.majorTaskGroupKey,
      specificTaskGroupKey: chapters.specificTaskGroupKey,
      terminalLearningObjectives: chapters.terminalLearningObjectives
    }).from(chapters).where(eq(chapters.bookId, actualBookId)).orderBy(asc(chapters.chapterNumber));

    // Get all scenes for all chapters
    if (bookChapters.length === 0) {
      return NextResponse.json({
        book: book[0],
        chapters: [],
        totalScenes: 0
      });
    }

    const chapterIds = bookChapters.map(c => c.id);

    // Get learning resources for all chapters
    const learningResourcesByChapter = new Map<string, any[]>();
    for (const chapterId of chapterIds) {
      // Get all learning resources linked to this chapter
      const linkedResources = await db
        .select({
          id: learningResources.id,
          resourceId: learningResources.resourceId,
          title: learningResources.title,
          author: learningResources.author,
        })
        .from(learningResourceChapters)
        .innerJoin(learningResources, eq(learningResourceChapters.learningResourceId, learningResources.id))
        .where(eq(learningResourceChapters.chapterId, chapterId));

      // For each learning resource, fetch its connection points and objectives
      const resourcesWithData = await Promise.all(
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

          return {
            ...resource,
            connectionPoints: points,
            objectives,
          };
        })
      );

      learningResourcesByChapter.set(chapterId, resourcesWithData);
    }

    // Get scenes for all chapters
    const scenesByChapter = new Map();
    for (const chapterId of chapterIds) {
      const chapterScenes = await db.select({
        id: scenes.id,
        chapterId: scenes.chapterId,
        sceneNumber: scenes.sceneNumber,
        title: scenes.title,
        focus: scenes.focus,
        preliminarySceneFocus: scenes.preliminarySceneFocus,
        preliminarySceneDescription: scenes.preliminarySceneDescription,
        description: scenes.description,
        setup: scenes.setup,
        sensoryDetail: scenes.sensoryDetail,
        internalConflict: scenes.internalConflict,
        beatGoal: scenes.beatGoal,
        tarotSymbolism: scenes.tarotSymbolism,
        heroJourneyStage: scenes.heroJourneyStage,
        pages: scenes.pages,
        symbolism: scenes.symbolism,
        primaryTarotCard: scenes.primaryTarotCard,
        secondaryTarotCards: scenes.secondaryTarotCards,
        tarotCardId: scenes.tarotCardId,
        tarotNarrativeRole: scenes.tarotNarrativeRole,
        franciscoTarotConnection: scenes.franciscoTarotConnection,
        laSignoraTarotConnection: scenes.laSignoraTarotConnection,
        dagonTarotConnection: scenes.dagonTarotConnection,
        temporalPowerManifested: scenes.temporalPowerManifested,
        characterGrowthElement: scenes.characterGrowthElement,
        sceneCardProgression: scenes.sceneCardProgression,
        cardReversalSignificance: scenes.cardReversalSignificance,
        historicalDate: scenes.historicalDate,
        storyTimelineDate: scenes.storyTimelineDate,
        historicalEventIds: scenes.historicalEventIds,
        temporalDivergencePoint: scenes.temporalDivergencePoint,
        realWorldContext: scenes.realWorldContext,
        alternateTimelineVariant: scenes.alternateTimelineVariant,
        chronologicalSequence: scenes.chronologicalSequence,
        storySequence: scenes.storySequence,
        timelineSignificance: scenes.timelineSignificance,
        timeline_date: scenes.timeline_date,
        timeline_variant: scenes.timeline_variant,
        location: scenes.location,
        pov: scenes.pov,
        tense: scenes.tense,
        core_emotion: scenes.core_emotion,
        scene_tone: scenes.scene_tone
      }).from(scenes).where(eq(scenes.chapterId, chapterId)).orderBy(asc(scenes.sceneNumber));
      
      scenesByChapter.set(chapterId, chapterScenes);
    }

    // Combine chapters with their scenes and learning resources
    const chaptersWithScenes = bookChapters.map(chapter => ({
      ...chapter,
      description: chapter.specificTaskGroupDescription || chapter.description,
      tagline: chapter.specificTaskGroupTagline,
      colorTheme: {
        name: chapter.colorName || 'Orange',
        hex: chapter.hexCode || '#FFA500',
        rgb: {
          red: chapter.red || 255,
          green: chapter.green || 165,
          blue: chapter.blue || 0
        }
      },
      scenes: scenesByChapter.get(chapter.id) || [],
      learningResources: learningResourcesByChapter.get(chapter.id) || [],
      // Ensure terminalLearningObjectives is properly passed through
      terminalLearningObjectives: chapter.terminalLearningObjectives
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
