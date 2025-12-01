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

// Function to generate image details from character data
function generateImageDetails(character: any) {
  const {
    name,
    personality,
    background,
    physical_description: physicalDescription,
    dialogue_style: dialogueStyle,
    groups,
    characterType,
    role,
    story_age: storyAge,
  } = character

  // Extract key attributes for image generation
  const buildPromptFromDescription = (): string => {
    const parts = [
      physicalDescription || '',
      dialogueStyle ? `Voice/Presence: ${dialogueStyle.substring(0, 100)}` : '',
      personality ? `Personality: ${personality.substring(0, 100)}` : '',
    ].filter(Boolean)

    return parts.join('\n')
  }

  const generationPrompt = buildPromptFromDescription()

  // Extract specific visual attributes
  let clothing = ''
  let hair = ''
  let eyes = ''
  let build = ''
  let distinguishingMarks = ''

  if (physicalDescription) {
    const desc = physicalDescription.toLowerCase()

    // Extract hair information
    if (desc.includes('hair')) {
      const hairMatch = physicalDescription.match(/(?:hair[:\s]+)([^,;.]*)/i)
      if (hairMatch) hair = hairMatch[1].trim()
    }

    // Extract eye information
    if (desc.includes('eye')) {
      const eyeMatch = physicalDescription.match(/(?:eyes?[:\s]+)([^,;.]*)/i)
      if (eyeMatch) eyes = eyeMatch[1].trim()
    }

    // Extract clothing information
    if (desc.includes('cloth') || desc.includes('robe') || desc.includes('attire')) {
      const clothMatch = physicalDescription.match(
        /(?:cloth|robe|attire|wear|dress)[^,;.]*(?:,|;|\.)/i
      )
      if (clothMatch) clothing = clothMatch[0].trim()
    }

    // Extract build information
    if (desc.includes('build') || desc.includes('frame') || desc.includes('tall')) {
      const buildMatch = physicalDescription.match(
        /(?:build|frame|tall|lean|sturdy)[^,;.]*/i
      )
      if (buildMatch) build = buildMatch[0].trim()
    }

    // Extract distinguishing marks
    if (desc.includes('scar') || desc.includes('mark') || desc.includes('tattoo')) {
      const marksMatch = physicalDescription.match(
        /(?:scar|mark|tattoo)[^;.]*(?:;|\.)/i
      )
      if (marksMatch) distinguishingMarks = marksMatch[0].trim()
    }
  }

  // Determine mood and atmosphere
  let mood = 'contemplative'
  if (characterType === 'mythic') {
    mood = 'ethereal, divine'
  } else if (characterType === 'fantasy') {
    mood = 'mysterious, otherworldly'
  } else if (characterType === 'historical') {
    mood = 'scholarly, introspective'
  }

  // Determine art style based on character type
  let artStyle = 'digital painting, photorealistic'
  if (characterType === 'mythic') {
    artStyle = 'ethereal digital art, celestial lighting'
  } else if (characterType === 'fantasy') {
    artStyle = 'fantasy illustration, dramatic lighting'
  }

  // Set color palette based on character role
  let colorPalette = 'rich, saturated colors'
  if (role === 'Antagonist') {
    colorPalette = 'dark, dramatic colors with deep reds and purples'
  } else if (role === 'Protagonist') {
    colorPalette = 'warm, golden tones with complementary highlights'
  } else if (characterType === 'mythic') {
    colorPalette = 'iridescent, luminous colors, otherworldly hues'
  }

  return {
    physical_appearance: physicalDescription || '',
    clothing: clothing || physicalDescription?.includes('robe') ? 'Mystical robes' : '',
    hair: hair || 'detailed hair rendering',
    eyes: eyes || 'expressive eyes',
    build: build || 'undefined',
    distinguishing_marks: distinguishingMarks || '',
    mood,
    expression: 'serene, knowing',
    pose: 'dignified, commanding',
    lighting: characterType === 'mythic' ? 'ethereal, divine lighting' : 'dramatic studio lighting',
    color_palette: colorPalette,
    art_style: artStyle,
    composition: 'centered, portrait focus, three-quarter view',
    atmosphere: 'mystical, charged with energy',
    detail_level: 'high',
    generation_prompt: generationPrompt,
    negative_prompt:
      'blurry, low quality, distorted, ugly, deformed, poorly drawn, bad anatomy',
    aspect_ratio: '3:4',
    scale: '10',
    quality_level: '8k',
    mood_keywords: `${mood}, ${role}`,
    style_references: artStyle,
  }
}

async function populateImageDetails() {
  try {
    console.log('🚀 Starting image details population...')

    // Get all characters
    const allCharacters = await db.select().from(characters)

    console.log(`📖 Found ${allCharacters.length} characters to process`)

    let created = 0
    let skipped = 0

    for (const character of allCharacters) {
      // Check if image details already exist
      const existing = await db
        .select()
        .from(imageDetailsForAiGeneration)
        .where(eq(imageDetailsForAiGeneration.characterId, character.id))
        .limit(1)

      if (existing.length > 0) {
        console.log(`⏭️  ${character.name} - already has image details`)
        skipped++
        continue
      }

      // Skip if no physical description
      if (!character.physicalDescription && !character.personality) {
        console.log(`⏭️  ${character.name} - insufficient data`)
        skipped++
        continue
      }

      console.log(`📝 Creating image details for: ${character.name}`)

      const imageDetails = generateImageDetails(character)

      await db.insert(imageDetailsForAiGeneration).values({
        characterId: character.id,
        physicalAppearance: imageDetails.physical_appearance,
        clothing: imageDetails.clothing,
        hair: imageDetails.hair,
        eyes: imageDetails.eyes,
        build: imageDetails.build,
        distinguishingMarks: imageDetails.distinguishing_marks,
        mood: imageDetails.mood,
        expression: imageDetails.expression,
        pose: imageDetails.pose,
        lighting: imageDetails.lighting,
        colorPalette: imageDetails.color_palette,
        artStyle: imageDetails.art_style,
        composition: imageDetails.composition,
        atmosphere: imageDetails.atmosphere,
        detailLevel: imageDetails.detail_level,
        generationPrompt: imageDetails.generation_prompt,
        negativePrompt: imageDetails.negative_prompt,
        aspectRatio: imageDetails.aspect_ratio,
        scale: imageDetails.scale,
        qualityLevel: imageDetails.quality_level,
        moodKeywords: imageDetails.mood_keywords,
        styleReferences: imageDetails.style_references,
      })

      created++
    }

    console.log(`\n✅ Image details population completed!`)
    console.log(`📊 Summary:`)
    console.log(`   Created: ${created}`)
    console.log(`   Skipped: ${skipped}`)
    console.log(`   Total: ${created + skipped}`)

  } catch (error) {
    console.error('❌ Error populating image details:', error)
    throw error
  }
}

async function main() {
  try {
    await populateImageDetails()
  } catch (error) {
    console.error('Failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

main()

export default main
