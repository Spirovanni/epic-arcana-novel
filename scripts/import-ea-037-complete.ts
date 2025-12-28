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

interface EA037Data {
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

function findEA037Data(): EA037Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA037Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-037') return obj as EA037Data;

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
  console.log('🔍 Searching for EA-037 in outline...\n');

  const ea037Data = findEA037Data();

  if (!ea037Data) {
    console.error('❌ EA-037 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-037: ${ea037Data.title}`);
  console.log(`   Scenes: ${ea037Data.scenes?.length || 0}\n`);
  console.log('🎯 BOOK 1 CLIMAX CHAPTER!\n');

  // Find the chapter - it should be chapter 37 in the same book as EA-023
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
    .where(eq(chapters.uniqueIdentifier, 'EA-037'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-037 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 37 in the same book
    const ch37 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 37))
      .limit(10);

    const correctChapter = ch37.find((ch) => ch.bookId === bookId);

    if (!correctChapter) {
      console.error('❌ Chapter 37 not found in the same book as EA-023');
      process.exit(1);
    }

    chapter = correctChapter;
    console.log(`✅ Found Chapter 37: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-037',
        title: ea037Data.title,
        epicNovelPages: truncate(ea037Data.epic_novel_pages, 50),
        epicChapterFocus: ea037Data.epic_chapter_focus,
        epicNovelChapterFocus: ea037Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea037Data.tarot_family, 100),
        tarotCardItem: truncate(ea037Data.tarot_card_item, 100),
        heroJourneyBeat: truncate(ea037Data.hero_journey_beat, 100),
        saveTheCatBeat: truncate(ea037Data.save_the_cat_beat, 255),
        summary: ea037Data.summary,
        characterArcs: ea037Data.character_arcs,
        storyGapsAddressed: ea037Data.story_gaps_addressed,
        locationDetails: ea037Data.location_details,
        seriesConnections: ea037Data.series_connections,
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-037 data\n');
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

  for (const sceneData of ea037Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-037',
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
      // Scene 1: Entropy's Arrival
      pages: 'Page 541 - 545',
      description: 'At the Potential Nexus, the Universal Entropy Entity materializes—a vast void-presence draining color, warmth, and possibility from reality itself. Francisco and Zara, surrounded by their cosmic alliance, watch dimensions flicker and die at the Entity\'s touch. Individual powers prove futile against the unstoppable drain. Francisco wants to synthesize his journey\'s lessons (valor, inspiration, ambition, collaboration) into unified action; Zara wants to find the transformation key before all potential vanishes. They face overwhelming opposition but step forward together toward the Entropy Boundary with grim resolve, knowing infinite existence depends on a breakthrough they haven\'t yet achieved.',
      focus: 'Francisco and Zara recognize that synthesizing all their growth (valor, inspiration, ambition, collaboration) into transcendent potential is the only path to survive the ultimate existential threat',
      chapterSceneFocus: 'Ch37S1: Understanding that separate cosmic skills must fuse into unified transcendent potential to face ultimate universal threats',
      preliminarySceneFocus: 'The Universal Entropy Entity manifests as the ultimate threat, forcing Francisco and Zara to synthesize all growth',
      preliminarySceneDescription: 'At dawn at the Potential Nexus—a shimmering convergence point spanning all dimensions—the Universal Entropy Entity materializes: a vast void-presence draining color, warmth, and possibility from reality itself. Francisco and Zara stand with their cosmic alliance (Theron, Lysara, Kael, dimensional representatives, and Malthor) watching dimensions flicker and die at the Entity\'s touch. Individual powers prove futile—valor can\'t stand against the drain, inspiration can\'t envision what\'s being erased, ambition can\'t achieve when potential dies, collaboration multiplies inadequacy. Francisco wants to synthesize his journey\'s lessons into unified action; Zara wants to find transformation before all potential vanishes. The Ace of Wands symbolism emerges: pure potential at the precipice—the unlit spark that could ignite infinite possibilities or be extinguished forever. They lock eyes, feeling infinite existence depending on a breakthrough they haven\'t achieved, and step forward together toward the Entropy Boundary with grim ultimate determination.',
      narrativeFunction: 'Establishes the Universal Entropy Entity as the ultimate existential threat requiring Francisco and Zara to transcend all previous growth. This scene creates the climactic stakes and recognizes that synthesizing valor, inspiration, ambition, and collaboration into unified transcendent potential is the only survival path.',
      sensoryDetail: 'The Potential Nexus shimmers across all dimensions simultaneously. The Entropy Entity materializes as vast void-presence—absence rather than presence, draining color to gray, warmth to cold, sound to silence. Dimensions flicker like dying stars. Alliance members\' individual powers spark and fail against the unstoppable drain. Growing despair manifests as dimming life force. Francisco and Zara\'s locked eyes hold infinite determination. The Entropy Boundary looms—the edge where existence meets oblivion.',
      internalConflict: 'Francisco struggles with synthesizing separate skills (valor, inspiration, ambition, collaboration) into unified action, uncertain how disparate growth fuses into transcendence. Zara grapples with finding transformation key before potential vanishes, wondering if breakthrough is achievable or futile hope. Both face overwhelming fear that their entire journey prepared them inadequately for ultimate universal threat.',
      characterGrowthElement: 'Francisco achieves recognition that his complete journey (valor facing impossible odds, inspiring others to courage, carrying enormous burdens ambitiously, collaborating to multiply strength) must synthesize into something greater—transcendent potential itself. Zara discovers that her parallel growth (steadfast courage, catalyst for inspiration, strategic ambition, diplomatic bridge-building) positions her as co-equal transformation partner. Both evolve toward becoming conduits for pure cosmic potential rather than wielders of separate abilities.',
      seriesConnectionResonance: 'The Universal Entropy Entity as ultimate threat establishes the Book 1 climax and demonstrates the power level required for the greater challenges Francisco and Zara will face in Books 2 and beyond. Their recognition that synthesis of all growth is required creates the Ace Ascendant framework guiding potential mastery throughout the series. This climactic moment completes Book 1\'s arc while opening infinite heroic paths.',
      sceneCardProgression: 66,
      realWorldContext: 'The Potential Nexus mirrors real-world moments where individuals must integrate all previous learning to face ultimate career, personal, or existential challenges. The Entropy Entity represents any force draining possibility—despair, stagnation, systemic oppression. The recognition that separate skills must synthesize into transcendent capability reflects how mastery requires integration not just accumulation.',
      timelineSignificance: 'Establishes that March 4, 1320 (Divergence Point Alpha) becomes the day the ultimate universal threat manifests, forcing Francisco and Zara toward their greatest transformation. This climactic moment determines whether existence continues evolving or falls into eternal stagnation—infinite stakes with potential for infinite resolution.',
      saveTheCatBeat: 'The Resurrection - Facing Ultimate Entropy',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on watching dimensions die at the Entity\'s touch, the futility of individual powers against unstoppable drain, the desperate need to synthesize all journey\'s lessons, the locked-eyes moment with Zara holding infinite determination, the grim resolve stepping toward Entropy Boundary. Show him recognizing synthesis requirement.',
        sudowrite_emotional_arc: 'Begins with cosmic alliance confidence facing new threat, moves through mounting horror as Entropy drains reality and individual powers fail, reaches grim ultimate determination recognizing synthesis is the only path. The emotional journey is from prepared confidence through overwhelming inadequacy to transcendent resolve.',
        sudowrite_sensory_emphasis: 'Emphasize the Potential Nexus shimmering across all dimensions, the Entropy Entity as void-presence draining color/warmth/sound, dimensions flickering like dying stars, alliance powers sparking and failing, growing despair dimming life force, Francisco and Zara\'s locked eyes, the Entropy Boundary looming.',
      },
      learning_objectives: {
        integration: 'Ultimate Synthesis and Transcendent Potential',
        terminal_objectives: [
          'Recognize that facing ultimate universal threats requires synthesizing all previous growth (valor, inspiration, ambition, collaboration) into unified transcendent potential',
          'Accept that separate cosmic skills, however powerful individually, prove inadequate against existential entropy without integration into something greater',
          'Prepare for transformation into conduits for pure potential rather than remaining wielders of separate abilities',
        ],
      },
      foreshadowing_elements: [
        'The Ace of Wands symbolism foreshadows the ignition of infinite potential in Scene 2',
        'The locked-eyes moment foreshadows Francisco and Zara becoming co-equal transformation partners',
        'The grim resolve stepping toward Entropy Boundary foreshadows the climactic transformation at the edge of existence',
      ],
    },
    {
      // Scene 2: Ignition of the Infinite
      pages: 'Page 546 - 550',
      description: 'At the Entropy Boundary where existence meets oblivion, Francisco and Zara stand alone before the void-presence as dimensions crumble. The Entity\'s drain intensifies, but something shifts: valor steadies them, inspiration reveals the pattern (entropy is potential frozen, not destroyed), ambition drives will to act, and collaboration multiplies their strength exponentially. In the climactic moment, they embrace entropy rather than oppose it, becoming conduits for the Ace Ascendant transformation. Their combined consciousness ignites like cosmic wildfire, converting stagnation into generative force. The Entity screams as it transmutes from destroyer to creator. Reality bends toward possibility.',
      focus: 'Francisco and Zara achieve complete integration becoming the Ace Ascendant, transforming entropy into generative potential through synthesis of all cosmic growth',
      chapterSceneFocus: 'Ch37S2: Achieving transcendent transformation by embracing rather than opposing entropy, becoming conduits for infinite actualizing potential',
      preliminarySceneFocus: 'Francisco and Zara ignite the Ace Ascendant transformation, converting entropy from destroyer to generative creator',
      preliminarySceneDescription: 'At the Entropy Boundary—where existence meets oblivion—Francisco and Zara stand alone before the void-presence as dimensions crumble behind them. The Entity\'s drain intensifies, pulling at their life force, but something shifts: valor steadies them against impossible odds, inspiration reveals the transformative pattern (entropy is potential frozen not destroyed), ambition drives their will to act despite futility, and collaboration—their bond with each other and the alliance feeding power—multiplies strength exponentially. In the climactic moment, they don\'t oppose entropy but embrace it, becoming conduits for the Ace Ascendant transformation. Their combined consciousness ignites like cosmic wildfire: valor\'s courage + inspiration\'s vision + ambition\'s drive + collaboration\'s multiplication = infinite actualizing potential. They convert stagnation into generative force. The Entity screams as it transmutes from destroyer to creator, entropy becoming genesis. The Ace ignited—the spark bursting into full cosmic fire—embodies actualizing potential. Reality itself bends toward possibility.',
      narrativeFunction: 'Demonstrates Francisco and Zara\'s complete integration achieving the Ace Ascendant transformation that converts entropy into generative potential. This scene is the Book 1 climax showing that synthesis of valor, inspiration, ambition, and collaboration creates transcendent power transforming universal threats into cosmic renewal.',
      sensoryDetail: 'The Entropy Boundary exists at the edge where reality dissolves into void. Dimensions crumble with cascading collapse. The Entity\'s drain pulls life force with inexorable gravity. The shift manifests as internal ignition—valor steadying courage, inspiration revealing patterns, ambition driving will, collaboration multiplying exponentially. The climactic transformation: combined consciousness igniting like cosmic wildfire spreading across all dimensions simultaneously. Entropy screaming as it transmutes from void-presence to generative radiance. Reality bending visibly toward infinite possibility.',
      internalConflict: 'Francisco struggles with the final surrender required—embracing entropy rather than opposing it, trusting that transformation emerges from acceptance not resistance. Zara grapples with becoming conduit rather than controller, releasing individual identity to merge into something transcendent. Both face the ultimate challenge: dissolving separate selves to ignite unified infinite potential.',
      characterGrowthElement: 'Francisco achieves complete integration of all cosmic abilities (valor, inspiration, ambition, collaboration) and ascends to become the Ace of Infinite Potential—a conduit for actualizing possibilities across all dimensions. He discovers that his entire journey prepared him not to wield power but to become the spark igniting universal transformation. Zara transforms from supportive partner to co-equal Cosmic Potential Master, discovering her unique gift for amplifying others\' potential makes her the catalyst for universal renewal. Both transcend individual heroism to become living embodiments of infinite possibility.',
      seriesConnectionResonance: 'The Ace Ascendant transformation establishes the ultimate power level Francisco and Zara achieve in Book 1, providing the cosmic authority needed for greater challenges in Books 2+. The entropy transformation precedent sets the pattern for handling major threats—not destruction but conversion into generative force. This climactic moment completes their hero\'s journey while establishing them as Potential Masters guiding all existence toward higher possibilities.',
      sceneCardProgression: 67,
      realWorldContext: 'The Entropy Boundary mirrors real-world moments where individuals must embrace rather than resist challenges to achieve transformation. The pattern that "entropy is frozen potential" reflects how stagnation contains seeds of renewal when approached correctly. The synthesis creating exponential power reflects how integrated mastery transcends component skills. The conduit rather than controller realization applies to leadership and service.',
      timelineSignificance: 'Establishes that this morning becomes the moment Francisco and Zara achieve the Ace Ascendant transformation, fundamentally altering cosmic reality and establishing new universal order where all beings can access higher potential. This transformation ripples throughout all timelines, creating the foundation for resistance against future threats.',
      saveTheCatBeat: 'The Resurrection - Igniting the Ace Ascendant',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Alternating Francisco and Zara: Francisco focuses on the internal synthesis—valor + inspiration + ambition + collaboration = infinite potential, the surrender to embrace rather than oppose. Zara focuses on amplification discovery, merging into unified transformation. Show both becoming conduits igniting cosmic wildfire.',
        sudowrite_emotional_arc: 'Begins with desperate last stand at existence\'s edge, moves through the shift as synthesis begins, reaches transcendent ignition as Ace Ascendant emerges transforming entropy to genesis. The emotional journey is from final resistance through surrender-embrace to infinite actualized potential.',
        sudowrite_sensory_emphasis: 'Emphasize the Entropy Boundary where reality dissolves, cascading dimensional collapse, life force drain, the internal ignition shift, combined consciousness becoming cosmic wildfire spreading across all dimensions, Entity screaming as it transmutes from void to radiance, reality visibly bending toward possibility.',
      },
      learning_objectives: {
        integration: 'Ace Ascendant Transformation and Entropy Conversion',
        terminal_objectives: [
          'Achieve complete integration of all cosmic growth (valor, inspiration, ambition, collaboration) synthesizing into transcendent Ace Ascendant potential',
          'Transform ultimate threats through embrace rather than opposition, converting entropy from destroyer to generative creator',
          'Transcend individual heroism to become conduits for infinite actualizing potential that elevates all existence',
        ],
      },
      foreshadowing_elements: [
        'The Ace ignited bursting into cosmic fire foreshadows the universal transformation in Scene 3',
        'The Entity transmuting from destroyer to creator foreshadows the new cosmic order',
        'The reality bending toward possibility foreshadows dimensions blooming with renewed potential',
      ],
    },
    {
      // Scene 3: Potential Reborn
      pages: 'Page 551 - 555',
      description: 'Reality reshapes around the Ace Ascendant transformation. Francisco and Zara, glowing with integrated cosmic power, witness the cascade: the transformed Entity radiates generative energy, dimensions bloom with new life, and the Academy evolves into the Potential Mastery Institute. Alliance members discover latent abilities awakening—the gift of Francisco and Zara\'s breakthrough. They guide first students in accessing possibility-consciousness, watch the Ten Lost Realms flourish with renewed purpose, and embrace their roles as Ace Ascendants: keepers of infinite potential. The Ace seed planted grows into infinite new realities, demonstrating that unlocking potential catalyzes collective elevation. Book 1\'s arc completes while opening infinite heroic paths.',
      focus: 'Francisco and Zara establish the new cosmic order where all beings access higher potential, completing Book 1 while laying the foundation for infinite possibility',
      chapterSceneFocus: 'Ch37S3: Proving that individual potential achievement catalyzes collective elevation, establishing cosmic order empowering all existence toward infinite possibilities',
      preliminarySceneFocus: 'The Ace Ascendant transformation catalyzes universal renewal, establishing Francisco and Zara as keepers of infinite potential',
      preliminarySceneDescription: 'By afternoon, reality reshapes itself around the Ace Ascendant transformation. Francisco and Zara, still glowing with integrated cosmic power, witness the cascade: the transformed Entity radiates generative energy rather than draining void, dimensions bloom with new life where stagnation reigned, and the Academy evolves into the Potential Mastery Institute before their eyes. Their alliance members—Theron, Lysara, Kael, dimensional representatives, Malthor—discover latent abilities awakening within themselves, the gift of Francisco and Zara\'s breakthrough catalyzing collective elevation. Francisco wants to ensure this new cosmic order empowers all beings not just elite; Zara wants to establish the template so others can walk this path to potential. They guide the first students in accessing possibility-consciousness, watch the Ten Lost Realms flourish with renewed purpose, and stand together knowing they\'ve completed their hero\'s journey while opening infinite heroic paths for all existence. The Ace seed planted crystallizes: the transformed potential grows into infinite new realities across dimensions, demonstrating that unlocking full potential catalyzes collective elevation not just individual achievement. They embrace their roles as Ace Ascendants: keepers of infinite potential serving universal flourishing.',
      narrativeFunction: 'Completes Book 1\'s arc by establishing the new cosmic order where all beings access higher potential through Francisco and Zara\'s Ace Ascendant breakthrough. This scene demonstrates that individual transformation catalyzes collective elevation, fulfilling ultimate purpose and laying the foundation for the series\' ongoing exploration of infinite possibility.',
      sensoryDetail: 'Transformed reality radiates renewed vitality. The Entity glows with generative energy, pulsing creative force across all dimensions. Dimensions bloom—gray becoming vibrant color, silence filling with harmonic resonance, cold igniting with warmth. The Academy transforms architecturally into Potential Mastery Institute. Alliance members glow with awakening latent abilities. First students accessing possibility-consciousness creates visible enlightenment ripples. The Ten Lost Realms flourish with plants growing rapidly, structures rebuilding, populations celebrating. Francisco and Zara still radiating integrated Ace power.',
      internalConflict: 'Francisco struggles with ensuring the new order empowers all not just elite, uncertain how to prevent potential mastery from becoming hierarchical privilege. Zara grapples with establishing accessible templates versus controlling the path, wanting to guide without limiting others\' unique journeys. Both must trust that their breakthrough creates genuine democratization of cosmic potential rather than new forms of gatekeeping.',
      characterGrowthElement: 'Francisco completes his hero\'s journey by becoming the Ace Ascendant dedicated to empowering all beings toward their potential, discovering that his ultimate purpose is catalyzing collective elevation not individual glory. Zara achieves her final transformation as co-equal Potential Master whose amplification gift ensures breakthrough enables universal access not elite privilege. Both fulfill their cosmic service purpose: not maintaining order but actualizing infinite possibilities and elevating all existence to higher potential.',
      seriesConnectionResonance: 'The new cosmic order established here (Potential Mastery Institute, universal access to higher abilities, collective elevation framework) provides the foundation for Books 2+ where Francisco and Zara guide others toward potential while facing greater challenges. Their roles as Ace Ascendants give them the authority and capability needed for the expanded scope. The democratized potential access theme continues throughout the series.',
      sceneCardProgression: 68,
      realWorldContext: 'The transformed reality mirrors real-world scenarios where breakthrough innovations or social movements catalyze collective elevation rather than just individual benefit. The concern about empowering all not just elite reflects ongoing challenges of democratizing access to transformational resources. The template establishment for others\' journeys reflects how leaders must balance guidance with autonomy. The Book 1 completion opening infinite paths reflects how achievement creates new possibilities.',
      timelineSignificance: 'Establishes that this afternoon marks the fundamental transformation of cosmic reality into a new order where all beings can access higher potential through the Ace Ascendant framework. This becomes the pivotal moment in dimensional history when existence shifts from maintaining order to actualizing infinite possibilities, creating the foundation for all future cosmic development and resistance against threats throughout timelines.',
      saveTheCatBeat: 'The Resurrection - New Cosmic Order and Infinite Potential',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on witnessing the cascade of universal transformation, the joy of alliance members awakening latent abilities, the commitment to empowering all beings, guiding first students with care, watching Ten Lost Realms flourish, understanding fulfilled cosmic purpose. Show him embracing the Ace Ascendant role as keeper of infinite potential.',
        sudowrite_emotional_arc: 'Begins with awed witnessing of transformed reality, moves through joyful recognition of catalyzed collective elevation, reaches fulfilled cosmic purpose understanding they\'ve completed journey while opening infinite paths. The emotional journey is from triumphant transformation through collective celebration to eternally hopeful purposeful service.',
        sudowrite_sensory_emphasis: 'Emphasize transformed reality\'s renewed vitality, Entity glowing generatively, dimensions blooming (gray to color, silence to harmony, cold to warmth), Academy transforming architecturally, alliance members glowing with awakening abilities, students accessing possibility-consciousness, Ten Lost Realms flourishing rapidly, Francisco and Zara radiating Ace power.',
      },
      learning_objectives: {
        integration: 'Collective Elevation and Infinite Potential Democratization',
        terminal_objectives: [
          'Establish new cosmic order where all beings access higher potential through democratized frameworks rather than elite gatekeeping',
          'Demonstrate that individual breakthrough catalyzes collective elevation, fulfilling ultimate purpose of cosmic service',
          'Complete hero\'s journey as Ace Ascendants dedicated to actualizing infinite possibilities and guiding universal flourishing',
        ],
      },
      foreshadowing_elements: [
        'The Potential Mastery Institute foreshadows the expanded scope and new students in future books',
        'The alliance members\' awakening abilities foreshadow their roles in future cosmic challenges',
        'The infinite heroic paths opened foreshadow the ongoing series exploration of limitless possibility',
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

  console.log('\n🎉 EA-037 complete import finished!');
  console.log('🏆 BOOK 1 CLIMAX COMPLETE!\n');
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
