import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scenes } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;

    console.log(`[SCENES API] Fetching scenes for chapter ID: ${chapterId}`);

    const chapterScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapterId))
      .orderBy(scenes.sceneNumber);

    console.log(`[SCENES API] Found ${chapterScenes.length} scenes for chapter ${chapterId}`);
    if (chapterScenes.length > 0) {
      console.log(`[SCENES API] Scene titles:`, chapterScenes.map(s => `#${s.sceneNumber}: ${s.title}`));
    }

    return NextResponse.json({ scenes: chapterScenes });
  } catch (error) {
    console.error('Error fetching scenes:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    const data = await request.json();

    // Get the next scene number for this chapter
    const lastScene = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapterId))
      .orderBy(desc(scenes.sceneNumber))
      .limit(1);

    const nextSceneNumber = lastScene.length > 0 ? lastScene[0].sceneNumber + 1 : 1;

    const newScene = await db
      .insert(scenes)
      .values({
        chapterId,
        sceneNumber: nextSceneNumber,
        title: data.title || `Scene ${nextSceneNumber}`,
        focus: data.focus,
        description: data.description,
        setup: data.setup,
        sensoryDetail: data.sensoryDetail,
        internalConflict: data.internalConflict,
        beatGoal: data.beatGoal,
        preliminarySceneFocus: data.preliminarySceneFocus,
        preliminarySceneDescription: data.preliminarySceneDescription,
        pages: data.pages,
        symbolism: data.symbolism,
        temporalPowerManifested: data.temporalPowerManifested,
        characterGrowthElement: data.characterGrowthElement,
        sceneCardProgression: data.sceneCardProgression,
        realWorldContext: data.realWorldContext,
        chronologicalSequence: data.chronologicalSequence,
        storySequence: data.storySequence,
        timelineSignificance: data.timelineSignificance,
        timeline_date: data.timeline_date,
        timeline_variant: data.timeline_variant,
        location: data.location,
        pov: data.pov,
        tense: data.tense,
        core_emotion: data.core_emotion,
        scene_tone: data.scene_tone,
      })
      .returning();

    return NextResponse.json(newScene[0]);
  } catch (error) {
    console.error('Error creating scene:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}