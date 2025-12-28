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

interface EA040Data {
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

function findEA040Data(): EA040Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA040Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-040') return obj as EA040Data;

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
  console.log('🔍 Searching for EA-040 in outline...\n');

  const ea040Data = findEA040Data();

  if (!ea040Data) {
    console.error('❌ EA-040 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-040: ${ea040Data.title}`);
  console.log(`   Scenes: ${ea040Data.scenes?.length || 0}\n`);
  console.log('🎆 BOOK 1 FINALE - The Knight Ascendant!\n');
  console.log('🌟 MASTER OF TWO WORLDS - Complete Transformation!\n');

  // Find the chapter - it should be chapter 40 in the same book as EA-023
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
    .where(eq(chapters.uniqueIdentifier, 'EA-040'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-040 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 40 in the same book
    const ch40 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 40))
      .limit(10);

    const correctChapter = ch40.find((ch) => ch.bookId === bookId);

    if (!correctChapter) {
      console.error('❌ Chapter 40 not found in the same book as EA-023');
      process.exit(1);
    }

    chapter = correctChapter;
    console.log(`✅ Found Chapter 40: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-040',
        title: ea040Data.title,
        epicNovelPages: truncate(ea040Data.epic_novel_pages, 50),
        epicChapterFocus: ea040Data.epic_chapter_focus,
        epicNovelChapterFocus: ea040Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea040Data.tarot_family, 100),
        tarotCardItem: truncate(ea040Data.tarot_card_item, 100),
        heroJourneyBeat: ea040Data.hero_journey_beat?.substring(0, 99) || null,
        saveTheCatBeat: ea040Data.save_the_cat_beat?.substring(0, 100) || null,
        summary: ea040Data.summary,
        characterArcs: typeof ea040Data.character_arcs === 'string'
          ? ea040Data.character_arcs
          : JSON.stringify(ea040Data.character_arcs),
        storyGapsAddressed: typeof ea040Data.story_gaps_addressed === 'string'
          ? ea040Data.story_gaps_addressed
          : JSON.stringify(ea040Data.story_gaps_addressed),
        locationDetails: typeof ea040Data.location_details === 'string'
          ? ea040Data.location_details
          : JSON.stringify(ea040Data.location_details),
        seriesConnections: typeof ea040Data.series_connections === 'string'
          ? ea040Data.series_connections
          : JSON.stringify(ea040Data.series_connections),
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-040 data\n');
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

  for (const sceneData of ea040Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-040',
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
      // Scene 1: The Threshold Crossed
      pages: 'Page 586 - 591',
      description: 'At dawn, Francisco stands at the Master\'s Threshold—a cosmic nexus shimmering with converging realities, a liminal space where all dimensions meet. The Academy\'s highest masters (Grand Master Severyn, the Council of Nine, and Zara standing witness with Marcus and Elena) observe as Francisco undergoes the final transformation: his temporal, cosmic, and human aspects—once fragmented and struggling for integration—now fuse into seamless unity. Francisco wants to fully embrace this transcendence without losing his essential humanity; the masters want to formally elevate him while ensuring he understands the responsibility. Opposition arises not externally but internally: the fear of losing himself in vastness, the temptation to cling to student identity for safety, the vertigo of standing at the threshold of infinite possibility. But as dawn breaks simultaneously across multiple dimensions—a cascade of light only he can perceive and navigate—Francisco steps forward. The limitations dissolve. He is no longer a student seeking mastery but a master ready to guide.',
      focus: 'Francisco achieves his ultimate transformation to Master of Two Worlds status, transcending student limitations and embodying the aspiration principle that clear vision and purpose drive forward momentum across all realities',
      chapterSceneFocus: 'Ch40S1: Completing the Hero\'s Journey by achieving Master of Two Worlds status, transcending all limitations while maintaining essential humanity',
      preliminarySceneFocus: 'Francisco undergoes final transformation at the Master\'s Threshold, achieving seamless unity across all aspects',
      preliminarySceneDescription: 'At dawn at the Master\'s Threshold—a cosmic nexus where all dimensions meet—Francisco undergoes final transformation as Academy\'s highest masters observe. His temporal, cosmic, and human aspects—once fragmented—now fuse into seamless unity. Francisco wants to embrace transcendence without losing essential humanity; masters want to elevate him while ensuring he understands responsibility. Opposition is internal: fear of losing himself in vastness, temptation to cling to student identity for safety, vertigo at the threshold of infinite possibility. The Knight of Disks symbolism emerges: mastery in action, spiritual wisdom applied practically. The black void represents infinite potential from which all creation emerges; multi-dimensional dawn shows Francisco bringing illuminating purpose to all realms through clear vision. As dawn breaks simultaneously across multiple dimensions—cascade of light only he can perceive and navigate—Francisco steps forward. Limitations dissolve. He is no longer student seeking mastery but master ready to guide. Transcendent peace suffused with profound responsibility.',
      narrativeFunction: 'Establishes Francisco\'s ultimate transformation achieving Master of Two Worlds status—the culmination of the Hero\'s Journey. This scene demonstrates that complete mastery requires transcending all limitations while maintaining essential humanity, embodying the aspiration principle that clear vision and purpose enable movement across all realities.',
      sensoryDetail: 'The Master\'s Threshold shimmers with converging realities—all dimensions meeting at liminal nexus. Academy\'s highest masters observe with solemn presence. Francisco\'s aspects—temporal, cosmic, human—manifest as distinct energies fusing into seamless unity. Dawn breaks simultaneously across multiple dimensions—cascade of light visible only to him. Internal opposition manifests as vertigo, clinging sensation, fear of vastness. The fusion creates transcendent peace. Limitations dissolve visibly like barriers shattering. Master consciousness awakens.',
      internalConflict: 'Francisco struggles with fear of losing essential humanity in transcendent vastness, questioning whether embracing infinite possibility means abandoning the student self who worked so hard to reach this threshold. He grapples with vertigo at standing before infinite possibility, uncertain if he\'s truly ready for the responsibility. The temptation to cling to familiar student identity for safety battles against the call to step forward into mastery. The profound weight of responsibility threatens to overwhelm the transcendent peace.',
      characterGrowthElement: 'Francisco achieves the ultimate Hero\'s Journey transformation: Master of Two Worlds. He discovers that transcendence doesn\'t erase humanity but integrates it—his temporal, cosmic, and human aspects fusing into seamless whole. He evolves from student seeking mastery to master ready to guide others, understanding that this transformation carries profound responsibility. The aspiration principle crystallizes: clear vision and purpose enable him to perceive and navigate multi-dimensional reality, bringing illuminating purpose to all realms.',
      seriesConnectionResonance: 'The Master of Two Worlds achievement establishes Francisco\'s foundational status for Books 2-9—he now possesses the consciousness and capabilities needed for series-long cosmic challenges. The transformation at the Master\'s Threshold creates the template for how he\'ll guide others through similar awakenings. His ability to perceive and navigate multiple dimensions simultaneously becomes essential for future multi-reality conflicts.',
      sceneCardProgression: 75,
      realWorldContext: 'The Master\'s Threshold mirrors real-world moments where individuals achieve complete integration of previously fragmented aspects—professional, personal, spiritual identities fusing into coherent whole. The fear of losing humanity in transcendence reflects how growth requires releasing familiar identities while maintaining core values. The responsibility weight mirrors how true mastery brings obligation to serve and guide others. The multi-dimensional dawn reflects expanded awareness changing how reality is perceived.',
      timelineSignificance: 'Establishes that March 7, 1320 (Prime Timeline) becomes the day Francisco achieves Master of Two Worlds status—the pivotal moment completing his Hero\'s Journey and beginning his role as cosmic guide. This transformation fundamentally alters cosmic reality as he becomes the living bridge between all dimensions, creating new possibilities for cross-reality cooperation and collective evolution.',
      saveTheCatBeat: 'Final Image - Ultimate Transformation Complete',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on standing at the Master\'s Threshold where all dimensions meet, highest masters observing solemnly, his aspects (temporal, cosmic, human) fusing into seamless unity, the internal opposition (fear, clinging, vertigo), dawn breaking simultaneously across multiple dimensions as cascade of light, stepping forward as limitations dissolve, transcendent peace suffused with profound responsibility. Show the transition from student seeking mastery to master ready to guide.',
        sudowrite_emotional_arc: 'Begins with solemn anticipation at the threshold facing final transformation, moves through internal struggle as fear and clinging battle against transcendent call, reaches transcendent peace as fusion completes and master consciousness awakens. The emotional journey is from threshold anticipation through integration struggle to profound purposeful transcendence.',
        sudowrite_sensory_emphasis: 'Emphasize the Master\'s Threshold shimmering with converging realities, highest masters\' solemn observation, aspects manifesting as distinct energies fusing seamlessly, dawn breaking across multiple dimensions as visible cascade of light, internal opposition as vertigo and clinging sensation, limitations dissolving like shattering barriers, transcendent peace awakening.',
      },
      learning_objectives: {
        integration: 'Master of Two Worlds Achievement and Complete Integration',
        terminal_objectives: [
          'Achieve Master of Two Worlds status by transcending all limitations while maintaining essential humanity, completing the Hero\'s Journey ultimate transformation',
          'Integrate temporal, cosmic, and human aspects into seamless unity, demonstrating that true mastery fuses all dimensions of being into coherent whole',
          'Accept the profound responsibility of guiding others that comes with mastery, embodying the aspiration principle that clear vision and purpose enable multi-reality service',
        ],
      },
      foreshadowing_elements: [
        'The multi-dimensional dawn perception foreshadows Francisco\'s ongoing ability to navigate multiple realities in Scene 2',
        'The master ready to guide foreshadows his teaching role in Scene 3',
        'The profound responsibility foreshadows the cosmic challenges he\'ll face in future books',
      ],
    },
    {
      // Scene 2: Living Bridge
      pages: 'Page 592 - 596',
      description: 'By morning, Francisco demonstrates his Master of Two Worlds capacity by existing simultaneously in his law school\'s familiar lecture hall and the Academy\'s cosmic council chamber—no longer choosing between worlds but inhabiting both freely. In the lecture hall, his former classmates (now sensing something luminous about him) ask tentative questions about purpose and meaning; Francisco helps them glimpse their latent potential without overwhelming their readiness. In the council chamber, he coordinates with cosmic masters on dimensional stabilization challenges spanning multiple realities. Francisco wants to serve both worlds with equal presence and effectiveness; Zara, Marcus, and Elena want to support his dual role while finding their own places in the cosmic plan. The challenge is balancing: giving each world adequate attention, translating cosmic wisdom into ordinary language and vice versa, and maintaining groundedness while operating across dimensions. But Francisco moves with fluid grace between realms, a living bridge connecting levels of reality. As he speaks, former classmates awaken to possibility; as he coordinates, cosmic masters recognize his unique gift.',
      focus: 'Francisco actively uses his Master of Two Worlds abilities to serve both ordinary and cosmic realms simultaneously, demonstrating that aspiration aligned with deeper meaning motivates creative pursuit and enables others to see their own transformative possibilities',
      chapterSceneFocus: 'Ch40S2: Demonstrating Master of Two Worlds capacity by inhabiting multiple realities simultaneously, serving all with equal presence',
      preliminarySceneFocus: 'Francisco exists simultaneously in law school and cosmic council, bridging ordinary and cosmic realms freely',
      preliminarySceneDescription: 'By morning, Francisco demonstrates Master of Two Worlds capacity by existing simultaneously in his law school\'s familiar lecture hall and the Academy\'s cosmic council chamber—no longer choosing between worlds but inhabiting both freely. In the lecture hall, former classmates sensing something luminous ask tentative questions about purpose and meaning; Francisco helps them glimpse latent potential without overwhelming readiness. In the council chamber, he coordinates with cosmic masters on dimensional stabilization challenges spanning multiple realities. Francisco wants to serve both worlds with equal presence and effectiveness; Zara, Marcus, and Elena want to support his dual role while finding their own places in cosmic plan. The bridge mirrors the aspiration theme of purpose-driven leadership: Francisco\'s clear \'why\'—to elevate all beings—aligns his actions across realms, inspiring others by demonstrating that meaningful vision transcends any single world and connects all realities through shared potential. The challenge is balancing: giving each world adequate attention, translating wisdom bidirectionally, maintaining groundedness while operating across dimensions. But Francisco moves with fluid grace between realms, a living bridge connecting reality levels. Former classmates awaken to possibility; cosmic masters recognize his unique gift. Joyful service and fulfilled purpose.',
      narrativeFunction: 'Demonstrates Francisco\'s Master of Two Worlds abilities in practical action as he simultaneously serves ordinary and cosmic realms. This scene shows that aspiration aligned with deeper meaning—elevating all beings—enables him to bridge realities, translate wisdom bidirectionally, and inspire others to recognize their own transformative potential.',
      sensoryDetail: 'The lecture hall feels familiar—wooden desks, afternoon light through windows, former classmates\' curious faces sensing his luminous presence. Simultaneously, the cosmic council chamber manifests crystalline vastness—dimensional maps floating holographically, cosmic masters coordinating across realities. Francisco\'s consciousness bridges both seamlessly. His voice translates wisdom bidirectionally—ordinary language in the hall, cosmic resonance in the chamber. The fluid grace of movement between realms. Former classmates\' eyes widening with awakening possibility. Cosmic masters\' recognition.',
      internalConflict: 'Francisco struggles with balancing attention across worlds—questioning whether he can truly serve both with equal presence or if one will inevitably suffer. He grapples with translating cosmic wisdom into language that doesn\'t overwhelm ordinary readiness while simultaneously coordinating complex dimensional challenges. The challenge of maintaining groundedness while operating across infinite realities threatens to fragment his newly integrated consciousness. The desire to serve perfectly battles against accepting he can only do his best.',
      characterGrowthElement: 'Francisco demonstrates complete Master of Two Worlds mastery by inhabiting multiple realities simultaneously without fragmentation. He discovers that his clear purpose—elevating all beings—naturally aligns his actions across realms, creating coherence rather than conflict. His ability to translate wisdom bidirectionally and gauge others\' readiness shows evolved teaching capacity. The joy he experiences in serving both worlds reveals that his fulfillment comes from enabling others\' potential, embodying the aspiration principle that meaningful vision transcends boundaries.',
      seriesConnectionResonance: 'The living bridge capacity establishes Francisco\'s unique contribution for the series—his ability to simultaneously operate across multiple realities will be essential for coordinating responses to threats spanning dimensions. His skill at translating wisdom bidirectionally enables him to recruit and guide heroes from both ordinary and cosmic realms. The joy in service rather than achievement defines his ongoing character motivation.',
      sceneCardProgression: 76,
      realWorldContext: 'The dual presence mirrors real-world scenarios where individuals balance multiple important roles—professional and personal, local and global, individual and collective—discovering that clear purpose creates coherence rather than conflict. The bidirectional translation reflects how effective leaders communicate complex ideas accessibly while maintaining depth. The joy in service reflects how meaningful work aligned with values provides deepest fulfillment. The awakening others to possibility mirrors teaching and mentorship impact.',
      timelineSignificance: 'Establishes that this morning marks Francisco\'s first active demonstration of Master of Two Worlds abilities, showing that the transformation enables practical simultaneous service across realities. This becomes the model for how cosmic masters operate—not choosing between worlds but freely inhabiting all, creating bridges that enable collective evolution across dimensions.',
      saveTheCatBeat: 'Final Image - Living the Transformation',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on simultaneous presence in lecture hall and cosmic council chamber, former classmates\' tentative questions and luminous sensing, helping them glimpse potential without overwhelming, coordinating dimensional stabilization with cosmic masters, the fluid grace of moving between realms, translating wisdom bidirectionally, former classmates awakening to possibility, cosmic masters recognizing unique gift. Show the joy in serving both worlds with equal presence.',
        sudowrite_emotional_arc: 'Begins with focused intention as dual presence engages both realms simultaneously, moves through fluid grace as balancing becomes natural rather than effortful, reaches joyful fulfillment as service enables others\' awakening and recognition. The emotional journey is from intentional dual focus through graceful balancing to joyful purposeful service.',
        sudowrite_sensory_emphasis: 'Emphasize lecture hall familiarity (wooden desks, afternoon light, curious faces), cosmic council chamber crystalline vastness with holographic dimensional maps, Francisco\'s consciousness bridging both seamlessly, voice translating wisdom bidirectionally, fluid grace of realm movement, former classmates\' widening eyes awakening to possibility, cosmic masters\' recognition.',
      },
      learning_objectives: {
        integration: 'Master of Two Worlds in Action and Purpose-Driven Bridge Building',
        terminal_objectives: [
          'Demonstrate Master of Two Worlds capacity by simultaneously inhabiting and serving multiple realities with equal presence and effectiveness',
          'Align actions across realms through clear purpose—elevating all beings—showing that meaningful vision creates coherence and inspires others to recognize transformative potential',
          'Translate wisdom bidirectionally and gauge readiness appropriately, becoming the living bridge that connects reality levels and enables collective evolution',
        ],
      },
      foreshadowing_elements: [
        'The awakening former classmates foreshadow Francisco recruiting ordinary humans for cosmic missions in future books',
        'The dimensional stabilization coordination foreshadows larger-scale multi-reality challenges',
        'The living bridge role foreshadows Francisco\'s unique contribution to series-long conflicts',
      ],
    },
    {
      // Scene 3: The Quest Begins Anew
      pages: 'Page 597 - 600',
      description: 'By afternoon, Francisco stands in the Hall of Cosmic Masters—an ancient chamber where the greatest guides throughout history have taken their oaths—while simultaneously feeling the familiar grass of his university quad beneath his feet. The duality no longer disorients; it empowers. Grand Master Severyn presents Francisco\'s first assignment as guide and master: prepare humanity for the cosmic challenges emerging on the horizon, challenges that will require ordinary people to access their own extraordinary potential. Francisco wants to honor this mission with wisdom and humility; the cosmic masters want to entrust him with responsibilities that will shape the series\' future; Zara, Marcus, and Elena want to commit as his first apprentices and partners. There is no opposition now—only anticipation. As afternoon light bathes both the cosmic hall\'s crystalline pillars and Earth\'s ordinary beauty, Francisco looks toward the unwritten future with clear-eyed readiness. His transformation from ambitious law student to Master of Two Worlds is complete, yet he understands this completion is actually commencement. His greatest adventures—guiding others through their own heroic journeys—are just beginning.',
      focus: 'Francisco\'s transformation arc completes while his new role as guide begins, establishing the series foundation and embodying the aspiration principle: when vision aligns with purpose, endings become beginnings, and individual mastery enables collective elevation toward infinite possibility',
      chapterSceneFocus: 'Ch40S3: Completing Book 1 arc while beginning series-long mission, embodying that mastery\'s purpose is enabling collective evolution',
      preliminarySceneFocus: 'Francisco receives his first mission as cosmic master while standing in both cosmic and ordinary worlds',
      preliminarySceneDescription: 'By afternoon, Francisco stands in the Hall of Cosmic Masters—ancient chamber where greatest guides throughout history took their oaths—while simultaneously feeling familiar grass of his university quad beneath his feet. Duality no longer disorients; it empowers. Grand Master Severyn presents Francisco\'s first assignment as guide and master: prepare humanity for cosmic challenges emerging on the horizon, challenges requiring ordinary people to access their own extraordinary potential. Francisco wants to honor this mission with wisdom and humility; cosmic masters want to entrust him with responsibilities shaping the series\' future; Zara, Marcus, and Elena want to commit as his first apprentices and partners. Afternoon light represents mature completion; the Knight embodies readiness for action in service of high aspirations. Dual presence (cosmic hall and Earth) crystallizes the theme that clear vision and purpose enable individuals to bridge worlds, aim high, and inspire others toward their own transformative quests. There is no opposition now—only anticipation. As afternoon light bathes both cosmic hall\'s crystalline pillars and Earth\'s ordinary beauty, Francisco looks toward the unwritten future with clear-eyed readiness. His transformation from ambitious law student to Master of Two Worlds is complete, yet he understands this completion is actually commencement. His greatest adventures—guiding others through their own heroic journeys—are just beginning. The Knight Ascendant stepping forward into infinite possibility.',
      narrativeFunction: 'Completes Francisco\'s Book 1 transformation arc while establishing his series-long role as cosmic guide preparing humanity for challenges ahead. This scene embodies the aspiration principle\'s ultimate expression: when vision aligns with purpose, endings become beginnings, and individual mastery enables collective elevation toward infinite possibility, creating the foundation for all future adventures.',
      sensoryDetail: 'The Hall of Cosmic Masters emanates ancient power—crystalline pillars rising toward infinity, oath-taking stones worn smooth by countless masters throughout history. Simultaneously, the university quad feels present—familiar grass beneath feet, afternoon warmth, ordinary beauty. The duality empowers rather than disorients. Grand Master Severyn\'s presentation carries gravitas and trust. Zara, Marcus, and Elena\'s commitment radiates partnership. Afternoon light bathes both realms simultaneously. The unwritten future shimmers with anticipation. Clear-eyed readiness manifests as calm certainty.',
      internalConflict: 'Francisco grapples with honoring the mission with wisdom and humility while accepting the enormous responsibility of preparing humanity for cosmic challenges. He questions whether he truly possesses the wisdom to guide others through their heroic journeys, uncertain if his own transformation taught him enough to be an effective master. The weight of shaping the series\' future through his choices threatens to paralyze with perfectionism. But the understanding that completion is actually commencement dissolves the need for having all answers—he\'ll learn by serving.',
      characterGrowthElement: 'Francisco completes his ultimate Book 1 transformation: from ambitious law student to Master of Two Worlds cosmic guide. He achieves the profound understanding that mastery\'s purpose is enabling collective elevation—his individual transformation serves to prepare humanity for accessing extraordinary potential. The acceptance of his first mission with wisdom and humility demonstrates evolved maturity. His readiness to guide others through heroic journeys shows he\'s internalized that endings are beginnings, and the greatest adventures lie in service rather than personal achievement.',
      seriesConnectionResonance: 'The first mission establishes the series-long arc: Francisco preparing humanity for cosmic challenges requiring ordinary people to access extraordinary potential. This creates the framework for Books 2-9 where he\'ll recruit, train, and guide expanding circles of heroes. Zara, Marcus, and Elena committing as first apprentices establishes the core team structure. The recognition that greatest adventures are just beginning opens infinite narrative possibilities while providing satisfying Book 1 closure.',
      sceneCardProgression: 77,
      realWorldContext: 'The Hall of Cosmic Masters mirrors real-world moments where individuals accept major responsibilities and callings—career transitions, leadership roles, teaching commitments. The mission to prepare others for challenges reflects how experienced individuals guide next generations. The understanding that completion is commencement mirrors how achievements open new chapters rather than providing final destinations. The clear-eyed readiness reflects mature acceptance that serving others is the highest purpose.',
      timelineSignificance: 'Establishes that this afternoon marks the formal beginning of Francisco\'s series-long mission to prepare humanity for cosmic challenges—a pivotal moment that determines how Earth and ordinary humans will face the threats emerging across timelines. This becomes the foundational moment when individual heroic transformation expands into collective evolutionary potential, changing the trajectory of all future cosmic development.',
      saveTheCatBeat: 'Final Image - The Quest Begins Anew',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on standing simultaneously in the Hall of Cosmic Masters (ancient chamber, crystalline pillars, oath-taking stones) and university quad (familiar grass, afternoon warmth), the duality empowering rather than disorienting, Grand Master Severyn presenting first mission with gravitas, Zara/Marcus/Elena committing as apprentices and partners, afternoon light bathing both realms, looking toward unwritten future with clear-eyed readiness, understanding completion is commencement. Show the Knight Ascendant stepping forward into infinite possibility.',
        sudowrite_emotional_arc: 'Begins with empowered dual presence as Francisco receives mission and commitment, moves through profound understanding that completion is commencement, reaches clear-eyed anticipatory readiness as greatest adventures begin. The emotional journey is from empowered mission acceptance through profound realization to anticipatory forward-looking purpose.',
        sudowrite_sensory_emphasis: 'Emphasize Hall of Cosmic Masters\' ancient power (crystalline pillars, oath-taking stones worn smooth), university quad\'s ordinary beauty (grass, afternoon warmth), the empowering duality, Grand Master Severyn\'s gravitas, Zara/Marcus/Elena\'s partnership commitment, afternoon light bathing both realms simultaneously, unwritten future shimmering with anticipation, clear-eyed readiness as calm certainty.',
      },
      learning_objectives: {
        integration: 'Series Foundation and Purpose-Driven New Beginning',
        terminal_objectives: [
          'Complete Book 1 transformation arc while accepting series-long mission to prepare humanity for cosmic challenges, demonstrating that individual mastery serves collective evolution',
          'Understand that endings are beginnings—completion of heroic journey is commencement of guide role, embodying the aspiration principle that vision aligned with purpose creates infinite possibility',
          'Accept responsibility for enabling others\' extraordinary potential with wisdom and humility, recognizing that greatest adventures lie in guiding others through their own transformative journeys',
        ],
      },
      foreshadowing_elements: [
        'The mission to prepare humanity foreshadows the recruitment and training arcs in Books 2-9',
        'The cosmic challenges emerging on the horizon foreshadow the escalating threats throughout the series',
        'The first apprentices commitment foreshadows the expanding team and teaching dynamics',
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
        saveTheCatBeat: truncate(enhancement.saveTheCatBeat, 255),
        sudowrite_metadata: enhancement.sudowrite_metadata,
        learning_objectives: enhancement.learning_objectives,
        foreshadowing_elements: enhancement.foreshadowing_elements,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: Enhanced with all fields`);
  }

  console.log('\n🎉 EA-040 complete import finished!');
  console.log('🎆 THE KNIGHT ASCENDANT - Book 1 Finale Complete!\n');
  console.log('🌟 MASTER OF TWO WORLDS - Francisco\'s Ultimate Transformation!\n');
  console.log('📖 BOOK 1 COMPLETE - The Hero\'s Journey Fulfilled!\n');
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
