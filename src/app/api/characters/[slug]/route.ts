import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { characters } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request, { params }) {
  const { slug } = params;
  try {
    console.log('Fetching character with slug:', slug);
    const result = await db.select().from(characters).where(eq(characters.slug, slug));
    console.log('Query result:', result);
    if (!result || result.length === 0) {
      console.log('Character not found for slug:', slug);
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching character:', error);
    return NextResponse.json({ error: 'Failed to fetch character', details: String(error) }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { slug } = params;
  try {
    const data = await request.json();
    
    // Remove fields that shouldn't be updated directly
    const { id, createdAt, slug: _, ...updateData } = data;
    
    const updatedCharacter = await db
      .update(characters)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(characters.slug, slug))
      .returning();

    if (updatedCharacter.length === 0) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCharacter[0]);
  } catch (error) {
    console.error('Error updating character:', error);
    return NextResponse.json({ error: 'Failed to update character', details: String(error) }, { status: 500 });
  }
} 