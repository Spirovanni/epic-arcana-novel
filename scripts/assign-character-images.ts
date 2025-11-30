import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { characters } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

/**
 * Assign pre-selected images to characters
 * This script matches the images we have in /public/images/characters/ to their respective characters
 */
async function assignCharacterImages() {
  try {
    console.log('🖼️  Starting character image assignment...');

    const imageAssignments = [
      { characterName: 'Dante Alighieri', imageUrl: '/images/characters/dante-alighieri-1752537732606.jpg' },
      { characterName: 'Francisco Petrarch', imageUrl: '/images/characters/francisco-petrarch-1752462389558.png' },
      { characterName: 'Giovanna De Sade', imageUrl: '/images/characters/giovanna-de-sade-1752548827368.png' },
      { characterName: 'Madonna Oriente', imageUrl: '/images/characters/madonna-oriente-1752471344613.png' },
      { characterName: 'Novella d\'Andrea', imageUrl: '/images/characters/novella-dandrea-1752546227104.png' },
      { characterName: 'Roger de Flor', imageUrl: '/images/characters/roger-de-flor-1752540731273.png' },
    ];

    let assignedCount = 0;
    let failedCount = 0;

    for (const assignment of imageAssignments) {
      try {
        console.log(`  🔗 Assigning image to: ${assignment.characterName}`);

        const result = await db
          .update(characters)
          .set({
            imageUrl: assignment.imageUrl,
            updatedAt: new Date()
          })
          .where(eq(characters.name, assignment.characterName))
          .returning({
            id: characters.id,
            name: characters.name,
            imageUrl: characters.imageUrl,
          });

        if (result.length > 0) {
          console.log(`     ✓ Assigned: ${assignment.imageUrl}`);
          assignedCount++;
        } else {
          console.error(`     ✗ Character not found: ${assignment.characterName}`);
          failedCount++;
        }
      } catch (error) {
        console.error(`     ✗ Failed to assign image to ${assignment.characterName}:`, error);
        failedCount++;
      }
    }

    console.log(`\n✅ Image assignment complete!`);
    console.log(`   ✓ Assigned: ${assignedCount}`);
    console.log(`   ✗ Failed: ${failedCount}`);

    // Verify the assignments
    const verification = await db
      .select({
        name: characters.name,
        imageUrl: characters.imageUrl,
      })
      .from(characters)
      .where(eq(characters.name, 'Francisco Petrarch'));

    if (verification.length > 0 && verification[0].imageUrl) {
      console.log(`\n✅ Verification successful: Francisco Petrarch has image assigned`);
    } else {
      console.warn(`⚠️  Verification failed: Francisco Petrarch does not have image assigned`);
    }

  } catch (error) {
    console.error('❌ Image assignment failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

assignCharacterImages();
