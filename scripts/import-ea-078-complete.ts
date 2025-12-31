import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-078: Energy (Book 2, Chapter 38)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-078'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-078 not found. Run create-ea-078-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Siege',
      setup: 'The Drones arrive. A cloud of metal insects. They dive-bomb at random intervals. No one can sleep. Nerves are fraying. A soldier shoots at a shadow. Francisco sees the strategy: \'They are trying to break our minds before they take our bodies.\'',
      symbolism: 'The Mosquitoes. The dripping tap. The erosion of will.',
      beat_goal: 'The Pressure. Establishing the new threat level.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Weariness',
      scene_tone: 'Oppressive',
      timeline_date: '11/7/1320 - Morning',
      timeline_variant: 'The Wall',
      location: 'Base Zero',
    },
    {
      scene_number: 2,
      scene_title: 'The Energy Audit',
      setup: 'Francisco pulls the team off the line. \'You are useless like this.\' He force-feeds them rations. He orders mandatory sleep. \'But they will attack!\' \'Let them. I have the wall.\' He teaches them to pulse their energy—intense focus followed by deep recovery. He takes the burden.',
      symbolism: 'The Emperor on the Throne. The Father protecting the children.',
      beat_goal: 'The Strategy. Prioritizing recovery.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Protective',
      scene_tone: 'Quiet',
      timeline_date: '11/7/1320 - Night',
      timeline_variant: 'The Bunker',
      location: 'Base Zero',
    },
    {
      scene_number: 3,
      scene_title: 'The Emperor\'s Stand',
      setup: 'Francisco is alone on the wall. The drones come. He shoots them down. One by one. Hour after hour. He enters a trance state. No fear, no fatigue, just action. He is The Emperor—order imposed on chaos. He holds the line through the darkest part of the night. He is the lighthouse.',
      symbolism: 'The Stone Statue. The Unblinking Eye. The Force of Will.',
      beat_goal: 'The Climax (of endurance). Surviving the night.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Transcendence',
      scene_tone: 'Hypnotic',
      timeline_date: '11/8/1320 - 0300 Hours',
      timeline_variant: 'The Wall',
      location: 'Base Zero',
    },
    {
      scene_number: 4,
      scene_title: 'The Renewal',
      setup: 'Dawn. The team wakes up. They are rested. They rush to the wall. Francisco is still there, surrounded by smoking drone shells. He turns. He smiles. And then he collapses. Not dead, just empty. Novella catches him. \'We have it now,\' she says. The team takes the wall, energized by his sacrifice. They are ready for the finale.',
      symbolism: 'The Changing of the Guard. The Resurrection.',
      beat_goal: 'Resolution. The team is restored.',
      pov: '3rd Person Limited (Novella)',
      tense: 'Past Tense',
      core_emotion: 'Gratitude',
      scene_tone: 'Inspiring',
      timeline_date: '11/8/1320 - Dawn',
      timeline_variant: 'The Wall',
      location: 'Base Zero',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 556 - 560',
      description: 'Drones arriving metal insect cloud—dive-bombing random intervals no-sleep—nerves fraying soldier shadow-shooting—Francisco seeing strategy \'breaking minds before bodies\' as Mosquitoes dripping tap will erosion pressures establishing new threat level oppressively weary test endurance siege exhaustion.',
      focus: 'Pressure establishing threat level through exhaustion siege.',
      chapterSceneFocus: 'Ch78S1: Drone cloud metal insects dive-bombing random no-sleep—fraying nerves shadow-shooting—Francisco strategy-seeing \'minds before bodies\' as Mosquitoes tap erosion pressures new threat weary oppressive endurance test exhausts.',
      preliminarySceneFocus: 'Mosquitoes tap erodes will oppressively',
      preliminarySceneDescription: 'Exhaustion siege breaks minds weary pressure',
      narrativeFunction: 'Establishes drone siege threat; demonstrates psychological warfare; introduces energy management crisis.',
      sensoryDetail: 'Drones arriving, metal insect cloud, dive-bombing, random intervals, sleep denial, nerves fraying, soldier shooting shadow, strategy recognition, mind-breaking before body-taking, mosquito harassment, dripping tap persistence, will erosion.',
      internalConflict: 'Francisco experiencing weariness while recognizing psychological warfare—understanding need for new strategy.',
      characterGrowthElement: 'Francisco entering Emperor mode—recognizing energy management necessity over conventional defense, preparing to bear burden.',
      seriesConnectionResonance: 'Power of Full Engagement energy management; Emperor state hyper-focus introduction; siege mentality establishing; Book 4 addiction foreshadowing.',
      sceneCardProgression: 226,
      realWorldContext: 'Energy management necessity, psychological warfare, exhaustion tactics.',
      timelineSignificance: '11/7/1320 morning—Post-Crash + 8 days, drone siege beginning requiring Emperor endurance stance.',
      saveTheCatBeat: truncate('Finale - exhaustion siege threatens collapse', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'oppressive_harassment',
        narrative_mode: 'weary_recognition',
      }),
      learning_objectives: JSON.stringify([
        'Power of Full Engagement energy management',
        'Psychological warfare recognition',
        'Endurance necessity over strength',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Energy audit coming',
        'Emperor protective stance',
        '48-hour vigil preparation',
      ]),
    },
    {
      pages: 'Page 560 - 563',
      description: 'Francisco pulling team off-line \'useless like this\'—force-feeding rations ordering mandatory sleep—attack-warning \'Let them. I have wall\'—teaching energy pulsing intense-focus deep-recovery—burden taking as Emperor Throne Father protecting children strategizes prioritizing recovery sacrificing quiet protective audit energy manages.',
      focus: 'Strategy prioritizing recovery through energy management.',
      chapterSceneFocus: 'Ch78S2: Francisco off-line pulling \'useless\' force-feeding sleep ordering—attack warning \'wall mine\'—energy pulsing teaching focus-recovery—burden taking as Emperor Father protecting strategizes recovery quiet protective sacrifices audit manages.',
      preliminarySceneFocus: 'Emperor Father protects sacrificially',
      preliminarySceneDescription: 'Energy pulsing manages recovery quietly protective',
      narrativeFunction: 'Demonstrates Power of Full Engagement methodology; shows Francisco\'s protective leadership; establishes energy pulsing strategy.',
      sensoryDetail: 'Team pulling off-line, useless declaration, rations force-feeding, mandatory sleep order, attack warning, wall having declaration, energy pulsing teaching, intense focus, deep recovery, burden taking, dark circles Novella eyes, Francisco weapon checking steady hands, bunker breathing sound.',
      internalConflict: 'Francisco experiencing protective instinct—accepting burden to enable team recovery, trusting energy management over constant vigilance.',
      characterGrowthElement: 'Francisco embodying Emperor protective authority—teaching energy pulsing rhythm, taking Father role sacrificing personal safety for team restoration.',
      seriesConnectionResonance: 'Power of Full Engagement pulsing demonstration; Emperor protecting children archetype; leadership by example establishing; willpower depletion setup.',
      sceneCardProgression: 227,
      realWorldContext: 'Energy pulsing methodology, recovery prioritization, protective leadership.',
      timelineSignificance: '11/7/1320 night—forcing team rest while accepting solo vigil responsibility, Emperor stance beginning.',
      saveTheCatBeat: truncate('Finale - energy audit enables team recovery', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'quiet_protective',
        narrative_mode: 'sacrificial_care',
      }),
      learning_objectives: JSON.stringify([
        'Power of Full Engagement pulsing',
        'Recovery prioritization strategy',
        'Leadership by burden-bearing',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Francisco solo vigil',
        'Trance state entry',
        '48-hour endurance feat',
      ]),
    },
    {
      pages: 'Page 563 - 567',
      description: 'Francisco alone wall—drones coming shooting down one-by-one—hour after hour trance-state entering—no fear no fatigue just action—Emperor order-imposing chaos—darkest night line-holding lighthouse being as Stone Statue Unblinking Eye Force Will climaxes endurance surviving night feat hypnotically transcendent.',
      focus: 'Climax surviving night through willpower transcendence.',
      chapterSceneFocus: 'Ch78S3: Francisco wall-alone drones shooting one-by-one—hour-after-hour trance entering—no fear/fatigue action—Emperor chaos-ordering darkest night holding lighthouse as Stone Unblinking Will climaxes endurance feat hypnotic transcendent surviving.',
      preliminarySceneFocus: 'Stone Unblinking Will transcends hypnotically',
      preliminarySceneDescription: 'Emperor chaos-ordering survives night feat',
      narrativeFunction: 'Executes 48-hour Emperor vigil; demonstrates willpower depletion and renewal; creates maximum endurance climax.',
      sensoryDetail: 'Wall solitude, drones coming, shooting down, one-by-one elimination, hour after hour, trance state, fear absence, fatigue absence, pure action, Emperor being, order imposing, chaos controlling, darkest night, line holding, lighthouse being, statue stillness, unblinking vigilance, will force.',
      internalConflict: 'Francisco experiencing transcendence—entering trance beyond fear and fatigue, becoming pure will incarnate.',
      characterGrowthElement: 'Francisco achieving Emperor complete embodiment—sustaining 48-hour vigil through willpower transcendence, becoming unshakeable pillar for team.',
      seriesConnectionResonance: 'Willpower depletion-renewal demonstration; Emperor state hyper-focus dangerous addiction Book 4; lighthouse archetype establishing; limits of heroism showing.',
      sceneCardProgression: 228,
      realWorldContext: 'Willpower sustainability, trance state focus, endurance limits.',
      timelineSignificance: '11/8/1320 0300 hours—darkest hour of 48-hour vigil, Emperor state peak demonstration, heroic endurance climax.',
      saveTheCatBeat: truncate('Finale - Emperor vigil holds darkest hour', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'hypnotic_endurance',
        narrative_mode: 'transcendent_will',
      }),
      learning_objectives: JSON.stringify([
        'Willpower depletion and renewal',
        'Trance state focus achievement',
        'Emperor unshakeable pillar embodiment',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Francisco collapse coming',
        'Team energized takeover',
        'Guard changing renewal',
      ]),
    },
    {
      pages: 'Page 567 - 570',
      description: 'Dawn team waking rested—wall rushing Francisco still-there drone-shells surrounding—turning smiling collapsing not-dead just-empty—Novella catching \'We have it now\'—team wall-taking energized sacrifice—finale ready as Guard Changing Resurrection resolves team restored inspiring grateful handoff Novella POV renewal.',
      focus: 'Resolution restoring team through guard changing renewal.',
      chapterSceneFocus: 'Ch78S4: Dawn team rested rushing—Francisco still-there shells surrounding smiling collapsing empty—Novella catching \'have it\'—sacrifice-energized wall-taking finale-ready as Guard Resurrection resolves restored inspiring grateful handoff renews Novella.',
      preliminarySceneFocus: 'Guard Resurrection renews grateful inspiration',
      preliminarySceneDescription: 'Team restored energized handoff inspiring Novella',
      narrativeFunction: 'Resolves endurance arc; demonstrates sacrifice power; transfers burden to renewed team; completes Emperor cycle.',
      sensoryDetail: 'Dawn arrival, team waking, rested state, wall rushing, Francisco presence, drone shells surrounding, turn smiling, collapse, not-dead empty, Novella catching weight, have-it declaration, sacrifice energizing, team wall-taking, finale readiness, smoke rising crushed machine, light returning soldiers eyes, sun breaking purple clouds.',
      internalConflict: 'Novella experiencing gratitude—recognizing Francisco sacrifice while accepting renewed team responsibility, energized by his example.',
      characterGrowthElement: 'Francisco completing Emperor sacrifice cycle—giving everything to restore team, proving leadership through endurance; Novella receiving torch accepting renewed responsibility.',
      seriesConnectionResonance: 'Guard changing archetype; sacrifice energizing others; Emperor limits showing; siege mentality prepared; team readiness for Book 2 finale.',
      sceneCardProgression: 229,
      realWorldContext: 'Leadership sacrifice power, team renewal through example, responsibility handoff.',
      timelineSignificance: '11/8/1320 dawn—48-hour vigil complete, Francisco collapse after holding line, team renewed ready for final battle, Resurrection beat complete.',
      saveTheCatBeat: truncate('Finale - sacrifice renews team for finale', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'inspiring_renewal',
        narrative_mode: 'grateful_restoration',
      }),
      learning_objectives: JSON.stringify([
        'Sacrifice power to energize others',
        'Leadership through endurance example',
        'Energy management cycle completion',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Book 2 finale readiness',
        'Team energized for final battle',
        'Emperor state limits shown',
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
        chapterUniqueIdentifier: 'EA-078',
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

  console.log(`\n✅ EA-078 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
