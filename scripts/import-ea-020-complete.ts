import { db } from '../src/lib/db';
import { scenes, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing scenes for EA-020: The Crucible of Consistency...\n');

  // Get chapter ID
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-020'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-020 not found. Please run create-ea-020-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  const scenesData = [
    // Scene 1: The Guardian's Challenge
    {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-020',
      sceneNumber: 1,
      title: 'The Guardian\'s Challenge',
      setup: 'Master Lumina returns with grave news: the Council of Temporal Guardians has decreed a final test before the Crown Ordeal. Francisco and Zara must enter the Crucible of Consistency—a chamber where they\'ll perform escalating magical operations for seven consecutive days without significant error. The Eight of Wands explains that creative manifestation proved their potential, but cosmic guardianship requires demonstrated reliability.',
      symbolism: 'The Crucible represents transformation through sustained heat—excellence forged through repetition. The Eight of Wands\' swift arrows symbolize precision under pressure, speed without sacrificing accuracy.',
      beatGoal: 'Establish the test\'s purpose and stakes: proving readiness through sustained excellence, not one-time brilliance',
      pov: 'Francisco',
      tense: 'Past tense',
      core_emotion: 'Apprehension mixed with recognition of necessity',
      scene_tone: 'Sobering and purposeful',
      timeline_date: '2/18/1320 - Evening',
      timeline_variant: 'Academy Prime Timeline',
      location: 'Threshold of the Crucible Chamber',
    },
    // Scene 2: Days of Fire
    {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-020',
      sceneNumber: 2,
      title: 'Days of Fire',
      setup: 'The Crucible\'s torment unfolds. Day one seems manageable. Day two introduces distractions. Day three brings fatigue. Day four escalates complexity. By day five, they\'re running on pure discipline, their creative brilliance buried under grinding exhaustion. Francisco\'s narrative manifestations begin to fracture from mental fatigue. Zara\'s adaptive innovations become sloppy from physical depletion.',
      symbolism: 'The escalating trials represent life\'s reality: cosmic crises don\'t wait for rest or optimal conditions. The Eight of Wands becomes a metronome, demanding precise tempo regardless of circumstances.',
      beatGoal: 'Demonstrate the brutal reality of sustained excellence, push characters to breaking point',
      pov: 'Zara',
      tense: 'Past tense',
      core_emotion: 'Grinding determination fighting despair',
      scene_tone: 'Grueling and relentless with moments of desperate beauty',
      timeline_date: '2/19-23/1320 - Days 1-5',
      timeline_variant: 'Crucible Time Dilation',
      location: 'The Crucible Chamber',
    },
    // Scene 3: Excellence Embodied
    {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-020',
      sceneNumber: 3,
      title: 'Excellence Embodied',
      setup: 'Day six dawns, and something shifts. Francisco and Zara stop fighting the Crucible and start flowing with it. Their exhaustion becomes fuel, their fear becomes focus. Francisco discovers that discipline has transformed his sporadic genius into embodied capability. Zara finds that systematic practice has elevated her innovations from creative problem-solving to instinctive mastery. They succeed not through heroic effort but through habituated excellence.',
      symbolism: 'The transformation from fighting to flowing represents mastery—discipline becomes nature. The synchronization between Francisco and Zara symbolizes how individual excellence enables collective achievement.',
      beatGoal: 'Demonstrate the transformation: from forced discipline to embodied excellence, prove readiness for cosmic responsibility',
      pov: 'Francisco',
      tense: 'Past tense',
      core_emotion: 'Transcendent flow state and profound satisfaction',
      scene_tone: 'Triumphant and transformative with spiritual depth',
      timeline_date: '2/24-25/1320 - Days 6-7',
      timeline_variant: 'Crucible Completion',
      location: 'The Crucible Chamber - Ordeal Simulation',
    },
  ];

  let sceneCardCounter = 58; // EA-020 scenes start at card 58

  for (const sceneData of scenesData) {
    console.log(`\n📝 Scene ${sceneData.sceneNumber}: ${sceneData.title}`);

    // Insert base scene
    const [insertedScene] = await db
      .insert(scenes)
      .values(sceneData)
      .returning();

    console.log(`   ✅ Base scene created (ID: ${insertedScene.id})`);

    // Enhanced fields based on scene number
    let enhancedData: any = {};

    if (sceneData.sceneNumber === 1) {
      enhancedData = {
        pages: 'Page 286 - 289',
        description: 'Master Lumina returns with Guardians\' final pre-Ordeal test decree: Crucible of Consistency requiring seven days perfect magical execution without significant error. Eight of Wands explains creative manifestation proved potential, but guardianship requires demonstrated reliability. Francisco confronts his sporadic genius weakness, Zara learns excellence under fatigue matters more than peak performance.',
        focus: truncate('Establishing consistency test proving readiness through sustained excellence not brilliance', 255),
        chapterSceneFocus: truncate('Ch20S1: Guardians decree Crucible test—seven days perfect execution. Eight of Wands demands reliability. Francisco/Zara must prove sustained excellence, not sporadic genius', 255),
        preliminarySceneFocus: 'Proving readiness through sustained performance',
        preliminarySceneDescription: 'Crucible test addresses critical gap: creative manifestation showed potential, but cosmic responsibility requires maintaining excellence when exhausted, distracted, afraid. Seven-day duration forces transformation from forced effort to habituated mastery.',
        sensoryDetail: 'Crucible Chamber threshold crackling with Eight of Wands energy, crystalline arrows of swift precision hovering, Master Lumina grave and caring, temporal pressure palpable, seven-day gauntlet looming.',
        internalConflict: 'Francisco recognizing his deepest weakness exposed—sporadic genius brilliant in moments but unreliable under sustained pressure. Fear that Crucible will prove he\'s not ready despite all training.',
        characterGrowthElement: 'Francisco confronting gap between creative potential (EA-019) and disciplined delivery—discovering that cosmic responsibility requires transforming sporadic brilliance into reliable mastery.',
        seriesConnectionResonance: 'Discipline foundation establishing pattern for Books 2-3: cosmic crises require sustained excellence, not just heroic moments. Guardianship is marathon not sprint.',
        sceneCardProgression: sceneCardCounter++,
        realWorldContext: '2/18/1320 evening—Final test before Crown Ordeal, Guardians ensuring candidates prove readiness through demonstrated consistency not just potential.',
        timelineSignificance: 'Crucible test preventing premature Ordeal attempts—past brilliant candidates failed because they couldn\'t maintain performance when afraid and exhausted.',
        saveTheCatBeat: 'Approaching Inmost Cave - final proving',
        sudowrite_metadata: JSON.stringify({
          intensity: 'sobering',
          pacing: 'purposeful_grave',
          narrative_mode: 'challenge_establishing',
          visual_anchor: 'Crucible threshold Eight Wands arrows precision test',
          emotional_core: 'Apprehension necessity recognition fear'
        }),
        learning_objectives: JSON.stringify([
          'Sustained excellence requires discipline transforming brilliance into habit',
          'Cosmic responsibility demands reliability not just peak performance',
          'Testing consistency under pressure reveals true readiness'
        ]),
        foreshadowing_elements: JSON.stringify([
          'Seven-day transformation mirrors creation cycle—they must recreate selves',
          'Excellence under exhaustion crucial for Ordeal survival',
          'Francisco/Zara synchronization foreshadowing merged capabilities',
          'Discipline foundation for perseverance covenant (EA-021)'
        ])
      };
    } else if (sceneData.sceneNumber === 2) {
      enhancedData = {
        pages: 'Page 290 - 295',
        description: 'Crucible torment unfolds across five brutal days. Day one manageable, day two adds distractions, day three fatigue from prevented sleep, day four escalates complexity, day five grinds on pure discipline. Francisco\'s manifestations fracture from mental exhaustion, Zara\'s innovations sloppy from physical depletion. Both face crisis: reset and restart, or push through imperfect execution risking catastrophic failure.',
        focus: truncate('Demonstrating brutal sustained excellence reality, pushing characters to breaking point', 255),
        chapterSceneFocus: truncate('Ch20S2: Five days escalating torture—distractions, fatigue, complexity. Francisco fracturing from exhaustion, Zara sloppy from depletion. Crisis: reset or push through imperfection', 255),
        preliminarySceneFocus: 'Grueling test revealing excellence costs',
        preliminarySceneDescription: 'Escalating trials represent life reality: cosmic crises don\'t wait for optimal conditions. Eight of Wands metronome demands precise tempo regardless of exhaustion, fear, distraction. The choice between reset and perseverance differentiates practice from performance.',
        sensoryDetail: 'Days blurring into exhaustion haze, phantom voices whispering doubts, illusory threats manifesting, emotional manipulations attacking confidence, sleep-deprived hallucinations, complex operations requiring split-second timing, bodies screaming for rest.',
        internalConflict: 'Zara fighting warrior instinct demanding she power through versus recognizing that sloppy execution in cosmic stakes could kill innocents—precision matters more than completion.',
        characterGrowthElement: 'Zara discovering that warrior discipline isn\'t about never breaking but about maintaining standards when breaking. Her adaptive innovations must become systematic protocols reliable under any condition.',
        seriesConnectionResonance: 'Crucible experience establishing template for future crises: Books 2-3 will demand sustained excellence through impossible conditions. This training prevents future failures.',
        sceneCardProgression: sceneCardCounter++,
        realWorldContext: '2/19-23/1320—Five days deliberate torture testing whether creative brilliance can transform into reliable delivery under worst conditions.',
        timelineSignificance: 'Crucible time dilation compressing transformation—seven subjective days enabling growth that normally requires months of practice.',
        saveTheCatBeat: 'Approaching Inmost Cave - ordeal preview',
        sudowrite_metadata: JSON.stringify({
          intensity: 'grueling',
          pacing: 'relentless_grinding',
          narrative_mode: 'endurance_testing',
          visual_anchor: 'Exhaustion torture escalating distractions fatigue fracturing',
          emotional_core: 'Determination despair grinding crisis breaking'
        }),
        learning_objectives: JSON.stringify([
          'Excellence means maintaining standards when exhausted and afraid',
          'Discipline isn\'t about never struggling but about precision despite struggle',
          'Systematic practice transforms sporadic ability into reliable capability',
          'Crisis performance requires habituated mastery not heroic willpower'
        ]),
        foreshadowing_elements: JSON.stringify([
          'Breaking point experience preparing for Crown Ordeal intensity',
          'Sloppy execution danger foreshadowing stakes of cosmic failures',
          'Transformation through suffering establishing perseverance foundation',
          'Day five crisis forcing choice defining their character'
        ])
      };
    } else if (sceneData.sceneNumber === 3) {
      enhancedData = {
        pages: 'Page 296 - 300',
        description: 'Day six shift: Francisco/Zara stop fighting Crucible, start flowing with it. Exhaustion becomes fuel, fear becomes focus. Discipline transformed sporadic genius into embodied capability—hands shape reality before conscious mind engages. Day seven final sequence: staggering complexity under Ordeal simulation conditions. Success through habituated excellence not heroic effort. Eight of Wands absorbed into their beings. Guardians acknowledge readiness for sustained commitment beyond any single trial.',
        focus: truncate('Transformation from forced discipline to embodied excellence, proving cosmic readiness', 255),
        chapterSceneFocus: truncate('Ch20S3: Day six transformation—fighting to flowing. Exhaustion fuel, fear focus, discipline embodied. Day seven Ordeal simulation succeeded through habit not heroism. Excellence internalized', 255),
        preliminarySceneFocus: 'Excellence embodied through transformation',
        preliminarySceneDescription: 'Transformation from fighting to flowing represents true mastery—discipline becoming nature not effort. Synchronization between Francisco/Zara demonstrates how individual excellence enables collective achievement impossible alone. Eight of Wands arrows becoming part of them shows discipline internalized.',
        sensoryDetail: 'Day six dawn bringing shift from strain to flow, exhaustion integrating as power source, final sequence staggering complexity under temporal storms and divine interference, perfect synchronization between partners, Eight of Wands dissolving into their essence.',
        internalConflict: 'Francisco experiencing transcendent flow—no longer thinking about excellence but living it. Discovering discipline has rewritten his neural pathways, sporadic genius transformed into systematic mastery.',
        characterGrowthElement: 'Francisco completing transformation from EA-019 creative manifestation to EA-020 disciplined delivery—proving that potential only matters when reliable. Foundation for perseverance covenant.',
        seriesConnectionResonance: 'Embodied excellence establishing capability foundation: Books 2-3 cosmic responsibilities possible only because discipline transformed potential into reliable delivery. Guardianship earned through proven consistency.',
        sceneCardProgression: sceneCardCounter++,
        realWorldContext: '2/24-25/1320—Days six-seven completing transformation, Ordeal simulation proving readiness for Crown challenge and lifelong commitment beyond.',
        timelineSignificance: 'Crucible completion ensuring candidates won\'t fail Ordeal from inability to maintain performance—discipline internalized enabling cosmic responsibility.',
        saveTheCatBeat: 'Approaching Inmost Cave - readiness proven',
        sudowrite_metadata: JSON.stringify({
          intensity: 'transcendent',
          pacing: 'flow_triumphant',
          narrative_mode: 'mastery_achieved',
          visual_anchor: 'Flow state perfect synchronization Ordeal simulation excellence embodied',
          emotional_core: 'Transcendence satisfaction mastery readiness completion'
        }),
        learning_objectives: JSON.stringify([
          'True mastery transforms discipline from effort to nature',
          'Excellence becomes embodied through thousands of intentional iterations',
          'Flow state emerges when systematic practice removes conscious limitation',
          'Sustained commitment possible only through habituated capability',
          'Individual discipline enables collective excellence through synchronization'
        ]),
        foreshadowing_elements: JSON.stringify([
          'Embodied excellence enabling Crown Ordeal survival',
          'Perfect synchronization foreshadowing merged consciousness abilities',
          'Discipline foundation for EA-021 perseverance covenant',
          'Guardians acknowledgment establishing lifelong relationship',
          'Ordeal simulation previewing actual Crown challenge conditions'
        ])
      };
    }

    // Update scene with enhanced fields
    await db
      .update(scenes)
      .set(enhancedData)
      .where(eq(scenes.id, insertedScene.id));

    console.log(`   ✅ Enhanced fields added`);

    // Count fields
    const fieldCount = Object.keys(enhancedData).length + Object.keys(sceneData).length;
    console.log(`   📊 Total fields: ${fieldCount}`);
  }

  console.log('\n✅ All scenes imported successfully!');
  console.log(`📖 Chapter: EA-020 - ${chapter.title}`);
  console.log(`🎬 Scenes: 3`);
  console.log(`🎴 Scene cards: 58-60`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
