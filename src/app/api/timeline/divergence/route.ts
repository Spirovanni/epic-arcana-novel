import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { timelineDivergencePoints } from '../../../../lib/schema';

export async function GET() {
  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const db = drizzle(client);

    // Fetch timeline divergence points
    const divergencePoints = await db.select().from(timelineDivergencePoints).orderBy(timelineDivergencePoints.historicalDate);

    await client.end();

    return NextResponse.json({
      divergencePoints: divergencePoints.map(point => ({
        id: point.id,
        name: point.name,
        historicalDate: point.historicalDate,
        divergenceType: point.divergenceType,
        realTimelineOutcome: point.realTimelineOutcome,
        storyTimelineOutcome: point.storyTimelineOutcome,
        causedBySceneIds: point.causedBySceneIds,
        affectsSceneIds: point.affectsSceneIds,
        historicalConsequences: point.historicalConsequences,
        fantasyJustification: point.fantasyJustification,
        cascadeEffects: point.cascadeEffects
      }))
    });
  } catch (error) {
    console.error('Divergence API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch divergence data' },
      { status: 500 }
    );
  }
}