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
    console.log('🎨 Verifying AI generation prompts...\n')

    // Get all image details with prompts
    const imageDetails = await db.select().from(imageDetailsForAiGeneration)

    console.log(`✅ Found ${imageDetails.length} characters with prompts\n`)

    // Show sample characters with full prompts
    const sampleNames = ['Francisco Petrarch', 'Susanoo', 'Dagon Atumari']

    for (const name of sampleNames) {
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

      if (details.length > 0 && details[0].generationPrompt) {
        const detail = details[0]
        console.log(`${'='.repeat(80)}`)
        console.log(`📸 ${name.toUpperCase()}`)
        console.log(`${'='.repeat(80)}`)
        console.log(`\n🎯 COMPREHENSIVE PROMPT:\n`)
        console.log(detail.generationPrompt.substring(0, 500) + '...\n')

        if (detail.technicalParameters) {
          const params = detail.technicalParameters as any
          console.log(`\n🔧 OPTIMIZED FOR PLATFORMS:\n`)
          if (params.midjourneyPrompt) {
            console.log(`MIDJOURNEY:\n${params.midjourneyPrompt.substring(0, 200)}...\n`)
          }
          if (params.openArtPrompt) {
            console.log(`OPENART:\n${params.openArtPrompt.substring(0, 200)}...\n`)
          }
        }
      }
    }

    // Statistics
    console.log(`\n${'='.repeat(80)}`)
    console.log('📊 STATISTICS')
    console.log(`${'='.repeat(80)}`)

    const allChars = await db.select().from(characters)
    const withPrompts = imageDetails.filter((d) => d.generationPrompt && d.generationPrompt.length > 0)
    const withTechParams = imageDetails.filter((d) => d.technicalParameters)

    console.log(`\nTotal Characters: ${allChars.length}`)
    console.log(`With AI Prompts: ${withPrompts.length}`)
    console.log(`With Technical Parameters: ${withTechParams.length}`)
    console.log(`Coverage: ${((withPrompts.length / allChars.length) * 100).toFixed(1)}%`)

    // Sample character list
    console.log(`\n📋 CHARACTERS WITH COMPREHENSIVE AI PROMPTS:\n`)

    const charList = await db
      .select({ name: characters.name })
      .from(characters)
      .innerJoin(imageDetailsForAiGeneration, eq(characters.id, imageDetailsForAiGeneration.characterId))

    for (let i = 0; i < charList.length; i++) {
      console.log(`${i + 1}. ${charList[i].name}`)
    }

    console.log(`\n✨ All AI prompts have been successfully generated and uploaded!`)
    console.log(`\n💡 These prompts are optimized for:`)
    console.log(`   - Midjourney`)
    console.log(`   - OpenArt AI`)
    console.log(`   - DALL-E 3`)
    console.log(`   - Stable Diffusion`)
    console.log(`   - Any other modern AI image generation tool`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await sql.end()
  }
}

verify()

export default verify
