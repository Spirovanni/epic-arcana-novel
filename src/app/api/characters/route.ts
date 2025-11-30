import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { characters } from '@/lib/schema';
import { currentUser } from '@clerk/nextjs/server';
import { getUserPermissions } from '@/lib/auth';

let useFallbackQuery = false;
let loggedSchemaWarning = false;

export async function GET() {
  try {
    // Check authentication for read access
    const user = await currentUser();
    let hasPermission = false;

    if (user) {
      const permissions = await getUserPermissions();
      hasPermission = permissions.canRead;
    }

    // Allow unauthenticated access to character data (it's public)
    // but authenticated users with canRead permission get full access
    // For now, we allow public access since character data is not sensitive

    console.log('Fetching characters from database...');
    
    // Try to fetch with all fields first, fallback to core fields if there are schema issues
    let allCharacters;
    if (!useFallbackQuery) {
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
          imagePrompt: characters.imagePrompt,
          openArtLink: characters.openArtLink,
          customSetting: characters.customSetting,
          imageUrl: characters.imageUrl,
          createdAt: characters.createdAt,
          updatedAt: characters.updatedAt,
        }).from(characters);
      } catch (schemaError) {
        useFallbackQuery = true;
        if (!loggedSchemaWarning) {
          console.warn('Schema error detected, falling back to core fields only:', schemaError);
          loggedSchemaWarning = true;
        }
      }
    }

    if (!allCharacters) {
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
        imageUrl: characters.imageUrl,
        createdAt: characters.createdAt,
        updatedAt: characters.updatedAt,
      }).from(characters);
      
      // Add missing fields as null for all characters if they don't exist
      allCharacters = allCharacters.map(char => ({ 
        ...char, 
        imagePrompt: null,
        openArtLink: null,
        customSetting: null
      }));
    }
    
    console.log('Found characters:', allCharacters.length);
    return NextResponse.json(allCharacters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json({ error: 'Failed to fetch characters', details: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    
    // Create new character
    const newCharacter = await db
      .insert(characters)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
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

    return NextResponse.json(newCharacter[0], { status: 201 });
  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json({ error: 'Failed to create character', details: String(error) }, { status: 500 });
  }
} 
