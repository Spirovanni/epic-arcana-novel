import { NextResponse } from 'next/server';
import { seedCalendarDefaults } from '@/lib/hfCalendar';

/**
 * POST /api/hf-calendar/seed
 * Initialize default calendar data (day signs, settings)
 */
export async function POST() {
  try {
    await seedCalendarDefaults();
    
    return NextResponse.json({
      success: true,
      message: 'Calendar defaults seeded successfully'
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}