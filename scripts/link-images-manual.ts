import fs from 'fs'
import path from 'path'
import { db } from '@/lib/db'
import { characters } from '@/lib/schema'
import { eq } from 'drizzle-orm'

// Manual mapping of image filenames to character slugs
const imageMapping: Record<string, string> = {
  'dante-alighieri': 'Dante-Alighieri',
  'francisco-petrarch': 'Francisco-Petrarch',
  'giovanna-de-sade': 'Giovanna-e-Sade',
  'madonna-oriente': 'Madonna-Oriente',
  'novella-dandrea': 'Novella-d-Andrea',
  'roger-de-flor': 'Roger-de-lor',
}

async function linkCharacterImages() {
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'characters')
  
  // Get all image files
  const imageFiles = fs.readdirSync(imagesDir)
  
  console.log(`Found ${imageFiles.length} character images`)
  
  // Group images by character name (prefix before timestamp)
  const imagesByCharacter = new Map<string, string[]>()
  
  imageFiles.forEach(filename => {
    // Extract character name from filename (remove timestamp and extension)
    const match = filename.match(/^(.+?)-\d+\.(jpg|png|jpeg)$/i)
    if (match) {
      const characterName = match[1]
      if (!imagesByCharacter.has(characterName)) {
        imagesByCharacter.set(characterName, [])
      }
      imagesByCharacter.get(characterName)!.push(filename)
    }
  })
  
  console.log(`Organized images for ${imagesByCharacter.size} characters\n`)
  
  // For each character, get the most recent image
  const imagesToLink = new Map<string, string>()
  
  imagesByCharacter.forEach((files, characterName) => {
    const sorted = files.sort().reverse()
    imagesToLink.set(characterName, sorted[0])
  })
  
  // Update using the manual mapping
  let updateCount = 0
  
  for (const [imageName, imageFile] of imagesToLink) {
    try {
      const slug = imageMapping[imageName]
      
      if (!slug) {
        console.log(`✗ No mapping found for image: ${imageName}`)
        continue
      }
      
      // Get the character first to verify it exists
      const character = await db.select({
        id: characters.id,
        name: characters.name,
        slug: characters.slug
      }).from(characters).where(eq(characters.slug, slug))
      
      if (character.length === 0) {
        console.log(`✗ Could not find character with slug: ${slug}`)
        continue
      }
      
      // Update the character
      await db
        .update(characters)
        .set({
          imageUrl: `/images/characters/${imageFile}`,
          updatedAt: new Date()
        })
        .where(eq(characters.slug, slug))
      
      console.log(`✓ Updated ${character[0].name} (${slug})`)
      console.log(`  Image: ${imageFile}`)
      updateCount++
    } catch (error) {
      console.error(`✗ Error updating ${imageName}:`, error)
    }
  }
  
  console.log(`\n✅ Successfully linked ${updateCount} character images`)
}

linkCharacterImages().catch(console.error)
