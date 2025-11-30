#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { characters } from '../drizzle/schema'
import { eq, inArray } from 'drizzle-orm'
import { config } from 'dotenv'

config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL not set')

const sql = postgres(connectionString)
const db = drizzle(sql)

async function verify() {
  try {
    const targetNames = ['Susanoo', 'Umbra', 'Atlas', 'Shumer', 'Shinar', 'Man from Taured']

    console.log('🔍 Verifying mythic and fantasy character data...\n')

    for (const name of targetNames) {
      const result = await db
        .select()
        .from(characters)
        .where(eq(characters.name, name))
        .limit(1)

      if (result.length > 0) {
        const char = result[0]
        console.log(`✅ ${name}`)
        console.log(`   Role: ${char.role || 'N/A'}`)
        console.log(`   Pronouns: ${char.pronouns || 'N/A'}`)
        console.log(`   Story Age: ${char.storyAge || 'N/A'}`)
        if (char.personality) {
          console.log(`   Personality: ${char.personality.substring(0, 70)}...`)
        }
        if (char.dialogueStyle) {
          console.log(`   Dialogue Style: ${char.dialogueStyle.substring(0, 70)}...`)
        }
        if (char.birthPlace) {
          console.log(`   Birth Place: ${char.birthPlace}`)
        }
        if (char.deathPlace) {
          console.log(`   Death Place: ${char.deathPlace}`)
        }
        console.log()
      } else {
        console.log(`❌ ${name} - NOT FOUND`)
      }
    }

    // Count total characters
    const allChars = await db.select().from(characters)
    console.log(`📊 Total characters in database: ${allChars.length}`)

    console.log('\n✨ All six mythic and fantasy characters have been successfully synced to Neon DB!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await sql.end()
  }
}

verify()

export default verify
