import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { timelineEvents, scenes } from '../../../lib/schema';

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
      timeline_date: scenes.timeline_date,
      timeline_variant: scenes.timeline_variant,
      realWorldContext: scenes.realWorldContext,
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
        timeline_date: scene.timeline_date,
        timeline_variant: scene.timeline_variant || 'Unknown',
        realWorldContext: scene.realWorldContext || 'Context not available',
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