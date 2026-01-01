import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-094: Goal Setting (Book 3, Chapter 14)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-094'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-094 not found. Run create-ea-094-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Map Room',
      setup: 'Dawn. Francisco clears the feast table (EA-092 remnants). He spreads out the maps. The \'Page of Disks\' energy—grounding the vision in reality. He calls for the Scribe.',
      symbolism: 'The Blank Slate. The Map.',
      beat_goal: 'The Start. creating the workspace.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Clarity',
      scene_tone: 'Quiet/Work',
      timeline_date: '6/9/1321 - Morning',
      timeline_variant: 'Sanctuary',
      location: 'Map Room',
    },
    {
      scene_number: 2,
      scene_title: 'The Objective',
      setup: 'The Council gathers. Francisco circles a location on the map. \'The Keystone.\' He explains its value. It\'s not just a treasure; it\'s a stabilizer. \'If we have this, we control the loops.\'',
      symbolism: 'The Bullseye.',
      beat_goal: 'The Target. Defining success.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Ambition',
      scene_tone: 'Strategic',
      timeline_date: '6/9/1321 - Noon',
      timeline_variant: 'Sanctuary',
      location: 'Map Room',
    },
    {
      scene_number: 3,
      scene_title: 'The Plan',
      setup: 'Breaking it down. Logistics. Who goes? Who stays? Consumables needed. It\'s boring, unglamorous work, but it\'s \'Goal Setting.\' The Page of Disks thrives here. Francisco delegates (trusting the Order).',
      symbolism: 'The List. The Coin (Disks).',
      beat_goal: 'The Logistics. Making it real.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Trust',
      scene_tone: 'Practical',
      timeline_date: '6/9/1321 - Afternoon',
      timeline_variant: 'Sanctuary',
      location: 'Map Room',
    },
    {
      scene_number: 4,
      scene_title: 'The Commitment',
      setup: 'The plan is set. The sun is setting. Francisco hands the Scribe the quill. \'Write it down. It is law.\' They have a path. The uncertainty of the \'Removal\' period is gone. They are moving.',
      symbolism: 'The Sealed Scroll.',
      beat_goal: 'The Launch. Committing to action.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Determination',
      scene_tone: 'Resolute',
      timeline_date: '6/9/1321 - Sunset',
      timeline_variant: 'Sanctuary',
      location: 'Map Room',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 196 - 200',
      description: 'Dawn Francisco feast-table clearing EA-092-remnants—maps spreading Page-Disks energy vision-reality grounding Scribe-calling as Blank-Slate Map start workspace-creating clarity quiet-work Atomic-Habits environment-design pivot EA-091-scroll stolen-using reactive-active transitioning Strategist.',
      focus: 'Start creating workspace through map spreading.',
      chapterSceneFocus: 'Ch94S1: Dawn Francisco feast-table clearing EA-092-remnants maps spreading Page-Disks energy vision-reality grounding Scribe-calling as Blank-Slate Map start workspace-creates clarity quiet-work Atomic-Habits environment-design pivot EA-091-scroll stolen reactive-active transitions Strategist.',
      preliminarySceneFocus: 'Blank-Slate Map clarity quiet-work',
      preliminarySceneDescription: 'Map-room starts workspace creating clearing grounding',
      narrativeFunction: 'Establishes Page of Disks grounding vision in reality through workspace creation; demonstrates Atomic Habits environment design principle clearing feast remnants; shows EA-091 stolen scroll utilizing beginning; creates pivot reactive to active strategy Strategist Francisco.',
      sensoryDetail: 'Dawn breaking, Francisco working, feast table clearing, EA-092 remnants removing, maps spreading out, Page of Disks energy, vision grounding reality, Scribe calling for, Blank Slate symbolism, Map imagery, workspace creating, clarity achieving, quiet work atmosphere.',
      internalConflict: 'Francisco experiencing clarity—clearing EA-092 feast remnants transitioning celebration to work, spreading maps grounding Hierophant vision in Page of Disks concrete reality, preparing workspace environment design utilizing EA-091 stolen scroll intelligence.',
      characterGrowthElement: 'Francisco becoming Strategist—transitioning reactive to active leadership through Page of Disks Goal Setting, applying Atomic Habits environment design clearing workspace, grounding EA-093 Hierophant Illumination vision in concrete reality maps stolen scroll utilizing.',
      seriesConnectionResonance: 'EA-091 Seven Swords scroll payoff beginning; EA-092 Three Cups feast transitioning to work; EA-093 Hierophant vision grounding reality; Keystone McGuffin introducing Book 3 chase; Part 1 ending structure; reactive to active pivot.',
      sceneCardProgression: 290,
      realWorldContext: 'Atomic Habits environment design, Page of Disks grounding, workspace preparation.',
      timelineSignificance: '6/9/1321 morning—day after EA-093 Hierophant oath sunset, Francisco clearing feast table spreading maps, Page of Disks Goal Setting beginning grounding vision reality workspace creating EA-091 scroll utilizing.',
      saveTheCatBeat: truncate('Push - workspace created vision grounded', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'low-medium',
        pacing: 'quiet_industrious',
        narrative_mode: 'clear_focused',
      }),
      learning_objectives: JSON.stringify([
        'Atomic Habits environment design mastery',
        'Page of Disks grounding vision practice',
        'Workspace preparation strategic importance',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Council gathering objective',
        'Keystone location circling',
        'Stabilizer value explaining',
      ]),
    },
    {
      pages: 'Page 200 - 204',
      description: 'Council gathering Francisco map-circling The-Keystone—value explaining not-treasure stabilizer loops-controlling as Bullseye target success-defining ambition strategic charcoal-circle parchment intent-eyes finger-route tracing quest-definition McGuffin-introducing Book-3-chase.',
      focus: 'Target defining success through Keystone objective.',
      chapterSceneFocus: 'Ch94S2: Council gathering Francisco map-circling The-Keystone value explaining not-treasure stabilizer loops-controlling as Bullseye target success-defines ambition strategic charcoal-circle parchment intent-eyes finger-route tracing quest-definition McGuffin-introduces Book-3-chase.',
      preliminarySceneFocus: 'Bullseye ambition strategic target',
      preliminarySceneDescription: 'Objective defines success Keystone targeting strategically',
      narrativeFunction: 'Establishes Keystone as primary McGuffin objective Book 3 chase; demonstrates Page of Disks concrete target defining success loops controlling; shows Council strategic planning vision becoming specific; creates quest definition intellectual work war pacing.',
      sensoryDetail: 'Council gathering, Francisco leading, map circling, The Keystone location, value explaining, not just treasure, stabilizer function, loops controlling capability, Bullseye symbolism, target defining, success criteria, ambition feeling, strategic tone, charcoal circle parchment, intent eyes council, finger route tracing.',
      internalConflict: 'Francisco experiencing ambition—defining Keystone objective strategically explaining stabilizer loops controlling value, moving from abstract Hierophant vision to concrete Page of Disks target, establishing quest definition Book 3 chase beginning.',
      characterGrowthElement: 'Francisco executing Strategist role—defining Keystone McGuffin objective explicitly introducing Book 3 chase, applying Page of Disks principle Vision requires concrete steps translating Illumination into specific target, demonstrating intellectual work war strategic planning.',
      seriesConnectionResonance: 'Keystone McGuffin Book 3 chase establishing; temporal loops controlling strategic value; intellectual work war pacing demonstrating; Council strategic planning showing; EA-091 scroll intelligence informing objective; quest definition explicit.',
      sceneCardProgression: 291,
      realWorldContext: 'Page of Disks concrete targeting, strategic objective defining, quest clarity.',
      timelineSignificance: '6/9/1321 noon—same morning after workspace preparation, Council gathering Francisco defining Keystone objective, Page of Disks target establishing Book 3 chase quest loops controlling stabilizer strategic value.',
      saveTheCatBeat: truncate('Push - Keystone objective defined target', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'strategic_focused',
        narrative_mode: 'ambitious_defining',
      }),
      learning_objectives: JSON.stringify([
        'Page of Disks concrete targeting mastery',
        'Strategic objective clarity importance',
        'Quest definition explicit communication',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Logistics breaking down',
        'Teams assigning delegation',
        'Consumables planning practical',
      ]),
    },
    {
      pages: 'Page 204 - 207',
      description: 'Breaking-down logistics who-goes who-stays consumables-needed—boring unglamorous Goal-Setting Page-Disks thriving Francisco delegating Order-trusting as List Coin-Disks logistics real-making trust practical Measure-What-Matters OKRs process intellectual-work teams-assigning.',
      focus: 'Logistics making real through delegation planning.',
      chapterSceneFocus: 'Ch94S3: Breaking-down logistics who-goes who-stays consumables-needed boring unglamorous Goal-Setting Page-Disks thriving Francisco delegating Order-trusting as List Coin-Disks logistics real-makes trust practical Measure-What-Matters OKRs process intellectual-work teams-assigning.',
      preliminarySceneFocus: 'List Coin-Disks trust practical',
      preliminarySceneDescription: 'Plan logistics real-making delegating trusting practically',
      narrativeFunction: 'Demonstrates Page of Disks unglamorous practical work logistics breaking down; shows Measure What Matters OKRs principle concrete planning; creates Francisco delegating trusting Order competence; establishes process intellectual work war teams assigning.',
      sensoryDetail: 'Breaking down mission, logistics planning, who goes decision, who stays determining, consumables needed listing, boring work, unglamorous planning, Goal Setting embodying, Page of Disks thriving, Francisco delegating, Order trusting, List symbolism, Coin Disks imagery, logistics reality, practical tone.',
      internalConflict: 'Francisco experiencing trust—delegating logistics planning to Order demonstrating confidence post-Hierophant transformation, engaging unglamorous Page of Disks work making vision real through boring practical planning, trusting competence built.',
      characterGrowthElement: 'Francisco embodying Strategist delegation—applying Measure What Matters OKRs breaking mission into concrete logistics, trusting Order competence through delegation demonstrating Page of Disks principle Vision requires concrete steps, engaging unglamorous practical work grounding ambition reality.',
      seriesConnectionResonance: 'Order competence demonstrating delegation trust; Measure What Matters OKRs strategic planning; intellectual work war pacing continuing; Page of Disks practical grounding; teams assigning mission beginning; unglamorous work necessity showing.',
      sceneCardProgression: 292,
      realWorldContext: 'Measure What Matters OKRs application, delegation trust building, unglamorous work necessity.',
      timelineSignificance: '6/9/1321 afternoon—hours after Keystone objective defined, Francisco breaking logistics down delegating Order trusting, Page of Disks practical planning teams assigning consumables determining mission real-making.',
      saveTheCatBeat: truncate('Push - logistics planned teams delegated', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'practical_methodical',
        narrative_mode: 'trusting_delegating',
      }),
      learning_objectives: JSON.stringify([
        'Measure What Matters OKRs planning mastery',
        'Delegation trust building practice',
        'Unglamorous work necessity acceptance',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Plan set completion',
        'Scribe quill receiving',
        'Write down law committing',
      ]),
    },
    {
      pages: 'Page 207 - 210',
      description: 'Plan set sun-setting—Francisco Scribe quill-handing Write-down-law—path having Removal-uncertainty gone moving as Sealed-Scroll launch action-committing determination resolute ink-drying nod-exchange breath-deep plunge-before Part-1-end Book-structure reactive-active complete.',
      focus: 'Launch committing action through plan sealing.',
      chapterSceneFocus: 'Ch94S4: Plan set sun-setting Francisco Scribe quill-handing Write-down-law path having Removal-uncertainty gone moving as Sealed-Scroll launch action-commits determination resolute ink-drying nod-exchange breath-deep plunge-before Part-1-end Book-structure reactive-active complete.',
      preliminarySceneFocus: 'Sealed-Scroll determination resolute launch',
      preliminarySceneDescription: 'Commitment launches action sealing plan determined resolutely',
      narrativeFunction: 'Resolves Page of Disks Goal Setting through plan commitment sealing; demonstrates Part 1 Book structure ending reactive to active complete; shows EA-090 Removal uncertainty replaced by clear path forward; creates launch moment committing action determination breath before plunge.',
      sensoryDetail: 'Plan set completion, sun setting, Francisco standing, Scribe receiving, quill handing, Write it down command, It is law declaration, path having, Removal uncertainty gone, moving forward, Sealed Scroll symbolism, launch moment, action committing, determination feeling, resolute tone, ink drying, nod exchange, deep breath, before plunge anticipation.',
      internalConflict: 'Francisco experiencing determination—committing plan to writing making law, replacing EA-090 Removal uncertainty with clear path forward, taking deep breath before plunge launching mission, completing Part 1 reactive to active transformation.',
      characterGrowthElement: 'Francisco completing Strategist transformation Part 1—sealing plan commitment writing as law demonstrating Page of Disks Vision requires concrete steps completion, replacing EA-090 Three Swords Removal uncertainty with clear Keystone path, launching mission action determination breath before plunge reactive to active complete.',
      seriesConnectionResonance: 'Part 1 Book structure ending establishing; EA-090 Removal uncertainty resolving clear path; Keystone Book 3 chase launching mission beginning; reactive to active complete transformation; Order competence established ready; Page of Disks grounding complete.',
      sceneCardProgression: 293,
      realWorldContext: 'Page of Disks commitment completion, Part 1 resolution, launch preparation.',
      timelineSignificance: '6/9/1321 sunset—evening after afternoon logistics planning, Francisco sealing plan commitment Scribe writing law, Part 1 ending Keystone mission launching EA-090 uncertainty replaced clear path reactive to active complete Book structure.',
      saveTheCatBeat: truncate('Push - plan sealed mission launched Part 1', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'resolute_launching',
        narrative_mode: 'determined_committed',
      }),
      learning_objectives: JSON.stringify([
        'Page of Disks commitment completion mastery',
        'Part 1 resolution understanding',
        'Launch preparation determination building',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Keystone quest Book 3 continuing',
        'Mission execution Part 2 beginning',
        'Order action phase starting',
      ]),
    },
  ];

  // Process each scene
  for (let i = 0; i < sceneData.length; i++) {
    const scene = sceneData[i];
    const enhancement = enhancements[i];

    console.log(`\n📝 Processing Scene ${scene.scene_number}: ${scene.scene_title}`);

    // Insert base scene data
    const [insertedScene] = await db
      .insert(scenes)
      .values({
        chapterId: chapter.id,
        chapterUniqueIdentifier: 'EA-094',
        sceneNumber: scene.scene_number,
        title: scene.scene_title,
        setup: scene.setup,
        symbolism: scene.symbolism,
        beatGoal: scene.beat_goal,
        pov: scene.pov,
        tense: scene.tense,
        core_emotion: scene.core_emotion,
        scene_tone: scene.scene_tone,
        timeline_date: scene.timeline_date,
        timeline_variant: scene.timeline_variant,
        location: scene.location,
      })
      .returning();

    console.log(`   ✅ Inserted scene with ID: ${insertedScene.id}`);

    // Update with enhanced narrative fields
    await db
      .update(scenes)
      .set({
        pages: enhancement.pages,
        description: enhancement.description,
        focus: truncate(enhancement.focus, 255),
        chapterSceneFocus: truncate(enhancement.chapterSceneFocus, 255),
        preliminarySceneFocus: truncate(enhancement.preliminarySceneFocus, 255),
        preliminarySceneDescription: enhancement.preliminarySceneDescription,
        narrativeFunction: enhancement.narrativeFunction,
        sensoryDetail: enhancement.sensoryDetail,
        internalConflict: enhancement.internalConflict,
        characterGrowthElement: enhancement.characterGrowthElement,
        seriesConnectionResonance: enhancement.seriesConnectionResonance,
        sceneCardProgression: enhancement.sceneCardProgression,
        realWorldContext: enhancement.realWorldContext,
        timelineSignificance: enhancement.timelineSignificance,
        saveTheCatBeat: enhancement.saveTheCatBeat,
        sudowrite_metadata: enhancement.sudowrite_metadata,
        learning_objectives: enhancement.learning_objectives,
        foreshadowing_elements: enhancement.foreshadowing_elements,
      })
      .where(eq(scenes.id, insertedScene.id));

    console.log(`   ✅ Updated with enhanced narrative fields`);
  }

  // Verify all scenes have complete data
  console.log('\n\n🔍 Verifying field completion...\n');

  const allScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  for (const scene of allScenes) {
    const fields = Object.keys(scene);
    const populatedFields = fields.filter(key => {
      const value = scene[key as keyof typeof scene];
      return value !== null && value !== undefined;
    });

    const requiredFields = 31;
    const presentCount = populatedFields.length;
    const missingCount = requiredFields - presentCount;

    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ✅ Present: ${presentCount}/${requiredFields}`);
    if (missingCount > 0) {
      console.log(`   ❌ Missing: ${missingCount}/${requiredFields}`);
    }
  }

  console.log(`\n✅ EA-094 import complete!`);
  console.log(`\n📋 The Page of Disks Goal Setting - Vision grounded in concrete steps, the Keystone quest begins!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
