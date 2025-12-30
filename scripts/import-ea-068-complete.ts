import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-068: Methodical (Book 2, Chapter 28)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-068'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-068 not found. Run create-ea-068-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Breakdown',
      setup: 'The Engineer is overwhelmed. \'It\'s too much.\' Francisco steps in. He wipes the whiteboard. He draws a line. \'Step 1: Coolant. Step 2: Coupling.\' He forces the panic into a structure. He creates the \'Checklist\'. He gives the team permission to focus only on their one bolt, their one wire. The room calms down. The \'King of Swords\' cuts through the noise.',
      symbolism: 'The Grid. The Scalpel. The shifting of the mental load from \'All\' to \'One Thing\'.',
      beat_goal: 'Establish the System. Turn chaos into a project plan.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Calculating',
      scene_tone: 'Clinical',
      timeline_date: '7/29/1320 - Early Morning',
      timeline_variant: 'Assembly Floor',
      location: 'Assembly Floor',
    },
    {
      scene_number: 2,
      scene_title: 'The Grind',
      setup: 'Montage of the work. Sweat, sparks, but no shouting. Francisco walks the floor. He is not building; he is removing obstacles. A team runs out of flux. He teleports some from the armory. A dispute arises over torque settings. He adjudicates instantly. He is the \'System 2\' thinking brain for the \'System 1\' muscle of the team. It is efficient. It is \'Deep Work\' in a war zone.',
      symbolism: 'The Machine. The cogs turning. The conductor of an orchestra of welders.',
      beat_goal: 'Show the progress. Validate the method.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Flow state',
      scene_tone: 'Rhythmic',
      timeline_date: '7/29/1320 - Morning',
      timeline_variant: 'Assembly Floor',
      location: 'Assembly Floor',
    },
    {
      scene_number: 3,
      scene_title: 'The Snag',
      setup: '90% complete. The primary coupler cracks. A groan goes through the room. The Engineer looks defeated. \'We don\'t have a spare.\' Panic threatens to return. Francisco holds up a hand. \'Stop. Think.\' He uses \'Thinking, Fast and Slow\'. He forces them to slow down. \'What does the coupler *do*?\' \'It bridges the charge.\' \'What else bridges a charge?\' Silence. Then: \'The stasis field coils on the transport.\' \'Strip them.\' The logic saves them, not luck.',
      symbolism: 'The Crack. The Pause. The \'King of Swords\' weighing the options.',
      beat_goal: 'The Crisis. The Test of the Method.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Steel calm',
      scene_tone: 'Tense silence',
      timeline_date: '7/29/1320 - Late Morning',
      timeline_variant: 'Assembly Floor',
      location: 'Assembly Floor',
    },
    {
      scene_number: 4,
      scene_title: 'The Lock',
      setup: 'The new part is fitted. It holds. The device hums to life. The checklist is complete. Every box is ticked. Francisco puts the cap on the marker. He looks at the team. They are exhausted, filthy, but proud. They didn\'t just build a bomb; they built a process. The \'King of Swords\' sheathes his blade. \'Deploy it.\'',
      symbolism: 'The Last Box Ticked. The hum of power. The shift from potential to kinetic.',
      beat_goal: 'Resolution. The weapon is ready. The Method worked.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Satisfied fatigue',
      scene_tone: 'Heavy and finalized',
      timeline_date: '7/29/1320 - Midday',
      timeline_variant: 'Assembly Floor',
      location: 'Assembly Floor',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 406 - 410',
      description: 'Overwhelmed engineer declaring "It\'s too much"—Francisco wiping whiteboard drawing line creating checklist structure "Step 1: Coolant. Step 2: Coupling"—forcing panic into structure giving team permission to focus one bolt, one wire—room calming as King of Swords cuts through noise shifting mental load from All to One Thing.',
      focus: 'Establishing System turning chaos into project plan.',
      chapterSceneFocus: 'Ch68S1: Overwhelmed engineer facing too much—Francisco creating whiteboard checklist structure Step 1 Coolant Step 2 Coupling—giving permission for single-task focus calming room as King of Swords cuts noise shifting mental load from All to One Thing Grid.',
      preliminarySceneFocus: 'Grid scalpel focuses load',
      preliminarySceneDescription: 'Checklist structure calms panic chaos',
      narrativeFunction: 'Establishes methodical system; demonstrates King of Swords clarity; breaks overwhelm into manageable tasks.',
      sensoryDetail: 'Engineer overwhelmed, whiteboard wiped, line drawn, checklist created, step structure, panic forced into order, one bolt focus, one wire focus, room calming, noise cut.',
      internalConflict: 'Francisco channeling King of Swords precision to impose order on chaos despite time pressure.',
      characterGrowthElement: 'Francisco integrating King of Swords methodical mastery—balancing Wands passion with Swords logic through structured approach.',
      seriesConnectionResonance: 'Checklist Manifesto becoming resistance bible; standard operating procedures foundation; execution demonstrating how not just what.',
      sceneCardProgression: 186,
      realWorldContext: 'Checklist methodology, breaking overwhelm into tasks, structured thinking under pressure.',
      timelineSignificance: 'EA-067 wild idea implementation beginning—4-hour countdown starts with methodical breakdown.',
      saveTheCatBeat: truncate('Dark Night of the Soul - structure conquers chaos', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'clinical_focus',
        narrative_mode: 'calculating_order',
      }),
      learning_objectives: JSON.stringify([
        'Checklist conquering overwhelm',
        'Single-task focus permission',
        'Structure calming panic',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Progress montage coming',
        'Obstacle removal leadership',
        'Coupler crisis test',
      ]),
    },
    {
      pages: 'Page 410 - 414',
      description: 'Work montage with sweat and sparks but no shouting—Francisco walking floor removing obstacles not building—teleporting flux from armory, adjudicating torque disputes instantly—being System 2 thinking brain for System 1 muscle team efficient as Deep Work in war zone with machine cogs turning.',
      focus: 'Showing progress validating methodical approach.',
      chapterSceneFocus: 'Ch68S2: Montage showing sweat sparks no shouting—Francisco removing obstacles not building teleporting flux adjudicating torque—being System 2 brain for System 1 muscle achieving Deep Work war zone efficiency as machine cogs turn validating method.',
      preliminarySceneFocus: 'Machine cogs turn efficiently',
      preliminarySceneDescription: 'Obstacle removal orchestrates progress',
      narrativeFunction: 'Validates systematic approach; shows leadership as obstacle removal; demonstrates Deep Work efficiency.',
      sensoryDetail: 'Work montage, sweat, sparks, no shouting, floor walking, flux teleported, torque disputes adjudicated, System 2 brain, System 1 muscle, Deep Work efficiency, machine cogs, welder orchestra.',
      internalConflict: 'Francisco maintaining flow state while constantly context-switching to solve micro-problems.',
      characterGrowthElement: 'Francisco mastering King of Swords logistics—becoming conductor orchestrating competence rather than individual contributor.',
      seriesConnectionResonance: 'Deep Work principles applied to war; team coordination demonstrating ragtag to disciplined unit; process over heroics.',
      sceneCardProgression: 187,
      realWorldContext: 'Flow state maintenance, obstacle removal leadership, Deep Work under pressure.',
      timelineSignificance: 'Methodical progress toward hybrid weapon completion—system validating through rhythmic execution.',
      saveTheCatBeat: truncate('Dark Night of the Soul - method validates through progress', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'rhythmic_montage',
        narrative_mode: 'flow_efficiency',
      }),
      learning_objectives: JSON.stringify([
        'Leadership as obstacle removal',
        'System 2 guiding System 1',
        'Deep Work war zone application',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Coupler crisis imminent',
        'Method testing coming',
        'Logic over luck resolution',
      ]),
    },
    {
      pages: 'Page 414 - 417',
      description: '90% complete primary coupler cracking—groan through room, defeated engineer reporting no spare—panic threatening return—Francisco hand-raising "Stop. Think." using Thinking Fast and Slow forcing slowdown—Socratic questioning coupler function "bridges charge"—logic finding stasis field coils alternative "Strip them" saving through reasoning not luck.',
      focus: 'Crisis testing methodical approach through logic.',
      chapterSceneFocus: 'Ch68S3: Coupler cracking at 90% with no spare—panic threatening defeated engineer—Francisco forcing Thinking Fast and Slow pause "Stop. Think." Socratically questioning function finding stasis field coils workaround—logic saving not luck as King weighs options through crack.',
      preliminarySceneFocus: 'Crack pauses King weighing',
      preliminarySceneDescription: 'Slow thinking finds logical alternative',
      narrativeFunction: 'Tests method under crisis; demonstrates Thinking Fast and Slow principle; shows logic triumphing over panic.',
      sensoryDetail: '90% completion, coupler crack, room groan, defeated look, no spare, panic threat, hand raised, Stop Think command, forced slowdown, Socratic questions, function analysis, charge bridge, stasis field coils, strip order.',
      internalConflict: 'Francisco maintaining steel calm while team panics—trusting systematic thinking over reactive emotion.',
      characterGrowthElement: 'Francisco embodying King of Swords ultimate test—using logical reasoning to find solution when method encounters crisis.',
      seriesConnectionResonance: 'Thinking Fast and Slow as crisis tool; slow-down-to-speed-up principle; logic over luck establishing problem-solving culture.',
      sceneCardProgression: 188,
      realWorldContext: 'Crisis management through slow thinking, Socratic problem-solving, logical workarounds.',
      timelineSignificance: 'Critical coupler failure testing method at 90%—logic finding alternative maintaining 4-hour deadline.',
      saveTheCatBeat: truncate('Dark Night of the Soul - logic conquers crisis panic', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'tense_silence',
        narrative_mode: 'steel_calm',
      }),
      learning_objectives: JSON.stringify([
        'Slow thinking under crisis',
        'Socratic problem decomposition',
        'Logic over panic reaction',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Final assembly completion',
        'Process validation success',
        'Deployment readiness',
      ]),
    },
    {
      pages: 'Page 417 - 420',
      description: 'New part fitted holding—device humming to life with complete checklist every box ticked—Francisco capping marker looking at exhausted filthy proud team—realizing they built process not just bomb—King of Swords sheathing blade ordering "Deploy it" as last box ticked shifts potential to kinetic power hum.',
      focus: 'Resolution showing weapon ready and method validated.',
      chapterSceneFocus: 'Ch68S4: Fitted part holding as device hums alive with every checklist box ticked—Francisco capping marker seeing exhausted filthy proud team built process not bomb—King sheathing blade deploying as last tick shifts potential to kinetic validated method.',
      preliminarySceneFocus: 'Last tick shifts to kinetic',
      preliminarySceneDescription: 'Process proves through completed hum',
      narrativeFunction: 'Resolves chapter through success; validates methodical approach; establishes process as achievement equal to product.',
      sensoryDetail: 'Part fitted, holding, device hum, checklist complete, boxes ticked, marker capped, exhausted team, filthy proud, process built, King sheathing, Deploy order, power hum, potential to kinetic.',
      internalConflict: 'Francisco feeling satisfied fatigue recognizing process triumph over mere product completion.',
      characterGrowthElement: 'Francisco completing King of Swords integration—understanding methodology creates sustainable success over one-time heroics.',
      seriesConnectionResonance: 'Standard operating procedures validated; prototype for final weapon; team coordination becoming disciplined unit model.',
      sceneCardProgression: 189,
      realWorldContext: 'Process as product, methodical validation, sustainable systems over heroic efforts.',
      timelineSignificance: 'Hybrid weapon completed within 4-hour deadline—EA-067 gamble validated through EA-068 method enabling Abyss escape.',
      saveTheCatBeat: truncate('Dark Night of the Soul - method triumphs completely', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'heavy_finalized',
        narrative_mode: 'satisfied_fatigue',
      }),
      learning_objectives: JSON.stringify([
        'Process equals product achievement',
        'Methodical approach validation',
        'Sustainable systems over heroics',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Weapon deployment next',
        'Book 3 technique staple',
        'Resistance protocols established',
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
        chapterUniqueIdentifier: 'EA-068',
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

  console.log(`\n✅ EA-068 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
