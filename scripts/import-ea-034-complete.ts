import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import * as fs from 'fs';
import * as path from 'path';

interface SceneData {
  scene_number: number;
  scene_title: string;
  setup?: string;
  symbolism?: string;
  beat_goal?: string;
  pov?: string;
  tense?: string;
  core_emotion?: string;
  scene_tone?: string;
  timeline_date?: string;
  timeline_variant?: string;
  location?: string;
}

interface EA034Data {
  id: string;
  title: string;
  epic_novel_pages?: string;
  epic_chapter_focus?: string;
  epic_novel_chapter_focus?: string;
  tarot_family?: string;
  tarot_card_item?: string;
  hero_journey_beat?: string;
  save_the_cat_beat?: string;
  summary?: string;
  character_arcs?: string;
  story_gaps_addressed?: string;
  location_details?: string;
  series_connections?: string;
  scenes: SceneData[];
}

function findEA034Data(): EA034Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA034Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-034') return obj as EA034Data;

    for (const key of Object.keys(obj)) {
      const result = search(obj[key]);
      if (result) return result;
    }
    return null;
  };

  return search(outlineData);
}

function truncate(str: string | undefined, maxLength: number): string | null {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
}

async function main() {
  console.log('🔍 Searching for EA-034 in outline...\n');

  const ea034Data = findEA034Data();

  if (!ea034Data) {
    console.error('❌ EA-034 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-034: ${ea034Data.title}`);
  console.log(`   Scenes: ${ea034Data.scenes?.length || 0}\n`);

  // Find the chapter - it should be chapter 34 in the same book as EA-023
  const ea023 = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-023'))
    .limit(1);

  if (ea023.length === 0) {
    console.error('❌ EA-023 not found - cannot determine book ID');
    process.exit(1);
  }

  const bookId = ea023[0].bookId;

  const existingChapter = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-034'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-034 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 34 in the same book
    const ch34 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 34))
      .limit(10);

    const correctChapter = ch34.find((ch) => ch.bookId === bookId);

    if (!correctChapter) {
      console.error('❌ Chapter 34 not found in the same book as EA-023');
      process.exit(1);
    }

    chapter = correctChapter;
    console.log(`✅ Found Chapter 34: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-034',
        title: ea034Data.title,
        epicNovelPages: truncate(ea034Data.epic_novel_pages, 50),
        epicChapterFocus: ea034Data.epic_chapter_focus,
        epicNovelChapterFocus: ea034Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea034Data.tarot_family, 100),
        tarotCardItem: truncate(ea034Data.tarot_card_item, 100),
        heroJourneyBeat: truncate(ea034Data.hero_journey_beat, 100),
        saveTheCatBeat: truncate(ea034Data.save_the_cat_beat, 255),
        summary: ea034Data.summary,
        characterArcs: ea034Data.character_arcs,
        storyGapsAddressed: ea034Data.story_gaps_addressed,
        locationDetails: ea034Data.location_details,
        seriesConnections: ea034Data.series_connections,
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-034 data\n');
  }

  // Check existing scenes
  const existingScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  if (existingScenes.length > 0) {
    console.log(`⚠️  Found ${existingScenes.length} existing scenes. Deleting them first...\n`);
    await db.delete(scenes).where(eq(scenes.chapterId, chapter.id));
  }

  // Import scenes with basic data
  console.log('📝 Importing scenes with basic data...\n');

  for (const sceneData of ea034Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-034',
      sceneNumber: sceneData.scene_number,
      title: truncate(sceneData.scene_title, 255),
      setup: sceneData.setup || null,
      symbolism: sceneData.symbolism || null,
      beatGoal: sceneData.beat_goal || null,
      pov: truncate(sceneData.pov, 100),
      tense: truncate(sceneData.tense, 100),
      core_emotion: truncate(sceneData.core_emotion, 255),
      scene_tone: truncate(sceneData.scene_tone, 255),
      timeline_date: truncate(sceneData.timeline_date, 50),
      timeline_variant: truncate(sceneData.timeline_variant, 100),
      location: truncate(sceneData.location, 255),
    };

    await db.insert(scenes).values(sceneInsert);

    console.log(`✅ Scene ${sceneData.scene_number}: ${sceneData.scene_title}`);
  }

  console.log('\n📝 Adding comprehensive scene fields...\n');

  // Get the scenes we just inserted
  const insertedScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(scenes.sceneNumber);

  const sceneEnhancements = [
    {
      // Scene 1: The Cosmic Threat Emerges
      pages: 'Page 496 - 500',
      description: 'Francisco and Zara arrive at the Nexus of Seven Realms for routine maintenance when reality itself screams warnings. Malthor, a malevolent cosmic entity whose presence distorts reality, emerges through violent dimensional rifts. The Academy Elite Guards immediately evacuate, declaring the position tactically untenable. Francisco faces his defining moment—terror screaming to flee versus deeper recognition that abandoning the Nexus means abandoning countless dimensional populations. He chooses to stand. Zara positions herself shoulder-to-shoulder, choosing valor over survival, principle over tactics.',
      focus: 'Francisco confronts the defining moment of choosing valor over survival when facing Malthor, deciding to stand despite overwhelming odds while Elite Guards retreat',
      chapterSceneFocus: 'Ch34S1: Learning that true valor means standing for what is right even when standing alone, despite terror and tactical wisdom suggesting retreat',
      preliminarySceneFocus: 'Malthor emerges at the Nexus, Elite Guards evacuate, Francisco and Zara choose to stand against impossible odds',
      preliminarySceneDescription: 'At dawn at the Nexus of Seven Realms, Francisco and Zara witness reality screaming warnings as Malthor—a malevolent cosmic entity whose presence warps reality itself—emerges through violent dimensional rifts. The Academy Elite Guards assess his overwhelming power and immediately evacuate, declaring the position tactically untenable. Francisco feels terror grip him, every instinct screaming to flee, but beneath fear stirs recognition that if everyone retreats when threats become overwhelming, the Nexus and countless dimensional populations become defenseless. He faces his defining moment: choosing valor despite impossible odds. Zara sees his choice and positions herself shoulder-to-shoulder, standing together against overwhelming darkness.',
      narrativeFunction: 'Establishes Malthor as an impossible cosmic threat through the Elite Guards\' immediate evacuation while introducing Francisco\'s defining moment of choosing valor over survival. This scene sets up the ultimate test of whether their training has created genuine heroes or merely powerful individuals.',
      sensoryDetail: 'The Nexus screams warnings through cosmic senses. Violent dimensional rifts tear reality with chaotic force. Malthor\'s presence distorts everything—gravity fluctuates wildly, time flows irregularly, dimensional fabric unravels where his attention focuses. Evacuation portals activate with urgent klaxons. Francisco\'s body trembles with terror while his spirit chooses to stand. Zara\'s shoulder-to-shoulder stance radiates shared courage.',
      internalConflict: 'Francisco struggles between overwhelming terror screaming for survival and deeper recognition that some positions must be defended regardless of personal cost. His rational mind catalogs tactical reasons for retreat while his emerging heroism understands that abandoning principles for tactical advantage is another form of surrender. He must choose between guaranteed safety and uncertain valor.',
      characterGrowthElement: 'Francisco completes his transformation from fear-driven caution to principled courage by choosing to stand against Malthor despite terror, insufficient power, and tactical wisdom suggesting retreat. He learns that true valor isn\'t the absence of fear but acting rightly despite it, measuring heroism not by guaranteed victory but by willingness to defend what matters regardless of outcome.',
      seriesConnectionResonance: 'Francisco\'s choice to stand against impossible odds when others retreat establishes the cornerstone valor that enables all his future resistance against timeline manipulation. This moment becomes legendary, inspiring future generations of cosmic agents and resistance fighters to find courage when facing overwhelming threats. His willingness to stand alone when necessary becomes his defining characteristic.',
      sceneCardProgression: 57,
      realWorldContext: 'The Nexus mirrors critical positions requiring defense when tactical wisdom suggests retreat. Francisco\'s choice reflects real-world leadership moments where principles must override survival calculus, where someone must stand even when outcomes seem hopeless. The Elite Guards\' evacuation reflects how even experienced professionals retreat from impossible odds, making genuine heroism all the more significant.',
      timelineSignificance: 'Establishes that February 28, 2320 (Divergence Point Alpha timeline variant) becomes the day Francisco chooses valor over survival, creating a legendary stand that inspires dimensional civilizations and establishes him as an embodiment of true courage. This choice will echo throughout the timeline war.',
      saveTheCatBeat: 'Dark Night of the Soul - The Choice to Stand',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the terror gripping his body, every instinct screaming to flee, the rational tactical reasons for retreat, and the deeper recognition that some positions must be defended regardless of cost. Show the internal conflict between survival and principle, the moment of choosing valor despite fear.',
        sudowrite_emotional_arc: 'Begins with routine expectation, moves through escalating terror as Malthor emerges, reaches the dark night moment of choosing to stand despite impossible odds. The emotional journey is from normalcy through fear to principled courage.',
        sudowrite_sensory_emphasis: 'Emphasize the reality-screaming warnings, violent dimensional rifts tearing space, Malthor\'s reality-warping presence distorting gravity and time, evacuation klaxons wailing, the physical sensation of terror versus the spiritual choice of valor, Zara\'s shoulder-to-shoulder presence.',
      },
      learning_objectives: {
        integration: 'True Valor and Principled Courage',
        terminal_objectives: [
          'Choose to stand for what is right even when facing impossible odds and tactical wisdom suggests retreat',
          'Transform terror from paralyzing force into motivation for principled action rather than allowing fear to dictate choices',
          'Understand that true heroism is measured not by guaranteed victory but by willingness to defend what matters regardless of personal cost',
        ],
      },
      foreshadowing_elements: [
        'Francisco\'s choice to stand foreshadows the seven critical stands he and Zara will make against Malthor',
        'The Elite Guards\' evacuation foreshadows how Francisco\'s valor will inspire even veteran agents to reconsider courage',
        'Malthor\'s overwhelming power foreshadows that success won\'t come from defeating him but from embodying principles',
      ],
    },
    {
      // Scene 2: The Stand of Valor
      pages: 'Page 501 - 505',
      description: 'At the Battleground of Courage, Francisco and Zara face seven critical stands against Malthor. Each stand tests different aspects of valor: acknowledging fear as motivation, protecting innocents through innovation, working with disruption rather than fighting it, succeeding despite isolation, rejecting safety for abandoned principles, transcending individual power to embody universal truths, and choosing sustained embodiment over tactical victory. Through six hours of sustained cosmic valor, they discover that authentic heroism awakens ancient defenses and inspires contagious courage across dimensions.',
      focus: 'Francisco and Zara demonstrate true valor through seven critical stands, embodying cosmic principles rather than relying on power, proving courage succeeds through principled persistence not tactical victory',
      chapterSceneFocus: 'Ch34S2: Proving that sustained valor means embodying universal principles persistently, transforming fear into motivation, and inspiring courage through authentic heroism',
      preliminarySceneFocus: 'Seven critical stands demonstrate how Francisco and Zara embody cosmic valor through principled action despite impossible odds',
      preliminarySceneDescription: 'Morning erupts into seven critical stands at the Battleground of Courage. Stand One: Malthor\'s shadow-tendrils probe psychological weaknesses, manifesting their deepest fears—they anchor in wisdom that acknowledged fear transforms into motivation. Stand Two: Dimensional rifts threaten innocents—they innovate synchronized techniques facilitating self-regulation. Stand Three: Reality unravels—they work with disruption rather than fighting it. Stand Four: Backup fails—isolation mirrors their strength-building journey. Stand Five: Malthor offers honorable retreat—Francisco rejects: "Courage measured by guaranteed victory isn\'t courage but calculation." Stand Six: Their powers prove insufficient—they transcend individual ability to embody universal principles. Stand Seven: Malthor presents evidence their stand is meaningless—they respond with sustained principled embodiment that awakens ancient defenses. Through six hours of sustained valor, authentic heroism inspires contagious courage across dimensions.',
      narrativeFunction: 'Demonstrates Francisco and Zara\'s valor through seven concrete stands facing Malthor, showing that true courage means acknowledging fear while acting on principle, transcending individual power to embody universal truths, and succeeding not by defeating threats but by proving some positions must be defended regardless of outcome.',
      sensoryDetail: 'The Battleground of Courage resonates with energy of past heroic stands. Shadow-tendrils manifest nightmarish fears. Dimensional rifts tear toward innocent populations. Reality itself dissolves into chaos under Malthor\'s assault. Support systems sever. Malthor\'s voice offers tempting retreat. Cosmic powers fail against ancient malevolence. The Nexus transforms, awakening to their unwavering stand. Ancient defenses glow with renewed purpose. Six hours of sustained intensity.',
      internalConflict: 'Francisco struggles with insufficient power against overwhelming malevolence, temptation to accept honorable retreat, and the challenge of embodying principles when technique fails. Zara grapples with protecting innocents while maintaining their position, fighting the urge to abandon when outcomes seem hopeless. Both must transcend reliance on individual capability to become conduits for universal truths.',
      characterGrowthElement: 'Francisco achieves mastery of true valor by sustaining seven critical stands, learning that courage isn\'t momentary but persistent, that heroism requires embodying universal principles when individual power fails, and that success lies in principled persistence not guaranteed victory. Zara discovers that authentic courage becomes contagious when modeled without pretense, inspiring collective resistance through steadfast example.',
      seriesConnectionResonance: 'The seven stands become legendary examples of principled valor that Francisco will reference throughout the timeline war. His demonstration that success comes from embodying principles rather than wielding power becomes the foundation for resistance culture. The ancient defenses awakened by authentic heroism foreshadow how genuine courage activates dormant capabilities throughout the cosmos.',
      sceneCardProgression: 58,
      realWorldContext: 'The seven stands mirror real-world moments where leaders must sustain principles through multiple crises, each testing different aspects of courage. The progression from fear acknowledgment through innovation, adaptation, isolation, temptation resistance, power transcendence, to ultimate choice reflects the comprehensive nature of authentic heroism. The contagious effect of modeled courage applies universally.',
      timelineSignificance: 'Establishes that this morning of sustained valor demonstrates how authentic heroism operates through principled persistence across multiple challenges. The seven stands create a template for sustained courage that will guide cosmic agents throughout dimensional history, proving valor is comprehensive commitment not momentary action.',
      saveTheCatBeat: 'Dark Night of the Soul - Seven Stands of Valor',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Alternating Francisco and Zara: Focus on each stand\'s unique challenge, the persistent choice to embody principles despite failing techniques, the physical and spiritual exhaustion of sustained valor, the moment of transcending individual power to become conduits for universal truths. Show them discovering heroism through principled persistence.',
        sudowrite_emotional_arc: 'Begins with immediate crisis response, moves through escalating challenges testing different valor aspects, reaches transcendent understanding that success lies in embodiment not victory. The emotional journey is from reactive courage through sustained principled action to universal truth embodiment.',
        sudowrite_sensory_emphasis: 'Emphasize the Battleground resonating with past heroism, each stand\'s unique sensory signature (shadow-tendrils, rifts, unraveling reality, severed systems, tempting voice, insufficient powers, awakening defenses), the six-hour sustained intensity, ancient defenses glowing with renewed purpose.',
      },
      learning_objectives: {
        integration: 'Sustained Valor and Universal Principle Embodiment',
        terminal_objectives: [
          'Sustain valor through seven critical challenges by persistently embodying principles when individual techniques and power prove insufficient',
          'Transform fear, isolation, temptation, and inadequacy into motivation for continued principled action rather than retreat',
          'Transcend reliance on individual capability to become conduits for universal truths that inspire contagious courage across dimensions',
        ],
      },
      foreshadowing_elements: [
        'The seven stands awakening ancient defenses foreshadow how Francisco\'s valor will activate dormant resistance throughout the cosmos',
        'The contagious courage spreading across dimensions foreshadows his role inspiring collective resistance during the timeline war',
        'The transcendence from individual power to universal principle embodiment foreshadows his evolution beyond personal capability',
      ],
    },
    {
      // Scene 3: The Legacy of Courage
      pages: 'Page 506 - 510',
      description: 'Malthor withdraws acknowledging their authentic valor: "You\'ve revealed something I\'d forgotten existed: valor as principle rather than tactic." The Academy Elite Guards return mixing shame with awe. Master Cornelius acknowledges this as the fourth instance in three centuries where agents embodied valor so authentically it transformed reality. Word spreads virally—trainees watch reconstructions seeing recognizable fear transformed into principled action, seasoned agents reconsider courage\'s meaning. Seven dimensional cultures simultaneously honor their stand. Francisco and Zara realize their greatest impact lies not in threats defeated but in courage awakened across dimensions.',
      focus: 'Francisco and Zara complete their valor arc as Malthor acknowledges their authentic heroism, their stand inspires courage across dimensions, and they evolve into embodiments whose legacy lies in awakening others\' valor',
      chapterSceneFocus: 'Ch34S3: Understanding that the greatest cosmic service often involves inspiring others to discover their own valor through witnessing authentic courage modeled without pretense',
      preliminarySceneFocus: 'Malthor withdraws acknowledging their valor, inspiring contagious courage across dimensions and establishing their legacy as embodiments of heroism',
      preliminarySceneDescription: 'Afternoon settles as Malthor withdraws, his malevolent intelligence acknowledging something unexpected: "Valor as principle rather than tactic, the willingness to stand not because victory seems possible but because the position matters. This... gives me pause." The Elite Guards return, mixing shame at retreat with awe at the aftermath. Master Cornelius delivers rare acknowledgment: "In three centuries, I\'ve witnessed precisely four instances where cosmic agents embodied valor so authentically that it transformed reality itself—two are standing before me now." Word spreads virally through Academy networks—not tactical details but the principle that some positions must be defended regardless of odds. Trainees watch reconstructions seeing recognizable fear transformed into action. Seasoned agents reconsider courage. Seven dimensional cultures simultaneously honor their stand. Francisco and Zara realize their greatest impact lies not in threats defeated but in courage awakened—they\'ve evolved from capable agents to inspirational embodiments whose legacy will inspire generations.',
      narrativeFunction: 'Completes Francisco and Zara\'s valor arc by showing Malthor\'s withdrawal acknowledging their authentic heroism, the viral spread of their inspiring example across dimensional space, and their evolution from capable cosmic agents to embodiments of valor whose legacy lies in courage awakened rather than threats defeated.',
      sensoryDetail: 'Afternoon light settles over strengthened Nexus. Malthor\'s voice resonates with ominous respect as he withdraws through closing rifts. Elite Guards\' return carries visible shame and awe. Master Cornelius\'s presence radiates rare acknowledgment. Holographic reconstructions spread through Academy networks showing recognizable vulnerability choosing valor. Ancient defenses glow with renewed purpose. Seven dimensional cultures\' simultaneous honors create harmonic resonance. Exhausted satisfaction pervades.',
      internalConflict: 'Francisco processes the profound recognition that their greatest achievement isn\'t defeating Malthor but demonstrating principles worth defending. Zara grapples with understanding that their vulnerability choosing valor inspires more than invulnerability ever could. Both must integrate that their evolution has reached a threshold where their presence itself becomes inspirational.',
      characterGrowthElement: 'Francisco completes his valor embodiment by understanding that cosmic agents are measured not by threats overcome but by principles they won\'t abandon, that his greatest service lies in inspiring others\' courage through authentic example. Zara achieves recognition that her steadfast support models how courage becomes contagious. Both evolve from capable agents to inspirational embodiments whose legacy serves generations.',
      seriesConnectionResonance: 'The viral spread of Francisco\'s inspiring example establishes his reputation throughout dimensional space as an embodiment of authentic valor. His stand against Malthor becomes the legendary moment referenced during the timeline war when beings need courage. The recognition that his greatest impact comes from inspiring others becomes the foundation for resistance movements throughout the cosmos.',
      sceneCardProgression: 59,
      realWorldContext: 'The aftermath mirrors how authentic heroism creates lasting cultural impact beyond immediate tactical outcomes. Master Cornelius\'s rare acknowledgment reflects how genuine courage is recognized across generations. The viral spread of inspiring examples reflects how witnessing authentic vulnerability choosing valor motivates collective courage. The seven cultures\' simultaneous honors reflect universal recognition of principled stands.',
      timelineSignificance: 'Establishes that this afternoon marks Francisco and Zara\'s evolution from capable cosmic agents to inspirational embodiments of valor whose legacy will inspire dimensional civilizations for generations. Their stand becomes a defining moment in cosmic history, referenced whenever beings need courage to face impossible odds.',
      saveTheCatBeat: 'The Resurrection - Acknowledged Heroism and Awakened Legacy',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on processing Malthor\'s acknowledgment, understanding the viral spread of inspiration, recognizing that vulnerability choosing valor inspires more than invulnerability, and integrating that his greatest service lies in courage awakened not threats defeated. Show him understanding legacy.',
        sudowrite_emotional_arc: 'Begins with exhausted aftermath, moves through mounting recognition of impact beyond immediate outcomes, culminates in profound understanding of evolution to inspirational embodiment. The emotional journey is from depleted satisfaction through growing awareness to legacy consciousness.',
        sudowrite_sensory_emphasis: 'Emphasize Malthor\'s respectful withdrawal, Elite Guards\' mixed emotions, Master Cornelius\'s rare acknowledgment, holographic reconstructions spreading virally, seven cultures\' harmonic honors, ancient defenses glowing, the exhausted but transcendent satisfaction of legacy established.',
      },
      learning_objectives: {
        integration: 'Valor Legacy and Inspirational Embodiment',
        terminal_objectives: [
          'Understand that the greatest cosmic service often lies in inspiring others to discover their own courage through witnessing authentic valor',
          'Recognize that vulnerability choosing principles inspires more powerfully than invulnerability demonstrating technique',
          'Evolve from capable cosmic agents to inspirational embodiments whose legacy serves generations through awakened courage across dimensions',
        ],
      },
      foreshadowing_elements: [
        'Malthor\'s acknowledgment that they\'ll meet again foreshadows future conflicts where their legendary valor will be tested',
        'The viral spread of inspiration foreshadows how Francisco\'s example will motivate resistance throughout the timeline war',
        'The evolution to inspirational embodiment foreshadows his role as a symbol of courage transcending individual capability',
      ],
    },
  ];

  for (let i = 0; i < insertedScenes.length; i++) {
    const scene = insertedScenes[i];
    const enhancement = sceneEnhancements[i];

    await db
      .update(scenes)
      .set({
        pages: enhancement.pages,
        description: enhancement.description,
        focus: enhancement.focus,
        chapterSceneFocus: truncate(enhancement.chapterSceneFocus, 255),
        preliminarySceneFocus: enhancement.preliminarySceneFocus,
        preliminarySceneDescription: enhancement.preliminarySceneDescription,
        narrativeFunction: enhancement.narrativeFunction,
        sensoryDetail: enhancement.sensoryDetail,
        internalConflict: enhancement.internalConflict,
        characterGrowthElement: enhancement.characterGrowthElement,
        seriesConnectionResonance: enhancement.seriesConnectionResonance,
        sceneCardProgression: enhancement.sceneCardProgression,
        realWorldContext: enhancement.realWorldContext,
        timelineSignificance: enhancement.timelineSignificance,
        saveTheCatBeat: truncate(enhancement.saveTheCatBeat, 255),
        sudowrite_metadata: enhancement.sudowrite_metadata,
        learning_objectives: enhancement.learning_objectives,
        foreshadowing_elements: enhancement.foreshadowing_elements,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: Enhanced with all fields`);
  }

  console.log('\n🎉 EA-034 complete import finished!');
  console.log('\n📊 Verifying scene completion...\n');

  // Verify all fields are populated
  const finalScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(scenes.sceneNumber);

  const allFields = [
    'title',
    'setup',
    'symbolism',
    'beatGoal',
    'pov',
    'tense',
    'core_emotion',
    'scene_tone',
    'timeline_date',
    'timeline_variant',
    'location',
    'pages',
    'description',
    'focus',
    'chapterSceneFocus',
    'preliminarySceneFocus',
    'preliminarySceneDescription',
    'narrativeFunction',
    'sensoryDetail',
    'internalConflict',
    'characterGrowthElement',
    'seriesConnectionResonance',
    'sceneCardProgression',
    'realWorldContext',
    'timelineSignificance',
    'saveTheCatBeat',
    'sudowrite_metadata',
    'learning_objectives',
    'foreshadowing_elements',
  ];

  for (const scene of finalScenes) {
    const populatedCount = allFields.filter((field) => {
      const value = (scene as any)[field];
      return value !== null && value !== undefined;
    }).length;

    console.log(`Scene ${scene.sceneNumber}: ${populatedCount}/${allFields.length} fields populated`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
