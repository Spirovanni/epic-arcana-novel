import fs from 'fs'
import path from 'path'
import { db } from '@/lib/db'
import { characters } from '@/lib/schema'
import { sql } from 'drizzle-orm'

async function linkCharacterImages() {
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'characters')
  
  // Get all image files
  const imageFiles = fs.readdirSync(imagesDir)
  
  console.log(`Found ${imageFiles.length} character images`)
  
  // Group images by character name (prefix before timestamp)
  const imagesByCharacter = new Map<string, string[]>()
  
  imageFiles.forEach(filename => {
    // Extract character name from filename (remove timestamp and extension)
    // e.g., "dante-alighieri-1752537732606.jpg" -> "dante-alighieri"
    const match = filename.match(/^(.+?)-\d+\.(jpg|png|jpeg)$/i)
    if (match) {
      const characterName = match[1]
      if (!imagesByCharacter.has(characterName)) {
        imagesByCharacter.set(characterName, [])
      }
      imagesByCharacter.get(characterName)!.push(filename)
    }
  })
  
  console.log(`Organized images for ${imagesByCharacter.size} characters`)
  
  // For each character, get the most recent image (by timestamp)
  const imagesToLink = new Map<string, string>()
  
  imagesByCharacter.forEach((files, characterName) => {
    // Sort by timestamp (descending) and take the latest
    const sorted = files.sort().reverse()
    imagesToLink.set(characterName, sorted[0])
  })
  
  // Now match with characters in database and update imageUrl
  let updateCount = 0
  
  for (const [characterName, imageFile] of imagesToLink) {
    try {
      // Try to find character by slug (which is usually name in lowercase with hyphens)
      const slug = characterName.toLowerCase().replace(/\s+/g, '-')
      
      const result = await db
        .update(characters)
        .set({
          imageUrl: `/images/characters/${imageFile}`,
          updatedAt: new Date()
        })
        .where(sql`LOWER(slug) = LOWER(${slug})`)
        .returning({ id: characters.id, name: characters.name, slug: characters.slug })
      
      if (result.length > 0) {
        console.log(`✓ Updated ${result[0].name} (${slug}) with image: ${imageFile}`)
        updateCount++
      } else {
        console.log(`✗ Could not find character with slug: ${slug}`)
      }
    } catch (error) {
      console.error(`Error updating character ${characterName}:`, error)
    }
  }
  
  console.log(`\nSuccessfully linked ${updateCount} character images`)
}

linkCharacterImages().catch(console.error)
