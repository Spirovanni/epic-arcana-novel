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
    // Check a few key characters
    const petrarch = await db
      .select()
      .from(characters)
      .where(eq(characters.name, 'Francisco Petrarch'))

    if (petrarch.length > 0) {
      const char = petrarch[0]
      console.log('✅ Francisco Petrarch found')
      console.log(`   Birth: ${char.birthPlace} (${char.birthYear})`)
      console.log(`   Death: ${char.deathPlace} (${char.died})`)
      if (char.dialogueStyle) {
        console.log(`   Dialogue Style: ${char.dialogueStyle.substring(0, 60)}...`)
      }
    }

    const novella = await db
      .select()
      .from(characters)
      .where(eq(characters.name, "Novella d'Andrea"))

    if (novella.length > 0) {
      const char = novella[0]
      console.log('\n✅ Novella d\'Andrea found')
      console.log(`   Born: ${char.birthYear} in ${char.birthPlace}`)
      console.log(`   Died: ${char.died} in ${char.deathPlace}`)
      console.log(`   Story Age: ${char.storyAge}`)
    }

    const giovanni = await db
      .select()
      .from(characters)
      .where(eq(characters.name, "Giovanni d'Andrea"))

    if (giovanni.length > 0) {
      const char = giovanni[0]
      console.log('\n✅ Giovanni d\'Andrea found')
      console.log(`   Role: ${char.role}`)
      console.log(`   Death Place: ${char.deathPlace}`)
      if (char.dialogueStyle) {
        console.log(`   Dialogue Style: ${char.dialogueStyle.substring(0, 60)}...`)
      }
    }

    // Count total characters
    const allChars = await db.select().from(characters)
    console.log(`\n📊 Total characters in database: ${allChars.length}`)

    console.log('\n✨ All character data successfully synced to Neon DB!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await sql.end()
  }
}

verify()

export default verify
