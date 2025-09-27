import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { dayOverride } from '@/lib/schema';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

const OverrideSchema = z.object({
  dayOfYear: z.number().min(1).max(365),
  title: z.string().optional(),
  description: z.string().optional(),
  ritual: z.string().optional(),
  tags: z.string().optional(),
});

/**
 * GET /api/overrides
 * Returns all day overrides
 */
export async function GET() {
  try {
    const results = await db
      .select()
      .from(dayOverride)
      .orderBy(dayOverride.dayOfYear);

    return NextResponse.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Overrides API error:', error);
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
 * POST /api/overrides
 * Create or update a day override
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const overrideData = OverrideSchema.parse(body);

    const result = await db
      .insert(dayOverride)
      .values(overrideData)
      .onConflictDoUpdate({
        target: dayOverride.dayOfYear,
        set: {
          title: overrideData.title,
          description: overrideData.description,
          ritual: overrideData.ritual,
          tags: overrideData.tags,
          updatedAt: new Date()
        }
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: result[0],
      message: `Override for day ${overrideData.dayOfYear} saved successfully`
    });

  } catch (error) {
    console.error('Override create/update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.issues
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

/**
 * DELETE /api/overrides
 * Delete a day override
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dayOfYear = searchParams.get('dayOfYear');
    
    if (!dayOfYear) {
      return NextResponse.json(
        { error: 'dayOfYear parameter is required' },
        { status: 400 }
      );
    }
    
    const dayNum = parseInt(dayOfYear);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 365) {
      return NextResponse.json(
        { error: 'dayOfYear must be between 1 and 365' },
        { status: 400 }
      );
    }

    const result = await db
      .delete(dayOverride)
      .where(eq(dayOverride.dayOfYear, dayNum))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Override not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Override for day ${dayNum} deleted successfully`
    });

  } catch (error) {
    console.error('Override delete error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}