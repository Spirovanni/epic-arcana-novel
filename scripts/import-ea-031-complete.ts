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

interface EA031Data {
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

function findEA031Data(): EA031Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA031Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-031') return obj as EA031Data;

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
  console.log('🔍 Searching for EA-031 in outline...\n');

  const ea031Data = findEA031Data();

  if (!ea031Data) {
    console.error('❌ EA-031 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-031: ${ea031Data.title}`);
  console.log(`   Scenes: ${ea031Data.scenes?.length || 0}\n`);

  // Find the chapter - it should be chapter 31 in the same book as EA-023
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
    .where(eq(chapters.uniqueIdentifier, 'EA-031'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-031 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 31 in the same book
    const ch31 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 31))
      .limit(10);

    const correctChapter = ch31.find((ch) => ch.bookId === bookId);

    if (!correctChapter) {
      console.error('❌ Chapter 31 not found in the same book as EA-023');
      process.exit(1);
    }

    chapter = correctChapter;
    console.log(`✅ Found Chapter 31: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-031',
        title: ea031Data.title,
        epicNovelPages: truncate(ea031Data.epic_novel_pages, 50),
        epicChapterFocus: ea031Data.epic_chapter_focus,
        epicNovelChapterFocus: ea031Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea031Data.tarot_family, 100),
        tarotCardItem: truncate(ea031Data.tarot_card_item, 100),
        heroJourneyBeat: truncate(ea031Data.hero_journey_beat, 100),
        saveTheCatBeat: truncate(ea031Data.save_the_cat_beat, 255),
        summary: ea031Data.summary,
        characterArcs: ea031Data.character_arcs,
        storyGapsAddressed: ea031Data.story_gaps_addressed,
        locationDetails: ea031Data.location_details,
        seriesConnections: ea031Data.series_connections,
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-031 data\n');
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

  for (const sceneData of ea031Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-031',
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
      // Scene 1: The Strategic Deployment
      pages: 'Page 451 - 455',
      description: 'Francisco and Zara receive their most ambitious mission: establish six cosmic monitoring stations across radically different dimensional zones in thirty days, creating the Academy\'s first integrated early-warning network. Each station must be customized for unique environments while maintaining network compatibility, requiring them to coordinate six diverse construction teams, manage vast resource distribution, and maintain timeline adherence while adapting to challenges.',
      focus: 'Francisco and Zara transition from reactive crisis handlers to proactive cosmic architects, learning to translate cosmic knowledge into systematic executable strategies at unprecedented scale',
      chapterSceneFocus: 'Ch31S1: Understanding that effective cosmic service requires building proactive infrastructure that prevents crises rather than just responding to them',
      preliminarySceneFocus: 'The Academy Council assigns Francisco and Zara the mission to build a six-station monitoring network across diverse dimensional zones',
      preliminarySceneDescription: 'At the Strategic Planning Center at dawn, Francisco and Zara receive the Academy\'s most ambitious infrastructure project: establish six cosmic monitoring stations across radically different dimensional zones (crystalline void-spaces, turbulent storm-dimensions, phase-shifted temporal zones, gravity-inverted regions, quantum-fluctuation fields, and corrosive-atmosphere dimensions) within thirty days. They must coordinate six diverse construction teams from different dimensional cultures, manage resource distribution across vast cosmic distances, and create an integrated early-warning network. The mission represents their evolution from reactive agents handling crises to proactive architects building preventive infrastructure at scale.',
      narrativeFunction: 'Establishes the unprecedented scale and coordination challenge of the deployment mission, introducing Francisco and Zara\'s transition from reactive crisis response to proactive infrastructure building. This scene sets up the systematic execution required for the finale.',
      sensoryDetail: 'The Strategic Planning Center hums with quiet intensity. Holographic displays show six diverse dimensional zones with unique environmental challenges. Master Cornelius\'s voice carries unusual gravity. Francisco feels the weight of coordinating complexity, while Zara perceives the intricate web of teams, resources, and timelines that must align.',
      internalConflict: 'Francisco struggles with the leap from individual cosmic power to systematic coordination at scale. Zara grapples with the challenge of empowering diverse teams without micromanaging. Both must evolve from crisis responders to infrastructure builders, from tactical problem-solvers to strategic architects.',
      characterGrowthElement: 'Francisco develops the capacity to translate cosmic principles into practical executable strategies at scale. Zara learns to coordinate diverse teams and resources across vast distances. Both grow in their understanding that true mastery requires organizing capability systematically rather than relying on individual heroic action.',
      seriesConnectionResonance: 'Establishes Francisco\'s deployment expertise and execution leadership that become crucial during the timeline war. The monitoring network built here becomes part of the early warning system against Dagon\'s incursions, and his team coordination experience becomes essential for uniting dimensional cultures against common threats.',
      sceneCardProgression: 48,
      realWorldContext: 'The Strategic Planning Center mirrors real-world project management where leaders must coordinate complex multi-site initiatives with diverse teams, limited timelines, and varied local conditions. The challenge of adapting universal principles to local contexts reflects how effective leadership honors cultural differences while maintaining unified purpose.',
      timelineSignificance: 'Establishes that February 26, 1320 becomes the day Francisco and Zara begin building proactive cosmic infrastructure, marking their evolution from reactive agents to systematic architects. This deployment approach will influence how cosmic service prevents rather than just responds to crises.',
      saveTheCatBeat: 'Finale - The Plan',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the recognition that this mission requires different capabilities than previous challenges—systematic coordination rather than individual power, strategic planning rather than tactical response. Show him grappling with the scale and complexity.',
        sudowrite_emotional_arc: 'Begins with the weight of unprecedented scope, moves through strategic analysis of the challenge, culminates in determined commitment to systematic execution. The emotional journey is from overwhelm to purposeful focus.',
        sudowrite_sensory_emphasis: 'Emphasize the holographic displays showing six diverse zones, the quiet intensity of the planning center, Master Cornelius\'s grave tone, the physical sensation of coordinating complexity across dimensional boundaries.',
      },
      learning_objectives: {
        integration: 'Strategic Deployment and Systematic Execution at Scale',
        terminal_objectives: [
          'Translate cosmic principles into practical executable strategies that adapt universal truths to diverse local conditions',
          'Coordinate diverse teams, resources, and timelines across multiple simultaneous sites requiring parallel execution',
          'Evolve from reactive crisis response to proactive infrastructure building that prevents problems rather than just solving them',
        ],
      },
      foreshadowing_elements: [
        'The six-station network foreshadows the deployment challenges Francisco and Zara will face in coordinating execution',
        'The thirty-day timeline foreshadows the pressure of execution under constraints with no margin for major delays',
        'The diverse construction teams foreshadow the cultural coordination challenges that require honoring different approaches',
      ],
    },
    {
      // Scene 2: Coordinated Execution
      pages: 'Page 456 - 460',
      description: 'Deployment begins simultaneously across all six dimensional zones as Francisco and Zara split responsibilities based on complementary strengths. Through nine hours of coordinated intensity, they solve real-time technical and cultural challenges—adapting equipment, negotiating safety protocols, innovating temporal anchoring, developing new coordination systems, and maintaining team morale. Cross-site insight sharing accelerates collective capability as solutions from one site strengthen capability across the entire network.',
      focus: 'Francisco and Zara demonstrate deployment mastery through managing six simultaneous operations, proving that systematic coordinated execution with empowered diverse teams creates exponentially greater capability than individual action',
      chapterSceneFocus: 'Ch31S2: Learning that successful deployment requires parallel execution with coordinated learning, where empowering local teams to adapt produces better results than rigid central control',
      preliminarySceneFocus: 'Francisco and Zara manage real-time problem-solving across six simultaneous construction sites, applying lessons from previous missions',
      preliminarySceneDescription: 'Morning erupts into orchestrated chaos as deployment begins simultaneously across all six zones. Francisco oversees three technically demanding sites (crystalline void-space, quantum-fluctuation field, phase-shifted temporal zone) while Zara manages three culturally complex sites (storm-dimension, gravity-inverted region, corrosive-atmosphere dimension). Through relentless real-time problem-solving, they adapt approaches: redesigning calibration for delicate environments, negotiating safety boundaries while respecting efficiency, working with rather than against fluctuations, developing new spatial coordination systems, innovating temporal anchoring techniques, and maintaining morale through transparent acknowledgment of danger. Cross-site insight sharing accelerates collective capability as each breakthrough strengthens the entire network.',
      narrativeFunction: 'Demonstrates Francisco and Zara\'s deployment mastery through successful execution of complex coordinated operations. This scene shows systematic problem-solving at scale, applying lessons from previous chapters (Korthak-7\'s disruption wisdom, collaborative healing, balanced choices) to new deployment challenges.',
      sensoryDetail: 'Orchestrated chaos vibrates through dimensional relay networks. Francisco\'s crystalline site shimmers with delicate energy patterns. Zara\'s storm-dimension roars with aggressive construction. Quantum fields fluctuate unpredictably. Temporal zones desynchronize. Gravity-inverted crews work in disorienting orientations. Corrosive atmospheres hiss against protective gear. Progress emerges visibly by afternoon as systematic approaches tame initial complexity.',
      internalConflict: 'Francisco struggles with the instinct to control versus trusting teams to adapt. Zara battles the urge to rescue teams from challenges versus empowering them to solve problems. Both must resist micromanagement, embrace parallel execution, and trust that coordinated learning creates better outcomes than central control.',
      characterGrowthElement: 'Francisco develops mastery of parallel execution and real-time adaptation at scale, learning to trust systematic approaches over individual control. Zara masters cultural coordination and team empowerment across diverse working styles. Both grow in understanding that coordinated execution with empowered teams creates exponentially greater capability than heroic individual action.',
      seriesConnectionResonance: 'Francisco\'s experience managing simultaneous operations under pressure becomes vital for coordinating resistance activities across multiple dimensions during the timeline war. His ability to share insights across sites and empower local adaptation becomes the template for resistance coordination against centralized threats.',
      sceneCardProgression: 49,
      realWorldContext: 'The simultaneous multi-site execution mirrors real-world program management where leaders must solve problems in real-time across distributed teams. The balance between providing guidance and trusting local adaptation reflects modern distributed leadership. The cross-site insight sharing reflects how networked organizations create collective intelligence.',
      timelineSignificance: 'Establishes that this morning of coordinated execution demonstrates how systematic deployment transforms overwhelming complexity into tangible achievement through parallel operations. The approach of empowering local teams while sharing insights becomes the model for distributed cosmic service.',
      saveTheCatBeat: 'Finale - Executing the Plan',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Zara\'s POV: Focus on the intensity of coordinating multiple teams simultaneously, the discipline of empowering rather than controlling, the satisfaction of seeing systematic approaches emerge from chaos. Show her learning to trust distributed capability.',
        sudowrite_emotional_arc: 'Begins with the overwhelm of orchestrated chaos, moves through the rhythm of real-time problem-solving, culminates in growing confidence as systematic execution produces visible progress. The emotional journey is from intensity to coordinated mastery.',
        sudowrite_sensory_emphasis: 'Emphasize the vibration of dimensional relay communications, the contrast between six different construction environments, the visible progress emerging at all sites, the rhythm of coordinated problem-solving across vast distances.',
      },
      learning_objectives: {
        integration: 'Coordinated Multi-Site Execution and Team Empowerment',
        terminal_objectives: [
          'Execute parallel operations across multiple simultaneous sites through systematic coordination and real-time adaptation',
          'Empower diverse local teams to solve problems and adapt approaches rather than imposing rigid central control',
          'Share insights and solutions across sites to accelerate collective capability and create networked intelligence',
        ],
      },
      foreshadowing_elements: [
        'The cross-site insight sharing foreshadows how networked resistance will share intelligence during the timeline war',
        'The empowerment of local teams foreshadows Francisco\'s approach to coordinating autonomous resistance cells',
        'The systematic transformation of chaos into achievement foreshadows his capacity to organize resistance under pressure',
      ],
    },
    {
      // Scene 3: The Foundation Network
      pages: 'Page 461 - 465',
      description: 'After twenty-nine days of coordinated deployment, all six monitoring stations reach completion simultaneously. At the Network Control Hub, representatives from all six construction teams gather for network activation. As the system comes online, it immediately detects subtle dimensional disturbances that existing sensors never perceived—micro-fractures, unauthorized transit signatures, temporal manipulation indicators, and artificial dimensional engineering harmonics. The successful deployment demonstrates that systematic coordinated execution creates exponentially greater value than individual components, establishing early-warning capability that transforms cosmic service from reactive response to proactive prevention.',
      focus: 'Francisco and Zara complete their deployment mastery by activating the six-station network, demonstrating that coordinated systematic execution creates lasting infrastructure serving countless dimensions for generations',
      chapterSceneFocus: 'Ch31S3: Proving that true cosmic mastery requires organizing capability at scale, honoring diverse approaches toward unified purpose that creates generational value',
      preliminarySceneFocus: 'The six-station network activates successfully, immediately detecting threats that previous systems missed',
      preliminarySceneDescription: 'After twenty-nine days of sustained deployment, all six monitoring stations complete simultaneously. At the Network Control Hub, representatives from all six diverse construction teams gather for activation. Francisco calibrates the final technical integration ensuring each station\'s unique customization contributes to unified network architecture. Zara coordinates the cultural expressions of celebration, honoring diverse approaches to shared achievement. As the activation sequence begins, all six stations power up in synchronized coordination. The network immediately begins detecting subtle dimensional disturbances invisible to existing sensors—micro-fractures in boundaries, unauthorized transit signatures, temporal manipulation indicators, and artificial dimensional engineering harmonics. Master Cornelius recognizes that they\'ve built infrastructure serving cosmic security for generations, demonstrating that coordinated systematic execution exceeds individual heroic action. The six foundations working together create surveillance coverage that transforms cosmic service from reactive crisis response to proactive threat prevention.',
      narrativeFunction: 'Completes Francisco and Zara\'s deployment mastery arc by showing the successful network activation and immediate validation of its value. This scene demonstrates that systematic infrastructure building creates generational impact, concluding their evolution from students to cosmic architects capable of organizing capability at scale.',
      sensoryDetail: 'The Network Control Hub pulses with anticipation. Representatives from six diverse teams fill the space with cultural variety. Holographic displays show all six stations in synchronized status. Energy signatures stabilize. Detection arrays come online. Communication links establish. Data streams converge into integrated surveillance coverage. The moment of full activation creates cascading discovery as previously invisible threats become visible. Diverse celebrations erupt—quiet satisfaction, exuberant demonstration, shared recognition.',
      internalConflict: 'Francisco experiences the satisfaction of technical mastery balanced by recognition that the human coordination mattered as much as cosmic knowledge. Zara feels the accomplishment of cultural coordination balanced by understanding that honoring diversity built stronger foundations than uniform protocols. Both recognize that their greatest achievement isn\'t individual power but organizing collective capability.',
      characterGrowthElement: 'Francisco completes his evolution to strategic architect capable of organizing cosmic capability at scale through systematic deployment. Zara masters cultural coordination that honors diverse approaches while achieving unified purpose. Both achieve the understanding that true mastery lies in building infrastructure that serves generations, not just solving immediate problems.',
      seriesConnectionResonance: 'The six-station network becomes part of the early warning system that detects Dagon\'s incursions. Francisco\'s experience building lasting infrastructure with diverse teams becomes the foundation for coordinating resistance across dimensional cultures. The proactive prevention approach becomes his hallmark in opposing timeline manipulation.',
      sceneCardProgression: 50,
      realWorldContext: 'The network activation mirrors real-world infrastructure projects that create lasting value through coordinated execution. The immediate detection of previously invisible threats reflects how better systems reveal dangers current approaches miss. The diverse cultural celebrations reflect how inclusive achievement builds stronger organizational foundations than uniform protocols.',
      timelineSignificance: 'Establishes that this afternoon marks the transformation of cosmic service from reactive heroism to proactive systematic prevention. The six-station network activation becomes a milestone in cosmic infrastructure that will serve dimensional security for generations, setting the pattern for organized collaborative capability.',
      saveTheCatBeat: 'Finale - Victory and New World',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco and Zara alternating: Focus on the culmination of sustained effort, the satisfaction of seeing diverse teams celebrate shared achievement, the profound recognition that they\'ve built something larger than themselves. Show them understanding that true mastery is organizing collective capability.',
        sudowrite_emotional_arc: 'Begins with anticipation of activation, moves through the exhilaration of successful deployment, culminates in profound satisfaction recognizing they\'ve created generational value. The emotional journey is from completion to legacy consciousness.',
        sudowrite_sensory_emphasis: 'Emphasize the synchronized activation sequence, the holographic convergence of data streams, the diverse cultural celebration expressions, the cascade of discovery as invisible threats become visible, the palpable sense of achievement across six teams.',
      },
      learning_objectives: {
        integration: 'Infrastructure Deployment and Generational Value Creation',
        terminal_objectives: [
          'Complete systematic infrastructure deployment that creates lasting capability serving countless dimensions for generations',
          'Honor diverse cultural approaches to achievement while building unified purpose and integrated capability',
          'Transform cosmic service from reactive crisis response to proactive threat prevention through strategic infrastructure',
        ],
      },
      foreshadowing_elements: [
        'The early-warning network detecting invisible threats foreshadows its role in identifying Dagon\'s timeline manipulations',
        'The diverse teams working toward unified purpose foreshadows Francisco coordinating resistance across dimensional cultures',
        'The generational infrastructure value foreshadows how his deployment expertise creates lasting resistance capability',
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

  console.log('\n🎉 EA-031 complete import finished!');
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
