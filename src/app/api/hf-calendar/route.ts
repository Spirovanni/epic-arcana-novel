import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resolveHfCalendar, resolveHfCalendarRange, getFullYearCalendar, type HfCalendarResult } from '@/lib/hfCalendar';
import { getBookColorForDay } from '@/lib/bookColors';

const QuerySchema = z.object({
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  year: z.string().optional(),
});

// Database health check with timeout
async function checkDatabaseHealth(): Promise<boolean> {
  try {
    // For development, always use fallback to avoid database timeouts
    // In production, you could implement actual database connectivity check
    return false; // Use fallback for faster loading and avoid timeouts
  } catch (error) {
    console.warn('Database health check failed:', error);
    return false;
  }
}


// Segment boundaries (matching client-side logic)
const SEGMENT_BOUNDARIES = {
  Q1: { start: 1, end: 81 },
  Q2: { start: 82, end: 162 },
  MID_A: { start: 163, end: 182 },
  MIDPOINT: { start: 183, end: 183 },
  MID_B: { start: 184, end: 203 },
  Q3: { start: 204, end: 284 },
  Q4: { start: 285, end: 365 }
} as const;

// Server-side calendar utility functions (matching client logic)
function resolveSegmentServer(dayOfYear365: number) {
  for (const [segment, bounds] of Object.entries(SEGMENT_BOUNDARIES)) {
    if (dayOfYear365 >= bounds.start && dayOfYear365 <= bounds.end) {
      return {
        segment: segment as any,
        intraSegmentIndex: dayOfYear365 - bounds.start + 1
      };
    }
  }
  return { segment: 'Q1' as any, intraSegmentIndex: 1 };
}

function isRestDayServer(segment: string, intraSegmentIndex: number): boolean {
  return ['Q1', 'Q2', 'Q3', 'Q4'].includes(segment) && intraSegmentIndex === 81;
}

function isMidpointServer(segment: string): boolean {
  return segment === 'MIDPOINT';
}

function isActiveDayServer(segment: string, intraSegmentIndex: number): boolean {
  if (isMidpointServer(segment) || isRestDayServer(segment, intraSegmentIndex)) {
    return false;
  }
  return true;
}

function getTwentyDayWeekIndexServer(dayOfYear365: number): number {
  let activeIndex = 0;
  
  for (let day = 1; day < dayOfYear365; day++) {
    const { segment, intraSegmentIndex } = resolveSegmentServer(day);
    if (isActiveDayServer(segment, intraSegmentIndex)) {
      activeIndex++;
    }
  }
  
  // Add current day if it's active
  const { segment, intraSegmentIndex } = resolveSegmentServer(dayOfYear365);
  if (isActiveDayServer(segment, intraSegmentIndex)) {
    activeIndex++;
  }
  
  return (activeIndex - 1) % 20;
}

function getDetoxPhaseServer(segment: string) {
  switch (segment) {
    case 'MID_A':
      return 'EXILE_1_20';
    case 'MIDPOINT':
      return 'MIDPOINT';
    case 'MID_B':
      return 'RENEWAL_1_20';
    default:
      return 'NONE';
  }
}

// Generate fallback calendar data with proper rest day logic
function generateFallbackData(date: Date): HfCalendarResult {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const { segment, intraSegmentIndex } = resolveSegmentServer(dayOfYear);
  
  const isRest = isRestDayServer(segment, intraSegmentIndex);
  const isMid = isMidpointServer(segment);
  const isActive = isActiveDayServer(segment, intraSegmentIndex);
  
  return {
    dateISO: date.toISOString().split('T')[0],
    dayOfYear365: dayOfYear,
    segment: segment as any,
    intraSegmentIndex,
    isRestDay: isRest,
    isMidpoint: isMid,
    isActiveDay: isActive,
    twentyDayWeekIndex: getTwentyDayWeekIndexServer(dayOfYear),
    detoxPhase: getDetoxPhaseServer(segment) as any,
    daySignName: isActive ? `Day ${getTwentyDayWeekIndexServer(dayOfYear) + 1}` : undefined,
    theme: isActive ? 'Sacred Calendar Day' : isMid ? 'Sacred Center' : 'Rest Day',
    reflection: 'Reflect on the energy of this day',
    color: isActive ? getBookColorForDay(dayOfYear) : undefined
  };
}

function generateFallbackYearData(year: number): HfCalendarResult[] {
  const fallbackData: HfCalendarResult[] = [];
  for (let dayOfYear = 1; dayOfYear <= 365; dayOfYear++) {
    const date = new Date(year, 0, dayOfYear - 1);
    fallbackData.push(generateFallbackData(date));
  }
  return fallbackData;
}

/**
 * GET /api/hf-calendar
 * Returns Human Framework Calendar data
 * 
 * Query params:
 * - date: YYYY-MM-DD (single day)
 * - startDate & endDate: YYYY-MM-DD (date range)
 * - year: YYYY (full year)
 * - No params: today
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(searchParams));

    // Quick health check - if database is not available, return fallback immediately
    const shouldUseFallback = await checkDatabaseHealth();

    // Full year request
    if (query.year) {
      const year = parseInt(query.year);
      if (isNaN(year) || year < 1000 || year > 9999) {
        return NextResponse.json(
          { error: 'Invalid year. Must be between 1000 and 9999.' },
          { status: 400 }
        );
      }
      
      if (shouldUseFallback) {
        const results = generateFallbackYearData(year);
        return NextResponse.json({
          success: true,
          data: results,
          meta: {
            type: 'year',
            year,
            totalDays: results.length,
            source: 'fallback'
          }
        });
      }

      try {
        const results = await getFullYearCalendar(year);
        return NextResponse.json({
          success: true,
          data: results,
          meta: {
            type: 'year',
            year,
            totalDays: results.length,
            source: 'database'
          }
        });
      } catch (error) {
        // Fallback on database error
        const results = generateFallbackYearData(year);
        return NextResponse.json({
          success: true,
          data: results,
          meta: {
            type: 'year',
            year,
            totalDays: results.length,
            source: 'fallback'
          }
        });
      }
    }

    // Date range request
    if (query.startDate && query.endDate) {
      const startDate = new Date(query.startDate);
      const endDate = new Date(query.endDate);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format. Use YYYY-MM-DD.' },
          { status: 400 }
        );
      }
      
      if (startDate > endDate) {
        return NextResponse.json(
          { error: 'Start date must be before end date.' },
          { status: 400 }
        );
      }
      
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 365) {
        return NextResponse.json(
          { error: 'Date range cannot exceed 365 days.' },
          { status: 400 }
        );
      }
      
      if (shouldUseFallback) {
        const results: HfCalendarResult[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          results.push(generateFallbackData(new Date(currentDate)));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return NextResponse.json({
          success: true,
          data: results,
          meta: {
            type: 'range',
            startDate: query.startDate,
            endDate: query.endDate,
            totalDays: results.length,
            source: 'fallback'
          }
        });
      }

      try {
        const results = await resolveHfCalendarRange(startDate, endDate);
        return NextResponse.json({
          success: true,
          data: results,
          meta: {
            type: 'range',
            startDate: query.startDate,
            endDate: query.endDate,
            totalDays: results.length,
            source: 'database'
          }
        });
      } catch (error) {
        // Fallback on database error
        const results: HfCalendarResult[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          results.push(generateFallbackData(new Date(currentDate)));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return NextResponse.json({
          success: true,
          data: results,
          meta: {
            type: 'range',
            startDate: query.startDate,
            endDate: query.endDate,
            totalDays: results.length,
            source: 'fallback'
          }
        });
      }
    }

    // Single day request
    const targetDate = query.date ? new Date(query.date) : new Date();
    
    if (query.date && isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD.' },
        { status: 400 }
      );
    }

    if (shouldUseFallback) {
      const result = generateFallbackData(targetDate);
      return NextResponse.json({
        success: true,
        data: result,
        meta: {
          type: 'single',
          date: result.dateISO,
          source: 'fallback'
        }
      });
    }

    try {
      const result = await resolveHfCalendar(targetDate);
      return NextResponse.json({
        success: true,
        data: result,
        meta: {
          type: 'single',
          date: result.dateISO,
          source: 'database'
        }
      });
    } catch (error) {
      // Fallback on database error
      const result = generateFallbackData(targetDate);
      return NextResponse.json({
        success: true,
        data: result,
        meta: {
          type: 'single',
          date: result.dateISO,
          source: 'fallback'
        }
      });
    }

  } catch (error) {
    console.error('HF Calendar API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}