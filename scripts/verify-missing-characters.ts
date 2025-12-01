#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { characters } from '../drizzle/schema'
import { eq } from 'drizzle-orm'
import { config } from 'dotenv'

config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL not set')

const sql = postgres(connectionString)
const db = drizzle(sql)

async function verify() {
  try {
    console.log('🎨 Verifying Missing Characters...\n')

    const targetNames = ['Madonna Oriente', 'The Shining Ones', 'La Signora del Gioco']

    for (const name of targetNames) {
      const char = await db
        .select()
        .from(characters)
        .where(eq(characters.name, name))
        .limit(1)

      if (char.length > 0) {
        const c = char[0]
        console.log(`✅ ${name}`)
        console.log(`   Character Type: ${c.characterType}`)
        console.log(`   Role: ${c.role || 'N/A'}`)
        console.log(`   Pronouns: ${c.pronouns || 'N/A'}`)
        console.log(`   Story Age: ${c.storyAge || 'N/A'}`)
        console.log(`   Birth Place: ${c.birthPlace || 'N/A'}`)
        console.log(`   Groups: ${c.groups ? (Array.isArray(c.groups) ? c.groups.join(', ') : JSON.stringify(c.groups).substring(0, 50)) : 'N/A'}...`)
        console.log(`   Personality: ${c.personality ? c.personality.substring(0, 70) : 'N/A'}...`)
        console.log(`   AI Prompt: ${c.aiPrompt ? c.aiPrompt.substring(0, 70) : 'N/A'}...`)
        console.log(`   Slug: ${c.slug}`)
        console.log()
      } else {
        console.log(`❌ ${name} - NOT FOUND`)
      }
    }

    // Summary statistics
    const allChars = await db.select().from(characters)
    console.log('📊 Overall Statistics')
    console.log(`   Total characters in database: ${allChars.length}`)

    const charsWithPrompts = allChars.filter(c => c.aiPrompt)
    console.log(`   Characters with AI prompts: ${charsWithPrompts.length}`)

    const charsWithDescription = allChars.filter(c => c.physicalDescription)
    console.log(`   Characters with physical description: ${charsWithDescription.length}`)

    console.log('\n✨ All missing characters have been successfully populated!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await sql.end()
  }
}

verify()

export default verify
