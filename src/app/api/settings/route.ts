import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, sql } from 'drizzle-orm';
import { calendarSettings } from '@/lib/schema';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

const SettingsSchema = z.object({
  anchor: z.string().optional(), // ISO date string
  leapPolicy: z.enum(['duplicate', 'skip', 'insert_after_Q4']).optional(),
  theme: z.enum(['default', 'rainbow', 'seasons', 'monochrome']).optional(),
  showDayNumbers: z.string().optional(), // 'true' or 'false'
  showColorLegend: z.string().optional(), // 'true' or 'false'
  compactView: z.string().optional(), // 'true' or 'false'
});

/**
 * GET /api/settings
 * Returns calendar configuration settings
 */
export async function GET() {
  try {
    const results = await db
      .select()
      .from(calendarSettings);

    const settings: Record<string, string> = {};
    for (const setting of results) {
      const key = setting.key.replace('calendar.', '');
      settings[key] = setting.value;
    }

    return NextResponse.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('Settings API error:', error);
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
 * POST /api/settings
 * Update calendar configuration settings
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = SettingsSchema.parse(body);

    const updates: Array<{ key: string; value: string }> = [];

    if (settings.anchor) {
      // Validate anchor date
      const anchorDate = new Date(settings.anchor);
      if (isNaN(anchorDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid anchor date format. Use ISO date string.' },
          { status: 400 }
        );
      }
      updates.push({ key: 'calendar.anchor', value: settings.anchor });
    }

    if (settings.leapPolicy) {
      updates.push({ key: 'calendar.leapPolicy', value: settings.leapPolicy });
    }

    if (settings.theme) {
      updates.push({ key: 'calendar.theme', value: settings.theme });
    }

    if (settings.showDayNumbers !== undefined) {
      updates.push({ key: 'calendar.showDayNumbers', value: settings.showDayNumbers });
    }

    if (settings.showColorLegend !== undefined) {
      updates.push({ key: 'calendar.showColorLegend', value: settings.showColorLegend });
    }

    if (settings.compactView !== undefined) {
      updates.push({ key: 'calendar.compactView', value: settings.compactView });
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid settings provided' },
        { status: 400 }
      );
    }

    const results = [];
    for (const update of updates) {
      const result = await db
        .insert(calendarSettings)
        .values(update)
        .onConflictDoUpdate({
          target: calendarSettings.key,
          set: {
            value: sql`excluded.value`,
            updatedAt: sql`now()`
          }
        })
        .returning();
      
      results.push(result[0]);
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Updated ${results.length} setting(s)`
    });

  } catch (error) {
    console.error('Settings update error:', error);
    
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