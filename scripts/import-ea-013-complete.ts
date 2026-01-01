import { db } from '../src/lib/db';
import { scenes, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing scenes for EA-013: The Fool\'s Threshold...\n');

  // Get chapter ID
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-013'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-013 not found. Please run create-ea-013-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  const scenesData = [
    // Scene 1: The Decision at the Threshold
    {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-013',
      sceneNumber: 1,
      title: 'The Decision at the Threshold',
      setup: 'Standing before the shimmering gateway to Pangaea, the group faces their most crucial decision. The portal reveals glimpses of infinite possibility, but also terrifying responsibility. Francisco must choose between the safety of remaining in the familiar world and the unknown dangers of cosmic rebellion. As his Trionfi cards begin resonating with the portal\'s energy, he realizes this is the point of no return.',
      symbolism: 'The threshold represents the choice between limitation and infinite potential, while the mirror-like portal reflects not who they are, but who they could become. The resonating cards symbolize the awakening of dormant cosmic potential responding to limitless possibility.',
      beatGoal: 'Establish the magnitude of the decision and build tension before the irreversible crossing',
      pov: 'Francisco',
      tense: 'Past tense',
      core_emotion: 'Anticipation mixed with profound responsibility',
      scene_tone: 'Tense, contemplative, momentous',
      timeline_date: '2/14/1320 - Dawn',
      timeline_variant: 'Prime Timeline',
      location: 'Threshold Gateway - Between Zanetti Train and Pangaea',
    },
    // Scene 2: Crossing Into Infinite
    {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-013',
      sceneNumber: 2,
      title: 'Crossing Into Infinite',
      setup: 'Francisco steps through the threshold, and the world transforms. Pangaea unfolds in all its impossible glory—floating islands of different eras, rivers flowing through time, landscapes that shift with thought and intention. The group experiences their first taste of reality\'s malleability as Francisco\'s cards begin manifesting possibilities directly into the environment around them.',
      symbolism: 'The crossing represents birth into a new existence, while Pangaea\'s shifting landscapes symbolize the fluid nature of reality when potential is unleashed. Floating islands of different eras represent the convergence of all timelines, while rivers flowing upward symbolize the reversal of assumed natural laws.',
      beatGoal: 'Execute the threshold crossing and establish the rules and wonder of Pangaea',
      pov: 'Francisco',
      tense: 'Past tense',
      core_emotion: 'Wonder bordering on overwhelm',
      scene_tone: 'Awestruck, disorienting, magnificent',
      timeline_date: '2/14/1320 - Morning',
      timeline_variant: 'Convergence Point',
      location: 'Pangaea - Multiple Convergent Landscapes',
    },
    // Scene 3: The Fool's First Steps
    {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-013',
      sceneNumber: 3,
      title: 'The Fool\'s First Steps',
      setup: 'In Pangaea\'s Convergence Plaza, Francisco and his companions begin to adapt to their new reality. Francisco fully embraces his role as The Fool—the one who steps fearlessly into the unknown with beginner\'s mind. His cards now respond to pure potential rather than predetermined outcomes. The group realizes they are no longer just players in a cosmic game but potential rewriters of its rules.',
      symbolism: 'The Fool archetype represents unlimited potential and fearless beginnings, while the plaza symbolizes the starting point of infinite journeys. The circular design with pathways to infinite destinations embodies the principle that every beginning contains all possible endings.',
      beatGoal: 'Establish Francisco\'s transformation into The Fool and set up the group\'s new cosmic mission',
      pov: 'Francisco',
      tense: 'Past tense',
      core_emotion: 'Fearless determination and cosmic purpose',
      scene_tone: 'Empowering, transformative, cosmic',
      timeline_date: '2/14/1320 - Afternoon',
      timeline_variant: 'Convergence Point',
      location: 'Convergence Plaza - Pangaea\'s Gateway Nexus',
    },
  ];

  let sceneCardCounter = 37; // EA-013 scenes start at card 37

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
        pages: 'Page 181 - 186',
        description: 'Standing before shimmering gateway to Pangaea, Francisco and companions face point of no return—portal reveals infinite possibility and terrifying responsibility. Francisco must choose between familiar world safety and unknown cosmic rebellion dangers. Trionfi cards resonate with portal energy, awakening dormant cosmic potential.',
        focus: truncate('The moment of ultimate choice between limitation and limitless potential', 255),
        chapterSceneFocus: truncate('Ch13S1: Francisco and group face irreversible threshold decision—portal reflecting infinite becoming, cards awakening to cosmic potential, choosing transformation over safety', 255),
        preliminarySceneFocus: 'The ultimate choice between safety and infinite possibility',
        preliminarySceneDescription: 'Francisco stands at gateway between worlds, experiencing weight of choosing transformation over safety. Portal reflects not physical travel but existential transformation—choice to embrace The Fool\'s path of unlimited potential despite terrifying unknowns.',
        sensoryDetail: 'Shimmering gateway fluctuating between dimensions, electric air charged with potential, portal surface flowing with possibilities, cards pulsing with sympathetic energy, cold sweat of fear meeting warmth of cosmic invitation.',
        internalConflict: 'Francisco torn between safety of known world versus magnetic terror of infinite possibility—recognizing choice affects companions, all of Pangaea, potentially all reality.',
        characterGrowthElement: 'Francisco demonstrating growth mindset enabling him to frame terrifying choice as opportunity—evolving from earthly scholar to cosmic pioneer ready to embrace The Fool\'s fearless leap.',
        seriesConnectionResonance: 'Threshold moment establishing pattern recurring throughout trilogy—Francisco repeatedly facing impossible choices requiring embracing unknown potential over comfortable limitation.',
        sceneCardProgression: sceneCardCounter++,
        realWorldContext: 'Break Into Two - transition from Act 1 preparation to Act 2 cosmic action, marking irreversible commitment to cosmic rebellion.',
        timelineSignificance: '2/14/1320 dawn—threshold between Prime Timeline and Convergence Point, marking Francisco\'s crossing from mortal to cosmic scales.',
        saveTheCatBeat: 'Break Into Two - decision moment',
        sudowrite_metadata: JSON.stringify({
          intensity: 'high',
          pacing: 'suspended_contemplative',
          narrative_mode: 'philosophical_visceral',
          visual_anchor: 'Shimmering portal reflecting becoming cards resonating cosmic',
          emotional_core: 'Anticipation responsibility magnitude choice'
        }),
        learning_objectives: JSON.stringify([
          'Growth mindset essential for embracing infinite possibility',
          'Threshold crossing as existential transformation not just physical',
          'Leadership through making impossible choices that shape reality'
        ]),
        foreshadowing_elements: JSON.stringify([
          'Portal reflection showing becoming—identity transformations in Act 2',
          'Cards resonating with Pangaea—evolution beyond current capabilities',
          'La Signora uncertainty—even gods find Pangaea daunting',
          'Novella sensing folded realities—timeline mechanics crucial later'
        ])
      };
    } else if (sceneData.sceneNumber === 2) {
      enhancedData = {
        pages: 'Page 186 - 190',
        description: 'Francisco crosses threshold and Pangaea unfolds—floating islands of different eras, rivers flowing through time, landscapes shifting with thought. Group experiences reality\'s malleability as cards begin manifesting possibilities directly into environment. Consciousness expands to perceive impossible geometry.',
        focus: truncate('Sensory and conceptual overwhelm transforming into expanded consciousness', 255),
        chapterSceneFocus: truncate('Ch13S2: Francisco crosses into Pangaea experiencing impossible magnificence—floating islands, time rivers, thought-responsive landscapes, cards manifesting possibilities, consciousness expanding', 255),
        preliminarySceneFocus: 'Overwhelming sensory experience of entering infinite possibility',
        preliminarySceneDescription: 'Crossing transforms everything. Francisco and companions experience reality\'s fundamental malleability as Pangaea reveals impossible magnificence. Disorientation evolves into expanded consciousness—minds, bodies, spirits adapting to perceive realm where thought influences form, past and future exist simultaneously.',
        sensoryDetail: 'Impossible colors outside normal spectrum, floating islands of different eras visible simultaneously, rivers of liquid time flowing upward, crystallized forests of frozen moments, sky cycling day/night in different regions, cards glowing with substantial light.',
        internalConflict: 'Francisco\'s perception fragmenting and multiplying—seeing multiple perspectives simultaneously, experiencing time non-linearly, identity blurring and reconstituting as consciousness expands beyond human parameters.',
        characterGrowthElement: 'Francisco\'s limitless mindset allowing brain to process patterns with no precedent—consciousness evolving in real-time, frameworks expanding, discovering latent capabilities responding to Pangaea\'s infinite scales.',
        seriesConnectionResonance: 'Crossing experience establishing Francisco\'s capacity for consciousness expansion essential throughout trilogy—brain proving capable of learning entirely new perception modes.',
        sceneCardProgression: sceneCardCounter++,
        realWorldContext: 'First experience of Special World—Act 2 beginning with entry into realm where earthly physics become suggestions and reality responds to consciousness.',
        timelineSignificance: '2/14/1320 morning—Convergence Point where all timelines meet, Francisco beginning adaptation to cosmic temporal scales.',
        saveTheCatBeat: 'Break Into Two - entry into new world',
        sudowrite_metadata: JSON.stringify({
          intensity: 'overwhelming',
          pacing: 'rapid_sensory_bombardment',
          narrative_mode: 'consciousness_expansion',
          visual_anchor: 'Floating islands time rivers crystallized forests impossible colors',
          emotional_core: 'Wonder terror awe adaptation transformation'
        }),
        learning_objectives: JSON.stringify([
          'Limitless brain performance—processing impossible patterns',
          'Consciousness expansion through adaptation not resistance',
          'Reality malleability as fundamental principle not exception'
        ]),
        foreshadowing_elements: JSON.stringify([
          'Cards manifesting possibilities—eventual mastery of reality-shaping',
          'Visible time layers in rivers—timeline mission mechanics',
          'La Signora divine resonance—deeper god/realm connections',
          'Novella perceiving emotional responsiveness—realm consciousness',
          'Gherardo weapons transforming—everything adapts to potential'
        ])
      };
    } else if (sceneData.sceneNumber === 3) {
      enhancedData = {
        pages: 'Page 191 - 195',
        description: 'In Convergence Plaza, Francisco embraces The Fool archetype—beginner\'s mind stepping fearlessly into unknown. Cards respond to pure potential rather than predetermined outcomes. Group transforms from reactive travelers to active reality-shapers, no longer players in cosmic game but potential rewriters of its rules.',
        focus: truncate('Conscious embrace of cosmic identity and commitment to reality-rewriting mission', 255),
        chapterSceneFocus: truncate('Ch13S3: Francisco embraces The Fool identity in Convergence Plaza—cards responding to pure intention, group transforming to cosmic rebels capable of rewriting reality\'s rules', 255),
        preliminarySceneFocus: 'Transformation from reactive travelers to active reality-shapers',
        preliminarySceneDescription: 'Having survived entry overwhelm, Francisco and companions consciously choose relationship with infinite possibility. Scene completes threshold arc: Scene 1 choice to cross, Scene 2 crossing itself, Scene 3 commitment to journey beyond. Francisco fully embodies The Fool—beginner\'s mind seeing potential where experts see limitation.',
        sensoryDetail: 'Circular plaza with infinite radiating pathways, each showing different destinations, floor inscribed with intention-shifting symbols, past visitors as translucent echoes, future visitors as shimmering possibilities, cards displaying moving evolving illustrations.',
        internalConflict: 'Francisco integrating transformation—earthly self expanding to contain cosmic awareness, thinking in both mortal and divine scales simultaneously, discovering cards respond to intention rather than predetermined spells.',
        characterGrowthElement: 'Francisco\'s growth mindset evolving from theoretical belief to lived reality—experiencing self as perpetually becoming rather than static being, beginner\'s mind enabling faster learning than experts.',
        seriesConnectionResonance: 'Scene establishes Francisco\'s core identity persisting throughout trilogy—The Fool embracing infinite potential through beginner\'s mind, foundation for all future transformation.',
        sceneCardProgression: sceneCardCounter++,
        realWorldContext: 'Establishing new baseline capabilities—group discovering collective intelligence exceeds sum of individuals, networked awareness enabling shared limitless cognition.',
        timelineSignificance: '2/14/1320 afternoon—Convergence Point where infinite journeys intersect, Francisco committing to cosmic purpose beyond earthly constraints.',
        saveTheCatBeat: 'Break Into Two - establishing purpose',
        sudowrite_metadata: JSON.stringify({
          intensity: 'empowering',
          pacing: 'purposeful_transformative',
          narrative_mode: 'cosmic_agency_discovery',
          visual_anchor: 'Plaza infinite pathways Fool cards potential futures',
          emotional_core: 'Determination transformation purpose fearlessness'
        }),
        learning_objectives: JSON.stringify([
          'The Fool archetype—beginner\'s mind as superpower not limitation',
          'Lateral thinking at strategic scale—rewriting rules not playing by them',
          'Collective consciousness multiplying individual potential'
        ]),
        foreshadowing_elements: JSON.stringify([
          'Writing new rules declaration—eventual cosmic order challenge',
          'Plaza showing future selves—visions coming true in later chapters',
          'Walking between mortal/divine—Francisco as bridge role',
          'Group as single force—merged consciousness abilities',
          'Pathways illuminating—each leading to Act 2 chapter adventures',
          'Dante recognizing Francisco surpassed teaching—role reversal later'
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
  console.log(`📖 Chapter: EA-013 - ${chapter.title}`);
  console.log(`🎬 Scenes: 3`);
  console.log(`🎴 Scene cards: 37-39`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
