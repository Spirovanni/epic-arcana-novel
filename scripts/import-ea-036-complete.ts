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

interface EA036Data {
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

function findEA036Data(): EA036Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA036Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-036') return obj as EA036Data;

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
  console.log('🔍 Searching for EA-036 in outline...\n');

  const ea036Data = findEA036Data();

  if (!ea036Data) {
    console.error('❌ EA-036 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-036: ${ea036Data.title}`);
  console.log(`   Scenes: ${ea036Data.scenes?.length || 0}\n`);

  // Find the chapter - it should be chapter 36 in the same book as EA-023
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
    .where(eq(chapters.uniqueIdentifier, 'EA-036'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-036 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 36 in the same book
    const ch36 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 36))
      .limit(10);

    const correctChapter = ch36.find((ch) => ch.bookId === bookId);

    if (!correctChapter) {
      console.error('❌ Chapter 36 not found in the same book as EA-023');
      process.exit(1);
    }

    chapter = correctChapter;
    console.log(`✅ Found Chapter 36: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-036',
        title: ea036Data.title,
        epicNovelPages: truncate(ea036Data.epic_novel_pages, 50),
        epicChapterFocus: ea036Data.epic_chapter_focus,
        epicNovelChapterFocus: ea036Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea036Data.tarot_family, 100),
        tarotCardItem: truncate(ea036Data.tarot_card_item, 100),
        heroJourneyBeat: truncate(ea036Data.hero_journey_beat, 100),
        saveTheCatBeat: truncate(ea036Data.save_the_cat_beat, 255),
        summary: ea036Data.summary,
        characterArcs: ea036Data.character_arcs,
        storyGapsAddressed: ea036Data.story_gaps_addressed,
        locationDetails: ea036Data.location_details,
        seriesConnections: ea036Data.series_connections,
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-036 data\n');
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

  for (const sceneData of ea036Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-036',
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
      // Scene 1: Pride Yields to Need
      pages: 'Page 526 - 530',
      description: 'At the First Convergence Hall, Francisco and Zara stand before three former rival agents—Theron, Lysara, and Kael—who once competed with them for Academy honors. Cosmic disturbances threaten to unravel the Ten Lost Realms they recently restored. By openly admitting their limitations and naming the shared threat, Francisco and Zara begin forging the first fragile bridge from competition to partnership. Vulnerability becomes the first pour that begins filling the communal cup of collaboration. The rivals agree to one collaborative trial, establishing cautious hope.',
      focus: 'Francisco and Zara transcend ego to initiate collaboration with former rivals, learning that individual brilliance cannot solve universal threats requiring genuine partnership',
      chapterSceneFocus: 'Ch36S1: Learning that true cosmic power requires setting aside competitive ego to forge partnerships that amplify collective capability',
      preliminarySceneFocus: 'Francisco and Zara must transform rivalry into partnership by openly admitting limitations to former competitors',
      preliminarySceneDescription: 'At dawn in the First Convergence Hall, Francisco and Zara face three former rival agents—Theron (whose obsession they helped channel), Lysara, and Kael—who once competed with them for Academy honors. Cosmic disturbances ripple through dimensional barriers, threatening to unravel the Ten Lost Realms they recently restored through ambitious individual leadership. They must secure genuine alliance by setting aside competitive ego and pride. The rivals bring skepticism: "Why should we trust those who always outshined us?" Francisco and Zara employ vulnerability as strategy—openly admitting their limitations, naming the shared existential threat exceeding individual capability, and revealing that their greatest achievements came through collaboration not competition. The Three of Cups theme emerges: separate vessels (individual cosmic agents) joining together, transforming rivalry into shared celebration. Theron extends cautious support first, remembering their compassionate intervention. The scene lands on fragile hope as the rivals agree to one collaborative trial.',
      narrativeFunction: 'Establishes the necessity of collaboration over individual achievement when facing universal threats. This scene begins Francisco and Zara\'s transformation from ambitious individual leaders to master collaborators who set aside ego to forge partnerships that multiply collective cosmic power.',
      sensoryDetail: 'The First Convergence Hall adapts to accommodate diverse cosmic beings, its architecture fostering communication. Former rivals stand with guarded body language, arms crossed defensively. Cosmic disturbances ripple visibly through dimensional barriers displayed on viewing arrays. Francisco\'s vulnerable admission creates palpable tension release. Theron\'s cautious support breaks the ice. The atmosphere shifts from competitive suspicion to tentative collaborative possibility.',
      internalConflict: 'Francisco struggles with admitting limitations to former competitors, his pride resisting vulnerability while recognizing necessity. Zara grapples with creating emotional trust where only rivalry existed, uncertain whether honesty will invite mockery or respect. Both must transcend ego-driven individual achievement to embrace collaborative partnership requiring mutual vulnerability.',
      characterGrowthElement: 'Francisco evolves from ambitious individual leader to master collaborator by learning to set aside ego and competitive instincts to forge partnerships that amplify collective capability. He discovers that admitting limitations creates trust more powerfully than demonstrating strength. Zara transitions from strategic architect to diplomatic bridge-builder by discovering her gift for creating shared purpose between previously opposing entities through empathy and vulnerability. Both grow in understanding that true cosmic power lies in collaborative synergy not individual brilliance.',
      seriesConnectionResonance: 'The collaborative framework established here guides Francisco and Zara throughout the series, showing that ultimate success requires partnerships rather than individual achievement. The transformation of rivals into allies becomes the template for future alliance-building. The vulnerability-as-trust strategy becomes Francisco\'s hallmark approach in creating resistance networks during the timeline war.',
      sceneCardProgression: 63,
      realWorldContext: 'The Convergence Hall mirrors real-world conflict resolution and alliance-building where former competitors must unite against common threats. The vulnerability strategy reflects how admitting limitations creates trust in professional partnerships. The transformation from rivalry to collaboration applies to organizational mergers, political coalitions, and any scenario requiring former opponents to work together.',
      timelineSignificance: 'Establishes that March 3, 1320 (Divergence Point Alpha) becomes the day Francisco and Zara begin transforming from individual ambitious leaders to collaborative masters. This marks the shift from "Road Back" individual achievement to "Rescue from Without" collaborative partnership that will define their cosmic service and resistance leadership.',
      saveTheCatBeat: 'Rescue from Without - Initiating Collaboration',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the internal resistance to admitting limitations before former rivals, the vulnerability of opening to partnership, the relief when honesty creates trust rather than mockery, the cautious hope as collaboration begins. Show him transcending ego for collective capability.',
        sudowrite_emotional_arc: 'Begins with competitive defensiveness facing former rivals, moves through vulnerable admission of limitations despite pride, reaches cautious hope as partnership tentatively forms. The emotional journey is from ego-protection through honest vulnerability to collaborative possibility.',
        sudowrite_sensory_emphasis: 'Emphasize the Convergence Hall\'s adaptive architecture, former rivals\' guarded defensive postures, cosmic disturbances rippling visibly through dimensional barriers, the tension release when vulnerability is offered, Theron\'s ice-breaking support, the palpable atmospheric shift from suspicion to possibility.',
      },
      learning_objectives: {
        integration: 'Collaborative Partnership and Ego Transcendence',
        terminal_objectives: [
          'Set aside competitive ego and admit limitations to former rivals, recognizing that vulnerability creates trust more powerfully than demonstrations of strength',
          'Transform rivalry into genuine partnership by openly naming shared existential threats that exceed individual capability',
          'Understand that true cosmic power lies in collaborative synergy that multiplies collective capability rather than individual brilliant achievement',
        ],
      },
      foreshadowing_elements: [
        'The fragile collaborative trial foreshadows the deeper partnerships formed in subsequent convergences',
        'Theron\'s support based on past compassion foreshadows how former interventions create future allies',
        'The Three of Cups theme foreshadows the complete unity achieved when all three convergences merge',
      ],
    },
    {
      // Scene 2: Dimensions Clash and Converge
      pages: 'Page 531 - 535',
      description: 'At the Second Convergence Hall, Francisco and Zara facilitate the gathering of dimensional representatives—the crystalline Luminari, shadow-dwelling Umbrals, and temporal Chronists—whose ancient cultural conflicts threaten to derail unity. They employ layered strategy: honoring each culture\'s pain, reframing the threat as existential for all, and revealing how diverse powers complement rather than compete. When the Luminari elder extends a hand to the Umbral envoy, the emotional breakthrough ripples through the chamber, sealing a fragile but genuine multi-dimensional pact. Three cups fill from different sources, each culture pouring unique wisdom into shared mission.',
      focus: 'Francisco and Zara master multi-dimensional diplomacy by uniting disparate cosmic entities through empathy and strategic vision, proving collaboration transcends cultural boundaries',
      chapterSceneFocus: 'Ch36S2: Demonstrating that diverse cultural powers complement rather than compete when united through empathy and shared existential purpose',
      preliminarySceneFocus: 'Francisco and Zara unite dimensional representatives from conflicting cultures through diplomatic bridge-building',
      preliminarySceneDescription: 'Mid-morning in the Second Convergence Hall, Francisco and Zara facilitate a gathering of dimensional representatives whose ancient conflicts threaten unity: the crystalline Luminari (beings of pure light), shadow-dwelling Umbrals (entities of darkness), and temporal Chronists (time-manipulating consciousnesses). Old grudges flare immediately—Luminari distrust Umbrals\' shadow motives, Chronists resent both for timeline interference, and the hall crackles with millennia of cultural tension. Francisco and Zara employ layered diplomatic strategy: honoring each culture\'s historical pain without validating grudges, reframing the universal threat as existential for all dimensions equally, and revealing how their diverse powers complement rather than compete (Luminari\'s illumination, Umbrals\' concealment, Chronists\' temporal perception create comprehensive cosmic awareness). Zara creates emotional breakthroughs through empathetic witnessing of each culture\'s suffering. The pivotal moment: the Luminari elder extends a hand to the Umbral envoy, light and shadow joining without canceling. The Three of Cups theme manifests: three cups filling from different sources, each dimensional culture pouring unique wisdom and power into shared mission, multiplying collective strength beyond individual capacities.',
      narrativeFunction: 'Demonstrates Francisco and Zara\'s mastery of multi-dimensional diplomacy by uniting disparate cosmic entities through empathy and strategic vision. This scene proves that collaboration transcends cultural boundaries when leaders honor diverse perspectives while revealing complementary strengths serving shared existential purpose.',
      sensoryDetail: 'The Second Convergence Hall shimmers with dimensional diversity—crystalline Luminari radiating brilliant light, Umbral envoys casting deliberate shadows, Chronist representatives flickering across temporal states. Ancient tensions crackle electrically through the space. Cultural pain surfaces in accusatory tones and defensive postures. Zara\'s empathetic witnessing creates visible softening. The hand extension moment freezes time: light and shadow joining creates prismatic beauty rather than cancellation. The emotional breakthrough ripples through the chamber like harmonic resonance.',
      internalConflict: 'Francisco struggles with honoring legitimate cultural grievances while preventing them from derailing unity, uncertain how to validate pain without enabling perpetual conflict. Zara grapples with the diplomatic complexity of creating trust among beings whose fundamental natures seem incompatible, wondering if unity is achievable or naive idealism. Both must trust that empathy and strategic reframing can transcend millennia of cultural antagonism.',
      characterGrowthElement: 'Francisco achieves mastery of multi-dimensional diplomacy by learning to channel diverse strengths toward shared purpose while honoring cultural differences without enabling division. He discovers that revealing complementary capabilities transforms competition into collaboration. Zara completes her evolution to diplomatic bridge-builder by mastering empathetic witnessing that validates pain while redirecting energy toward shared survival. Both grow in understanding that collaboration multiplies diverse strengths exponentially when guided by skilled facilitation.',
      seriesConnectionResonance: 'The multi-dimensional alliance established here becomes the foundation for cosmic cooperation throughout the series. Francisco and Zara\'s diplomatic methods for uniting diverse entities shape how resistance forces coordinate across cultural boundaries during the timeline war. The complementary powers framework (light, shadow, time) establishes the pattern for diverse capability integration in future cosmic challenges.',
      sceneCardProgression: 64,
      realWorldContext: 'The Second Convergence Hall mirrors real-world multicultural negotiations where historical conflicts threaten cooperation on existential issues. The diplomatic strategy reflects conflict resolution best practices: honoring pain without validating perpetual grievance, reframing threats as equally affecting all parties, revealing complementary capabilities. The hand extension moment reflects breakthrough gestures that transform frozen positions.',
      timelineSignificance: 'Establishes that this morning demonstrates how skilled diplomacy unites fundamentally different cultures through empathy and strategic vision. The multi-dimensional pact creates the template for cosmic collaboration across cultural boundaries that will enable coordinated resistance throughout dimensional history, proving diversity strengthens rather than weakens unified purpose.',
      saveTheCatBeat: 'Rescue from Without - Multi-Dimensional Unity',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Alternating Francisco and Zara: Francisco focuses on strategic reframing revealing complementary powers, balancing cultural validation with unity urgency. Zara focuses on empathetic witnessing creating emotional breakthroughs, the satisfaction when light and shadow join. Show both mastering diplomatic complexity.',
        sudowrite_emotional_arc: 'Begins with crackling cultural tension and ancient antagonism, moves through layered diplomatic strategy honoring pain while redirecting energy, reaches triumphant breakthrough as representatives transcend millennia of conflict. The emotional journey is from hostile fragmentation through empathetic bridge-building to unified pact.',
        sudowrite_sensory_emphasis: 'Emphasize the dimensional diversity creating visual spectacle (brilliant light, deliberate shadows, temporal flickering), ancient tensions crackling electrically, cultural pain surfacing in accusations, empathetic witnessing softening postures, the hand extension freezing time as light and shadow create prismatic beauty, breakthrough rippling harmonically through chamber.',
      },
      learning_objectives: {
        integration: 'Multi-Dimensional Diplomacy and Complementary Unity',
        terminal_objectives: [
          'Master diplomatic facilitation that honors diverse cultural pain while preventing grievances from derailing existential cooperation',
          'Reveal how fundamentally different capabilities complement rather than compete when guided by shared purpose and strategic vision',
          'Create emotional breakthroughs through empathetic witnessing that validates suffering while redirecting energy toward collaborative survival',
        ],
      },
      foreshadowing_elements: [
        'The complementary powers framework foreshadows how diverse resistance forces will coordinate capabilities during the timeline war',
        'The hand extension breakthrough foreshadows similar transformative gestures in future conflicts',
        'The multi-dimensional unity foreshadows the ultimate alliance when Malthor joins in Scene 3',
      ],
    },
    {
      // Scene 3: Enemy Becomes Ally
      pages: 'Page 536 - 540',
      description: 'At the Collaboration Nexus, the newly formed alliance finalizes strategy when Malthor—the cosmic entity Francisco and Zara once opposed—materializes seeking alliance against the rising entropy force dwarfing past rivalries. Francisco and Zara step forward, openly naming Malthor\'s past wrongs yet offering partnership based on mutual survival and evolved purpose. Malthor accepts accountability, reveals intelligence on the entropy threat, and pledges his formidable power. The three convergences—rivals, dimensions, and former enemy—merge into unified cosmic alliance demonstrating that collaboration multiplies impact beyond individual heroism. Three cups overflow together in transcendent unity.',
      focus: 'Francisco and Zara complete their collaborative transformation by turning their greatest enemy into their most powerful ally, establishing unified alliance ready for climactic universal challenge',
      chapterSceneFocus: 'Ch36S3: Proving that even former enemies become the most powerful allies when they share common threats and compatible deeper values beyond past conflicts',
      preliminarySceneFocus: 'Malthor returns seeking alliance, completing the transformation from enemy to ally through accountability and shared purpose',
      preliminarySceneDescription: 'By afternoon at the Collaboration Nexus, the newly formed alliance (former rivals and dimensional representatives) gathers to finalize strategy when Malthor—the cosmic entity Francisco and Zara opposed in their legendary stand—materializes at the chamber\'s threshold. The room holds its breath; former rivals and dimensional representatives bristle at their shared nemesis arriving. Malthor seeks alliance against the rising entropy force—a universal threat dwarfing all past rivalries. Francisco and Zara face critical choice: validate the fragile alliance\'s trust by welcoming Malthor without betraying allies\' justified concerns, or refuse the most powerful potential ally. They step forward with radical transparency: openly naming Malthor\'s past wrongs ("You violated dimensional sovereignty, threatened innocents, and tested us to our limits"), yet offering partnership based on mutual survival and evolved purpose ("But the entropy force threatens us all, and your intelligence and power are invaluable"). Malthor accepts accountability without defensiveness, reveals critical intelligence on the entropy threat\'s weakness, and pledges his formidable reality-warping power to the cause. The three convergences merge: rivals-turned-allies, dimensional representatives transcending cultures, and former enemy becoming collaborator. The Three of Cups theme completes: three cups overflowing together, demonstrating that partnership transcends ambition when even greatest enemies contribute to unified cosmic purpose, multiplying impact beyond individual heroism.',
      narrativeFunction: 'Completes Francisco and Zara\'s collaborative transformation by demonstrating that even the greatest former enemy becomes the most powerful ally through accountability, shared existential threat, and evolved purpose. This scene establishes the unified cosmic alliance ready for climactic universal challenge, proving collaboration multiplies capabilities exponentially.',
      sensoryDetail: 'The Collaboration Nexus energetically amplifies shared purpose while diminishing competitive impulses through architectural harmony. Malthor\'s materialization creates reality-distortion ripples. The alliance members\' bristling hostility manifests as defensive energy fields. Francisco and Zara\'s radical transparency creates tense silence. Malthor\'s acceptance of accountability without defensiveness shifts the chamber\'s resonance. His intelligence revelation generates strategic excitement. The three convergences merging creates visible harmonic unification—separate energy signatures blending into coherent collective power that exceeds sum of parts.',
      internalConflict: 'Francisco struggles with trusting his greatest former opponent while validating allies\' justified concerns, wondering if welcoming Malthor betrays those who just learned to trust him. Zara grapples with transforming enmity into partnership without erasing legitimate grievance, uncertain whether accountability is sufficient foundation for alliance. Both must trust that shared existential threat and evolved purpose transcend past conflicts when former enemies accept responsibility.',
      characterGrowthElement: 'Francisco completes his evolution to master collaborator by demonstrating the ultimate partnership transformation: turning his greatest enemy into his most powerful ally through radical transparency, accountability, and shared purpose transcending past conflicts. He learns that authentic collaboration requires addressing wrongs honestly while focusing on evolved mutual survival. Zara achieves diplomatic bridge-builder mastery by facilitating the most difficult alliance: integrating a former enemy into fragile coalition without betraying existing allies\' trust. Both prove that collaboration multiplies impact beyond individual heroism when guided by cosmic purpose transcending personal grievances.',
      seriesConnectionResonance: 'The Malthor alliance establishes the enemy-to-ally template repeated throughout the series as Francisco and Zara face various cosmic threats. The unified alliance created here becomes the network they can call upon in future crises. The radical transparency approach to integrating former opponents becomes Francisco\'s signature method during resistance movements, demonstrating that accountability plus shared purpose creates strongest partnerships.',
      sceneCardProgression: 65,
      realWorldContext: 'The Collaboration Nexus mirrors real-world scenarios where former enemies must unite against greater threats (wartime alliances, political coalitions, organizational mergers). The radical transparency strategy reflects conflict resolution requiring honest acknowledgment of past harms while focusing on shared survival. The three convergences merging reflects how comprehensive alliances create exponential capability beyond individual components.',
      timelineSignificance: 'Establishes that this afternoon marks the complete transformation from individual ambitious achievement to collaborative cosmic power transcending all boundaries—competitive, cultural, and adversarial. The unified alliance ready for climactic challenge demonstrates that the greatest cosmic service emerges from partnerships multiplying diverse strengths. This collaborative framework guides dimensional cooperation throughout history.',
      saveTheCatBeat: 'Rescue from Without - Ultimate Alliance',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the tension of Malthor\'s arrival, the risk of welcoming greatest enemy potentially betraying fragile alliance, the radical transparency naming wrongs while offering partnership, the profound satisfaction when accountability creates trust, witnessing three convergences merge into transcendent unity. Show him achieving collaborative mastery.',
        sudowrite_emotional_arc: 'Begins with tense arrival of former enemy threatening fragile unity, moves through risky radical transparency balancing accountability with partnership offer, reaches transcendent satisfaction as ultimate alliance forms multiplying capabilities beyond individual heroism. The emotional journey is from threatened fragmentation through courageous integration to cosmic unified purpose.',
        sudowrite_sensory_emphasis: 'Emphasize Malthor\'s reality-distorting materialization, alliance members\' bristling defensive energy fields, the tense silence after radical transparency, Malthor\'s accountability shifting chamber resonance, intelligence revelation generating strategic excitement, three convergences merging into visible harmonic unification creating coherent collective power exceeding sum of parts.',
      },
      learning_objectives: {
        integration: 'Ultimate Alliance and Enemy-to-Ally Transformation',
        terminal_objectives: [
          'Transform greatest former enemy into most powerful ally through radical transparency addressing past wrongs while offering partnership based on mutual survival',
          'Integrate former opponent into fragile coalition without betraying existing allies\' trust by requiring accountability as foundation for evolved collaboration',
          'Prove that comprehensive alliances merging rivals, diverse cultures, and former enemies create exponential cosmic capability through unified purpose transcending all boundaries',
        ],
      },
      foreshadowing_elements: [
        'The unified alliance foreshadows the collective cosmic power that will face the climactic entropy threat',
        'The enemy-to-ally template foreshadows future transformations throughout Francisco\'s resistance leadership',
        'The three cups overflowing together foreshadows the celebration and triumph of collaborative cosmic service',
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

  console.log('\n🎉 EA-036 complete import finished!');
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
