import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scenes, chapters, books } from '@/lib/schema';
import { eq, gt, lt, and, asc, desc } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ sceneId: string }> }) {
  try {
    const { sceneId } = await params;

    const sceneData = await db
      .select({
        scene: scenes,
        chapter: chapters,
        book: books,
      })
      .from(scenes)
      .leftJoin(chapters, eq(scenes.chapterId, chapters.id))
      .leftJoin(books, eq(chapters.bookId, books.id))
      .where(eq(scenes.id, sceneId))
      .limit(1);

    if (sceneData.length === 0) {
      return new NextResponse('Scene Not Found', { status: 404 });
    }

    const { scene, chapter, book } = sceneData[0];

    // Get previous scene (within same chapter)
    const previousScene = await db
      .select({
        id: scenes.id,
        title: scenes.title,
        sceneNumber: scenes.sceneNumber
      })
      .from(scenes)
      .where(
        and(
          eq(scenes.chapterId, scene.chapterId),
          lt(scenes.sceneNumber, scene.sceneNumber)
        )
      )
      .orderBy(desc(scenes.sceneNumber))
      .limit(1);

    // Get next scene (within same chapter)
    const nextScene = await db
      .select({
        id: scenes.id,
        title: scenes.title,
        sceneNumber: scenes.sceneNumber
      })
      .from(scenes)
      .where(
        and(
          eq(scenes.chapterId, scene.chapterId),
          gt(scenes.sceneNumber, scene.sceneNumber)
        )
      )
      .orderBy(asc(scenes.sceneNumber))
      .limit(1);

    return NextResponse.json({
      scene,
      chapter,
      book,
      navigation: {
        previousScene: previousScene[0] || null,
        nextScene: nextScene[0] || null
      }
    });
  } catch (error) {
    const { sceneId: errorSceneId } = await params;
    console.error(`Error fetching scene ${errorSceneId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ sceneId: string }> }) {
  try {
    const { sceneId } = await params;
    const body = await request.json();

    // Convert camelCase to snake_case for database fields
    const updateData: Partial<typeof scenes.$inferInsert> = {};
    
    // Map frontend field names to database column names
    const fieldMappings: { [key: string]: keyof typeof scenes.$inferInsert } = {
      'title': 'title',
      'focus': 'focus', 
      'description': 'description',
      'setup': 'setup',
      'sensoryDetail': 'sensoryDetail',
      'internalConflict': 'internalConflict', 
      'beatGoal': 'beatGoal',
      'beat_goal': 'beatGoal',
      'symbolism': 'symbolism',
      'tarotSymbolism': 'tarotSymbolism',
      'heroJourneyStage': 'heroJourneyStage',
      'pages': 'pages',
      'primaryTarotCard': 'primaryTarotCard',
      'secondaryTarotCards': 'secondaryTarotCards',
      'preliminarySceneFocus': 'preliminarySceneFocus',
      'preliminarySceneDescription': 'preliminarySceneDescription',
      // Timeline and context fields
      'timeline_date': 'timeline_date',
      'timeline_variant': 'timeline_variant',
      'location': 'location',
      'pov': 'pov',
      'tense': 'tense',
      'core_emotion': 'core_emotion',
      'scene_tone': 'scene_tone',
      'chronologicalSequence': 'chronologicalSequence',
      'temporalDivergencePoint': 'temporalDivergencePoint',
      'realWorldContext': 'realWorldContext',
      'timelineSignificance': 'timelineSignificance'
    };

    // Only include fields that are defined in the schema
    for (const [frontendField, dbField] of Object.entries(fieldMappings)) {
      if (body[frontendField] !== undefined) {
        updateData[dbField] = body[frontendField];
      }
    }

    const updatedScene = await db
      .update(scenes)
      .set(updateData)
      .where(eq(scenes.id, sceneId))
      .returning();

    if (updatedScene.length === 0) {
      return new NextResponse('Scene Not Found', { status: 404 });
    }

    return NextResponse.json(updatedScene[0]);
  } catch (error) {
    const { sceneId: errorSceneId } = await params;
    console.error(`Error updating scene ${errorSceneId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ sceneId: string }> }) {
  try {
    const { sceneId } = await params;

    const deletedScene = await db
      .delete(scenes)
      .where(eq(scenes.id, sceneId))
      .returning();

    if (deletedScene.length === 0) {
      return new NextResponse('Scene Not Found', { status: 404 });
    }

    return NextResponse.json({ message: 'Scene deleted successfully' });
  } catch (error) {
    const { sceneId: errorSceneId } = await params;
    console.error(`Error deleting scene ${errorSceneId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
