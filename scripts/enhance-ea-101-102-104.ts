import * as fs from 'fs';
import * as path from 'path';

/**
 * Enhances EA-101, EA-102, and EA-104 scenes with:
 * - Descriptive titles
 * - location field
 * - timeline_variant field
 * - narrative_function field
 */

const enhancements = {
  'EA-101': {
    scenes: [
      {
        scene_number: 1,
        title: 'Community Witness',
        location: 'Obsidian Chamber Courtyard, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrative_function: 'Reversal establishing community support after individual ordeal'
      },
      {
        scene_number: 2,
        title: 'Circles of Trust',
        location: 'Hall of Solidarity, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrative_function: 'Deepening bonds through structured vulnerability and shared testimony'
      },
      {
        scene_number: 3,
        title: 'The True Dyad',
        location: 'Hall of Solidarity, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrative_function: 'Partnership formalization establishing foundation for future cosmic challenges'
      }
    ]
  },
  'EA-102': {
    scenes: [
      {
        scene_number: 1,
        title: 'Seven Chalices',
        location: 'Francisco\'s Chambers, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrative_function: 'Presenting sophisticated temptation requiring discernment and strategic caution'
      },
      {
        scene_number: 2,
        title: 'The Hidden Costs',
        location: 'Council Chamber, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrative_function: 'Analytical evaluation revealing trade-offs beneath appealing options'
      },
      {
        scene_number: 3,
        title: 'The Fourth Path',
        location: 'Chamber of Echoes, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrative_function: 'Creative synthesis transcending false dilemmas through imaginative solution'
      }
    ]
  },
  'EA-104': {
    scenes: [
      {
        scene_number: 1,
        title: 'Ruins of Achievement',
        location: 'Destroyed Community Quarter, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrative_function: 'Devastating loss testing character and revealing true nature of leadership'
      },
      {
        scene_number: 2,
        title: 'Rising From Ashes',
        location: 'Makeshift Assembly Point, Bologna',
        timeline_variant: 'Baseline Reality (Francisco\'s home timeline)',
        narrative_function: 'Inspirational revival demonstrating leadership through hope in darkness'
      }
    ]
  }
};

function findAndEnhanceChapter(data: any, eaId: string, enhancements: any): boolean {
  if (!data || typeof data !== 'object') return false;

  if (data.id === eaId && data.scenes) {
    console.log(`\n✨ Enhancing ${eaId}: ${data.specific_task_group_title}`);

    const sceneEnhancements = enhancements[eaId].scenes;

    for (let i = 0; i < data.scenes.length; i++) {
      const scene = data.scenes[i];
      const enhancement = sceneEnhancements.find((e: any) => e.scene_number === scene.scene_number);

      if (enhancement) {
        scene.title = enhancement.title;
        scene.location = enhancement.location;
        scene.timeline_variant = enhancement.timeline_variant;
        scene.narrative_function = enhancement.narrative_function;

        console.log(`   ✅ Scene ${scene.scene_number}: "${enhancement.title}"`);
      }
    }

    return true;
  }

  // Recursively search
  for (const key of Object.keys(data)) {
    if (findAndEnhanceChapter(data[key], eaId, enhancements)) {
      return true;
    }
  }

  return false;
}

async function main() {
  console.log('🎨 Enhancing EA-101, EA-102, and EA-104...\n');

  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');

  console.log('📖 Reading outline file...');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  // Enhance each chapter
  const chaptersToEnhance = ['EA-101', 'EA-102', 'EA-104'];
  let enhancedCount = 0;

  for (const eaId of chaptersToEnhance) {
    if (findAndEnhanceChapter(outline, eaId, enhancements)) {
      enhancedCount++;
    } else {
      console.log(`   ⚠️  ${eaId} not found`);
    }
  }

  if (enhancedCount > 0) {
    console.log(`\n💾 Writing enhanced outline back to file...`);
    fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
    console.log(`✅ Successfully enhanced ${enhancedCount} chapters!`);
  } else {
    console.log('\n❌ No chapters were enhanced');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
