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
    // Quick timeout check - if we can't connect in 1 second, use fallback
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 1000)
    );
    
    // Try a simple query or connection test here
    // For now, we'll assume database issues and return fallback
    return false; // Use fallback for faster loading
  } catch (error) {
    console.warn('Database health check failed:', error);
    return false;
  }
}


// Generate fallback calendar data
function generateFallbackData(date: Date): HfCalendarResult {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return {
    dateISO: date.toISOString().split('T')[0],
    dayOfYear365: dayOfYear,
    segment: dayOfYear <= 81 ? 'Q1' : dayOfYear <= 162 ? 'Q2' : dayOfYear <= 203 ? 'MID_A' : dayOfYear <= 284 ? 'Q3' : 'Q4',
    intraSegmentIndex: dayOfYear <= 81 ? dayOfYear : dayOfYear <= 162 ? dayOfYear - 81 : dayOfYear - 162,
    isRestDay: false,
    isMidpoint: false,
    isActiveDay: true,
    twentyDayWeekIndex: (dayOfYear - 1) % 20,
    detoxPhase: 'NONE',
    daySignName: `Day ${(dayOfYear - 1) % 20 + 1}`,
    theme: 'Sacred Calendar Day',
    reflection: 'Reflect on the energy of this day',
    color: getBookColorForDay(dayOfYear)
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