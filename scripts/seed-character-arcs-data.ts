#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'
import { characters, characterArcs, storyCards, storyArcGoals } from '../drizzle/schema'
import { eq, and } from 'drizzle-orm'

// Load environment variables
config()

// Database connection
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

const sql = postgres(connectionString)
const db = drizzle(sql)

interface CharacterArcData {
  character_arcs: Array<{
    character_id: string
    character_name: string 
    arc_type: string
    primary_book?: number | number[]
    character_foundation?: {
      lie_character_believes?: string
      truth_character_needs?: string
      want?: string
      need?: string
      ghost?: string
      characteristic_moment?: string
    }
    stages: Record<string, {
      description: string
      books_chapters?: Array<{book: number, chapters?: number[], chapter?: number}>
      scene_goals?: Array<{
        book: number
        chapter: number
        scene: number
        goal: string
        arc_development: string
        internal_conflict?: string
      }>
    }>
    thematic_elements?: Record<string, {
      development: string
      story_arc_goals?: Array<{
        chapter: number
        goal: string
        measurement: string
      }>
    }>
    cross_character_relationships?: Array<{
      target_character: string
      relationship_type: string
      key_chapters: number[]
      description?: string
    }>
  }>
}

interface CharacterMappings {
  [key: string]: string // Maps character_id to database UUID
}

async function findOrCreateCharacter(characterId: string, characterName: string): Promise<string> {
  try {
    // First try to find existing character by name
    const existingCharacter = await db
      .select({ id: characters.id })
      .from(characters)
      .where(eq(characters.name, characterName))
      .limit(1)

    if (existingCharacter.length > 0) {
      console.log(`Found existing character: ${characterName}`)
      return existingCharacter[0].id
    }

    // Create new character if not found
    console.log(`Creating new character: ${characterName}`)
    const newCharacter = await db
      .insert(characters)
      .values({
        name: characterName,
        characterType: 'fantasy', // Default to fantasy type
        role: 'Main Character',
        description: `Character from Epic Arcana series - ${characterName}`,
        // Add other required fields as needed
      })
      .returning({ id: characters.id })

    return newCharacter[0].id
  } catch (error) {
    console.error(`Error finding/creating character ${characterName}:`, error)
    throw error
  }
}

async function seedCharacterArcs() {
  try {
    console.log('Starting character arcs seeding...')

    // Read the character arcs JSON file
    const dataPath = path.join(process.cwd(), 'lore/json/storyline/character_arcs.json')
    
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Character arcs data file not found at: ${dataPath}`)
    }

    const rawData = fs.readFileSync(dataPath, 'utf8')
    const characterArcsData: CharacterArcData = JSON.parse(rawData)

    if (!characterArcsData.character_arcs || !Array.isArray(characterArcsData.character_arcs)) {
      throw new Error('Invalid character arcs data structure')
    }

    console.log(`Found ${characterArcsData.character_arcs.length} character arcs to process`)

    // Create mapping of character IDs to database UUIDs
    const characterMappings: CharacterMappings = {}

    // Process each character arc
    for (const arcData of characterArcsData.character_arcs) {
      console.log(`\nProcessing character arc for: ${arcData.character_name}`)

      // Find or create character
      const characterUuid = await findOrCreateCharacter(arcData.character_id, arcData.character_name)
      characterMappings[arcData.character_id] = characterUuid

      // Check if character arc already exists
      const existingArc = await db
        .select({ id: characterArcs.id })
        .from(characterArcs)
        .where(eq(characterArcs.characterId, characterUuid))
        .limit(1)

      let characterArcId: string

      if (existingArc.length > 0) {
        console.log(`  Updating existing character arc`)
        
        // Update existing character arc with Weiland structure
        await db
          .update(characterArcs)
          .set({
            arcType: arcData.arc_type,
            triumphTheme: typeof arcData.primary_book === 'string' ? arcData.primary_book : 'Character Growth',
            stages: arcData.stages,
            thematicElements: arcData.thematic_elements || {},
            keyMoments: arcData.character_foundation || {},
            updatedAt: new Date().toISOString(),
          })
          .where(eq(characterArcs.id, existingArc[0].id))

        characterArcId = existingArc[0].id
      } else {
        console.log(`  Creating new character arc`)
        
        // Create new character arc with Weiland structure
        const newArc = await db
          .insert(characterArcs)
          .values({
            characterId: characterUuid,
            arcType: arcData.arc_type,
            triumphTheme: typeof arcData.primary_book === 'string' ? arcData.primary_book : 'Character Growth',
            stages: arcData.stages,
            thematicElements: arcData.thematic_elements || {},
            keyMoments: arcData.character_foundation || {},
          })
          .returning({ id: characterArcs.id })

        characterArcId = newArc[0].id
      }

      // Delete existing story cards for this character arc
      await db
        .delete(storyCards)
        .where(eq(storyCards.characterArcId, characterArcId))

      // Delete existing story arc goals for this character arc
      await db
        .delete(storyArcGoals)
        .where(eq(storyArcGoals.characterArcId, characterArcId))

      // Create story cards from stages
      let displayOrder = 1
      for (const [stageName, stageData] of Object.entries(arcData.stages)) {
        console.log(`    Creating story card for stage: ${stageName}`)
        
        await db
          .insert(storyCards)
          .values({
            characterArcId: characterArcId,
            stageName: stageName,
            title: stageName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: stageData.description,
            chapterReferences: stageData.books_chapters ? 
              stageData.books_chapters.map((bc: any) => `Book ${bc.book}${bc.chapters ? `, Chapters ${bc.chapters.join(', ')}` : bc.chapter ? `, Chapter ${bc.chapter}` : ''}`).join('; ') 
              : [],
            sceneGoals: stageData.scene_goals || [],
            arcDevelopment: stageData.description,
            positionX: (displayOrder - 3) * 2,
            positionY: Math.random() * 2 - 1,
            positionZ: Math.random() * 2 - 1,
            color: getCharacterColor(arcData.character_id),
            displayOrder: displayOrder,
            isVisible: true,
          })

        displayOrder++
      }

      // Create story arc goals from thematic elements
      if (arcData.thematic_elements) {
        for (const [theme, themeData] of Object.entries(arcData.thematic_elements)) {
          if (themeData.story_arc_goals) {
            console.log(`    Creating story arc goals for theme: ${theme}`)
            
            for (const goal of themeData.story_arc_goals) {
              await db
                .insert(storyArcGoals)
                .values({
                  characterArcId: characterArcId,
                  theme: theme,
                  chapterNumber: goal.chapter,
                  goalDescription: goal.goal,
                  measurementCriteria: goal.measurement,
                  arcDevelopmentNote: themeData.development,
                  isCompleted: false,
                  positionIn3d: {
                    x: Math.random() * 10 - 5,
                    y: Math.random() * 10 - 5,
                    z: Math.random() * 10 - 5
                  },
                  visualProperties: {
                    color: getCharacterColor(arcData.character_id),
                    size: 1.0
                  }
                })
            }
          }
        }
      }

      console.log(`  Completed processing for ${arcData.character_name}`)
    }

    console.log('\n✅ Character arcs seeding completed successfully!')
    console.log(`📊 Processed ${characterArcsData.character_arcs.length} character arcs`)
    
  } catch (error) {
    console.error('❌ Error seeding character arcs:', error)
    throw error
  }
}

function getCharacterColor(characterId: string): string {
  const colorMap: { [key: string]: string } = {
    'francisco-petrarch': '#8B5CF6',
    'la-signora-del-gioco': '#EC4899',
    'dante-alighieri': '#10B981',
    'dagon-atumari': '#DC2626',
    'novella-dandrea': '#F59E0B',
    'hannibal-barca': '#6366F1',
    'madonna-oriente': '#7C3AED',
    'man-from-taured': '#059669',
    'umbra': '#374151'
  }
  
  return colorMap[characterId] || '#6B7280'
}

// Main execution
async function main() {
  try {
    await seedCharacterArcs()
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

// Run the script
main()

export default main