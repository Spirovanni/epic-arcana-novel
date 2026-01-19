import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fix "preliminary_scene_focus" column for EA-153 through EA-168
 * Format: "Daughter [action/description] [progression/context]"
 * MAX LENGTH: 255 characters
 */

interface SceneFix {
  chapterNumber: number;
  sceneNumber: number;
  preliminarySceneFocus: string;
}

const fixes: SceneFix[] = [
  // EA-153: Creative Idealism
  {
    chapterNumber: 153,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter discovering creative vulnerability protecting imagination through internal visioning"
  },
  {
    chapterNumber: 153,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter developing mental creative process protecting private writing from extraction"
  },
  {
    chapterNumber: 153,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter accepting isolation cost choosing solitary creativity over exposed collaboration"
  },
  {
    chapterNumber: 153,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter completing creative journey protecting authentic visions despite loneliness price"
  },

  // EA-154: Op-For Planning
  {
    chapterNumber: 154,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter confronting strategic bloodbath discovering uncontested space through opposition thinking"
  },
  {
    chapterNumber: 154,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter developing paradoxical strategy winning where losing through counter-intuitive planning"
  },
  {
    chapterNumber: 154,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter overcoming scenario paralysis choosing decisive action despite uncertainty"
  },
  {
    chapterNumber: 154,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter achieving strategic clarity finding rest enabling decisive opposition planning"
  },

  // EA-155: Exigency Planning
  {
    chapterNumber: 155,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter confronting team betrayal discovering distributed coordination for exigency response"
  },
  {
    chapterNumber: 155,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter developing antifragile systems gaining strength from disorder and stress"
  },
  {
    chapterNumber: 155,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter surviving black swan inundation adapting to unpredictable catastrophic events"
  },
  {
    chapterNumber: 155,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter achieving exigency mastery retaining five cups capacity despite crisis demands"
  },

  // EA-156: Forward Thinking
  {
    chapterNumber: 156,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter escaping innovation trap balancing disruption with sustaining capabilities"
  },
  {
    chapterNumber: 156,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter overcoming speed paralysis choosing decisive action over perfect timing"
  },
  {
    chapterNumber: 156,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter piercing strategic fog gaining clarity despite complexity and uncertainty"
  },
  {
    chapterNumber: 156,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter mastering forward thinking balancing backward reflection, slow deliberation, and ambiguous navigation"
  },

  // EA-157: Inspirational Empathy
  {
    chapterNumber: 157,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter recognizing empathy exploitation protecting emotional boundaries despite connection demands"
  },
  {
    chapterNumber: 157,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter confronting inspirational burnout sustaining energy while uplifting others"
  },
  {
    chapterNumber: 157,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter developing emotional intelligence navigating feelings with awareness and skill"
  },
  {
    chapterNumber: 157,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter reaching empty cup climax achieving inspirational empathy through self-replenishment"
  },

  // EA-158: Self-Reflection
  {
    chapterNumber: 158,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter rescued by silence finding wisdom through withdrawal and contemplation"
  },
  {
    chapterNumber: 158,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter conducting internal examination exploring depths through self-inquiry"
  },
  {
    chapterNumber: 158,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter extinguishing external lantern finding inner light through darkness acceptance"
  },
  {
    chapterNumber: 158,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter completing hermit journey mastering self-reflection through solitary wisdom"
  },

  // EA-159: Stack Wins/Losses
  {
    chapterNumber: 159,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter escaping incremental trap recognizing progress accumulation limitations"
  },
  {
    chapterNumber: 159,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter confronting loss accounting accepting defeats as growth lessons"
  },
  {
    chapterNumber: 159,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter transcending mastery monotony finding meaning beyond achievement repetition"
  },
  {
    chapterNumber: 159,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter integrating scattered wins understanding diverse small victories pattern"
  },

  // EA-160: Foresight
  {
    chapterNumber: 160,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter developing foresight capacity anticipating future patterns and possibilities"
  },
  {
    chapterNumber: 160,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter refining predictive thinking balancing intuition with analytical projection"
  },
  {
    chapterNumber: 160,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter testing foresight accuracy learning from prediction successes and failures"
  },
  {
    chapterNumber: 160,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter mastering future vision integrating foresight into strategic decision-making"
  },

  // EA-161: Readiness
  {
    chapterNumber: 161,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter establishing readiness foundation preparing systematically for challenges ahead"
  },
  {
    chapterNumber: 161,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter building readiness capacity developing skills and resources for action"
  },
  {
    chapterNumber: 161,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter testing readiness level verifying preparedness through assessment and practice"
  },
  {
    chapterNumber: 161,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter achieving complete readiness standing prepared for mission commencement"
  },

  // EA-162: Confirmation
  {
    chapterNumber: 162,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter seeking confirmation validating calling through external signs and internal conviction"
  },
  {
    chapterNumber: 162,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter receiving confirmation discovering evidence supporting mission legitimacy"
  },
  {
    chapterNumber: 162,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter testing confirmation weighing validation against doubt and uncertainty"
  },
  {
    chapterNumber: 162,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter accepting confirmation committing fully to quest with validated purpose"
  },

  // EA-163: Tumultuous Victory
  {
    chapterNumber: 163,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter escaping hero trap recognizing journey formula limitations and manipulation"
  },
  {
    chapterNumber: 163,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter confronting grit exhaustion accepting persistence limits and rest necessity"
  },
  {
    chapterNumber: 163,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter resisting mindset manipulation maintaining authentic growth despite pressure"
  },
  {
    chapterNumber: 163,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter achieving tumultuous victory accepting triumph's chaos and complexity"
  },

  // EA-164: Resilient Allegiance
  {
    chapterNumber: 164,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter building resilient bonds creating allegiances surviving adversity and pressure"
  },
  {
    chapterNumber: 164,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter testing alliance strength maintaining loyalty through conflict and doubt"
  },
  {
    chapterNumber: 164,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter deepening commitment demonstrating resilient allegiance through action"
  },
  {
    chapterNumber: 164,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter completing allegiance formation establishing unshakeable bonds despite challenges"
  },

  // EA-165: Revitalized Hope
  {
    chapterNumber: 165,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter recognizing hope depletion confronting despair and energy exhaustion"
  },
  {
    chapterNumber: 165,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter discovering hope sources finding renewal through connection and meaning"
  },
  {
    chapterNumber: 165,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter cultivating revitalized hope rebuilding optimism through intentional practice"
  },
  {
    chapterNumber: 165,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter embodying renewed hope carrying revitalized energy forward into action"
  },

  // EA-166: Blind Beneficence
  {
    chapterNumber: 166,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter discovering blind generosity giving without seeing full consequences"
  },
  {
    chapterNumber: 166,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter confronting beneficence limits recognizing helping's shadow and harm"
  },
  {
    chapterNumber: 166,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter developing wise giving balancing generosity with awareness and boundaries"
  },
  {
    chapterNumber: 166,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter mastering conscious beneficence giving with eyes open to impact"
  },

  // EA-167: Responsive Grace
  {
    chapterNumber: 167,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter discovering responsive capacity adapting gracefully to changing circumstances"
  },
  {
    chapterNumber: 167,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter cultivating grace under pressure maintaining poise through adversity"
  },
  {
    chapterNumber: 167,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter integrating responsiveness reacting wisely without losing center"
  },
  {
    chapterNumber: 167,
    sceneNumber: 4,
    preliminarySceneFocus: "Daughter embodying responsive grace flowing with change maintaining elegant equilibrium"
  },

  // EA-168: Adaptable Analysis
  {
    chapterNumber: 168,
    sceneNumber: 1,
    preliminarySceneFocus: "Daughter recognizing analytical limits discovering systematic thinking's vulnerabilities through pursuit"
  },
  {
    chapterNumber: 168,
    sceneNumber: 2,
    preliminarySceneFocus: "Daughter escaping hypothesis trap avoiding adaptive thinking systematization creating paralysis"
  },
  {
    chapterNumber: 168,
    sceneNumber: 3,
    preliminarySceneFocus: "Daughter achieving strategic agility integrating persistent commitment with flexible adaptation"
  }
];

async function updateDatabase() {
  console.log('📊 Updating database...\n');

  let updateCount = 0;
  for (const fix of fixes) {
    if (fix.preliminarySceneFocus.length > 255) {
      console.log(`   ⚠️  WARNING: Ch${fix.chapterNumber}S${fix.sceneNumber} is ${fix.preliminarySceneFocus.length} chars (exceeds 255)`);
      continue;
    }

    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, fix.chapterNumber))
      .limit(1);

    if (!chapter) {
      console.log(`   ⚠️  Chapter ${fix.chapterNumber} not found, skipping`);
      continue;
    }

    const result = await db
      .update(scenes)
      .set({ preliminarySceneFocus: fix.preliminarySceneFocus })
      .where(
        and(
          eq(scenes.chapterId, chapter.id),
          eq(scenes.sceneNumber, fix.sceneNumber)
        )
      )
      .returning();

    if (result.length > 0) {
      console.log(`✅ Ch${fix.chapterNumber}S${fix.sceneNumber}: Updated (${fix.preliminarySceneFocus.length} chars)`);
      updateCount++;
    } else {
      console.log(`   ⚠️  Ch${fix.chapterNumber}S${fix.sceneNumber}: Scene not found`);
    }
  }

  console.log(`\n✅ Database updated! ${updateCount} scenes modified.\n`);
}

function updateOutline() {
  console.log('📝 Updating outline file...\n');

  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  function findAndUpdateChapter(obj: any, eaId: string, sceneUpdates: Map<number, string>): boolean {
    if (!obj || typeof obj !== 'object') return false;

    if (obj.id === eaId) {
      if (!obj.scenes) {
        console.log(`   ⚠️  ${eaId}: No scenes array`);
        return true;
      }

      console.log(`✅ Found ${eaId}: ${obj.chapter} - ${obj.specific_task_group_title || obj.title}`);
      
      for (const [sceneNum, newValue] of sceneUpdates.entries()) {
        const scene = obj.scenes.find((s: any) => s.scene_number === sceneNum);
        if (scene) {
          scene.preliminarySceneFocus = newValue;
          console.log(`   ✅ Updated Scene ${sceneNum}`);
        } else {
          console.log(`   ⚠️  Scene ${sceneNum} not found`);
        }
      }
      
      return true;
    }

    for (const key of Object.keys(obj)) {
      if (findAndUpdateChapter(obj[key], eaId, sceneUpdates)) {
        return true;
      }
    }
    return false;
  }

  const chapterUpdates = new Map<string, Map<number, string>>();
  
  for (const fix of fixes) {
    const eaId = `EA-${fix.chapterNumber.toString().padStart(3, '0')}`;
    if (!chapterUpdates.has(eaId)) {
      chapterUpdates.set(eaId, new Map());
    }
    chapterUpdates.get(eaId)!.set(fix.sceneNumber, fix.preliminarySceneFocus);
  }

  for (const [eaId, sceneUpdates] of chapterUpdates.entries()) {
    findAndUpdateChapter(outline, eaId, sceneUpdates);
  }

  const backupPath = path.join(process.cwd(), 'data', 'l_outline.backup-prelim-153-168.json');
  fs.writeFileSync(backupPath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`\n💾 Created backup at data/l_outline.backup-prelim-153-168.json`);

  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`✅ Updated data/l_outline.json\n`);
}

async function main() {
  console.log('🔧 Fixing "preliminary_scene_focus" column for EA-153 through EA-168\n');
  console.log('Expected format: "Daughter [action/description] [progression/context]"\n');
  console.log('Max length: 255 characters\n');

  await updateDatabase();
  updateOutline();

  console.log('✨ All updates complete!\n');
  console.log('Updated chapters:');
  console.log('  EA-153: 4 scenes (converted from Prophet format)');
  console.log('  EA-154: 4 scenes (NULL to Daughter format)');
  console.log('  EA-155: 4 scenes (NULL to Daughter format)');
  console.log('  EA-156: 4 scenes (NULL to Daughter format)');
  console.log('  EA-157: 4 scenes (NULL to Daughter format)');
  console.log('  EA-158: 4 scenes (NULL to Daughter format)');
  console.log('  EA-159: 4 scenes (NULL to Daughter format)');
  console.log('  EA-160: 4 scenes (NULL to Daughter format)');
  console.log('  EA-161: 4 scenes (NULL to Daughter format)');
  console.log('  EA-162: 4 scenes (NULL to Daughter format)');
  console.log('  EA-163: 4 scenes (NULL to Daughter format)');
  console.log('  EA-164: 4 scenes (NULL to Daughter format)');
  console.log('  EA-165: 4 scenes (NULL to Daughter format)');
  console.log('  EA-166: 4 scenes (NULL to Daughter format)');
  console.log('  EA-167: 4 scenes (NULL to Daughter format)');
  console.log('  EA-168: 3 scenes (converted from Refusal format)');
  console.log('  Total: 63 scenes\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
