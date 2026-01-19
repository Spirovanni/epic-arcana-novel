import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fix "focus" column for EA-211 through EA-213 (v2 with proper truncation)
 * Format: [Character] [action/framework]—[detailed mechanism and implications]
 * MAX LENGTH: 255 characters
 */

interface SceneFix {
  chapterNumber: number;
  sceneNumber: number;
  focus: string;
}

const fixes: SceneFix[] = [
  // EA-211: Voracious
  {
    chapterNumber: 211,
    sceneNumber: 1,
    focus: "Francisco employing Csikszentmihalyi's flow curiosity identifying absorbing topics—pursuing deep immersion creating voracious knowledge hunger transcending surface learning, flow-driven curiosity enabling rapid mastery through passionate engagement"
  },
  {
    chapterNumber: 211,
    sceneNumber: 2,
    focus: "Francisco implementing Clear's atomic habits for systematic learning—defining curiosity routines and daily tracking creating consistent knowledge accumulation transcending scattered chaos, habit lattice enabling sustained practice"
  },
  {
    chapterNumber: 211,
    sceneNumber: 3,
    focus: "Francisco developing Dweck's growth mindset reframing challenges as learning questions—seeking uncomfortable feedback and revising inquiry approach transcending comfort zone, growth questions enabling knowledge expansion"
  },
  {
    chapterNumber: 211,
    sceneNumber: 4,
    focus: "Francisco integrating Csikszentmihalyi-Clear-Dweck achieving voracious mastery—flow hunger with habit systems and growth mindset unifying complete curiosity, selective learning enabling cosmic transformation through integrated pursuit"
  },

  // EA-212: Regard
  {
    chapterNumber: 212,
    sceneNumber: 1,
    focus: "Francisco discovering Godin's tribe community recognizing allies and shared values—establishing respect rituals and appreciation actions transcending solo transformation, tribe recognition enabling collaborative strength"
  },
  {
    chapterNumber: 212,
    sceneNumber: 2,
    focus: "Francisco forging Brown's vulnerability-based trust through story sharing—inviting feedback and acknowledging contributions transcending surface collaboration, vulnerability creating deep trust enabling authentic connection"
  },
  {
    chapterNumber: 212,
    sceneNumber: 3,
    focus: "Francisco creating Sinek's psychological safety through circle—assessing trust levels and addressing concerns respectfully transcending toxic environment, safety circle enabling team cohesion through protected vulnerability"
  },
  {
    chapterNumber: 212,
    sceneNumber: 4,
    focus: "Francisco integrating Godin-Brown-Sinek achieving regard mastery—tribe values with vulnerability trust and safety circle unifying complete collaboration, ultimate regard enabling cosmic teamwork through integrated community"
  },

  // EA-213: (Give) Sacrifice
  {
    chapterNumber: 213,
    sceneNumber: 1,
    focus: "Francisco crossing Campbell's first threshold through sacrifice—releasing individual achievement attachments and performing symbolic rite transcending old identity, threshold enabling cosmic alchemy transformation"
  },
  {
    chapterNumber: 213,
    sceneNumber: 2,
    focus: "Francisco discovering Frankl's meaning through sacrifice suffering—reflecting on past loss extracting hidden lessons transcending meaningless pain, meaning-making enabling purpose discovery through suffering as teacher"
  },
  {
    chapterNumber: 213,
    sceneNumber: 3,
    focus: "Francisco achieving Coelho's alchemist transformation through comfort zone exit—recalling past leaps and trusting process transcending safety, alchemist leap enabling cosmic transformation through uncertainty embrace"
  }
];

async function updateDatabase() {
  console.log('📊 Updating database...\n');

  let updateCount = 0;
  for (const fix of fixes) {
    if (fix.focus.length > 255) {
      console.log(`   ⚠️  ERROR: Ch${fix.chapterNumber}S${fix.sceneNumber} focus is ${fix.focus.length} chars (exceeds 255) - SKIPPING`);
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
      .set({ focus: fix.focus })
      .where(
        and(
          eq(scenes.chapterId, chapter.id),
          eq(scenes.sceneNumber, fix.sceneNumber)
        )
      )
      .returning();

    if (result.length > 0) {
      console.log(`✅ Ch${fix.chapterNumber}S${fix.sceneNumber}: Updated focus (${fix.focus.length} chars)`);
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
          scene.focus = newValue;
          console.log(`   ✅ Updated Scene ${sceneNum} focus`);
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
    chapterUpdates.get(eaId)!.set(fix.sceneNumber, fix.focus);
  }

  for (const [eaId, sceneUpdates] of chapterUpdates.entries()) {
    findAndUpdateChapter(outline, eaId, sceneUpdates);
  }

  const backupPath = path.join(process.cwd(), 'data', 'l_outline.backup-focus-211-213-v2.json');
  fs.writeFileSync(backupPath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`\n💾 Created backup at data/l_outline.backup-focus-211-213-v2.json`);

  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`✅ Updated data/l_outline.json\n`);
}

async function main() {
  console.log('🔧 Fixing "focus" column for EA-211 through EA-213 (v2 with truncation)\n');
  console.log('Expected format: [Character] [action/framework]—[detailed mechanism and implications]\n');
  console.log('Max length: 255 characters\n');

  await updateDatabase();
  updateOutline();

  console.log('✨ All updates complete!\n');
  console.log('Updated chapters:');
  console.log('  EA-211 (Voracious): 4 scenes');
  console.log('  EA-212 (Regard): 4 scenes');
  console.log('  EA-213 (Give/Sacrifice): 3 scenes');
  console.log('  Total: 11 scenes\n');
  console.log('Note: preliminary_scene_description already in good format, no changes needed.\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
