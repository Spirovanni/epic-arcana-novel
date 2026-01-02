import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Updates EA-101, EA-102, and EA-104 scenes in database with enhanced fields
 */

const enhancements = {
  100: null, // Skip 100
  101: {
    title: 'Mutual Respect',
    scenes: [
      {
        scene_number: 1,
        title: 'Community Witness',
        location: 'Obsidian Chamber Courtyard, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrativeFunction: 'Reversal establishing community support after individual ordeal'
      },
      {
        scene_number: 2,
        title: 'Circles of Trust',
        location: 'Hall of Solidarity, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrativeFunction: 'Deepening bonds through structured vulnerability and shared testimony'
      },
      {
        scene_number: 3,
        title: 'The True Dyad',
        location: 'Hall of Solidarity, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrativeFunction: 'Partnership formalization establishing foundation for future cosmic challenges'
      }
    ]
  },
  102: {
    title: 'Known Options',
    scenes: [
      {
        scene_number: 1,
        title: 'Seven Chalices',
        location: 'Francisco\'s Chambers, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrativeFunction: 'Presenting sophisticated temptation requiring discernment and strategic caution'
      },
      {
        scene_number: 2,
        title: 'The Hidden Costs',
        location: 'Council Chamber, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrativeFunction: 'Analytical evaluation revealing trade-offs beneath appealing options'
      },
      {
        scene_number: 3,
        title: 'The Fourth Path',
        location: 'Chamber of Echoes, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrativeFunction: 'Creative synthesis transcending false dilemmas through imaginative solution'
      }
    ]
  },
  103: null, // Skip 103 - already has enhanced fields
  104: {
    title: 'Empire',
    scenes: [
      {
        scene_number: 1,
        title: 'Ruins of Achievement',
        location: 'Destroyed Community Quarter, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrativeFunction: 'Devastating loss testing character and revealing true nature of leadership'
      },
      {
        scene_number: 2,
        title: 'Rising From Ashes',
        location: 'Makeshift Assembly Point, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrativeFunction: 'Inspirational revival demonstrating leadership through hope in darkness'
      }
    ]
  }
};

async function main() {
  console.log('🔄 Updating scenes in database with enhanced fields...\n');

  for (const [chapterNumStr, chapterData] of Object.entries(enhancements)) {
    const chapterNum = parseInt(chapterNumStr);

    if (!chapterData) {
      console.log(`⏭️  Skipping chapter ${chapterNum}`);
      continue;
    }

    console.log(`📖 Chapter ${chapterNum}: ${chapterData.title}`);

    // Find the chapter
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, chapterNum))
      .limit(1);

    if (!chapter) {
      console.log(`   ❌ Chapter ${chapterNum} not found in database\n`);
      continue;
    }

    // Update each scene
    for (const sceneData of chapterData.scenes) {
      const [existingScene] = await db
        .select()
        .from(scenes)
        .where(
          and(
            eq(scenes.chapterId, chapter.id),
            eq(scenes.sceneNumber, sceneData.scene_number)
          )
        )
        .limit(1);

      if (!existingScene) {
        console.log(`   ⚠️  Scene ${sceneData.scene_number} not found`);
        continue;
      }

      await db
        .update(scenes)
        .set({
          title: sceneData.title,
          location: sceneData.location,
          timeline_variant: sceneData.timeline_variant,
          narrativeFunction: sceneData.narrativeFunction
        })
        .where(eq(scenes.id, existingScene.id));

      console.log(`   ✅ Scene ${sceneData.scene_number}: "${sceneData.title}"`);
      console.log(`      Location: ${sceneData.location}`);
      console.log(`      Timeline Variant: ${sceneData.timeline_variant}`);
      console.log(`      Narrative Function: ${sceneData.narrativeFunction}`);
    }

    console.log('');
  }

  console.log('✅ Database update complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
