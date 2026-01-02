import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Updates EA-100 and EA-101 scenes with timeline and emotion fields
 */

async function main() {
  console.log('🔧 Updating EA-100 and EA-101 scenes with timeline and emotion fields...\n');

  // EA-100 Scene Updates
  console.log('📖 Updating EA-100 scenes...\n');

  const ea100Updates = [
    {
      sceneNumber: 1,
      timelineDate: '11/15/1347 - The Midpoint Hour',
      timelineVariant: 'Prime Timeline - Ordeal Threshold',
      coreEmotion: 'Desire warring with dread',
      sceneTone: 'Seductive and terrifying, beautiful and corrupting',
    },
    {
      sceneNumber: 2,
      timelineDate: '11/15/1347 - The Hour of Choice',
      timelineVariant: 'Prime Timeline - Resistance Point',
      coreEmotion: 'Clarity emerging from confusion, love overpowering desire',
      sceneTone: 'Intimate and defiant with spiritual weight',
    },
    {
      sceneNumber: 3,
      timelineDate: '11/15/1347 - The Hour of Proof',
      timelineVariant: 'Prime Timeline - Character Confirmation',
      coreEmotion: 'Triumphant clarity and humbled gratitude',
      sceneTone: 'Victorious and transformative with cosmic significance',
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
        timeline_date: update.timelineDate,
        timeline_variant: update.timelineVariant,
        core_emotion: update.coreEmotion,
        scene_tone: update.sceneTone,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`   ✅ Updated Scene ${update.sceneNumber}: Added timeline and emotion fields`);
  }

  // EA-101 Scene Updates
  console.log('\n📖 Updating EA-101 scenes...\n');

  const ea101Updates = [
    {
      sceneNumber: 1,
      timelineDate: '11/15/1347 - Post-Ordeal Dusk',
      timelineVariant: 'Prime Timeline - Community Convergence',
      coreEmotion: 'Overwhelmed gratitude and belonging',
      sceneTone: 'Tender and celebratory with spiritual intimacy',
    },
    {
      sceneNumber: 2,
      timelineDate: '11/15/1347 - Evening of Solidarity',
      timelineVariant: 'Prime Timeline - Trust Deepening',
      coreEmotion: 'Reverent witnessing and deepening connection',
      sceneTone: 'Sacred and intimate with collective power',
    },
    {
      sceneNumber: 3,
      timelineDate: '11/15/1347 - Night of Recognition',
      timelineVariant: 'Prime Timeline - Partnership Confirmation',
      coreEmotion: 'Profound trust and empowered partnership',
      sceneTone: 'Triumphant and transformative with relational depth',
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
        timeline_date: update.timelineDate,
        timeline_variant: update.timelineVariant,
        core_emotion: update.coreEmotion,
        scene_tone: update.sceneTone,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`   ✅ Updated Scene ${update.sceneNumber}: Added timeline and emotion fields`);
  }

  console.log('\n✅ Update complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
