import { db } from '../src/lib/db';
import { scenes, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing scenes for EA-017: The Vault of Infinite Resources...\n');

  // Get chapter ID
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-017'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-017 not found. Please run create-ea-017-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  const scenesData = [
    // Scene 1: The Failing Vault
    {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-017',
      sceneNumber: 1,
      title: 'The Failing Vault',
      setup: 'Francisco and Zara are summoned to the Academy\'s legendary Vault of Infinite Resources, expecting treasure and abundance. Instead, they find a dying ecosystem: shelves half-empty, protective wards flickering, and two faction leaders locked in bitter dispute. The Vault Keeper explains that the Vault generates resources based on collective belief in abundance—but factional hoarding has poisoned the generative field.',
      symbolism: 'The failing Vault represents how scarcity mindset creates actual scarcity through self-fulfilling belief. The Three of Stones symbolizes collaborative building—three stones supporting each other create stability impossible alone.',
      beatGoal: 'Establish the stakes: resource crisis threatening the Academy, and demonstrate how scarcity thinking creates scarcity reality',
      pov: 'Francisco',
      tense: 'Past tense',
      core_emotion: 'Dismay transforming into determined purpose',
      scene_tone: 'Tense and deteriorating, with underlying hope',
      timeline_date: '2/16/1320 - Morning',
      timeline_variant: 'Academy Prime Timeline',
      location: 'Vault of Infinite Resources - Central Chamber',
    },
    // Scene 2: The Resource Web
    {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-017',
      sceneNumber: 2,
      title: 'The Resource Web',
      setup: 'Zara proposes a radical experiment: map the actual resource needs and capabilities of each faction, then create strategic flow paths where one group\'s excess meets another\'s need. Francisco adds narrative framing: what if the Vault isn\'t depleting but reorganizing—evolving from static storage to living circulation?',
      symbolism: 'The Resource Web represents abundance through circulation—like blood must flow to nourish. The Three of Stones manifests as Francisco, Zara, and the Vault Keeper forming new structural support.',
      beatGoal: 'Develop the solution through collaborative creation, demonstrating abundance mindset in action',
      pov: 'Zara',
      tense: 'Past tense',
      core_emotion: 'Focused determination with emerging breakthrough excitement',
      scene_tone: 'Intense negotiation transforming into creative collaboration',
      timeline_date: '2/16/1320 - Afternoon',
      timeline_variant: 'Academy Prime Timeline',
      location: 'Vault Strategy Chamber',
    },
    // Scene 3: Abundance Activated
    {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-017',
      sceneNumber: 3,
      title: 'Abundance Activated',
      setup: 'The Resource Web goes live. As Francisco and Zara facilitate the first intentional exchange, the Vault blazes with new light. The generative field responds to cooperative intention: resources literally multiply when shared strategically rather than hoarded fearfully. Shelves refill. Wards strengthen. The Vault Keeper, tears streaming, explains this is how the Vault was always meant to work.',
      symbolism: 'The Vault blazing to life represents abundance as natural state when scarcity thinking is released. The Three of Stones completes: three-way collaboration (Collectors, Distributors, Coordinators) creates stable structure.',
      beatGoal: 'Demonstrate the transformation from scarcity to abundance, establish resource sustainability for future trials',
      pov: 'Francisco',
      tense: 'Past tense',
      core_emotion: 'Triumphant joy and expanded possibility awareness',
      scene_tone: 'Celebratory and transformative with cosmic implications',
      timeline_date: '2/16/1320 - Evening',
      timeline_variant: 'Academy Prime Timeline',
      location: 'Vault of Infinite Resources - Central Chamber Restored',
    },
  ];

  let sceneCardCounter = 49; // EA-017 scenes start at card 49

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
        pages: 'Page 241 - 246',
        description: 'Francisco and Zara summoned to legendary Vault expecting abundance, find dying ecosystem instead—shelves half-empty, wards flickering, faction leaders in bitter dispute. Vault Keeper explains resource generation requires collective abundance belief, but factional hoarding poisoned the field creating scarcity crisis.',
        focus: truncate('Establishing resource crisis demonstrating how scarcity mindset creates scarcity reality', 255),
        chapterSceneFocus: truncate('Ch17S1: Francisco/Zara find Vault failing—shelves empty, wards flickering, factions fighting. Scarcity mindset poisoning generative field, proving beliefs create reality', 255),
        preliminarySceneFocus: 'Scarcity mindset manifesting as actual depletion',
        preliminarySceneDescription: 'Vault crisis demonstrates self-fulfilling prophecy: belief in scarcity creates scarcity through hoarding and restriction. Francisco and Zara must mediate between Collectors (preservation through restriction) and Distributors (unlimited sharing), discovering middle path of strategic circulation.',
        sensoryDetail: 'Half-empty shelves where abundance should overflow, flickering protective wards, heavy atmosphere of decay, two faction leaders emanating hostility, Vault Keeper ancient and weary, dying ecosystem feel.',
        internalConflict: 'Francisco torn between disappointment at finding crisis instead of treasure versus recognizing opportunity to apply assertiveness training at scale—can they truly mediate resource conflict?',
        characterGrowthElement: 'Francisco applying assertiveness skills learned in EA-016 to real-world resource crisis—communication mastery translating into practical problem-solving.',
        seriesConnectionResonance: 'Abundance mindset principle establishing foundation for cosmic resource management in later books—scarcity thinking creates scarcity even in infinite universes.',
        sceneCardProgression: sceneCardCounter++,
        realWorldContext: '2/16/1320 morning—Academy resource crisis requiring immediate mediation between conflicting preservation and distribution philosophies.',
        timelineSignificance: 'Vault failing represents timeline stress point—if Academy resources collapse, training infrastructure for cosmic guardians fails.',
        saveTheCatBeat: 'B Story - resource relationships testing',
        sudowrite_metadata: JSON.stringify({
          intensity: 'medium-high',
          pacing: 'tense_deteriorating',
          narrative_mode: 'crisis_establishing',
          visual_anchor: 'Failing Vault flickering wards empty shelves faction dispute',
          emotional_core: 'Dismay determination purpose crisis'
        }),
        learning_objectives: JSON.stringify([
          'Scarcity mindset creates self-fulfilling scarcity prophecy',
          'Resource conflicts require understanding underlying fears not just positions',
          'Abundance requires collaborative belief not individual hoarding'
        ]),
        foreshadowing_elements: JSON.stringify([
          'Resource Web system establishing pattern for cosmic coordination',
          'Collective belief generating reality—principle crucial for timeline work',
          'Francisco/Zara complementary skills enabling complex problem-solving'
        ])
      };
    } else if (sceneData.sceneNumber === 2) {
      enhancedData = {
        pages: 'Page 247 - 250',
        description: 'Zara proposes mapping actual faction needs/capabilities to create strategic flow paths matching excess with need. Francisco reframes narrative: Vault not depleting but reorganizing from storage to circulation. Intense negotiation reveals Collectors fear past misuse collapses, Distributors traumatized by hoarding deaths. Three of Stones energy forming through collaboration.',
        focus: truncate('Developing abundance solution through collaborative mapping and narrative reframing', 255),
        chapterSceneFocus: truncate('Ch17S2: Zara maps resource flows, Francisco reframes Vault as living circulation. Negotiation reveals faction fears—past collapses and hoarding trauma. Solution emerging through understanding', 255),
        preliminarySceneFocus: 'Collaborative problem-solving through needs mapping',
        preliminarySceneDescription: 'Resource Web concept emerges through mapping faction needs/capabilities and creating intentional flow paths. Francisco and Zara discover preservation and distribution aren\'t opposites but complementary circulation phases.',
        sensoryDetail: 'Strategy chamber walls mapping resource flows in glowing lines, faction leaders leaning over tables with intense focus, Zara\'s tactical mind visualizing connections, Francisco weaving narrative frameworks, Three of Stones energy building.',
        internalConflict: 'Zara pushing past initial frustration with bureaucratic factions to genuinely understand their fears—warrior learning that some battles require empathy not force.',
        characterGrowthElement: 'Zara demonstrating strategic thinking beyond combat—her tactical analysis applied to resource coordination, discovering leadership requires understanding motivations not just positions.',
        seriesConnectionResonance: 'Resource Web establishing pattern for later cosmic coordination systems—infinite universes require strategic flow management not central control.',
        sceneCardProgression: sceneCardCounter++,
        realWorldContext: '2/16/1320 afternoon—intensive negotiation revealing that resource conflicts stem from trauma and fear, not inherent opposition.',
        timelineSignificance: 'Resource mapping creating first Academy-wide coordination system—prototype for larger timeline coordination networks.',
        saveTheCatBeat: 'B Story - developing relationship wisdom',
        sudowrite_metadata: JSON.stringify({
          intensity: 'high',
          pacing: 'intense_breakthrough',
          narrative_mode: 'negotiation_transformation',
          visual_anchor: 'Strategy chamber glowing maps faction leaders collaborating',
          emotional_core: 'Determination excitement breakthrough understanding'
        }),
        learning_objectives: JSON.stringify([
          'Mapping systems reveals invisible connections and opportunities',
          'Apparent opposites often complementary phases in larger cycle',
          'Understanding fears enables solutions; focusing on positions creates deadlock'
        ]),
        foreshadowing_elements: JSON.stringify([
          'Mapping technique crucial for timeline network visualization later',
          'Francisco narrative reframing ability key to reality-shaping mastery',
          'Zara tactical coordination foreshadowing multi-dimensional battle leadership'
        ])
      };
    } else if (sceneData.sceneNumber === 3) {
      enhancedData = {
        pages: 'Page 251 - 255',
        description: 'Resource Web activates. First strategic exchange—Collectors sharing regeneration techniques with Distributors providing raw materials—triggers Vault transformation. Generative field responds to cooperative intention, resources multiply through strategic sharing. Shelves refill, wards strengthen. Three of Stones energy stabilizes Vault as living abundance system. Francisco realizes cosmic-scale application potential.',
        focus: truncate('Demonstrating abundance transformation through activated Resource Web', 255),
        chapterSceneFocus: truncate('Ch17S3: Resource Web live—strategic exchange triggers Vault transformation. Resources multiply through cooperation, shelves refill, wards strengthen. Three of Stones completing abundance structure', 255),
        preliminarySceneFocus: 'Abundance activated through strategic circulation',
        preliminarySceneDescription: 'Vault blazing to life proves abundance as natural state when scarcity thinking released. Three-way collaboration (Collectors, Distributors, Coordinators) creates stable structure enabling resource multiplication.',
        sensoryDetail: 'Vault blazing with new light, shelves filling with manifesting resources, wards strengthening into brilliant protection, generative field pulsing with cooperative energy, Vault Keeper crying with joy, factions witnessing abundance multiplication.',
        internalConflict: 'Francisco experiencing expanded awareness—recognizing that if resource abundance works at Academy scale through collaborative belief, same principles apply to cosmic conflicts. Responsibility growing with capability.',
        characterGrowthElement: 'Francisco integrating communication mastery (EA-016) with resource stewardship—discovering that influence without sustainable resource management fails. Building foundation for cosmic leadership.',
        seriesConnectionResonance: 'Abundance principles establishing core philosophy: scarcity creates scarcity, collaboration multiplies resources. Foundation for Books 2-3 cosmic resource challenges.',
        sceneCardProgression: sceneCardCounter++,
        realWorldContext: '2/16/1320 evening—Resource Web success establishing sustainable Academy infrastructure enabling continued guardian training.',
        timelineSignificance: 'Vault restoration ensuring Academy survival—without resources, cosmic guardian development impossible. Timeline protection requires material foundation.',
        saveTheCatBeat: 'B Story - resource wisdom achieved',
        sudowrite_metadata: JSON.stringify({
          intensity: 'triumphant',
          pacing: 'celebratory_expansive',
          narrative_mode: 'transformation_complete',
          visual_anchor: 'Vault blazing light shelves refilling wards strengthening abundance',
          emotional_core: 'Joy triumph cosmic awareness possibility'
        }),
        learning_objectives: JSON.stringify([
          'Abundance natural state when scarcity beliefs released',
          'Strategic sharing multiplies resources; hoarding depletes',
          'Systems designed for collaboration generate exponential value',
          'Resource sustainability foundation for sustained cosmic work'
        ]),
        foreshadowing_elements: JSON.stringify([
          'Abundance principles apply to cosmic timeline conflicts',
          'Collaborative systems enabling challenges requiring sustained resources',
          'Francisco cosmic-scale thinking preparing for guardian responsibility',
          'Resource Web prototype for multiverse coordination systems'
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
  console.log(`📖 Chapter: EA-017 - ${chapter.title}`);
  console.log(`🎬 Scenes: 3`);
  console.log(`🎴 Scene cards: 49-51`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
