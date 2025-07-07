import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { timelineEvents, scenes, chapters } from '../../../lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const db = drizzle(client);

    // Fetch timeline events
    const events = await db.select().from(timelineEvents).orderBy(timelineEvents.year);
    
    // Fetch scenes with their timeline data
    const scenesData = await db.select({
      id: scenes.id,
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      historicalDate: scenes.historicalDate,
      alternateTimelineVariant: scenes.alternateTimelineVariant,
      temporalDivergencePoint: scenes.temporalDivergencePoint,
      realWorldContext: scenes.realWorldContext,
      heroJourneyStage: scenes.heroJourneyStage,
      primaryTarotCard: scenes.primaryTarotCard,
      timelineSignificance: scenes.timelineSignificance,
      chronologicalSequence: scenes.chronologicalSequence
    }).from(scenes).orderBy(scenes.sceneNumber);

    await client.end();

    return NextResponse.json({
      events: events.map(event => ({
        id: event.id,
        eventKey: event.eventKey,
        label: event.label,
        year: event.year,
        era: event.era,
        historical: event.historical === 1,
        summary: event.summary,
        month: event.month,
        day: event.day
      })),
      scenes: scenesData.map(scene => ({
        id: scene.id,
        sceneNumber: scene.sceneNumber,
        title: scene.title,
        historicalDate: scene.historicalDate,
        alternateTimelineVariant: scene.alternateTimelineVariant || 'Unknown',
        temporalDivergencePoint: scene.temporalDivergencePoint || 'No divergence recorded',
        realWorldContext: scene.realWorldContext || 'Context not available',
        heroJourneyStage: scene.heroJourneyStage || 'Unknown',
        primaryTarotCard: scene.primaryTarotCard || 'No card assigned',
        timelineSignificance: scene.timelineSignificance,
        chronologicalSequence: scene.chronologicalSequence
      }))
    });
  } catch (error) {
    console.error('Timeline API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline data' },
      { status: 500 }
    );
  }
}