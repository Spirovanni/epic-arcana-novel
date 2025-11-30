#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'
import { characters } from '../drizzle/schema'
import { eq } from 'drizzle-orm'

// Load environment variables
config()

// Database connection
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

const sql = postgres(connectionString)
const db = drizzle(sql)

interface EnhancedCharacter {
  name: string
  pronouns?: string
  relation?: string
  alt_name?: string
  aka?: string
  role?: string
  description?: string
  personality?: string
  background?: string
  physical_description?: string
  dialogue_style?: string
  birth_year?: number | null
  died?: number | null
  story_year?: number
  story_age?: string | number
  groups?: string[]
  birth_place?: string
  birth_place_description?: string
  death_place?: string
  death_place_description?: string
  goal?: string
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function syncEnhancedCharacters() {
  try {
    console.log('🚀 Starting mythic and fantasy characters sync...')

    // Read both enhanced character files
    const mythicPath = path.join(process.cwd(), 'lore/json/characters/mythic_characters_enhanced.json')
    const fantasyPath = path.join(process.cwd(), 'lore/json/characters/fantasy_characters_enhanced.json')

    if (!fs.existsSync(mythicPath)) {
      throw new Error(`Mythic characters file not found at: ${mythicPath}`)
    }

    if (!fs.existsSync(fantasyPath)) {
      throw new Error(`Fantasy characters file not found at: ${fantasyPath}`)
    }

    const mythicData: EnhancedCharacter[] = JSON.parse(fs.readFileSync(mythicPath, 'utf8'))
    const fantasyData: EnhancedCharacter[] = JSON.parse(fs.readFileSync(fantasyPath, 'utf8'))

    // Combine all characters
    const allCharacters = [...mythicData, ...fantasyData]

    // Filter for only the six target characters
    const targetNames = ['Susanoo', 'Umbra', 'Atlas', 'Shumer', 'Shinar', 'Man from Taured']
    const targetCharacters = allCharacters.filter(char => targetNames.includes(char.name))

    console.log(`📖 Found ${targetCharacters.length} target characters to sync`)

    let updated = 0

    // Process each character
    for (const charData of targetCharacters) {
      console.log(`\n📝 Processing character: ${charData.name}`)

      // Find existing character
      const existingCharacter = await db
        .select({ id: characters.id })
        .from(characters)
        .where(eq(characters.name, charData.name))
        .limit(1)

      if (existingCharacter.length === 0) {
        console.log(`  ⚠️  Character not found in database, skipping...`)
        continue
      }

      const slug = generateSlug(charData.name)

      const characterValues = {
        name: charData.name,
        characterType: 'mythic' as const,
        pronouns: charData.pronouns || null,
        relation: charData.relation || null,
        personality: charData.personality || null,
        background: charData.background || null,
        physicalDescription: charData.physical_description || null,
        dialogueStyle: charData.dialogue_style || null,
        role: charData.role || null,
        goal: charData.goal || null,
        birthYear: charData.birth_year ? String(charData.birth_year) : null,
        died: charData.died ? String(charData.died) : null,
        storyYear: charData.story_year ? String(charData.story_year) : null,
        storyAge: charData.story_age ? String(charData.story_age) : null,
        groups: charData.groups ? JSON.stringify(charData.groups) : null,
        description: charData.description || null,
        birthPlace: charData.birth_place || null,
        birthPlaceDescription: charData.birth_place_description || null,
        deathPlace: charData.death_place || null,
        deathPlaceDescription: charData.death_place_description || null,
        aka: charData.aka || charData.alt_name || null,
        slug: slug,
      }

      console.log(`  ✏️  Updating character`)
      await db
        .update(characters)
        .set({
          ...characterValues,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(characters.id, existingCharacter[0].id))

      updated++
    }

    console.log(`\n✅ Mythic and fantasy characters sync completed successfully!`)
    console.log(`📊 Summary:`)
    console.log(`   Updated: ${updated}`)

  } catch (error) {
    console.error('❌ Error syncing characters:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    await syncEnhancedCharacters()
  } catch (error) {
    console.error('Sync failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

// Run the script
main()

export default main
