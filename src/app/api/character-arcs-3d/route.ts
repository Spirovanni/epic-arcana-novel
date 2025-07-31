import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { characterArcs, characters, storyCards, storyArcGoals } from '../../../lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Fetch character arcs with related data
    const arcsData = await db
      .select({
        arc: characterArcs,
        character: characters,
      })
      .from(characterArcs)
      .leftJoin(characters, eq(characterArcs.characterId, characters.id))

    // Fetch story cards
    const cardsData = await db
      .select()
      .from(storyCards)

    // Fetch story arc goals
    const goalsData = await db
      .select()
      .from(storyArcGoals)

    // Transform data for 3D visualization
    const transformedCharacters = arcsData.map(({ arc, character }) => ({
      id: arc.id,
      characterId: arc.characterId,
      characterName: character?.name || 'Unknown',
      arcType: arc.arcType,
      stages: arc.stages || {},
      thematicElements: arc.thematicElements || {},
      image: getCharacterImage(character?.name || ''),
      position: getCharacterPosition(arc.characterId),
      color: getCharacterColor(arc.arcType)
    }))

    // Transform story cards for 3D positioning
    const transformedCards = cardsData.map(card => ({
      id: card.id,
      characterArcId: card.characterArcId,
      stageName: card.stageName,
      title: card.title,
      description: card.description || '',
      chapterReferences: card.chapterReferences || [],
      sceneGoals: card.sceneGoals || [],
      position: {
        x: card.positionX || 0,
        y: card.positionY || 0,
        z: card.positionZ || 0
      },
      rotation: {
        x: card.rotationX || 0,
        y: card.rotationY || 0,
        z: card.rotationZ || 0
      },
      scale: card.scale || 1,
      color: card.color || '#6366f1',
      displayOrder: card.displayOrder || 0,
      isVisible: card.isVisible ?? true
    }))

    // Transform story arc goals
    const transformedGoals = goalsData.map(goal => ({
      id: goal.id,
      characterArcId: goal.characterArcId,
      theme: goal.theme,
      chapterNumber: goal.chapterNumber,
      sceneNumber: goal.sceneNumber,
      goalDescription: goal.goalDescription,
      measurementCriteria: goal.measurementCriteria,
      arcDevelopmentNote: goal.arcDevelopmentNote,
      isCompleted: goal.isCompleted || false,
      position: goal.positionIn3d || { x: 0, y: 0, z: 0 },
      visualProperties: goal.visualProperties || {}
    }))

    return NextResponse.json({
      characters: transformedCharacters,
      storyCards: transformedCards,
      storyArcGoals: transformedGoals,
      relationships: getCharacterRelationships(),
      success: true
    })

  } catch (error) {
    console.error('Error fetching character arcs 3D data:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch character arcs data',
        characters: [],
        storyCards: [],
        storyArcGoals: [],
        relationships: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'update_card_position':
        await db
          .update(storyCards)
          .set({
            positionX: data.position.x,
            positionY: data.position.y,
            positionZ: data.position.z,
            updatedAt: new Date().toISOString()
          })
          .where(eq(storyCards.id, data.cardId))
        break

      case 'update_card_content':
        await db
          .update(storyCards)
          .set({
            title: data.title,
            description: data.description,
            chapterReferences: data.chapterReferences,
            sceneGoals: data.sceneGoals,
            updatedAt: new Date().toISOString()
          })
          .where(eq(storyCards.id, data.cardId))
        break

      case 'create_story_card':
        await db
          .insert(storyCards)
          .values({
            characterArcId: data.characterArcId,
            stageName: data.stageName,
            title: data.title,
            description: data.description,
            chapterReferences: data.chapterReferences || [],
            sceneGoals: data.sceneGoals || [],
            positionX: data.position.x,
            positionY: data.position.y,
            positionZ: data.position.z,
            color: data.color || '#6366f1',
            displayOrder: data.displayOrder || 0
          })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid operation type' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating character arcs 3D data:', error)
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 }
    )
  }
}

// Helper functions
function getCharacterImage(characterName: string): string {
  const imageMap: Record<string, string> = {
    'Francisco Petrarch': '/images/characters/francisco-petrarch-1752459749919.png',
    'Giovanna De Sade': '/images/characters/giovanna-de-sade-1752548654762.png',
    'La Signora del Gioco': '/images/characters/giovanna-de-sade-1752548827368.png',
    'Dante Alighieri': '/images/characters/dante-alighieri-1752537732606.jpg',
    'Novella d\'Andrea': '/images/characters/novella-dandrea-1752546227104.png'
  }
  
  return imageMap[characterName] || ''
}

function getCharacterPosition(characterId: string): [number, number, number] {
  const positionMap: Record<string, [number, number, number]> = {
    'francisco': [0, 0, 0],
    'la-signora': [8, 0, 0],
    'giovanna': [8, 0, 0],
    'dagon': [-8, 0, 0],
    'dante': [0, 8, 0],
    'novella': [0, -8, 0]
  }
  
  return positionMap[characterId] || [Math.random() * 16 - 8, Math.random() * 16 - 8, 0]
}

function getCharacterColor(arcType: string): string {
  const colorMap: Record<string, string> = {
    "Hero's Journey": '#8B5CF6',
    'Transformation': '#EC4899',
    "Antagonist's Journey": '#DC2626',
    'Mentor': '#10B981',
    'Love Interest': '#F59E0B'
  }
  
  return colorMap[arcType] || '#6366f1'
}

function getCharacterRelationships() {
  return [
    {
      source: 'francisco',
      target: 'la-signora',
      type: 'romance',
      strength: 8,
      color: '#EC4899',
      chaptersActive: [12, 13, 14, 15, 35, 36, 37, 38, 39, 40]
    },
    {
      source: 'francisco',
      target: 'dagon',
      type: 'conflict',
      strength: 9,
      color: '#DC2626',
      chaptersActive: [20, 21, 22, 23, 24, 35, 36, 37, 38, 39]
    },
    {
      source: 'la-signora',
      target: 'dagon',
      type: 'conflict',
      strength: 7,
      color: '#F59E0B',
      chaptersActive: [25, 26, 27, 28, 29, 30, 35, 36, 37, 38]
    },
    {
      source: 'francisco',
      target: 'dante',
      type: 'mentorship',
      strength: 6,
      color: '#10B981',
      chaptersActive: [2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  ]
}