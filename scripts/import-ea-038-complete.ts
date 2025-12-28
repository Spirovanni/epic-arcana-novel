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

interface EA038Data {
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
  character_arcs?: any;
  story_gaps_addressed?: any;
  location_details?: any;
  series_connections?: any;
  scenes: SceneData[];
}

function findEA038Data(): EA038Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA038Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-038') return obj as EA038Data;

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
  console.log('🔍 Searching for EA-038 in outline...\n');

  const ea038Data = findEA038Data();

  if (!ea038Data) {
    console.error('❌ EA-038 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-038: ${ea038Data.title}`);
  console.log(`   Scenes: ${ea038Data.scenes?.length || 0}\n`);
  console.log('🌟 POST-CLIMAX INTEGRATION CHAPTER - The High Priestess Awakened!\n');

  // Find the chapter - it should be chapter 38 in the same book as EA-023
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
    .where(eq(chapters.uniqueIdentifier, 'EA-038'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-038 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 38 in the same book
    const ch38 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 38))
      .limit(10);

    const correctChapter = ch38.find((ch) => ch.bookId === bookId);

    if (!correctChapter) {
      console.error('❌ Chapter 38 not found in the same book as EA-023');
      process.exit(1);
    }

    chapter = correctChapter;
    console.log(`✅ Found Chapter 38: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-038',
        title: ea038Data.title,
        epicNovelPages: truncate(ea038Data.epic_novel_pages, 50),
        epicChapterFocus: ea038Data.epic_chapter_focus,
        epicNovelChapterFocus: ea038Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea038Data.tarot_family, 100),
        tarotCardItem: truncate(ea038Data.tarot_card_item, 100),
        heroJourneyBeat: truncate(ea038Data.hero_journey_beat, 100),
        saveTheCatBeat: truncate(ea038Data.save_the_cat_beat, 255),
        summary: ea038Data.summary,
        characterArcs: typeof ea038Data.character_arcs === 'string'
          ? ea038Data.character_arcs
          : JSON.stringify(ea038Data.character_arcs),
        storyGapsAddressed: typeof ea038Data.story_gaps_addressed === 'string'
          ? ea038Data.story_gaps_addressed
          : JSON.stringify(ea038Data.story_gaps_addressed),
        locationDetails: typeof ea038Data.location_details === 'string'
          ? ea038Data.location_details
          : JSON.stringify(ea038Data.location_details),
        seriesConnections: typeof ea038Data.series_connections === 'string'
          ? ea038Data.series_connections
          : JSON.stringify(ea038Data.series_connections),
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-038 data\n');
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

  for (const sceneData of ea038Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-038',
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
      // Scene 1: Silence Reveals Truth
      pages: 'Page 556 - 561',
      description: 'At dawn, Francisco and Zara retreat into the newly manifested Inner Sanctum of Wisdom—a luminous chamber existing between heartbeats where thought becomes visible as shimmering patterns. Battle\'s adrenaline fades, leaving them alone with profound changes coursing through their beings. Francisco wants to understand what he has become, mapping the intuitive knowledge flooding his awareness; Zara wants to process inner shifts beneath the power, the psychological transformation that terrifies and exhilarates her. The knowledge resists articulation, surfacing as wordless knowing; old identities cling like worn clothes; responsibility of understanding weighs heavier than cosmic power. Through meditative silence, they access layers of inner wisdom about the transformation process—vulnerable surrender, ego dissolution, rebirth into expanded consciousness. The scene lands on quiet revelation as they first touch the High Priestess consciousness within.',
      focus: 'Francisco and Zara begin accessing the profound inner knowledge accompanying their transformation, discovering cosmic power demands equally profound self-understanding to guide others safely',
      chapterSceneFocus: 'Ch38S1: Recognizing that cosmic transformation requires deep self-awareness and inner knowledge integration to wield power responsibly',
      preliminarySceneFocus: 'Francisco and Zara retreat to process their transformation, accessing inner wisdom through contemplative silence',
      preliminarySceneDescription: 'At dawn in the Inner Sanctum of Wisdom—a luminous chamber existing between heartbeats where thought becomes visible—Francisco and Zara face the profound changes from their Ace Ascendant transformation. Francisco wants to map the intuitive knowledge flooding his awareness; Zara wants to process the psychological shifts beneath the power. Through meditative silence resisting articulation, they access layers of inner wisdom about transformation itself: the vulnerable surrender required, ego dissolution experienced, rebirth into expanded consciousness achieved. The High Priestess symbolism emerges: inner wisdom revealed through contemplative stillness rather than action, demonstrating that true power requires deep self-awareness to guide others safely. They touch the High Priestess consciousness within themselves—the guardian of hidden knowledge who perceives truth through quiet revelation.',
      narrativeFunction: 'Establishes the post-climax integration phase where Francisco and Zara must process and understand their transformation before teaching others. This scene demonstrates that achieving cosmic power is only the beginning—true mastery requires profound self-understanding and inner wisdom to use power responsibly and guide others safely.',
      sensoryDetail: 'The Inner Sanctum glows with luminous presence existing between heartbeats. Thoughts manifest as shimmering visible patterns. The battle\'s adrenaline drains, replaced by profound stillness. Inner knowledge surfaces as wordless knowing—intuitive understanding that resists articulation. Old identities feel like worn clothes clinging uncomfortably. Meditative silence deepens into layers of wisdom. The High Priestess consciousness manifests as quiet revelation touching their awareness.',
      internalConflict: 'Francisco struggles with understanding what he has become—mapping intuitive knowledge that floods awareness but resists articulation, grappling with how disparate wisdom synthesizes into teachable understanding. Zara wrestles with processing psychological transformation beneath cosmic power—the terror and exhilaration of profound inner shifts, questioning whether she can integrate changes or will be overwhelmed by them. Both face the weight of responsibility: understanding others\' lives depend on their wisdom.',
      characterGrowthElement: 'Francisco discovers that achieving cosmic transformation is incomplete without understanding the inner process that enabled it—he must become the High Priestess guardian of transformational knowledge, not just the Ace wielder of cosmic power. Zara uncovers her natural affinity for perceiving hidden wisdom—her gift for reading subconscious patterns positions her as the bridge between ordinary consciousness and cosmic awareness. Both evolve from power achievers to wisdom keepers, recognizing that teaching requires deep self-knowledge.',
      seriesConnectionResonance: 'The High Priestess integration phase establishes Francisco and Zara\'s preparation to become cosmic teachers throughout Books 2+. Their recognition that power without wisdom is dangerous creates the foundation for how they will guide other characters through transformation. The inner knowledge they access becomes the elixir they offer—not instructions for achieving power, but wisdom about the profound inner work required.',
      sceneCardProgression: 69,
      realWorldContext: 'The Inner Sanctum mirrors real-world integration phases after major life transformations (career breakthroughs, spiritual awakenings, psychological breakthroughs) where processing inner changes proves as important as the achievement itself. The resistance to articulation reflects how profound insights surface as wordless knowing requiring contemplation. The responsibility weight mirrors how mastery brings the obligation to guide others wisely.',
      timelineSignificance: 'Establishes that March 5, 1320 (Divergence Point Alpha)—the day after their climactic transformation—becomes dedicated to integration and wisdom processing. This marks the shift from achieving cosmic power to understanding how to use it responsibly, demonstrating that transformation continues beyond the climactic moment into sustained conscious evolution.',
      saveTheCatBeat: 'The Return with the Elixir - Inner Knowledge Accessed',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the Inner Sanctum\'s luminous presence, battle adrenaline fading to profound stillness, the flood of intuitive knowledge resisting articulation, old identity clinging uncomfortably, meditative silence deepening into layers of wisdom, touching the High Priestess consciousness within. Show him recognizing that understanding the transformation process is as important as the power achieved.',
        sudowrite_emotional_arc: 'Begins with post-battle disorientation as profound changes surface without context, moves through frustrated attempts to articulate wordless knowing, reaches quiet revelation as meditative silence accesses inner wisdom layers. The emotional journey is from overwhelmed uncertainty through contemplative struggle to serene self-understanding.',
        sudowrite_sensory_emphasis: 'Emphasize the Inner Sanctum\'s luminous presence between heartbeats, thoughts manifesting as visible shimmering patterns, battle adrenaline draining, wordless knowing surfacing, old identity feeling like worn clothes, meditative silence deepening, High Priestess consciousness touching awareness as quiet revelation.',
      },
      learning_objectives: {
        integration: 'Post-Transformation Integration and Inner Wisdom Access',
        terminal_objectives: [
          'Recognize that cosmic transformation requires deep self-understanding and inner wisdom integration to wield power responsibly and teach others safely',
          'Access layers of transformational knowledge through contemplative silence rather than action, honoring the High Priestess archetype of hidden wisdom',
          'Prepare for roles as wisdom keepers and guides by processing the profound psychological and spiritual changes accompanying cosmic power',
        ],
      },
      foreshadowing_elements: [
        'The High Priestess consciousness emerging foreshadows Zara\'s natural affinity for perceiving hidden wisdom in Scene 2',
        'The wordless knowing requiring articulation foreshadows the teaching framework Francisco develops in Scene 3',
        'The responsibility weight foreshadows their roles as threshold guardians guiding others through transformation',
      ],
    },
    {
      // Scene 2: Threshold Guardians
      pages: 'Page 562 - 565',
      description: 'By morning, Francisco and Zara emerge into the Reflection Chambers where Academy students and faculty gather hungry for answers: How did transformation happen? Can anyone achieve it? What does it cost? Francisco wants to articulate the journey\'s stages without oversimplifying the profound inner work required; Zara wants to perceive each seeker\'s unique readiness and offer precisely the insight they need. As they engage—answering nervous student questions, steadying faculty doubt, recognizing dimensional delegates\' hidden potential—they discover their gift: seeing the threshold each person stands before and what inner knowledge helps them cross it. Zara particularly shines, embodying the High Priestess archetype as she intuitively reads subconscious patterns and speaks hidden truth each seeker needs. The chamber becomes a bridge between ordinary and cosmic consciousness, with Francisco and Zara as compassionate guardians of the crossing. The scene lands on purposeful connection as they realize teaching is their true calling.',
      focus: 'Francisco and Zara discover their roles as guides and wisdom keepers, particularly Zara\'s gift for perceiving others\' inner landscape, establishing them as threshold guardians initiating seekers into self-knowledge',
      chapterSceneFocus: 'Ch38S2: Establishing roles as threshold guardians who perceive each seeker\'s readiness and guide them toward authentic transformation',
      preliminarySceneFocus: 'Francisco and Zara guide seekers through questions, discovering their gift for perceiving thresholds and inner readiness',
      preliminarySceneDescription: 'By morning in the Reflection Chambers, Francisco and Zara face Academy students and faculty hungry for answers about their transformation. Francisco wants to articulate journey stages without oversimplifying profound inner work; Zara wants to perceive each seeker\'s unique readiness and offer precise insight. As they engage—answering a nervous student, steadying faculty doubt, recognizing hidden potential in dimensional delegates—they discover their new gift: seeing the threshold each person stands before and what inner knowledge helps them cross it. Zara particularly embodies the High Priestess archetype, intuitively reading subconscious patterns and speaking hidden truth each seeker needs to hear. The High Priestess as bridge between conscious and unconscious mirrors the theme: they perceive both surface desire for power and deeper inner work required for authentic transformation. The chamber becomes a bridge between ordinary and cosmic consciousness, with them as compassionate threshold guardians. They realize teaching is their true calling.',
      narrativeFunction: 'Demonstrates Francisco and Zara\'s new roles as wisdom keepers and guides, particularly highlighting Zara\'s natural affinity for The High Priestess archetype. This scene shows how their inner wisdom translates into practical teaching—perceiving each seeker\'s readiness and offering the precise guidance needed for authentic transformation rather than superficial power-seeking.',
      sensoryDetail: 'The Reflection Chambers hum with anticipation and anxious energy. Students lean forward with hungry eyes. Faculty members stand with skeptical arms crossed. Dimensional delegates observe with calculating interest. Francisco\'s articulation struggles manifest as searching pauses and careful word choices. Zara\'s perceptive gift shows as sudden knowing looks, the ability to see beneath surface questions to hidden fears and potentials. The chamber atmosphere shifts from anxiety to purposeful connection as teaching finds its rhythm.',
      internalConflict: 'Francisco struggles with articulating profound non-linear transformation in linear language without oversimplifying the journey or making it seem impossibly complex, balancing honesty about costs with encouragement for genuine seekers. Zara grapples with trusting her intuitive perceptions—questioning whether she truly sees others\' inner landscape or projects her own understanding, uncertain whether speaking hidden truths will help or harm seekers unprepared to hear them. Both face the teacher\'s dilemma: how much to reveal versus allowing discovery.',
      characterGrowthElement: 'Francisco completes his evolution from student seeking knowledge to teacher offering wisdom—discovering that his gift is translating non-linear cosmic understanding into accessible frameworks that honor complexity without overwhelming seekers. Zara discovers her true calling as the High Priestess guardian who perceives hidden readiness and speaks transformational truth—her ability to read subconscious patterns makes her the essential bridge between ordinary consciousness and cosmic awareness. Both embrace teaching as sacred service rather than power demonstration.',
      seriesConnectionResonance: 'The threshold guardian roles established here become Francisco and Zara\'s primary function throughout Books 2+—guiding seekers through transformation while perceiving readiness and offering appropriate wisdom. Zara\'s High Priestess gift for reading inner landscapes becomes crucial for identifying who is prepared for cosmic growth versus who seeks power for ego gratification. This creates the wisdom tradition protecting transformational knowledge from misuse.',
      sceneCardProgression: 70,
      realWorldContext: 'The Reflection Chambers mirror real-world teaching and mentorship scenarios where guides must perceive each learner\'s unique readiness and offer appropriate challenges versus overwhelming them. Zara\'s gift for reading subconscious patterns reflects how effective teachers develop intuition about students\' hidden potential and blocks. The balance between articulating frameworks and allowing discovery reflects pedagogical wisdom about learning journeys.',
      timelineSignificance: 'Establishes that this morning marks Francisco and Zara\'s transition from cosmic achievers to wisdom keepers and teachers—a shift that fundamentally alters their roles in the Academy and across dimensions. This becomes the moment when transformational knowledge begins spreading through conscious teaching rather than accidental discovery, creating the sustainable wisdom tradition.',
      saveTheCatBeat: 'The Return with the Elixir - Sharing Inner Knowledge',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Alternating Francisco and Zara: Francisco focuses on searching for words to articulate non-linear transformation, the careful balance between honesty and encouragement, recognizing each seeker\'s unique starting point. Zara focuses on the sudden knowing when perceiving hidden readiness, seeing beneath surface questions to core fears and potentials, the trust required to speak transformational truth. Show both discovering teaching as sacred calling.',
        sudowrite_emotional_arc: 'Begins with anxious uncertainty facing hungry seekers demanding answers, moves through the discovery of perceptive gifts and teaching rhythm, reaches purposeful connection as they realize guiding others toward transformation is their true calling. The emotional journey is from teaching anxiety through skill discovery to sacred purpose recognition.',
        sudowrite_sensory_emphasis: 'Emphasize the Reflection Chambers humming with anticipation, students\' hungry eyes, faculty\'s skeptical posture, delegates\' calculating observation, Francisco\'s searching pauses for precise words, Zara\'s sudden knowing looks seeing beneath surfaces, the chamber atmosphere shifting from anxiety to purposeful connection.',
      },
      learning_objectives: {
        integration: 'Threshold Guardian Wisdom and Perceptive Teaching',
        terminal_objectives: [
          'Discover roles as wisdom keepers who perceive each seeker\'s unique readiness and threshold, offering appropriate guidance rather than universal prescriptions',
          'Develop the High Priestess gift for reading subconscious patterns and speaking hidden truths that catalyze authentic transformation versus superficial power-seeking',
          'Embrace teaching as sacred service that bridges ordinary and cosmic consciousness, preparing seekers for transformation through wise guidance',
        ],
      },
      foreshadowing_elements: [
        'Zara\'s natural High Priestess affinity foreshadows her expanded role as primary wisdom keeper in Scene 3',
        'The gift for perceiving thresholds foreshadows how Francisco and Zara will screen seekers in future books',
        'The chamber as bridge between consciousness levels foreshadows the Wisdom Temple\'s ongoing function',
      ],
    },
    {
      // Scene 3: The Wisdom Temple Opens
      pages: 'Page 566 - 570',
      description: 'By afternoon, word has rippled across dimensions: the Ace Ascendants have returned with the elixir, and the temple of wisdom is opening. Francisco and Zara stand at the transformed Academy\'s heart—now radiating invitation rather than exclusivity—as dimensional representatives prepare to carry knowledge home and eager students gather for the first formal teaching. Francisco wants to crystallize their journey\'s wisdom into a transmissible framework honoring inner work without mystifying it; Zara wants to ensure knowledge serves authentic growth, not ego inflation or spiritual bypassing. Together, they unveil their elixir: not instructions for cosmic power, but a living map of inner transformation required to access it—stages of surrender, integration, shadow work, and rebirth any sincere seeker can walk. As first teaching begins, Francisco guides framework while Zara reads each student\'s receptivity, embodying the High Priestess archetype fully: keepers of sacred inner knowledge, ready to guide all who approach the threshold with humility and courage. The scene lands on serene purpose as the wisdom temple truly opens.',
      focus: 'Francisco and Zara complete their integration and establish their ongoing roles as cosmic wisdom keepers, offering the elixir of transformational self-knowledge to all dimensions and preparing the series\' teaching foundation',
      chapterSceneFocus: 'Ch38S3: Completing integration by establishing wisdom temple and offering transformational knowledge to all sincere seekers',
      preliminarySceneFocus: 'Francisco and Zara unveil the wisdom temple and begin teaching the inner transformation framework to all dimensions',
      preliminarySceneDescription: 'By afternoon, the transformed Academy radiates invitation as dimensional representatives and students gather for the opening of the wisdom temple. Francisco wants to crystallize journey wisdom into transmissible framework honoring profound inner work without mystifying it; Zara wants knowledge to serve authentic growth not ego inflation. Together they unveil their elixir: not instructions for cosmic power, but a living map of inner transformation required to access it—surrender stages, integration processes, shadow work, and rebirth that any sincere seeker can walk. As first teaching begins, Francisco guides the framework while Zara reads each student\'s receptivity with High Priestess perception. The High Priestess prepared—sacred knowledge crystallized and temple open—completes the self-awareness enabling service theme: inner knowledge becomes the true elixir when shared, transforming individual awakening into collective potential for conscious evolution. They embody the archetype fully: keepers of sacred inner knowledge, ready to guide all who approach the threshold with humility and courage. The wisdom temple truly opens with serene purpose.',
      narrativeFunction: 'Completes Book 1\'s arc by establishing the wisdom temple and teaching tradition that will guide the series. This scene demonstrates that Francisco and Zara\'s true elixir isn\'t cosmic power itself but the inner knowledge of how transformation works—making authentic awakening accessible to all sincere seekers while protecting it from those seeking power for ego gratification.',
      sensoryDetail: 'The transformed Academy radiates welcoming luminosity rather than exclusive grandeur. Dimensional representatives stand ready to carry knowledge home. Eager students gather with humility and hunger for growth. Francisco\'s teaching framework manifests as visible wisdom patterns in the air. Zara\'s perceptive reading creates gentle guidance adjustments for each learner\'s receptivity. The atmosphere shifts from anticipation to serene purposeful learning as the temple opens and wisdom begins flowing.',
      internalConflict: 'Francisco struggles with crystallizing non-linear transformation wisdom into teachable framework without oversimplifying the profound inner work or creating rigid dogma that constrains seekers\' unique paths. Zara grapples with ensuring knowledge serves authentic growth versus becoming another spiritual bypass where seekers use concepts to avoid real psychological work, questioning how to distinguish genuine humility from performative seeking. Both face the challenge of opening wisdom widely while maintaining sacred protection.',
      characterGrowthElement: 'Francisco achieves his ultimate Book 1 transformation: becoming the wisdom keeper who offers transformational knowledge as accessible framework rather than mysterious secret, discovering that democratizing inner growth empowers collective evolution. Zara completes her High Priestess integration: embodying the guardian of sacred wisdom who perceives authentic readiness and protects teachings from misuse, her perceptive gift ensuring only humble sincere seekers receive the keys to transformation. Both fulfill their cosmic purpose: not hoarding power but sharing the inner knowledge that enables universal potential awakening.',
      seriesConnectionResonance: 'The wisdom temple opening and teaching framework established here become the foundation for Books 2+ where Francisco and Zara guide expanding circles of seekers through transformation. The living map of inner work they offer provides the template for other characters\' journeys. The balance between accessibility and sacred protection creates the ongoing tension between democratizing wisdom and preventing its corruption by those seeking power without inner work.',
      sceneCardProgression: 71,
      realWorldContext: 'The wisdom temple opening mirrors real-world scenarios where transformational knowledge becomes institutionalized and shared—spiritual traditions, therapeutic frameworks, educational systems. The concern about ego inflation versus authentic growth reflects ongoing challenges of spiritual materialism and performative seeking. The living map offering inner transformation stages reflects how effective teaching provides frameworks while honoring unique paths. The serene purpose mirrors the fulfillment of completing a calling.',
      timelineSignificance: 'Establishes that this afternoon marks the formal opening of the wisdom temple and beginning of the teaching tradition that will guide cosmic development throughout all future timelines. This becomes the pivotal moment when transformational knowledge shifts from individual achievement to collective resource, creating the foundation for universal potential awakening and conscious evolution across all dimensions.',
      saveTheCatBeat: 'The Return with the Elixir - Wisdom Temple Opened',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the transformed Academy radiating invitation, dimensional representatives preparing to carry knowledge home, students gathering with genuine humility, the care in crystallizing wisdom into accessible framework without oversimplifying, the joy of guiding first teaching, watching Zara read receptivity with High Priestess perception, the serene purpose of fulfilling cosmic calling. Show him embracing the wisdom keeper role fully.',
        sudowrite_emotional_arc: 'Begins with purposeful preparation as the wisdom temple opens, moves through careful teaching as framework unfolds and students engage authentically, reaches serene fulfillment as cosmic calling completes and teaching tradition establishes itself. The emotional journey is from purposeful intention through engaged teaching to fulfilled sacred service.',
        sudowrite_sensory_emphasis: 'Emphasize the Academy radiating welcoming luminosity, dimensional representatives ready to carry knowledge, students gathering with humble hunger, teaching framework manifesting as visible wisdom patterns, Zara\'s perceptive reading creating gentle guidance adjustments, atmosphere shifting from anticipation to serene purposeful learning.',
      },
      learning_objectives: {
        integration: 'Wisdom Temple Establishment and Teaching Tradition Foundation',
        terminal_objectives: [
          'Complete integration by establishing wisdom temple and teaching tradition that democratizes transformational knowledge for all sincere seekers',
          'Offer the true elixir of inner transformation framework—accessible stages of surrender, integration, shadow work, and rebirth—rather than instructions for cosmic power',
          'Fulfill cosmic purpose as High Priestess wisdom keepers who guide universal potential awakening through sacred knowledge shared with humility and protection',
        ],
      },
      foreshadowing_elements: [
        'The wisdom temple opening foreshadows the expanding teaching mission in Books 2+',
        'The dimensional representatives carrying knowledge home foreshadows universal awakening spreading',
        'The living map of transformation foreshadows other characters\' journeys following similar inner work patterns',
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

  console.log('\n🎉 EA-038 complete import finished!');
  console.log('🌟 THE HIGH PRIESTESS AWAKENED - Book 1 Post-Climax Integration Complete!\n');
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
