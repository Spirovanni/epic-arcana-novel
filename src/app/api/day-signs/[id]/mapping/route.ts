import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { daySign, daySignMapping } from '@/lib/schema';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

const MappingSchema = z.object({
  archetype: z.string().min(1),
  theme: z.string().min(1),
  reflection: z.string().min(1),
  ritual: z.string().min(1),
  keywords: z.string().min(1),
});

/**
 * POST /api/day-signs/[id]/mapping
 * Update mapping for a specific day sign
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const daySignId = parseInt(id);
    
    if (isNaN(daySignId)) {
      return NextResponse.json(
        { error: 'Invalid day sign ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const mappingData = MappingSchema.parse(body);

    // Check if day sign exists
    const existingSign = await db
      .select({ id: daySign.id })
      .from(daySign)
      .where(eq(daySign.id, daySignId));
      
    if (existingSign.length === 0) {
      return NextResponse.json(
        { error: 'Day sign not found' },
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

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Day sign mapping updated successfully'
    });

  } catch (error) {
    console.error('Day sign mapping update error:', error);
    
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