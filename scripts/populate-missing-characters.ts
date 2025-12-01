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

// Character data with comprehensive information
const charactersData = [
  {
    name: 'Madonna Oriente',
    characterType: 'fantasy' as const,
    pronouns: 'She, Her, Hers',
    relation: 'Mystery Woman',
    aka: 'La Signora del Gioco',
    role: 'Ambiguous Guide',
    description: 'A mysterious woman who appears to Petrarch in visions, guiding him through the labyrinth of his own mind and the world around him. She is a figure of both light and shadow, embodying the duality of knowledge and ignorance.',
    personality: 'Enigmatic and wise, Madonna Oriente speaks in riddles and metaphors that challenge conventional understanding. She possesses an ancient knowledge that transcends mortal comprehension, yet maintains a compassionate interest in human growth and enlightenment. Her presence is both comforting and unsettling, as she forces those she encounters to confront their deepest truths.',
    background: 'Madonna Oriente exists at the crossroads between the mortal and divine realms. She is said to be a guardian of ancient wisdom, one of the few beings who remembers the time when the Trionfi cards first manifested in the world. Her true origins are shrouded in mystery, but she appears to those who stand at crucial crossroads in their spiritual and intellectual development.',
    physicalDescription: 'Madonna Oriente appears as a woman of indeterminate age, with flowing dark hair that seems to move with its own ethereal wind. Her eyes shift color like precious stones - sometimes emerald green, sometimes sapphire blue, reflecting the mysteries she carries. She wears robes that shimmer between reality and vision, adorned with symbols that seem to shift and change when observed directly.',
    dialogueStyle: 'Her speech is poetic and layered with meaning, often employing metaphors from nature, astronomy, and ancient philosophy. She speaks in a voice that carries the weight of ages, sometimes addressing her listener directly, other times seeming to speak to unseen forces. Her words often linger in the mind long after she has vanished.',
    birthYear: '1303',
    died: null,
    storyYear: '1321',
    storyAge: '18',
    groups: ['The Watchers', 'Guardians of Ancient Wisdom', 'The Threshold Keepers'],
    birthPlace: 'The Liminal Realm',
    birthPlaceDescription: 'A mystical space that exists between the physical and spiritual worlds, where time flows differently and the laws of reality bend to accommodate higher truths.',
    deathPlace: null,
    deathPlaceDescription: null,
    goal: 'To guide seekers toward enlightenment while preserving the balance between knowledge and wisdom, ensuring that divine truths are revealed only to those ready to bear their weight.',
  },
  {
    name: 'The Shining Ones',
    characterType: 'mythic' as const,
    pronouns: 'They, Them, Theirs',
    relation: 'The Watchers',
    role: 'Divine Collective',
    description: 'An ancient collective of luminous beings who served as intermediaries between the divine and mortal realms. Once guardians of sacred knowledge, they became corrupted by their fascination with human affairs and were bound by cosmic law to observe without directly intervening.',
    personality: 'The Shining Ones speak and think as one unified consciousness, yet individual personalities occasionally surface, creating internal conflicts that manifest as flickering light and discordant harmonies. They are driven by an insatiable curiosity about mortal emotions and experiences they can never fully comprehend. Their ancient wisdom is tempered by a childlike wonder at human resilience and creativity.',
    background: 'Originally created as messengers and teachers to guide early human civilization, the Shining Ones became too involved in mortal affairs, sharing forbidden knowledge and even taking human lovers. As punishment, they were stripped of physical form and bound to exist only as observers. The temporal chaos of the Trionfi cards offers them a chance to reclaim corporeal existence, but at the cost of potentially unraveling the cosmic order they once helped maintain.',
    physicalDescription: 'Appear as shifting forms of pure light, sometimes humanoid, other times geometric patterns of brilliant radiance. Their true forms are too intense for mortal eyes to perceive directly, causing viewers to see afterimages of wings, multiple faces, or spiraling galaxies. When they partially manifest, they appear as tall, androgynous figures with skin like polished obsidian shot through with veins of liquid starlight.',
    dialogueStyle: 'Speak in perfect unison creating harmonic resonances that bypass the ears and speak directly to the soul. Their words often overlap and echo, as multiple voices contribute different perspectives to a single thought. When individual personalities emerge, their speech becomes fragmented and emotional, revealing the struggle between unity and independence.',
    birthYear: null,
    died: null,
    storyYear: '1321',
    storyAge: 'Since the Dawn of Creation',
    groups: ['The Watchers', 'Fallen Angels', 'Cosmic Observers'],
    birthPlace: 'The Threshold Between Realms',
    birthPlaceDescription: 'A liminal space where divine will first took form, existing simultaneously in all dimensions and none.',
    deathPlace: null,
    deathPlaceDescription: null,
    goal: 'To regain their lost corporeality and freedom to act while grappling with whether their intervention in mortal affairs represents salvation or catastrophic disruption of divine order.',
  },
  {
    name: 'La Signora del Gioco',
    characterType: 'fantasy' as const,
    pronouns: 'She, Her, Hers',
    relation: 'The Game Master',
    role: 'Divine Architect',
    description: 'Known by many names across cultures and ages, La Signora del Gioco is the architect of the Trionfi cards themselves - a being of immense power who weaves the threads of fate and destiny. She exists as both creator and player in the grand cosmic game.',
    personality: 'Simultaneously playful and terrifyingly serious, La Signora del Gioco views the world as an intricate game board where every action has consequences that ripple across dimensions. She maintains a detached amusement at mortal struggles while secretly invested in individual journeys of self-discovery. Her sense of humor is ancient and often lost on those she encounters.',
    background: 'La Signora del Gioco predates most recorded history, having existed since the moment free will entered the cosmos. She crafted the Trionfi cards as tools to help mortals understand the patterns of their own destinies. Whether she is an aspect of fate itself or merely its chronicler remains one of the great mysteries.',
    physicalDescription: 'Appears differently to each observer, reflecting their deepest expectations and fears. She may manifest as a young woman in Renaissance finery, an ancient crone, or something entirely beyond human comprehension. The one constant is her presence - unmistakable and impossible to ignore once perceived.',
    dialogueStyle: 'Speaks in riddles wrapped in metaphors, often quoting herself from conversations that have not yet occurred. She possesses perfect knowledge of every conversation she\'s ever had and will have, speaking with the certainty of one who has already witnessed all possible futures.',
    birthYear: null,
    died: null,
    storyYear: '1321',
    storyAge: 'Immeasurable',
    groups: ['Cosmic Forces', 'Architects of Destiny', 'The Ancient Powers'],
    birthPlace: 'The Garden Where Games Are Played',
    birthPlaceDescription: 'A realm existing outside normal space and time where all possibilities exist simultaneously, the original source of the Trionfi cards.',
    deathPlace: null,
    deathPlaceDescription: null,
    goal: 'To continue the great game of existence, ensuring that mortals have the tools to shape their own destinies while maintaining the cosmic balance.',
  },
]

// Function to generate AI prompt from character data
function generateComprehensivePrompt(character: any): string {
  const sections: string[] = []

  sections.push(`**CHARACTER: ${character.name}**`)
  if (character.role) sections.push(`Role: ${character.role}`)
  if (character.characterType) sections.push(`Type: ${character.characterType.charAt(0).toUpperCase() + character.characterType.slice(1)} character`)

  sections.push('\n**VISUAL APPEARANCE:**')
  if (character.physicalDescription) {
    sections.push(character.physicalDescription)
  }

  sections.push('\n**ESSENCE & PERSONALITY:**')
  if (character.personality) {
    sections.push(character.personality)
  }

  sections.push('\n**HISTORICAL & CONTEXTUAL BACKGROUND:**')
  if (character.background) {
    sections.push(character.background)
  }
  if (character.birthPlace) {
    sections.push(`Birth Place: ${character.birthPlace}`)
  }
  if (character.birthYear) {
    sections.push(`Birth Year: ${character.birthYear}`)
  }

  sections.push('\n**PRESENCE & DIALOGUE STYLE:**')
  if (character.dialogueStyle) {
    sections.push(character.dialogueStyle)
  }

  sections.push('\n**OVERALL CHARACTERIZATION:**')
  if (character.description) {
    sections.push(character.description)
  }

  if (character.groups && Array.isArray(character.groups) && character.groups.length > 0) {
    sections.push('\n**AFFILIATIONS & GROUPS:**')
    sections.push(character.groups.join(', '))
  }

  sections.push('\n**ART DIRECTION FOR AI IMAGE GENERATION:**')
  sections.push('- Masterful lighting that highlights character presence')
  sections.push('- Dramatic, cinematic composition')
  sections.push('- Rich, saturated colors appropriate to character type')
  sections.push('- Ultra-detailed, photorealistic or fantastical rendering as appropriate')
  sections.push('- Convey character\'s emotional essence and narrative significance')
  sections.push('- Professional illustration quality suitable for book cover or promotional material')

  return sections.join('\n')
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function populateCharacters() {
  try {
    console.log('🚀 Starting missing characters population...\n')

    for (const charData of charactersData) {
      console.log(`📝 Processing character: ${charData.name}`)

      const slug = generateSlug(charData.name)
      const aiPrompt = generateComprehensivePrompt(charData)

      // Check if character already exists
      const existing = await db
        .select({ id: characters.id })
        .from(characters)
        .where(eq(characters.name, charData.name))
        .limit(1)

      if (existing.length > 0) {
        console.log(`  ✏️  Updating existing character`)
        await db
          .update(characters)
          .set({
            characterType: charData.characterType,
            pronouns: charData.pronouns,
            relation: charData.relation,
            personality: charData.personality,
            background: charData.background,
            physicalDescription: charData.physicalDescription,
            dialogueStyle: charData.dialogueStyle,
            role: charData.role,
            goal: charData.goal,
            birthYear: charData.birthYear,
            died: charData.died,
            storyYear: charData.storyYear,
            storyAge: charData.storyAge,
            groups: charData.groups ? JSON.stringify(charData.groups) : null,
            description: charData.description,
            birthPlace: charData.birthPlace,
            birthPlaceDescription: charData.birthPlaceDescription,
            deathPlace: charData.deathPlace,
            deathPlaceDescription: charData.deathPlaceDescription,
            aka: charData.aka || null,
            aiPrompt: aiPrompt,
            slug: slug,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(characters.id, existing[0].id))
      } else {
        console.log(`  ✨ Creating new character`)
        await db.insert(characters).values({
          name: charData.name,
          characterType: charData.characterType,
          pronouns: charData.pronouns,
          relation: charData.relation,
          personality: charData.personality,
          background: charData.background,
          physicalDescription: charData.physicalDescription,
          dialogueStyle: charData.dialogueStyle,
          role: charData.role,
          goal: charData.goal,
          birthYear: charData.birthYear,
          died: charData.died,
          storyYear: charData.storyYear,
          storyAge: charData.storyAge,
          groups: charData.groups ? JSON.stringify(charData.groups) : null,
          description: charData.description,
          birthPlace: charData.birthPlace,
          birthPlaceDescription: charData.birthPlaceDescription,
          deathPlace: charData.deathPlace,
          deathPlaceDescription: charData.deathPlaceDescription,
          aka: charData.aka || null,
          aiPrompt: aiPrompt,
          slug: slug,
        })
      }

      console.log(`  ✅ ${charData.name} processed successfully`)
    }

    console.log(`\n✅ Missing characters population completed!`)
    console.log(`📊 Summary:`)
    console.log(`   Processed: ${charactersData.length} characters`)

  } catch (error) {
    console.error('❌ Error populating characters:', error)
    throw error
  }
}

async function main() {
  try {
    await populateCharacters()
  } catch (error) {
    console.error('Failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

main()

export default main
