import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { locations } from '@/lib/schema';

export async function GET() {
  try {
    const locationsData = await db.select().from(locations);
    
    return NextResponse.json({
      success: true,
      locations: locationsData
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}