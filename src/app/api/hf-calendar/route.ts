import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resolveHfCalendar, resolveHfCalendarRange, getFullYearCalendar } from '@/lib/hfCalendar';

const QuerySchema = z.object({
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  year: z.string().optional(),
});

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

    // Full year request
    if (query.year) {
      const year = parseInt(query.year);
      if (isNaN(year) || year < 1000 || year > 9999) {
        return NextResponse.json(
          { error: 'Invalid year. Must be between 1000 and 9999.' },
          { status: 400 }
        );
      }
      
      const results = await getFullYearCalendar(year);
      return NextResponse.json({
        success: true,
        data: results,
        meta: {
          type: 'year',
          year,
          totalDays: results.length
        }
      });
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
      
      const results = await resolveHfCalendarRange(startDate, endDate);
      return NextResponse.json({
        success: true,
        data: results,
        meta: {
          type: 'range',
          startDate: query.startDate,
          endDate: query.endDate,
          totalDays: results.length
        }
      });
    }

    // Single day request
    const targetDate = query.date ? new Date(query.date) : new Date();
    
    if (query.date && isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD.' },
        { status: 400 }
      );
    }
    
    const result = await resolveHfCalendar(targetDate);
    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        type: 'single',
        date: result.dateISO
      }
    });

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