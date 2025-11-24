import { NextRequest, NextResponse } from 'next/server';
import {
  getAllPersonalityProfiles,
  getPersonalityByCanonicalId,
  searchPersonalities,
} from '@/lib/personality-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const searchQuery = searchParams.get('search');

    // Get single profile by canonical ID
    if (profileId) {
      const personality = await getPersonalityByCanonicalId(profileId);
      if (!personality) {
        return NextResponse.json(
          { error: 'Personality profile not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(personality);
    }

    // Search profiles
    if (searchQuery && searchQuery.trim().length > 0) {
      const results = await searchPersonalities(searchQuery);
      return NextResponse.json(results);
    }

    // Return all personalities
    const personalities = await getAllPersonalityProfiles();
    return NextResponse.json(personalities);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('❌ Error loading personality profiles:');
    console.error('Message:', errorMessage);
    console.error('Stack:', errorStack);

    return NextResponse.json(
      {
        error: 'Failed to load personality profiles',
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}