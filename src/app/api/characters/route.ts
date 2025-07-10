import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { characters } from '@/lib/schema';

export async function GET() {
  try {
    console.log('Fetching characters from database...');
    const allCharacters = await db.select().from(characters);
    console.log('Found characters:', allCharacters.length);
    return NextResponse.json(allCharacters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json({ error: 'Failed to fetch characters', details: String(error) }, { status: 500 });
  }
} 