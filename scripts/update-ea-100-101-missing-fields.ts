import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Updates EA-100 and EA-101 scenes with missing fields:
 * - location
 * - pov (fix format to "3rd Person Limited (Character)")
 * - narrative_function
 */

async function main() {
  console.log('🔧 Updating EA-100 and EA-101 scenes with missing fields...\n');

  // Truncate helper
  const truncate = (str: string, maxLen: number) =>
    str.length > maxLen ? str.substring(0, maxLen) : str;

  // EA-100 Scene Updates
  console.log('📖 Updating EA-100 scenes...\n');

  const ea100Updates = [
    {
      sceneNumber: 1,
      pov: '3rd Person Limited (Francisco)',
      location: 'The Obsidian Chamber - Dagon\'s Manifestation Space',
      narrativeFunction: 'The Supreme Temptation.',
    },
    {
      sceneNumber: 2,
      pov: '3rd Person Limited (Francisco)',
      location: 'The Obsidian Chamber - Memory Manifestation',
      narrativeFunction: 'The Resistance Through Connection.',
    },
    {
      sceneNumber: 3,
      pov: '3rd Person Limited (Francisco)',
      location: 'The Obsidian Chamber - Council Threshold',
      narrativeFunction: 'The Proof of Character.',
    },
  ];

  for (const update of ea100Updates) {
    const [scene] = await db
      .select()
      .from(scenes)
      .where(
        and(
          eq(scenes.chapterUniqueIdentifier, 'EA-100'),
          eq(scenes.sceneNumber, update.sceneNumber)
        )
      )
      .limit(1);

    if (!scene) {
      console.log(`   ⚠️  Scene ${update.sceneNumber} not found`);
      continue;
    }

    await db
      .update(scenes)
      .set({
        pov: update.pov,
        location: update.location,
        narrativeFunction: update.narrativeFunction,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`   ✅ Updated Scene ${update.sceneNumber}: Added POV, location, narrative_function`);
  }

  // EA-101 Scene Updates
  console.log('\n📖 Updating EA-101 scenes...\n');

  const ea101Updates = [
    {
      sceneNumber: 1,
      pov: '3rd Person Limited (Francisco)',
      location: 'The Garden of Witnesses - Threshold Outside the Chamber',
      narrativeFunction: 'The Community Witness.',
    },
    {
      sceneNumber: 2,
      pov: '3rd Person Limited (Zara)',
      location: 'The Hall of Solidarity - Circle Chamber',
      narrativeFunction: 'The Empathic Dialogue.',
    },
    {
      sceneNumber: 3,
      pov: '3rd Person Limited (Francisco)',
      location: 'The Hall of Solidarity - Dyad Threshold',
      narrativeFunction: 'The Partnership Forged.',
    },
  ];

  for (const update of ea101Updates) {
    const [scene] = await db
      .select()
      .from(scenes)
      .where(
        and(
          eq(scenes.chapterUniqueIdentifier, 'EA-101'),
          eq(scenes.sceneNumber, update.sceneNumber)
        )
      )
      .limit(1);

    if (!scene) {
      console.log(`   ⚠️  Scene ${update.sceneNumber} not found`);
      continue;
    }

    await db
      .update(scenes)
      .set({
        pov: update.pov,
        location: update.location,
        narrativeFunction: update.narrativeFunction,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`   ✅ Updated Scene ${update.sceneNumber}: Added POV, location, narrative_function`);
  }

  console.log('\n✅ Update complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
