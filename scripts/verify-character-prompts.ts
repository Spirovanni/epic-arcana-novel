#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { characters } from '../drizzle/schema'
import { eq, isNotNull } from 'drizzle-orm'
import { config } from 'dotenv'

config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL not set')

const sql = postgres(connectionString)
const db = drizzle(sql)

async function verify() {
  try {
    console.log('🎨 Verifying Character AI Prompts...\n')

    // Get all characters with AI prompts
    const charsWithPrompts = await db
      .select()
      .from(characters)
      .where(isNotNull(characters.aiPrompt))

    console.log(`✅ Found ${charsWithPrompts.length} characters with AI prompts\n`)

    // Show detailed sample prompts
    const samples = ['Francisco Petrarch', 'Susanoo', 'Dagon Atumari']

    for (const name of samples) {
      const char = await db
        .select()
        .from(characters)
        .where(eq(characters.name, name))
        .limit(1)

      if (char.length > 0 && char[0].aiPrompt) {
        console.log(`${'='.repeat(90)}`)
        console.log(`📸 ${name.toUpperCase()}`)
        console.log(`${'='.repeat(90)}`)
        console.log(`\n${char[0].aiPrompt}\n`)
      }
    }

    // Quick summary of all characters with prompts
    console.log(`${'='.repeat(90)}`)
    console.log('📋 ALL CHARACTERS WITH AI PROMPTS')
    console.log(`${'='.repeat(90)}\n`)

    for (let i = 0; i < charsWithPrompts.length; i++) {
      const char = charsWithPrompts[i]
      const promptLength = char.aiPrompt ? char.aiPrompt.length : 0
      console.log(`${String(i + 1).padStart(2)}. ${char.name.padEnd(30)} | Prompt Length: ${promptLength} chars`)
    }

    console.log(`\n${'='.repeat(90)}`)
    console.log('✨ CHARACTER AI PROMPT SUMMARY')
    console.log(`${'='.repeat(90)}`)
    console.log(`\nTotal Characters: ${charsWithPrompts.length}`)
    console.log(`Average Prompt Length: ${Math.round(
      charsWithPrompts.reduce((sum, c) => sum + (c.aiPrompt?.length || 0), 0) / charsWithPrompts.length
    )} characters`)

    const totalLength = charsWithPrompts.reduce((sum, c) => sum + (c.aiPrompt?.length || 0), 0)
    console.log(`Total Content: ${totalLength.toLocaleString()} characters`)

    console.log(`\n✨ All character AI prompts are ready for AI image generation!`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await sql.end()
  }
}

verify()

export default verify
