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

interface HistoricalCharacter {
  name: string
  pronouns?: string
  relation?: string
  personality?: string
  background?: string
  physical_description?: string
  dialogue_style?: string
  role?: string
  goal?: string
  birth_year?: number
  died?: number | null
  story_year?: number
  story_age?: number
  groups?: string[]
  description?: string
  birth_place?: string
  birth_place_description?: string
  death_place?: string
  death_place_description?: string
  aka?: string
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function syncHistoricalCharacters() {
  try {
    console.log('🚀 Starting historical characters sync...')

    // Read the historical characters JSON file
    const dataPath = path.join(process.cwd(), 'lore/json/characters/historical_characters.json')

    if (!fs.existsSync(dataPath)) {
      throw new Error(`Historical characters data file not found at: ${dataPath}`)
    }

    const rawData = fs.readFileSync(dataPath, 'utf8')
    const historicalCharacters: HistoricalCharacter[] = JSON.parse(rawData)

    if (!Array.isArray(historicalCharacters)) {
      throw new Error('Invalid historical characters data structure - expected array')
    }

    console.log(`📖 Found ${historicalCharacters.length} characters to sync`)

    let created = 0
    let updated = 0

    // Process each character
    for (const charData of historicalCharacters) {
      console.log(`\n📝 Processing character: ${charData.name}`)

      const slug = generateSlug(charData.name)

      // Check if character already exists
      const existingCharacter = await db
        .select({ id: characters.id })
        .from(characters)
        .where(eq(characters.name, charData.name))
        .limit(1)

      const characterValues = {
        name: charData.name,
        characterType: 'historical' as const,
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
        aka: charData.aka || null,
        slug: slug,
      }

      if (existingCharacter.length > 0) {
        console.log(`  ✏️  Updating existing character`)
        await db
          .update(characters)
          .set({
            ...characterValues,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(characters.id, existingCharacter[0].id))
        updated++
      } else {
        console.log(`  ✨ Creating new character`)
        await db
          .insert(characters)
          .values({
            ...characterValues,
          })
        created++
      }
    }

    console.log(`\n✅ Historical characters sync completed successfully!`)
    console.log(`📊 Summary:`)
    console.log(`   Created: ${created}`)
    console.log(`   Updated: ${updated}`)
    console.log(`   Total: ${created + updated}`)

  } catch (error) {
    console.error('❌ Error syncing historical characters:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    await syncHistoricalCharacters()
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
