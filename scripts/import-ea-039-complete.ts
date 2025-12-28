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

interface EA039Data {
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

function findEA039Data(): EA039Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA039Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-039') return obj as EA039Data;

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
  console.log('🔍 Searching for EA-039 in outline...\n');

  const ea039Data = findEA039Data();

  if (!ea039Data) {
    console.error('❌ EA-039 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-039: ${ea039Data.title}`);
  console.log(`   Scenes: ${ea039Data.scenes?.length || 0}\n`);
  console.log('🏆 MASTER OF TWO WORLDS - The Nine Fulfillments!\n');

  // Find the chapter - it should be chapter 39 in the same book as EA-023
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
    .where(eq(chapters.uniqueIdentifier, 'EA-039'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-039 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 39 in the same book
    const ch39 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 39))
      .limit(10);

    const correctChapter = ch39.find((ch) => ch.bookId === bookId);

    if (!correctChapter) {
      console.error('❌ Chapter 39 not found in the same book as EA-023');
      process.exit(1);
    }

    chapter = correctChapter;
    console.log(`✅ Found Chapter 39: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-039',
        title: ea039Data.title,
        epicNovelPages: truncate(ea039Data.epic_novel_pages, 50),
        epicChapterFocus: ea039Data.epic_chapter_focus,
        epicNovelChapterFocus: ea039Data.epic_novel_chapter_focus,
        tarotFamily: truncate(ea039Data.tarot_family, 100),
        tarotCardItem: truncate(ea039Data.tarot_card_item, 100),
        heroJourneyBeat: ea039Data.hero_journey_beat?.substring(0, 99) || null,
        saveTheCatBeat: ea039Data.save_the_cat_beat?.substring(0, 100) || null,
        summary: ea039Data.summary,
        characterArcs: typeof ea039Data.character_arcs === 'string'
          ? ea039Data.character_arcs
          : JSON.stringify(ea039Data.character_arcs),
        storyGapsAddressed: typeof ea039Data.story_gaps_addressed === 'string'
          ? ea039Data.story_gaps_addressed
          : JSON.stringify(ea039Data.story_gaps_addressed),
        locationDetails: typeof ea039Data.location_details === 'string'
          ? ea039Data.location_details
          : JSON.stringify(ea039Data.location_details),
        seriesConnections: typeof ea039Data.series_connections === 'string'
          ? ea039Data.series_connections
          : JSON.stringify(ea039Data.series_connections),
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-039 data\n');
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

  for (const sceneData of ea039Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-039',
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
      // Scene 1: Nine Fractures, One Call
      pages: 'Page 571 - 576',
      description: 'At dawn, Francisco awakens to simultaneous urgent transmissions flooding his consciousness: nine timeline nodes fracturing, each threatening cascade collapse across all realities. In the Academy\'s emergency convocation, Grand Master Severyn and the senior council formally acknowledge what they\'ve resisted—Francisco possesses the unique synthesis of temporal perception and collective coordination that this crisis demands. Francisco stands before the pristine Convergence Chamber, a spherical nexus where holographic timelines shimmer like hanging jewels, and feels the weight: this is the culmination of every lesson, every failure, every growth moment from ambitious law student to this precipice. He wants to prove his readiness and honor the trust placed in him; Zara, Marcus, and Elena want to support without overshadowing his leadership moment. Opposition arises from the crisis\'s complexity (nine nodes requiring simultaneous intervention), some masters\' lingering doubt, and Francisco\'s own imposter syndrome whispering he\'s not ready. But as he places his hand on the Chamber\'s crystalline interface, feeling nine timelines pulse beneath his touch, certainty replaces fear.',
      focus: 'Francisco accepts the ultimate leadership challenge as the cosmic crisis establishes his unique mastery necessity, demonstrating that sustained effort culminates in the moment where only he can coordinate the multi-dimensional solution',
      chapterSceneFocus: 'Ch39S1: Recognizing that all growth and learning culminates in this leadership moment requiring unique synthesis of temporal perception and collective coordination',
      preliminarySceneFocus: 'Francisco faces the nine-node cosmic crisis as the Academy formally acknowledges his unique mastery',
      preliminarySceneDescription: 'At dawn, Francisco awakens to nine timeline nodes fracturing simultaneously, each threatening cascade collapse. In the Academy emergency convocation, Grand Master Severyn and senior council formally acknowledge that Francisco possesses the unique synthesis of temporal perception and collective coordination this crisis demands. Before the pristine Convergence Chamber—a spherical nexus where holographic timelines shimmer like hanging jewels—Francisco feels the weight: culmination of every lesson from ambitious law student to this precipice. He wants to prove readiness and honor trust; Zara, Marcus, and Elena want to support without overshadowing. Opposition: crisis complexity (nine simultaneous interventions), masters\' lingering doubt, Francisco\'s imposter syndrome. The Nine of Cups symbolism emerges: fulfillment comes not from individual accolades but from realizing deepest aspiration—to heal and help others. Nine fractures mirror nine cups, each requiring disciplined habits and strategic action aligned with core values. As Francisco places his hand on the crystalline interface, feeling nine timelines pulse, certainty replaces fear.',
      narrativeFunction: 'Establishes the ultimate test of Francisco\'s mastery as he faces a cosmic crisis requiring synthesis of all learned abilities. This scene demonstrates that sustained effort and adaptive resilience culminate in moments where unique capabilities become essential, positioning Francisco as the only one who can coordinate the multi-dimensional solution.',
      sensoryDetail: 'Dawn consciousness floods with nine simultaneous urgent transmissions—timeline fractures manifesting as cascading alarm pulses. The emergency convocation hums with tense urgency. The Convergence Chamber gleams pristine—spherical nexus with holographic timelines shimmering like hanging jewels. Francisco\'s hand touches the crystalline interface, feeling nine timeline pulses beneath his palm. Imposter syndrome whispers doubts. Masters\' formal acknowledgment carries weight and solemnity. Certainty rises, replacing fear with focused determination.',
      internalConflict: 'Francisco struggles with imposter syndrome whispering he\'s not ready despite all growth, questioning whether his synthesis of temporal perception and collective coordination truly makes him uniquely qualified or if he\'s presuming too much. He grapples with proving readiness without arrogance, honoring trust without being crushed by weight, accepting leadership without diminishing his team\'s contributions. The fear that he might fail when it matters most battles against the certainty that this is what all his growth prepared him for.',
      characterGrowthElement: 'Francisco achieves the culmination of his hero\'s journey as he steps into true mastery—not as someone still proving himself but as the cosmic master the Academy formally recognizes. He discovers that all his growth (from ambitious law student through valor, inspiration, ambition, collaboration, potential, and wisdom) synthesized into this unique capability. The imposter syndrome dissolves not through bravado but through touching the crystalline interface and feeling certain: this is his purpose.',
      seriesConnectionResonance: 'The formal Academy recognition and nine-node crisis establish Francisco as a cosmic master whose unique synthesis positions him for the expanded challenges in future books. The Convergence Chamber and multi-dimensional coordination become signature capabilities he\'ll apply to greater threats. This moment completes his Book 1 arc from student to master while demonstrating the leadership style that will define his ongoing journey.',
      sceneCardProgression: 72,
      realWorldContext: 'The emergency convocation mirrors real-world moments where organizations face crises requiring unique expertise, and must overcome institutional inertia to empower unconventional leaders. The nine simultaneous nodes reflect complex challenges requiring coordinated responses across multiple domains. The imposter syndrome battle mirrors how accomplished individuals still doubt readiness when facing ultimate tests. The formal acknowledgment reflects how recognition enables leadership.',
      timelineSignificance: 'Establishes that March 6, 1320 (Prime Timeline) becomes the day Francisco steps into formal mastery as the Academy acknowledges his unique capabilities. The nine-node crisis creates the pivotal moment where his complete synthesis becomes essential for preserving all realities, demonstrating that individual growth serves collective survival at cosmic scale.',
      saveTheCatBeat: 'Finale - The Ultimate Test Begins',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on awakening to nine simultaneous transmissions flooding consciousness, the emergency convocation\'s tense solemnity, standing before the Convergence Chamber feeling culmination weight, masters\' formal acknowledgment, the imposter syndrome whispers battling against certainty, touching the crystalline interface and feeling nine timelines pulse, fear dissolving into focused determination. Show him accepting this is what all growth prepared him for.',
        sudowrite_emotional_arc: 'Begins with urgent alarm as nine fractures cascade, moves through heavy responsibility weight as Academy formally acknowledges unique necessity, reaches focused certainty as touching the interface dissolves imposter syndrome. The emotional journey is from crisis urgency through doubt-battling weight to determined mastery acceptance.',
        sudowrite_sensory_emphasis: 'Emphasize nine simultaneous transmissions flooding consciousness, emergency convocation\'s tense solemnity, the Convergence Chamber\'s pristine spherical nexus with holographic timelines shimmering like jewels, crystalline interface pulsing with nine timeline rhythms, imposter syndrome\'s whispered doubts, certainty rising to replace fear.',
      },
      learning_objectives: {
        integration: 'Culmination of Growth and Leadership Acceptance',
        terminal_objectives: [
          'Recognize that sustained effort and adaptive resilience culminate in moments where unique synthesized capabilities become essential for addressing ultimate challenges',
          'Accept formal recognition and leadership responsibility without arrogance or imposter syndrome, trusting that growth prepared you for this purpose',
          'Step into mastery by understanding that individual achievement serves collective survival and flourishing at the highest scale',
        ],
      },
      foreshadowing_elements: [
        'The nine timeline nodes foreshadow the complex coordination required in Scene 2',
        'The Convergence Chamber\'s crystalline interface foreshadows Francisco\'s direct connection to multiple realities',
        'The formal Academy acknowledgment foreshadows the master recognition ceremony in Scene 3',
      ],
    },
    {
      // Scene 2: Symphony of Timelines
      pages: 'Page 577 - 581',
      description: 'Mid-morning, Francisco orchestrates the nine-point intervention with the focused intensity of a conductor leading a cosmic symphony. Each timeline node demands different mastery: Node One requires Zara\'s innovative temporal stabilizers; Node Two needs Marcus\'s unwavering anchor presence; Node Three thrives under Elena\'s communication bridges between dimensional representatives; Nodes Four through Nine require Francisco\'s direct integration of valor, inspiration, ambition, collaboration, potential, and wisdom simultaneously. Francisco wants to synchronize all nine interventions without losing a single timeline; his team wants to execute flawlessly while trusting his coordination. The opposition is formidable: split-second timing requirements, cascading failures if any node slips, and the sheer cognitive load of perceiving nine realities at once. But Francisco has evolved—individual ambition has transmuted into collective leadership. As he channels each team member\'s strengths, he experiences profound flow: watching their gifts combine into something exponentially greater than their sum. Node by node, the fractures seal. Reality stabilizes. The coordinated success floods Francisco with deep fulfillment.',
      focus: 'Francisco\'s mastery manifests in coordinated action, successfully executing the complex multi-dimensional intervention and proving that achievement flows from synthesizing all learned skills into harmonious collective leadership',
      chapterSceneFocus: 'Ch39S2: Demonstrating that true mastery synthesizes individual skills and team strengths into coordinated collective action achieving exponential impact',
      preliminarySceneFocus: 'Francisco orchestrates the nine-point intervention like a cosmic symphony, achieving perfect coordination and deep fulfillment',
      preliminarySceneDescription: 'Mid-morning, Francisco orchestrates the nine-point intervention with a conductor\'s focused intensity leading cosmic symphony. Each timeline node demands different mastery: Node One requires Zara\'s innovative temporal stabilizers; Node Two needs Marcus\'s unwavering anchor; Node Three thrives under Elena\'s communication bridges; Nodes Four through Nine require Francisco\'s direct integration of valor, inspiration, ambition, collaboration, potential, and wisdom simultaneously. Francisco wants perfect synchronization without losing a single timeline; his team wants flawless execution trusting his coordination. Opposition is formidable: split-second timing, cascading failures if any node slips, sheer cognitive load perceiving nine realities at once. But individual ambition has transmuted into collective leadership. As Francisco channels each team member\'s strengths, he experiences profound flow: gifts combining exponentially greater than their sum. The Nine of Cups symbolism manifests: nine coordinations mirror nine overflowing cups, each representing one major growth area now applied simultaneously. Success emerges from integrating disciplined practice with clear purpose. Node by node, fractures seal. Reality stabilizes. Coordinated success floods Francisco with deep fulfillment.',
      narrativeFunction: 'Demonstrates Francisco\'s complete mastery as he successfully coordinates the nine-point intervention, proving that individual growth synthesized with collective leadership creates exponential impact. This scene shows the practical application of all learned abilities working in perfect harmony to achieve what seemed impossible.',
      sensoryDetail: 'The Convergence Chamber pulses with nine-point coordination. Timeline nodes manifest as distinct holographic spheres—each demanding different intervention patterns. Zara\'s temporal stabilizers shimmer at Node One. Marcus\'s anchor presence grounds Node Two. Elena\'s communication bridges spark at Node Three. Nodes Four through Nine surge with Francisco\'s direct integration—valor, inspiration, ambition, collaboration, potential, wisdom flowing simultaneously. The cognitive load of perceiving nine realities creates symphonic complexity. Flow state manifests as effortless coordination. Fractures seal with audible crystalline clicks. Reality stabilization ripples across all dimensions. Deep fulfillment floods consciousness.',
      internalConflict: 'Francisco struggles with the sheer cognitive load of perceiving and coordinating nine realities simultaneously, questioning whether his capacity can sustain the complexity without missing critical timing. He grapples with trusting his team to execute without micromanaging versus maintaining coordination oversight, balancing delegation with leadership. The fear that one slip could cascade into total failure battles against the flow state emerging from complete mastery synthesis.',
      characterGrowthElement: 'Francisco achieves the ultimate expression of collective leadership as individual ambition transmutes into orchestrating others\' strengths for exponential collective impact. He discovers that true mastery isn\'t solo heroics but conducting the symphony—channeling each team member\'s unique gifts into perfect coordination that exceeds the sum of parts. The deep fulfillment he experiences reveals that his greatest aspiration wasn\'t personal glory but enabling collective success that heals and helps countless others.',
      seriesConnectionResonance: 'The nine-point coordination establishes Francisco\'s signature leadership approach for future books—synthesizing individual and collective capabilities into orchestrated responses to cosmic challenges. The flow state he achieves demonstrates the mastery level he\'ll bring to greater threats. The deep fulfillment from enabling collective success rather than solo achievement defines his ongoing character motivation.',
      sceneCardProgression: 73,
      realWorldContext: 'The nine-point coordination mirrors real-world crisis management requiring simultaneous interventions across multiple domains—like coordinating pandemic responses, climate initiatives, or complex organizational transformations. The conductor metaphor reflects how effective leadership orchestrates diverse expertise rather than claiming all knowledge. The flow state from collective success reflects how meaningful achievement comes from enabling others. The cognitive load mirrors the complexity faced by leaders coordinating large-scale efforts.',
      timelineSignificance: 'Establishes that this morning marks the successful nine-point intervention that stabilizes all realities, demonstrating that Francisco\'s mastery enables cosmic-scale coordination. This becomes the pivotal moment proving that individual growth synthesized with collective leadership can address existential threats, creating the precedent for future multi-dimensional crisis responses.',
      saveTheCatBeat: 'Finale - Coordinated Victory Through Mastery',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on orchestrating nine-point coordination like conducting symphony, perceiving each timeline node\'s distinct demands, channeling team members\' unique strengths, the cognitive load of nine simultaneous realities, individual ambition transmuting into collective leadership flow, watching gifts combine exponentially, fractures sealing node by node, reality stabilizing, deep fulfillment flooding consciousness. Show the transition from complexity overwhelm to flow state mastery.',
        sudowrite_emotional_arc: 'Begins with intense focus as coordination begins and complexity threatens overwhelm, moves through flow state emergence as mastery synthesis takes hold, reaches deep fulfillment as coordinated success stabilizes reality. The emotional journey is from concentrated intensity through effortless orchestration to profound achievement satisfaction.',
        sudowrite_sensory_emphasis: 'Emphasize the Convergence Chamber pulsing with nine-point activity, timeline nodes as distinct holographic spheres, Zara\'s stabilizers shimmering, Marcus\'s anchor grounding, Elena\'s bridges sparking, Francisco\'s direct integration flowing through Nodes 4-9, cognitive load creating symphonic complexity, flow state\'s effortless coordination, fractures sealing with crystalline clicks, reality stabilization rippling.',
      },
      learning_objectives: {
        integration: 'Collective Leadership Mastery and Flow State Achievement',
        terminal_objectives: [
          'Demonstrate that true mastery synthesizes individual skills and team strengths into coordinated collective action achieving exponential impact beyond solo capabilities',
          'Experience flow state from orchestrating others\' unique gifts in perfect harmony, discovering that enabling collective success provides deeper fulfillment than individual achievement',
          'Prove that sustained disciplined practice integrated with clear purpose enables executing seemingly impossible complexity through harmonious coordination',
        ],
      },
      foreshadowing_elements: [
        'The deep fulfillment from collective success foreshadows Francisco\'s ongoing motivation as cosmic master',
        'The nine-point coordination precedent foreshadows similar large-scale responses to future threats',
        'The flow state mastery foreshadows Francisco\'s peak capabilities in upcoming challenges',
      ],
    },
    {
      // Scene 3: From Seeker to Enabler
      pages: 'Page 582 - 585',
      description: 'By afternoon, the crisis resolved and timelines stabilized, Francisco stands in the Master\'s Observatory overlooking the Academy grounds bathed in golden light. Grand Master Severyn performs the formal recognition ceremony, but Francisco barely registers the titles and honors—his attention is on the profound shift within. He\'s transformed from someone seeking success to someone enabling it in others. Francisco wants to internalize this transition and prepare for what comes next; the Academy wants to formally establish his new master status; Zara, Marcus, and Elena want to celebrate while acknowledging their collective achievement. The opposition has dissolved—doubt replaced by evidence, ambition refined into service, ego surrendered to purpose. As dimensional representatives depart carrying gratitude, as students look to Francisco with new recognition, he understands: this ending is actually beginning. The success he\'s achieved isn\'t a destination but a launchpad. His mastery of collective leadership is just becoming essential for challenges still hidden beyond the horizon. The scene lands on mature contentment and eager anticipation.',
      focus: 'Francisco\'s character arc completes as his full mastery is recognized, demonstrating that true success is enabling others\' success, and establishing the foundation for his continuing journey as cosmic master and guide',
      chapterSceneFocus: 'Ch39S3: Completing the transformation from seeking personal success to enabling collective success, recognizing achievement as beginning not destination',
      preliminarySceneFocus: 'Francisco receives formal master recognition but focuses on his internal shift from seeker to enabler',
      preliminarySceneDescription: 'By afternoon, crisis resolved and timelines stabilized, Francisco stands in the Master\'s Observatory overlooking Academy grounds bathed in golden light. Grand Master Severyn performs formal recognition ceremony, but Francisco barely registers titles and honors—his attention is on the profound internal shift. He\'s transformed from someone seeking success to someone enabling it in others. Francisco wants to internalize this transition and prepare for what comes next; the Academy wants to formally establish new master status; Zara, Marcus, and Elena want to celebrate collective achievement. Opposition has dissolved—doubt replaced by evidence, ambition refined into service, ego surrendered to purpose. The Nine of Cups fulfillment transforms from seeking to enabling: Francisco\'s success manifests as creating lasting positive change for countless others, embodying the theme that meaningful achievement aligns with core values and enables collective flourishing beyond personal gain. As dimensional representatives depart carrying gratitude, as students look to Francisco with new recognition, he understands: this ending is actually beginning. Success isn\'t destination but launchpad. His mastery is just becoming essential for hidden challenges beyond the horizon. Mature contentment meets eager anticipation.',
      narrativeFunction: 'Completes Francisco\'s Book 1 character arc by establishing his full transformation from ambitious law student seeking personal success to cosmic master enabling collective flourishing. This scene demonstrates that meaningful achievement isn\'t about titles or recognition but about the internal shift from seeking to serving, setting the foundation for his ongoing journey as guide and leader.',
      sensoryDetail: 'The Master\'s Observatory overlooks Academy grounds bathed in golden afternoon light. Grand Master Severyn\'s formal recognition ceremony carries solemnity and tradition. Titles and honors flow past barely registered. The internal shift manifests as profound peace—ambition refined into service purpose. Dimensional representatives depart with grateful acknowledgments. Students\' eyes show new recognition and respect. Zara, Marcus, and Elena\'s celebration radiates collective achievement joy. The scene glows with mature contentment meeting eager anticipation for future possibilities.',
      internalConflict: 'Francisco grapples with barely registering the formal recognition he once would have craved, questioning whether his lack of excitement means ingratitude or genuine transformation. He wrestles with understanding whether this achievement provides closure or creates new responsibilities, uncertain if he\'s ready for what "cosmic master" entails. The tension between wanting to savor this moment versus anticipating future challenges reflects the transition from seeker to enabler—no longer chasing validation but preparing to serve.',
      characterGrowthElement: 'Francisco completes his ultimate transformation as he internalizes the shift from seeking personal success to enabling collective flourishing—discovering that the formal recognition matters less than the profound internal change. He achieves the mature understanding that success isn\'t a destination providing rest but a launchpad creating responsibility for serving others. His mastery becomes not about what he\'s achieved but about what he can now enable others to achieve, embodying the Nine of Cups fulfillment through creating lasting positive change.',
      seriesConnectionResonance: 'The "seeker to enabler" transformation establishes Francisco\'s fundamental character motivation for Books 2+—using his mastery to guide and enable others rather than pursuing personal achievement. The recognition that this ending is actually beginning opens the series arc where greater challenges await. His mature contentment combined with eager anticipation defines the emotional foundation for his ongoing cosmic master journey.',
      sceneCardProgression: 74,
      realWorldContext: 'The Master\'s Observatory recognition mirrors real-world scenarios where individuals receive formal acknowledgment (degrees, promotions, awards) but find the internal transformation matters more than external validation. The shift from seeking to enabling reflects how mature success focuses on empowering others rather than personal achievement. The "ending as beginning" recognition mirrors how accomplishment creates new responsibilities. The mature contentment with eager anticipation reflects how true masters never stop growing.',
      timelineSignificance: 'Establishes that this afternoon marks Francisco\'s formal recognition as cosmic master and the completion of his Book 1 transformation arc. This becomes the pivotal moment when he internalizes that success means enabling collective flourishing rather than personal achievement, creating the foundation for how he\'ll approach all future challenges with service-oriented leadership.',
      saveTheCatBeat: 'Finale - Transformation Complete, New Beginning Revealed',
      sudowrite_metadata: {
        sudowrite_pov_guidance: 'Francisco\'s POV: Focus on the Master\'s Observatory\'s golden light, barely registering formal recognition ceremony, the profound internal shift from seeker to enabler, watching dimensional representatives depart with gratitude, students\' new recognition, Zara/Marcus/Elena celebrating collective achievement, understanding this ending is actually beginning, mature contentment meeting eager anticipation. Show him embracing the cosmic master role as service not status.',
        sudowrite_emotional_arc: 'Begins with peaceful observation as formal recognition unfolds barely registered, moves through profound internal shift recognition from seeking to enabling, reaches mature contentment combined with eager anticipation for future service. The emotional journey is from ceremonial acknowledgment through transformational internalization to purposeful forward-looking readiness.',
        sudowrite_sensory_emphasis: 'Emphasize the Master\'s Observatory bathed in golden afternoon light, Grand Master Severyn\'s solemn ceremony, titles flowing past barely heard, the internal shift manifesting as profound peace, dimensional representatives\' grateful departures, students\' respectful recognition, team\'s celebration radiating collective joy, mature contentment glowing with eager anticipation.',
      },
      learning_objectives: {
        integration: 'Transformation Completion and Service-Oriented Purpose',
        terminal_objectives: [
          'Complete the transformation from seeking personal success to enabling collective flourishing, recognizing that meaningful achievement creates lasting positive change for others',
          'Understand that success isn\'t a destination providing closure but a launchpad creating responsibility for serving and guiding others toward their potential',
          'Embrace mastery as the capacity to enable others\' achievement rather than personal accomplishment, embodying service-oriented leadership aligned with core values',
        ],
      },
      foreshadowing_elements: [
        'The "ending as beginning" recognition foreshadows the expanded scope of Books 2+',
        'The hidden challenges beyond the horizon foreshadow greater threats Francisco will face',
        'The service-oriented purpose foreshadows how Francisco will approach future leadership opportunities',
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

  console.log('\n🎉 EA-039 complete import finished!');
  console.log('🏆 THE NINE FULFILLMENTS - Master of Two Worlds Complete!\n');
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
