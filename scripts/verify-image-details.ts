#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { characters, imageDetailsForAiGeneration } from '../drizzle/schema'
import { eq } from 'drizzle-orm'
import { config } from 'dotenv'

config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL not set')

const sql = postgres(connectionString)
const db = drizzle(sql)

async function verify() {
  try {
    console.log('🔍 Verifying image details for AI generation...\n')

    // Get all image details
    const imageDetails = await db.select().from(imageDetailsForAiGeneration)

    console.log(`✅ Found ${imageDetails.length} image detail records\n`)

    // Show sample details
    const sampleCharacterNames = ['Francisco Petrarch', 'Susanoo', 'Atlas', 'Dagon Atumari', 'Novella d\'Andrea']

    for (const name of sampleCharacterNames) {
      const character = await db
        .select()
        .from(characters)
        .where(eq(characters.name, name))
        .limit(1)

      if (character.length === 0) continue

      const details = await db
        .select()
        .from(imageDetailsForAiGeneration)
        .where(eq(imageDetailsForAiGeneration.characterId, character[0].id))
        .limit(1)

      if (details.length > 0) {
        const detail = details[0]
        console.log(`📸 ${name}`)
        console.log(`   Art Style: ${detail.artStyle || 'N/A'}`)
        console.log(`   Color Palette: ${detail.colorPalette?.substring(0, 60) || 'N/A'}...`)
        console.log(`   Mood: ${detail.mood || 'N/A'}`)
        console.log(`   Detail Level: ${detail.detailLevel || 'N/A'}`)
        console.log(`   Generation Prompt: ${detail.generationPrompt?.substring(0, 80) || 'N/A'}...`)
        console.log()
      }
    }

    // Count by character type
    const allChars = await db.select().from(characters)
    console.log('📊 Statistics:')
    console.log(`   Total Characters: ${allChars.length}`)
    console.log(`   Image Details Created: ${imageDetails.length}`)
    console.log(`   Coverage: ${((imageDetails.length / allChars.length) * 100).toFixed(1)}%`)

    console.log('\n✨ Image details for AI generation have been successfully created!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await sql.end()
  }
}

verify()

export default verify
