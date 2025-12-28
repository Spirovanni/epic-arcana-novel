import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎨 Adding missing fields to EA-021 and EA-022...\n');

  // Process EA-021
  await processChapter('EA-021', ea021Data);

  // Process EA-022
  await processChapter('EA-022', ea022Data);

  console.log('\n🎉 Completed EA-021 and EA-022!');
}

async function processChapter(eaId: string, sceneData: any[]) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`\n📖 Processing ${eaId}...\n`);

  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, eaId))
    .limit(1);

  if (ch.length === 0) {
    console.error(`❌ ${eaId} not found`);
    return;
  }

  const chapter = ch[0];
  console.log(`✅ Found: ${chapter.title}`);

  const chapterScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  console.log(`   Current scenes: ${chapterScenes.length}`);
  console.log(`   Data for: ${sceneData.length} scenes\n`);

  for (let i = 0; i < Math.min(chapterScenes.length, sceneData.length); i++) {
    const scene = chapterScenes[i];
    const data = sceneData[i];

    await db
      .update(scenes)
      .set({
        focus: data.focus,
        pages: data.pages,
        characterGrowthElement: data.characterGrowthElement,
        sceneCardProgression: data.sceneCardProgression,
        realWorldContext: data.realWorldContext,
        timelineSignificance: data.timelineSignificance,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title || 'Untitled'}`);
  }
}

// EA-021: The Forge of Perseverance
const ea021Data = [
  {
    // Scene 1: The Hall of Infinite Lessons
    focus: 'Francisco and Zara face the overwhelming reality of cosmic-scale responsibility',
    pages: 'Page 301 - 310',
    characterGrowthElement:
      'Francisco confronts the impossibility of mastering all cosmic knowledge instantly, learning that true mastery requires accepting limitations and committing to persistent incremental growth across lifetimes.',
    sceneCardProgression: 21,
    realWorldContext:
      'The Hall of Infinite Lessons mirrors real-world archive halls like the Library of Alexandria or Vatican Secret Archives, but scaled to cosmic proportions. The overwhelming sense of knowledge beyond mortal capacity reflects scholarly experiences of dissertation research or entering specialized fields—confronting vast domains where expertise takes decades, not days.',
    timelineSignificance:
      'Establishes that cosmic challenges require persistent commitment beyond single lifetimes. Francisco and Zara learn that effectiveness comes not from omniscience but from strategic focus and endurance—critical for their role as guardians across temporal conflicts.',
  },
  {
    // Scene 2: The Training of Endless Commitment
    focus: 'Zara struggles with monotonous protection work lacking immediate visible results',
    pages: 'Page 311 - 320',
    characterGrowthElement:
      'Zara evolves from seeking glory in dramatic victories to finding purpose in invisible protective work. She learns that the highest-value contributions often go unrecognized, and that sustained commitment to unglamorous work builds true mastery.',
    sceneCardProgression: 22,
    realWorldContext:
      'Draws from endurance training, meditation practice, and professional apprenticeships where mastery emerges from thousands of hours of repetitive, unglamorous work. Mirrors experiences of athletes maintaining conditioning, musicians practicing scales, or professionals doing unsexy foundational work that enables future success.',
    timelineSignificance:
      'Transforms Zara\'s protective capabilities from reactive heroism to strategic prevention. This shift from visible intervention to invisible prevention becomes essential for timeline protection—preventing divergences before they cascade into cosmic catastrophes.',
  },
  {
    // Scene 3: The Covenant of Eternal Service
    focus: 'Francisco and Zara commit to cosmic service across lifetimes and timelines',
    pages: 'Page 321 - 330',
    characterGrowthElement:
      'Both Francisco and Zara transcend short-term thinking, accepting that their cosmic role extends across incarnations. They integrate perseverance as identity rather than temporary effort, understanding that cosmic balance requires multi-lifetime commitment.',
    sceneCardProgression: 23,
    realWorldContext:
      'Echoes religious vows, military oaths, and professional commitments where individuals pledge service beyond personal convenience. References monastic traditions of lifelong dedication, scientific researchers pursuing multi-decade projects, and environmental activists working for change they may never witness.',
    timelineSignificance:
      'The covenant binds Francisco and Zara to cosmic guardianship across all timelines and incarnations. This commitment enables them to access resources and authorities beyond mortal permissions—essential for their expanding role in universal conflicts.',
  },
];

// EA-022: The Treasury of Infinite Choices
const ea022Data = [
  {
    // Scene 1: The Master Treasurer's Welcome
    focus: 'Francisco learns strategic resource allocation across cosmic timelines',
    pages: 'Page 331 - 340',
    characterGrowthElement:
      'Francisco transitions from short-term tactical thinking to multi-timeline strategic resource management. He learns that cosmic effectiveness requires treating time, energy, and attention as finite resources requiring deliberate investment rather than reactive spending.',
    sceneCardProgression: 24,
    realWorldContext:
      'The Treasury mirrors financial strategy rooms, military logistics centers, and investment banks—spaces where professionals allocate scarce resources across competing priorities. Reflects real experiences of portfolio management, strategic planning sessions, and opportunity-cost decision-making.',
    timelineSignificance:
      'Establishes resource scarcity as a cosmic constant. Even with vast cosmic power, Francisco learns that effectiveness requires choosing where to invest attention and energy—critical for navigating infinite possibilities without dissipating impact.',
  },
  {
    // Scene 2: The Investment Simulation
    focus: 'Zara practices strategic patience and delayed gratification at cosmic scale',
    pages: 'Page 341 - 350',
    characterGrowthElement:
      'Zara learns to value invisible prevention work over visible intervention. She discovers that investing resources in foundational systems that prevent problems yields higher returns than heroic responses to crises—even though prevention receives no recognition.',
    sceneCardProgression: 25,
    realWorldContext:
      'Draws from investment simulations, strategic games, and delayed-gratification experiments like the marshmallow test. Mirrors professional experiences where investing time in systems, processes, or infrastructure pays compound returns but lacks immediate satisfaction.',
    timelineSignificance:
      'Trains Zara in strategic resource deployment across timelines. Her ability to invest protection resources where they compound prevents cascade failures—essential for maintaining timeline stability across infinite branching possibilities.',
  },
  {
    // Scene 3: The Portfolio of Purpose
    focus: 'Francisco and Zara align their cosmic resource allocation with deepest purpose',
    pages: 'Page 351 - 360',
    characterGrowthElement:
      'Both protagonists integrate strategic thinking with purpose clarity. They learn that optimal resource allocation requires knowing not just how to invest but why—ensuring cosmic power serves conscious purpose rather than reactive impulses or external pressures.',
    sceneCardProgression: 26,
    realWorldContext:
      'References strategic planning frameworks, values-based investing, and purpose-driven leadership. Mirrors experiences of mission statement development, priority clarification exercises, and strategic retreats where organizations align operations with core purpose.',
    timelineSignificance:
      'Establishes Francisco and Zara\'s cosmic resource allocation framework based on purpose rather than pressure. This clarity prevents manipulation by cosmic forces seeking to redirect their power—crucial for maintaining sovereignty amid universal politics.',
  },
];

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
