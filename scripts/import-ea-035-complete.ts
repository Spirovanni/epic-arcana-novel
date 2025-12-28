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

interface EA035Data {
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

function findEA035Data(): EA035Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA035Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-035') return obj as EA035Data;

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
  console.log('🔍 Searching for EA-035 in outline...\n');

  const ea035Data = findEA035Data();

  if (!ea035Data) {
    console.error('❌ EA-035 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-035: ${ea035Data.title}`);
  console.log(`   Scenes: ${ea035Data.scenes?.length || 0}\n`);

  // Find the chapter - it should be chapter 35 in the same book as EA-023
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
    .where(eq(chapters.uniqueIdentifier, 'EA-035'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-035 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 35 in the same book
    const ch35 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 35))
      .limit(10);

    const correctChapter = ch35.find((ch) => ch.bookId === bookId);

    if (!correctChapter) {
      console.error('❌ Chapter 35 not found in the same book as EA-023');
      process.exit(1);
    }

    chapter = correctChapter;
    console.log(`✅ Found Chapter 35: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-035',
        title: ea035Data.title,
        epicNovelPages: truncate(ea035Data.epic_novel_pages, 50),
        epicChapterFocus: ea035Data.epic_chapter_focus,
        epicNovelChapterFocus: ea035Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea035Data.tarot_family, 100),
        tarotCardItem: truncate(ea035Data.tarot_card_item, 100),
        heroJourneyBeat: truncate(ea035Data.hero_journey_beat, 100),
        saveTheCatBeat: truncate(ea035Data.save_the_cat_beat, 255),
        summary: ea035Data.summary,
        characterArcs: ea035Data.character_arcs,
        storyGapsAddressed: ea035Data.story_gaps_addressed,
        locationDetails: ea035Data.location_details,
        seriesConnections: ea035Data.series_connections,
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-035 data\n');
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

  for (const sceneData of ea035Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-035',
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
      // Scene 1: The Weight of Ten Worlds
      pages: 'Page 511 - 515',
      description: 'Francisco and Zara are summoned to the Cosmic Restoration Chambers where the ancient Cosmic Restoration Council presents their most daunting assignment: the restoration of the Ten Lost Realms, dimensions fallen into chaos and despair over cosmic ages. As they review the overwhelming scope of suffering across ten worlds through dimensional viewing arrays, they confront the monumental weight of cosmic ambition—deciding whether to accept enormous responsibility for multiple worlds\' survival. The Ten of Wands burden materializes as they comprehend the magnitude.',
      focus: 'Francisco and Zara receive the Ten Lost Realms assignment, confronting the overwhelming weight of cosmic ambition and deciding to accept enormous responsibility for restoring ten fallen dimensions',
      chapterSceneFocus: 'Ch35S1: Understanding that true cosmic ambition means accepting enormous responsibility for others\' wellbeing, not just personal achievement or glory',
      preliminarySceneFocus: 'The Cosmic Restoration Council presents the overwhelming Ten Lost Realms project, testing Francisco and Zara\'s ambitious leadership',
      preliminarySceneDescription: 'At dawn in the Cosmic Restoration Chambers, Francisco and Zara stand before the ancient Cosmic Restoration Council who present their most daunting leadership challenge: restore the Ten Lost Realms—dimensions fallen into chaos and despair over cosmic ages. Dimensional viewing arrays display the overwhelming scope of suffering across ten worlds. The Council explains this represents achievement at the highest cosmic level, while failure would doom countless beings across multiple dimensions. Francisco and Zara review the magnitude: ten separate dimensional systems, each requiring comprehensive restoration, millions of desperate inhabitants depending on their success. The Ten of Wands burden materializes as they comprehend carrying the weight of ten worlds on their shoulders. They must decide: accept this enormous responsibility or acknowledge it exceeds their capability.',
      narrativeFunction: 'Establishes the monumental scale of Francisco and Zara\'s first cosmic-level project and their decision to accept overwhelming responsibility for multiple worlds. This scene introduces the Ten of Wands theme of carrying enormous burdens with ambitious determination, setting up their evolution from inspirational leaders to project managers of cosmic restoration.',
      sensoryDetail: 'The Cosmic Restoration Chambers hum with ancient power. Dimensional viewing arrays shimmer with images of ten fallen realms—crumbling structures, desperate populations, chaotic energy signatures. The Cosmic Restoration Council\'s presence radiates timeless authority. The weight of responsibility physically manifests, pressing on Francisco and Zara\'s shoulders. Each realm\'s suffering creates visible resonance. The magnitude of ten worlds\' hope converging becomes palpable.',
      internalConflict: 'Francisco struggles between inspirational vision and the practical weight of enormous responsibility, wondering if accepting means overreaching beyond capability. Zara grapples with the transition from co-visionary to strategic architect, uncertain whether ambition or hubris drives the decision. Both must decide if their leadership can translate from inspiration to cosmic-level achievement requiring sustained effort across multiple dimensions.',
      characterGrowthElement: 'Francisco transitions from inspirational visionary to ambitious project leader by accepting the weight of massive responsibility for ten worlds\' restoration. He learns that true cosmic ambition requires carrying enormous burdens while maintaining drive despite overwhelming complexity. Zara evolves from co-visionary to strategic architect by recognizing the need to break down impossible projects into achievable milestones. Both grow in understanding that highest ambition serves universal flourishing not personal glory.',
      seriesConnectionResonance: 'The Ten Lost Realms project establishes the template for ambitious cosmic undertakings throughout the series, emphasizing responsibility, sustainable progress, and collective achievement. Francisco\'s willingness to accept enormous burden becomes his defining characteristic in resistance movements, inspiring others to take on greater challenges. The restoration work becomes legendary reference for cosmic ambition that future characters aspire to match.',
      sceneCardProgression: 60,
      realWorldContext: 'The Cosmic Restoration Chambers mirror real-world project scoping sessions where leaders must decide whether to accept overwhelming challenges. The Ten Lost Realms represent program-level initiatives affecting multiple stakeholders across vast scope. The decision to accept despite magnitude reflects how ambitious leaders commit to seemingly impossible goals requiring sustained multi-year effort.',
      timelineSignificance: 'Establishes that March 2, 1320 (Divergence Point Alpha) becomes the day Francisco and Zara accept the Ten Lost Realms assignment, marking their evolution from capable agents to ambitious cosmic project leaders. This decision creates a new model for cosmic-level achievement that will influence dimensional restoration throughout history.',
      saveTheCatBeat: 'The Road Back - Accepting Enormous Responsibility',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the overwhelming visual magnitude of ten suffering realms displayed simultaneously, the physical sensation of responsibility\'s weight pressing on shoulders, the internal debate between inspirational vision and practical capability, the moment of choosing to accept despite fear of inadequacy. Show him understanding ambition through service not glory.',
        sudowrite_emotional_arc: 'Begins with curiosity about the summons, moves through mounting overwhelm as scope becomes clear, reaches the weighty decision to accept enormous responsibility. The emotional journey is from confident capability through daunting recognition to determined acceptance.',
        sudowrite_sensory_emphasis: 'Emphasize the dimensional viewing arrays showing ten realms simultaneously, the ancient Council\'s timeless presence, the physical weight of responsibility manifesting, the convergence of ten worlds\' suffering and hope creating palpable pressure, the magnitude of scope pressing awareness.',
      },
      learning_objectives: {
        integration: 'Cosmic Ambition and Enormous Responsibility',
        terminal_objectives: [
          'Accept enormous responsibility for multiple worlds\' wellbeing by understanding that true cosmic ambition serves universal flourishing not personal glory',
          'Transition from inspirational vision to practical project leadership by confronting the weight of massive responsibility requiring sustained effort',
          'Decide to carry overwhelming burdens despite uncertainty about capability, trusting that ambitious commitment enables development of necessary skills',
        ],
      },
      foreshadowing_elements: [
        'The Ten of Wands burden foreshadows the sustained carrying effort required across the three scenes',
        'The magnitude of ten worlds foreshadows the methodical progress needed to achieve ambitious goals without burnout',
        'The decision to accept foreshadows Francisco\'s role carrying enormous resistance burdens during the timeline war',
      ],
    },
    {
      // Scene 2: Carrying the Burden Forward
      pages: 'Page 516 - 520',
      description: 'At the Ten Lost Realms Nexus, Francisco and Zara begin overwhelming restoration work. Witnessing firsthand the suffering across multiple realms, they feel the enormous weight of responsibility threatening to crush them. Working together with methodical ambition, they develop sustainable strategies: breaking down the impossible project into achievable milestones, distributing burden across diverse restoration teams, maintaining progress through setbacks, and inspiring others to share the load. They learn to carry the burden without being crushed by it, discovering that sustainable ambition requires methodical progress not heroic gestures.',
      focus: 'Francisco and Zara develop skills to carry enormous cosmic responsibility sustainably by breaking down overwhelming projects into milestones while maintaining ambitious progress despite setbacks',
      chapterSceneFocus: 'Ch35S2: Learning that sustainable ambition requires methodical progress and burden-sharing rather than heroic individual gestures that lead to burnout',
      preliminarySceneFocus: 'Francisco and Zara begin restoration work at the Ten Lost Realms Nexus, learning to carry enormous burden sustainably through strategic planning',
      preliminarySceneDescription: 'Morning at the Ten Lost Realms Nexus—the central access point where the weight of cosmic responsibility is physically felt as suffering and hope from ten dimensions converges. Francisco and Zara begin overwhelming restoration work, witnessing firsthand the desperate Lost Realm Inhabitants whose survival depends on their success. The burden threatens to crush them: ten simultaneous crises, millions depending on decisions, complexity beyond any previous challenge. They must learn to carry this weight without breaking. Working together with methodical ambition, they develop sustainable strategies: breaking the impossible into achievable milestones (stabilize Realm 1 first, then systematic progression), distributing burden across diverse restoration teams (empowering local inhabitants as partners), maintaining progress through inevitable setbacks (acknowledging challenges while sustaining momentum), and inspiring others to share the load (collaborative achievement not individual heroism). The Ten of Wands burden becomes manageable through strategic carrying.',
      narrativeFunction: 'Demonstrates Francisco and Zara developing skills and mindset to carry enormous cosmic responsibility sustainably. This scene shows them learning that true ambition requires methodical progress, burden-sharing, and persistent effort rather than overwhelming individual heroism leading to burnout. Establishes their evolution as strategic architects of ambitious achievement.',
      sensoryDetail: 'The Ten Lost Realms Nexus vibrates with convergent desperation and hope from ten dimensions. Restoration planning matrices display overwhelming complexity—thousands of variables, interconnected systems, cascading requirements. Lost Realm Inhabitants\' desperate faces plead for salvation. The burden\'s weight physically manifests, pressing shoulders, testing endurance. Strategic planning sessions generate methodical progress maps. Collaborative restoration teams begin coordinated effort. Visible progress emerges as first milestones achieve.',
      internalConflict: 'Francisco struggles with the urge to personally solve everything versus trusting collaborative distribution of burden, fighting impulse toward heroic individual effort that would lead to burnout. Zara grapples with perfectionist expectations versus sustainable progress standards, learning to celebrate incremental achievement while maintaining ambitious goals. Both must resist the temptation to be crushed by magnitude and instead methodically carry forward.',
      characterGrowthElement: 'Francisco masters carrying enormous responsibility by developing sustainable strategies: milestone-based progress, burden distribution, setback resilience, and collaborative achievement. He learns that true ambition requires persistent methodical effort not heroic gestures. Zara achieves strategic architecture of ambition by breaking overwhelming projects into achievable steps while keeping teams motivated through challenges. Both grow in understanding that sustainable ambition balances high standards with realistic progress.',
      seriesConnectionResonance: 'Francisco\'s methods for carrying enormous burdens sustainably become his template for managing resistance operations across multiple dimensions during the timeline war. His framework of milestone-based progress, burden-sharing, and collaborative achievement shapes how resistance forces maintain ambitious goals without burnout. The sustainable ambition model becomes legendary reference for cosmic project management.',
      sceneCardProgression: 61,
      realWorldContext: 'The Ten Lost Realms Nexus mirrors real-world program management centers where leaders coordinate complex multi-stakeholder initiatives. The sustainable strategies reflect best practices: breaking down overwhelming scope, distributing workload, celebrating incremental progress, collaborative achievement. The balance between ambitious goals and sustainable effort applies to any large-scale transformational project.',
      timelineSignificance: 'Establishes that this morning demonstrates how ambitious cosmic projects are carried forward through methodical sustainable progress rather than heroic burnout. The strategies developed become the model for dimensional restoration efforts throughout cosmic history, proving that enormous burdens become manageable through strategic carrying.',
      saveTheCatBeat: 'The Road Back - Carrying the Burden Forward',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Alternating Francisco and Zara: Focus on the physical and mental weight of responsibility threatening to crush, the strategic development of sustainable carrying methods, the relief of distributing burden across collaborative teams, the satisfaction of achieving first milestones. Show them learning methodical ambitious progress.',
        sudowrite_emotional_arc: 'Begins with overwhelming burden threatening to crush, moves through strategic development of sustainable carrying methods, reaches satisfied confidence in methodical progress. The emotional journey is from crushing weight through strategic adaptation to sustainable ambitious momentum.',
        sudowrite_sensory_emphasis: 'Emphasize the convergent desperation and hope from ten dimensions creating palpable pressure, restoration planning matrices showing overwhelming complexity, Lost Realm Inhabitants\' desperate pleading, the burden\'s physical weight testing endurance, collaborative teams beginning coordinated effort, visible first progress emerging.',
      },
      learning_objectives: {
        integration: 'Sustainable Ambition and Strategic Burden-Carrying',
        terminal_objectives: [
          'Develop sustainable strategies for carrying enormous responsibility: milestone-based progress, burden distribution, setback resilience, collaborative achievement',
          'Break down overwhelming projects into achievable steps while maintaining ambitious goals and keeping diverse teams motivated through challenges',
          'Balance high achievement standards with realistic sustainable progress, resisting heroic individual gestures that lead to burnout',
        ],
      },
      foreshadowing_elements: [
        'The methodical sustainable carrying strategies foreshadow the template Francisco will use managing resistance operations',
        'The milestone-based progress approach foreshadows how ambitious goals are achieved through persistent systematic effort',
        'The collaborative burden-sharing foreshadows the distributed resistance network that emerges during the timeline war',
      ],
    },
    {
      // Scene 3: The Ambitious Foundation
      pages: 'Page 521 - 525',
      description: 'After successfully stabilizing the first of the Ten Lost Realms, Francisco and Zara witness the profound impact of their ambitious cosmic leadership. The restored realm\'s inhabitants experience transformation from despair to hope, validating that enormous burdens carried methodically achieve the seemingly impossible. Word spreads through Academy networks—their willingness to accept overwhelming responsibility and maintain ambitious achievement standards inspires other cosmic agents to take on greater challenges. As the Cosmic Restoration Council acknowledges their success establishing a new model for cosmic-level ambition, Francisco and Zara realize the Ten of Wands burden has transformed into a foundation supporting greater achievements and inspiring others to ambitious service.',
      focus: 'Francisco and Zara complete their ambitious foundation by successfully restoring the first realm, inspiring other cosmic agents to accept greater challenges and establishing a new model for cosmic-level achievement',
      chapterSceneFocus: 'Ch35S3: Proving that enormous burdens carried methodically transform into foundations that support greater achievements and inspire others to ambitious cosmic service',
      preliminarySceneFocus: 'The first realm\'s successful restoration inspires Academy-wide recognition of Francisco and Zara as masters of ambitious cosmic achievement',
      preliminarySceneDescription: 'Afternoon brings triumphant validation as the first of the Ten Lost Realms achieves stabilization. Francisco and Zara witness profound transformation: desperate Lost Realm Inhabitants experiencing restoration from chaos to order, despair to hope, proving that enormous burdens carried methodically achieve the seemingly impossible. At the Academy of Eternal Wisdom, the Cosmic Restoration Council acknowledges their success establishing a new model for cosmic-level ambition and responsibility. Word spreads through Academy networks—not just tactical details but the principle that accepting overwhelming responsibility and maintaining ambitious achievement standards through sustainable progress creates transformational impact. Other cosmic agents watch their example, inspired to take on greater challenges. Trainees recognize that ambitious service requires carrying enormous burdens rather than avoiding difficult assignments. The Ten of Wands burden transforms into a foundation: the heavy responsibility becomes stable base supporting greater achievements, inspiring others to ambitious cosmic service, establishing Francisco and Zara as masters of cosmic-level project leadership.',
      narrativeFunction: 'Completes Francisco and Zara\'s ambitious foundation arc by demonstrating the transformational impact of their cosmic leadership. This scene shows how successfully carrying enormous burdens inspires Academy-wide recognition, establishes new models for cosmic achievement, and proves that methodical ambitious progress transforms impossible challenges into systematic restoration. They evolve from project leaders to inspirational embodiments of cosmic ambition.',
      sensoryDetail: 'The first restored realm radiates stabilized harmony—chaos transformed to order, despair to hope. Lost Realm Inhabitants celebrate with tears of grateful relief. The Academy of Eternal Wisdom resonates with acknowledgment of ambitious achievement. Cosmic Restoration Council\'s ancient approval carries profound weight. Word spreading through networks creates viral inspiration. Other cosmic agents\' awed recognition becomes palpable. The Ten of Wands burden visibly transforms into stable foundation supporting future achievements.',
      internalConflict: 'Francisco processes the profound recognition that their greatest achievement isn\'t just restoring one realm but inspiring others to accept greater challenges, uncertain whether to feel accomplished or humbled by the magnitude of influence. Zara grapples with understanding that their methodical sustainable approach matters as much as the outcome, integrating that the journey itself established valuable templates. Both must accept they\'ve evolved from capable agents to inspirational embodiments of cosmic ambition.',
      characterGrowthElement: 'Francisco completes his transition to ambitious project leader by proving that enormous burdens carried methodically achieve the seemingly impossible, establishing himself as a master of cosmic-level responsibility. He learns that true ambition serves universal flourishing by inspiring others to greater service. Zara achieves strategic architecture mastery by demonstrating how sustainable methodical progress transforms overwhelming projects into systematic achievement. Both evolve into inspirational embodiments whose ambitious foundation supports Academy-wide elevation of achievement standards.',
      seriesConnectionResonance: 'The Ten Lost Realms project becomes legendary reference for cosmic ambition throughout the series. Other characters aspire to match or exceed this achievement standard. Francisco\'s reputation as one who accepts enormous burdens and carries them methodically to success becomes his defining characteristic, inspiring resistance forces throughout the timeline war. The sustainable ambitious model influences cosmic project management across dimensional history.',
      sceneCardProgression: 62,
      realWorldContext: 'The Academy recognition mirrors how successful completion of ambitious projects creates organizational cultural shifts. The viral inspiration reflects how leaders who tackle overwhelming challenges methodically inspire others to raise their own standards. The transformation from burden to foundation reflects how difficult achievements become platforms for future growth. The model establishment applies to any ambitious transformational initiative.',
      timelineSignificance: 'Establishes that this afternoon marks Francisco and Zara\'s evolution from capable agents to inspirational embodiments of cosmic ambition whose legacy elevates achievement standards across dimensional space. The Ten Lost Realms project becomes a defining moment in cosmic history, referenced whenever ambitious undertakings are contemplated, proving that enormous burdens carried methodically transform into foundations for universal flourishing.',
      saveTheCatBeat: 'The Road Back - Ambitious Achievement and Foundation',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on witnessing the restored realm\'s transformation from despair to hope, processing the Academy-wide recognition and inspiration spreading, understanding that their greatest impact is inspiring others to ambitious service, integrating evolution to inspirational embodiment. Show him recognizing legacy consciousness.',
        sudowrite_emotional_arc: 'Begins with triumphant validation of successful restoration, moves through mounting recognition of broader inspirational impact, culminates in profound understanding of evolution to foundational embodiment. The emotional journey is from accomplished satisfaction through inspiring influence to legacy consciousness.',
        sudowrite_sensory_emphasis: 'Emphasize the restored realm radiating stabilized harmony, Lost Realm Inhabitants\' grateful celebration, Cosmic Restoration Council\'s ancient approval, viral spread of inspiration through Academy networks, other agents\' awed recognition, the visible transformation of Ten of Wands burden into stable foundation.',
      },
      learning_objectives: {
        integration: 'Ambitious Foundation and Inspirational Embodiment',
        terminal_objectives: [
          'Prove that enormous burdens carried methodically achieve seemingly impossible cosmic restoration, transforming overwhelming challenges into systematic progress',
          'Inspire Academy-wide elevation of ambition standards by demonstrating that accepting overwhelming responsibility with sustainable methods creates transformational impact',
          'Evolve from capable cosmic agents to inspirational embodiments whose ambitious foundation establishes new models for cosmic-level achievement and service',
        ],
      },
      foreshadowing_elements: [
        'The Academy-wide inspiration foreshadows how Francisco\'s ambitious example will motivate resistance forces during the timeline war',
        'The transformation of burden into foundation foreshadows how his difficult achievements become platforms for universal resistance',
        'The evolution to inspirational embodiment foreshadows his role as symbol of ambitious cosmic service throughout the series',
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

  console.log('\n🎉 EA-035 complete import finished!');
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
