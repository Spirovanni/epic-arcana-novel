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

// Comprehensive AI prompt generator
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

// Optimized prompt for AI generation (concise but detailed)
function generateOptimizedAiPrompt(character: any, imageDetails: any): string {
  const {
    name,
    characterType,
    personality,
    physicalDescription,
    dialogueStyle,
    role,
  } = character

  const {
    artStyle = 'digital painting',
    colorPalette = 'rich colors',
    lighting = 'dramatic lighting',
    mood = 'intense',
  } = imageDetails || {}

  const parts: string[] = [
    `A ${characterType || 'mystical'} character portrait of ${name}`,
  ]

  // Add physical description if available
  if (physicalDescription) {
    const shortDesc = physicalDescription.substring(0, 150)
    parts.push(shortDesc + (physicalDescription.length > 150 ? '...' : ''))
  }

  // Add personality essence
  if (personality) {
    const essence = personality.substring(0, 100)
    parts.push(essence + (personality.length > 100 ? '...' : ''))
  }

  // Add style parameters
  parts.push(`${artStyle}, ${lighting}, ${colorPalette}`)

  // Add mood
  if (mood) {
    parts.push(`Mood: ${mood}`)
  }

  // Add role context
  if (role) {
    parts.push(`Role: ${role}`)
  }

  return parts.join('. ')
}

// Midjourney-specific prompt
function generateMidjourneyPrompt(character: any, imageDetails: any): string {
  const {
    name,
    characterType,
    physicalDescription,
    personality,
    dialogueStyle,
  } = character

  const {
    artStyle = 'digital art',
    colorPalette = 'vibrant',
    mood = 'ethereal',
  } = imageDetails || {}

  const prompts: string[] = [
    `${name}, ${characterType} character`,
  ]

  if (physicalDescription) {
    const shortDesc = physicalDescription.match(/^[^.!?]+/)?.[0] || physicalDescription.substring(0, 80)
    prompts.push(shortDesc)
  }

  prompts.push(`${mood} ${artStyle}`)
  prompts.push(`color palette: ${colorPalette}`)

  if (personality) {
    const shortPersonality = personality.substring(0, 60)
    prompts.push(`essence: ${shortPersonality}...`)
  }

  prompts.push('--ar 3:4 --s 750 --q 2')

  return prompts.join(', ')
}

// OpenArt-specific prompt
function generateOpenArtPrompt(character: any, imageDetails: any): string {
  const {
    name,
    characterType,
    physicalDescription,
    personality,
    role,
  } = character

  const {
    artStyle = 'professional digital painting',
    colorPalette = 'rich',
    lighting = 'professional lighting',
  } = imageDetails || {}

  const sections: string[] = [
    `Portrait of ${name}`,
    physicalDescription ? physicalDescription.substring(0, 120) : `${characterType} character`,
    `${artStyle}`,
    `${lighting}`,
    `Color palette: ${colorPalette}`,
    role ? `Character: ${role}` : '',
    'ultra detailed, professional quality, 8k resolution',
    'cinematic composition',
  ]

  return sections.filter(Boolean).join(', ')
}

async function generateAndUploadPrompts() {
  try {
    console.log('🚀 Starting AI prompt generation and upload...\n')

    // Get all characters
    const allCharacters = await db.select().from(characters)

    console.log(`📖 Found ${allCharacters.length} characters to process`)

    let updated = 0
    let skipped = 0

    for (const character of allCharacters) {
      // Skip if no meaningful data
      if (!character.physicalDescription && !character.personality && !character.description) {
        console.log(`⏭️  ${character.name} - insufficient data`)
        skipped++
        continue
      }

      console.log(`\n📝 Processing: ${character.name}`)

      // Get existing image details
      const existingDetails = await db
        .select()
        .from(imageDetailsForAiGeneration)
        .where(eq(imageDetailsForAiGeneration.characterId, character.id))
        .limit(1)

      if (existingDetails.length === 0) {
        console.log(`  ⚠️  No image details found, skipping`)
        skipped++
        continue
      }

      const imageDetails = existingDetails[0]

      // Generate different prompt types
      const comprehensivePrompt = generateComprehensivePrompt(character)
      const optimizedPrompt = generateOptimizedAiPrompt(character, imageDetails)
      const midjourneyPrompt = generateMidjourneyPrompt(character, imageDetails)
      const openArtPrompt = generateOpenArtPrompt(character, imageDetails)

      // Combine into a comprehensive generation prompt
      const combinedPrompt = `COMPREHENSIVE AI GENERATION PROMPT FOR: ${character.name}\n\n${comprehensivePrompt}`

      console.log(`  ✏️  Updating generation prompt...`)

      // Update the image details with the comprehensive prompt
      await db
        .update(imageDetailsForAiGeneration)
        .set({
          generationPrompt: combinedPrompt,
          // Also store optimized versions in technical parameters
          technicalParameters: {
            optimizedPrompt,
            midjourneyPrompt,
            openArtPrompt,
            characterName: character.name,
            characterType: character.characterType,
          } as any,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(imageDetailsForAiGeneration.characterId, character.id))

      console.log(`  ✅ Updated: ${character.name}`)
      updated++
    }

    console.log(`\n✅ AI prompt generation and upload completed!`)
    console.log(`📊 Summary:`)
    console.log(`   Updated: ${updated}`)
    console.log(`   Skipped: ${skipped}`)
    console.log(`   Total: ${updated + skipped}`)

  } catch (error) {
    console.error('❌ Error generating and uploading prompts:', error)
    throw error
  }
}

async function main() {
  try {
    await generateAndUploadPrompts()
  } catch (error) {
    console.error('Failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

main()

export default main
