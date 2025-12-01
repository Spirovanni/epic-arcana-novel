#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { characters, imageDetailsForAiGeneration } from '../drizzle/schema'
import { eq } from 'drizzle-orm'
import { config } from 'dotenv'

config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

const sql = postgres(connectionString)
const db = drizzle(sql)

// Generate comprehensive AI prompt for character
function generateComprehensivePrompt(character: any): string {
  const {
    name,
    characterType,
    pronouns,
    personality,
    background,
    physicalDescription,
    dialogueStyle,
    role,
    birthYear,
    died,
    groups,
    description,
    birthPlace,
    deathPlace,
  } = character

  const sections: string[] = []

  // CHARACTER IDENTITY
  sections.push(`**CHARACTER: ${name}**`)
  if (role) sections.push(`Role: ${role}`)
  if (characterType) sections.push(`Type: ${characterType.charAt(0).toUpperCase() + characterType.slice(1)} character`)

  // PHYSICAL APPEARANCE - DETAILED
  sections.push('\n**VISUAL APPEARANCE:**')
  if (physicalDescription) {
    sections.push(physicalDescription)
  }

  // PERSONALITY & ESSENCE
  sections.push('\n**ESSENCE & PERSONALITY:**')
  if (personality) {
    sections.push(personality)
  }

  // BACKGROUND & CONTEXT
  sections.push('\n**HISTORICAL & CONTEXTUAL BACKGROUND:**')
  if (background) {
    sections.push(background)
  }
  if (birthPlace) {
    sections.push(`Born in: ${birthPlace}`)
  }
  if (birthYear) {
    sections.push(`Birth Year: ${birthYear}`)
  }
  if (deathPlace) {
    sections.push(`Death Place: ${deathPlace}`)
  }
  if (died) {
    sections.push(`Year of Death: ${died}`)
  }

  // PRESENCE & AURA
  sections.push('\n**PRESENCE & DIALOGUE STYLE:**')
  if (dialogueStyle) {
    sections.push(dialogueStyle)
  }

  // OVERALL DESCRIPTION
  sections.push('\n**OVERALL CHARACTERIZATION:**')
  if (description) {
    sections.push(description)
  }

  // GROUPS/AFFILIATIONS
  if (groups && Array.isArray(groups) && groups.length > 0) {
    sections.push('\n**AFFILIATIONS & GROUPS:**')
    sections.push(groups.join(', '))
  }

  // ART DIRECTION
  sections.push('\n**ART DIRECTION FOR AI IMAGE GENERATION:**')
  sections.push('- Masterful lighting that highlights character presence')
  sections.push('- Dramatic, cinematic composition')
  sections.push('- Rich, saturated colors appropriate to character type')
  sections.push('- Ultra-detailed, photorealistic or fantastical rendering as appropriate')
  sections.push('- Convey character\'s emotional essence and narrative significance')
  sections.push('- Professional illustration quality suitable for book cover or promotional material')

  return sections.join('\n')
}

async function populateCharacterPrompts() {
  try {
    console.log('🚀 Starting character AI prompt population...\n')

    // Get all characters with image details
    const charactersWithDetails = await db
      .select({ character: characters, imageDetails: imageDetailsForAiGeneration })
      .from(characters)
      .innerJoin(imageDetailsForAiGeneration, eq(characters.id, imageDetailsForAiGeneration.characterId))

    console.log(`📖 Found ${charactersWithDetails.length} characters to update`)

    let updated = 0
    let skipped = 0

    for (const record of charactersWithDetails) {
      const character = record.character

      // Skip if no meaningful data
      if (!character.physicalDescription && !character.personality && !character.description) {
        console.log(`⏭️  ${character.name} - insufficient data`)
        skipped++
        continue
      }

      console.log(`📝 Populating AI prompt for: ${character.name}`)

      // Generate comprehensive prompt
      const aiPrompt = generateComprehensivePrompt(character)

      // Update character with AI prompt
      await db
        .update(characters)
        .set({
          aiPrompt: aiPrompt,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(characters.id, character.id))

      console.log(`  ✅ Updated: ${character.name}`)
      updated++
    }

    console.log(`\n✅ Character AI prompt population completed!`)
    console.log(`📊 Summary:`)
    console.log(`   Updated: ${updated}`)
    console.log(`   Skipped: ${skipped}`)
    console.log(`   Total: ${updated + skipped}`)

  } catch (error) {
    console.error('❌ Error populating character prompts:', error)
    throw error
  }
}

async function main() {
  try {
    await populateCharacterPrompts()
  } catch (error) {
    console.error('Failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

main()

export default main
