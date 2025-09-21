import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { daySign, daySignMapping } from '@/lib/schema';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

const UpdateMappingSchema = z.object({
  archetype: z.string().min(1),
  theme: z.string().min(1),
  reflection: z.string().min(1),
  ritual: z.string().min(1),
  keywords: z.string().min(1),
});

/**
 * GET /api/day-signs
 * Returns all 20 day signs with their mappings
 */
export async function GET() {
  try {
    const results = await db
      .select({
        id: daySign.id,
        index0: daySign.index0,
        name: daySign.name,
        color: daySign.color,
        glyph: daySign.glyph,
        createdAt: daySign.createdAt,
        updatedAt: daySign.updatedAt,
        mapping: {
          id: daySignMapping.id,
          archetype: daySignMapping.archetype,
          theme: daySignMapping.theme,
          reflection: daySignMapping.reflection,
          ritual: daySignMapping.ritual,
          keywords: daySignMapping.keywords,
        }
      })
      .from(daySign)
      .leftJoin(daySignMapping, eq(daySign.id, daySignMapping.daySignId))
      .orderBy(daySign.index0);

    return NextResponse.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Day Signs API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/day-signs
 * Update multiple day sign mappings
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Expect array of updates: [{ daySignId, ...mappingData }]
    const updates = z.array(z.object({
      daySignId: z.number(),
      ...UpdateMappingSchema.shape
    })).parse(body);

    const results = [];
    
    for (const update of updates) {
      const { daySignId, ...mappingData } = update;
      
      // Check if day sign exists
      const existingSign = await db
        .select({ id: daySign.id })
        .from(daySign)
        .where(eq(daySign.id, daySignId));
        
      if (existingSign.length === 0) {
        return NextResponse.json(
          { error: `Day sign with ID ${daySignId} not found` },
          { status: 404 }
        );
      }

      // Upsert mapping
      const result = await db
        .insert(daySignMapping)
        .values({
          daySignId,
          ...mappingData
        })
        .onConflictDoUpdate({
          target: daySignMapping.daySignId,
          set: {
            ...mappingData,
            updatedAt: new Date()
          }
        })
        .returning();
        
      results.push(result[0]);
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Updated ${results.length} day sign mapping(s)`
    });

  } catch (error) {
    console.error('Day Signs update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}