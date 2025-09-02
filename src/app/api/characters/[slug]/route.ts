import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { characters } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';
import { getUserPermissions } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    console.log('Fetching character with slug:', slug);
    // Try to select all fields first, then fallback to core fields if there are schema issues
    let result;
    try {
      result = await db.select({
        id: characters.id,
        name: characters.name,
        aka: characters.aka,
        pronouns: characters.pronouns,
        relation: characters.relation,
        role: characters.role,
        description: characters.description,
        lastSeenChapter: characters.lastSeenChapter,
        personality: characters.personality,
        background: characters.background,
        physicalDescription: characters.physicalDescription,
        dialogueStyle: characters.dialogueStyle,
        groups: characters.groups,
        birthYear: characters.birthYear,
        died: characters.died,
        birthPlace: characters.birthPlace,
        deathPlace: characters.deathPlace,
        slug: characters.slug,
        characterType: characters.characterType,
        imagePrompt: characters.imagePrompt,
        openArtLink: characters.openArtLink,
        customSetting: characters.customSetting,
        imageUrl: characters.imageUrl,
        createdAt: characters.createdAt,
        updatedAt: characters.updatedAt,
      }).from(characters).where(eq(characters.slug, slug));
    } catch (schemaError) {
      console.log('Schema error detected, falling back to core fields only:', schemaError);
      // If there's a schema error, select only core fields
      result = await db.select({
        id: characters.id,
        name: characters.name,
        aka: characters.aka,
        pronouns: characters.pronouns,
        relation: characters.relation,
        role: characters.role,
        description: characters.description,
        lastSeenChapter: characters.lastSeenChapter,
        personality: characters.personality,
        background: characters.background,
        physicalDescription: characters.physicalDescription,
        dialogueStyle: characters.dialogueStyle,
        groups: characters.groups,
        birthYear: characters.birthYear,
        died: characters.died,
        birthPlace: characters.birthPlace,
        deathPlace: characters.deathPlace,
        slug: characters.slug,
        characterType: characters.characterType,
        createdAt: characters.createdAt,
        updatedAt: characters.updatedAt,
      }).from(characters).where(eq(characters.slug, slug));
      
      // Add missing fields as null if they don't exist
      if (result.length > 0) {
        result = result.map(char => ({ 
          ...char, 
          imageUrl: null,
          imagePrompt: null,
          openArtLink: null,
          customSetting: null
        }));
      }
    }
    
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

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    // Check authentication and permissions
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const permissions = await getUserPermissions();
    if (!permissions.canWrite) {
      return NextResponse.json({ error: 'Write permission required' }, { status: 403 });
    }

    const data = await request.json();
    
    // Remove fields that shouldn't be updated directly
    const { ...updateData } = data;
    
    const updatedCharacter = await db
      .update(characters)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(characters.slug, slug))
      .returning({
        id: characters.id,
        name: characters.name,
        characterType: characters.characterType,
        slug: characters.slug,
        aka: characters.aka,
        pronouns: characters.pronouns,
        relation: characters.relation,
        role: characters.role,
        description: characters.description,
        personality: characters.personality,
        background: characters.background,
        physicalDescription: characters.physicalDescription,
        dialogueStyle: characters.dialogueStyle,
        groups: characters.groups,
        birthYear: characters.birthYear,
        died: characters.died,
        birthPlace: characters.birthPlace,
        deathPlace: characters.deathPlace,
        imagePrompt: characters.imagePrompt,
        openArtLink: characters.openArtLink,
        customSetting: characters.customSetting,
        imageUrl: characters.imageUrl,
        lastSeenChapter: characters.lastSeenChapter,
        createdAt: characters.createdAt,
        updatedAt: characters.updatedAt
      });

    if (updatedCharacter.length === 0) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCharacter[0]);
  } catch (error) {
    console.error('Error updating character:', error);
    return NextResponse.json({ error: 'Failed to update character', details: String(error) }, { status: 500 });
  }
} 