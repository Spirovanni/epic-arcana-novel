import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-063: Strong Leadership (Book 2, Chapter 23)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-063'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-063 not found. Run create-ea-063-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The War of Words',
      setup: 'The Council Chamber is a shouting match. Marco (Hawks) slams a map on the table: \'We hit his supply depots!\' The Head Medici (Doves) counters: \'We reinforce the shields!\' Francisco sits at the head of the table, silent. He tries to mediate, but mediation is failing. He realizes that \'compromise\' will kill them. A half-attack, half-defense strategy is a losing strategy.',
      symbolism: 'The Two of Wands reversed—dominion disputes. The Cacophony.',
      beat_goal: 'Establish the impasse. The old way of leading (consensus) is broken.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Overwhelmed',
      scene_tone: 'Chaotic',
      timeline_date: '7/15/1320 - Morning',
      timeline_variant: 'Sanctuary Council Room',
      location: 'The Council Chamber',
    },
    {
      scene_number: 2,
      scene_title: 'The View from the Top',
      setup: 'Francisco leaves the meeting. He finds La Signora waiting. She leads him up the endless stairs to the Spire. It is quiet up there. They look out at the swirling raw mana of the Void. \'Dagon plays Go,\' she says. \'You are playing Chess. You are trying to capture pieces. He is trying to claim territory.\' She hands him a telescope—not for seeing far, but for seeing *structure*. He sees the pattern. He stops thinking about the enemy and starts thinking about the board.',
      symbolism: 'The Mountain Top. The Eagle\'s View. The Three of Wands (Looking out to sea).',
      beat_goal: 'The Epiphany. Meeting the Goddess (Wisdom).',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Awe',
      scene_tone: 'Philosophical and grand',
      timeline_date: '7/15/1320 - Sunset',
      timeline_variant: 'The High Spire',
      location: 'The Spire',
    },
    {
      scene_number: 3,
      scene_title: 'The Third Way',
      setup: 'Francisco returns to the Chamber. The argument hasn\'t stopped. He interrupts it—quietly. \'We are not attacking. We are not hiding.\' He draws a new circle on the map: The Empty Zone. \'We are planting.\' He explains the Seeding Strategy. Create false signals. Dilute Dagon\'s bandwidth. It appeals to the Hawks (it\'s offensive) and the Doves (it\'s evasive). It is synthesis.',
      symbolism: 'The Triangle merging two points. The \'Third Option\'.',
      beat_goal: 'The Solution. Presenting the Vision.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Focus',
      scene_tone: 'Compelling',
      timeline_date: '7/15/1320 - Night',
      timeline_variant: 'Sanctuary Council Room',
      location: 'The Council Chamber',
    },
    {
      scene_number: 4,
      scene_title: 'The Order',
      setup: 'The room is silent. Then, Marco nods. Then the Medici. They aren\'t voting; they are agreeing. Francisco gives the orders. \'Marco, prep the seed units. Medici, calibrate the cloaking.\' His voice has changed. It isn\'t a question anymore. He has become the Three of Wands: The Commander. The chapter ends with the teams moving out, unified by a single purpose.',
      symbolism: 'The Baton of Command. The Unification. The Ship setting sail.',
      beat_goal: 'Resolution. Authority established.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Commanding',
      scene_tone: 'Decisive',
      timeline_date: '7/15/1320 - Late Night',
      timeline_variant: 'Sanctuary HQ',
      location: 'The Map Room',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 331 - 335',
      description: 'Council Chamber shouting match with Marco Hawks slamming map demanding supply depot attacks while Head Medici Doves counter with shield reinforcement—Francisco sitting silent at table head trying to mediate but failing, realizing compromise will kill them as half-attack half-defense strategy loses.',
      focus: 'Establishing impasse where old consensus leadership is broken.',
      chapterSceneFocus: 'Ch63S1: Council Chamber shouting match between Marco Hawks demanding attacks and Medici Doves demanding defense—Francisco silent at head trying mediation failing, realizing compromise creates losing half-strategy as old consensus leadership breaks down.',
      preliminarySceneFocus: 'Cacophony reveals consensus failure',
      preliminarySceneDescription: 'Shouting match breaks mediation attempts',
      narrativeFunction: 'Establishes strategic deadlock; shows consensus leadership inadequacy; creates crisis requiring new approach.',
      sensoryDetail: 'Shouting match, map slammed on table, supply depot attack demands, shield reinforcement counters, silent Francisco at head, failing mediation, cacophony.',
      internalConflict: 'Francisco paralyzed by validity of both arguments, unable to mediate opposing positions.',
      characterGrowthElement: 'Francisco recognizing old consensus approach cannot resolve fundamental strategic opposition.',
      seriesConnectionResonance: 'Leadership crisis requiring vision over mediation; sets up Three of Wands transformation.',
      sceneCardProgression: 166,
      realWorldContext: 'Consensus failure in crisis, paralysis through valid opposing viewpoints, leadership inadequacy.',
      timelineSignificance: 'Alliance splintering without clear enemy—internal conflict threatening unity.',
      saveTheCatBeat: truncate('Bad Guys Close In - internal conflict threatens Alliance', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'chaotic_conflict',
        narrative_mode: 'overwhelming_cacophony',
      }),
      learning_objectives: JSON.stringify([
        'Consensus inadequate for crisis decisions',
        'Compromise as losing strategy',
        'Internal conflict as threat',
      ]),
      foreshadowing_elements: JSON.stringify([
        'La Signora intervention coming',
        'Vision epiphany needed',
        'Third way synthesis solution',
      ]),
    },
    {
      pages: 'Page 335 - 338',
      description: 'Francisco leaving meeting finds La Signora waiting—ascending endless stairs to quiet Spire viewing swirling Void mana—La Signora teaching "Dagon plays Go claiming territory, you play Chess capturing pieces," handing telescope for seeing structure not distance, Francisco seeing pattern thinking board not enemy.',
      focus: 'Epiphany through Meeting Goddess giving wisdom perspective.',
      chapterSceneFocus: 'Ch63S2: La Signora leading Francisco up Spire to view Void—teaching Go versus Chess metaphor where Dagon claims territory not captures pieces—telescope revealing structure pattern shifting Francisco from enemy-thinking to board-thinking as Goddess wisdom.',
      preliminarySceneFocus: 'Eagle view reveals structure',
      preliminarySceneDescription: 'Goddess gives perspective not weapon',
      narrativeFunction: 'Provides transformative epiphany; fulfills Goddess archetype; unlocks Three of Wands vision.',
      sensoryDetail: 'Leaving meeting, La Signora waiting, endless stairs ascending, quiet Spire, swirling Void raw mana, Go versus Chess teaching, telescope for structure, pattern revelation.',
      internalConflict: 'Francisco shifting from tactical enemy-focus to strategic board-thinking.',
      characterGrowthElement: 'Francisco receiving wisdom perspective unlocking Vision archetype—seeing structure over conflict.',
      seriesConnectionResonance: 'La Signora as Goddess mentor; Go/Chess metaphor defining Dagon\'s strategy; vision maturity turning point.',
      sceneCardProgression: 167,
      realWorldContext: 'Perspective shift from tactics to strategy, seeing patterns over pieces, wisdom mentorship.',
      timelineSignificance: 'Critical epiphany enabling expansion strategy over attack/defense binary.',
      saveTheCatBeat: truncate('Bad Guys Close In - wisdom provides escape from impasse', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'philosophical_epiphany',
        narrative_mode: 'awe_revelation',
      }),
      learning_objectives: JSON.stringify([
        'Go versus Chess strategic thinking',
        'Structure seeing over enemy focus',
        'Goddess gives perspective not weapons',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Seeding strategy emerging',
        'Third way synthesis',
        'Commander authority transformation',
      ]),
    },
    {
      pages: 'Page 338 - 342',
      description: 'Francisco returning to ongoing argument Chamber—interrupting quietly declaring neither attacking nor hiding but planting—drawing Empty Zone circle explaining Seeding Strategy creating false signals diluting Dagon bandwidth—appealing to Hawks offensively and Doves evasively as synthesis third option.',
      focus: 'Presenting Vision solution as synthesis.',
      chapterSceneFocus: 'Ch63S3: Francisco returning to argument interrupting with neither-attack-nor-hide declaration—drawing Empty Zone for Seeding Strategy planting false signals diluting Dagon bandwidth—synthesizing Hawks offense and Doves evasion as compelling third option.',
      preliminarySceneFocus: 'Triangle merges opposing points',
      preliminarySceneDescription: 'Seeding synthesis unites factions',
      narrativeFunction: 'Presents solution; demonstrates vision leadership; synthesizes opposing factions; introduces critical expansion mechanic.',
      sensoryDetail: 'Returning to Chamber, ongoing argument, quiet interruption, Empty Zone circle drawn, Seeding Strategy explanation, false signals, bandwidth dilution, synthesis appeal.',
      internalConflict: 'Francisco confidently presenting audacious plan transcending binary opposition.',
      characterGrowthElement: 'Francisco embodying Three of Wands Vision—creating third way synthesis over compromise.',
      seriesConnectionResonance: 'Seeding strategy enables series climax; mimics Dagon\'s viral nature as "fight fire with fire."',
      sceneCardProgression: 168,
      realWorldContext: 'Third way thinking, synthesis over compromise, audacious vision uniting factions.',
      timelineSignificance: 'Seeding expansion strategy resolves deadlock, enabling proactive rather than reactive posture.',
      saveTheCatBeat: truncate('Bad Guys Close In - audacious vision provides unity', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'compelling_presentation',
        narrative_mode: 'focused_synthesis',
      }),
      learning_objectives: JSON.stringify([
        'Synthesis transcends compromise',
        'Third way unites oppositions',
        'Vision leadership over mediation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Unified agreement coming',
        'Commander authority emerging',
        'Teams mobilizing',
      ]),
    },
    {
      pages: 'Page 342 - 345',
      description: 'Silent room then Marco nodding then Medici—not voting but agreeing—Francisco giving orders prepping seed units and calibrating cloaking with changed voice not questioning anymore—becoming Three of Wands Commander as teams move out unified by single purpose.',
      focus: 'Resolution establishing authority through unified action.',
      chapterSceneFocus: 'Ch63S4: Silent room breaking as Marco then Medici nod agreeing not voting—Francisco ordering seed unit prep and cloaking calibration with changed commanding voice—becoming Three of Wands Commander as unified teams mobilize for single purpose.',
      preliminarySceneFocus: 'Baton commands unified ship',
      preliminarySceneDescription: 'Authority established through agreement',
      narrativeFunction: 'Resolves chapter; establishes Francisco\'s unquestioned authority; unifies factions; initiates action.',
      sensoryDetail: 'Silent room, Marco nodding, Medici nodding, agreeing not voting, orders given, seed units prepping, cloaking calibration, changed voice, teams moving out, unified purpose.',
      internalConflict: 'Francisco embodying commander authority without question or hesitation.',
      characterGrowthElement: 'Francisco completing transformation to Three of Wands Commander—vision enacted through unified authority.',
      seriesConnectionResonance: 'Authority crisis resolved; seeding operations begin; factions unified under single command.',
      sceneCardProgression: 169,
      realWorldContext: 'Authority through vision, agreement over voting, unified mobilization.',
      timelineSignificance: 'Alliance shifts from competing interests to unified command under Francisco\'s vision leadership.',
      saveTheCatBeat: truncate('Bad Guys Close In - unified authority mobilizes response', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'decisive_mobilization',
        narrative_mode: 'commanding_resolution',
      }),
      learning_objectives: JSON.stringify([
        'Authority through vision not mediation',
        'Agreement transcends voting',
        'Unified purpose mobilizes action',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Seeding operations beginning',
        'Fight fire with fire theme',
        'Book 2 endgame approaching',
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
        chapterUniqueIdentifier: 'EA-063',
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

  console.log(`\n✅ EA-063 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
