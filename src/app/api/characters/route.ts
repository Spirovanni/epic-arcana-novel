import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { characters } from '@/lib/schema';

export async function GET() {
  try {
    console.log('Fetching characters from database...');
    
    // Try to fetch with all fields first, fallback to core fields if there are schema issues
    let allCharacters;
    try {
      allCharacters = await db.select({
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
        imageUrl: characters.imageUrl,
        createdAt: characters.createdAt,
        updatedAt: characters.updatedAt,
      }).from(characters);
    } catch (schemaError) {
      console.log('Schema error detected, falling back to core fields only:', schemaError);
      // Fallback to core fields that definitely exist
      allCharacters = await db.select({
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
      }).from(characters);
      
      // Add imageUrl as null for all characters if the field doesn't exist
      allCharacters = allCharacters.map(char => ({ ...char, imageUrl: null }));
    }
    
    console.log('Found characters:', allCharacters.length);
    return NextResponse.json(allCharacters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json({ error: 'Failed to fetch characters', details: String(error) }, { status: 500 });
  }
} 