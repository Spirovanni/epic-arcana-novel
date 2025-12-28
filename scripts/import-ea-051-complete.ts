import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-051: Swiftness (Book 2, Chapter 11)...\n');

  // Get chapter EA-051
  const [ch51] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-051'))
    .limit(1);

  if (!ch51) {
    console.error('❌ EA-051 not found in chapters table');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${ch51.title} (ID: ${ch51.id})\n`);

  // Scene data from outline
  const scenesData = [
    {
      scene_number: 1,
      scene_title: 'Arrows in Flight',
      setup: 'In a marketplace between timelines where Francisco\'s new allies are gathering supplies, the air suddenly fractures with the sound of displaced time—eight shimmering trajectories appear simultaneously, temporal assassins converging from different realities on a single target: Roger de Flor. Francisco wants to warn Roger before the attacks land; Roger wants to understand why he\'s being targeted across multiple timelines at once. Opposition erupts from all directions: the eight assassins strike simultaneously from different temporal angles (making defense nearly impossible), the marketplace\'s civilians panicking and creating chaos that obscures sight lines, and the sheer impossibility of protecting someone from attacks that arrive from past, present, and future at the same moment. But Roger, seeing the attacks converge and recognizing he\'s the anchor point, makes a choice with devastating speed: he shoves Francisco through a temporal rift to safety, then turns to face all eight strikes alone. As Francisco watches helplessly from between-time, Roger\'s body lights up at eight points of impact, each assassination rippling outward across multiple realities. The scene lands on Francisco\'s horror as his first true ally falls, and the Eight of Wands\' lesson manifests: swift action cuts both ways—attack and sacrifice arrive at the same velocity.',
      symbolism: 'The Eight of Wands embodies the chapter\'s swiftness theme through the simultaneous assassin strikes: eight arrows in flight, eight trajectories converging on a single point. Roger\'s sacrifice demonstrates that speed applies to both danger and heroism—the choice to act swiftly can mean death as easily as salvation.',
      beat_goal: 'Francisco witnesses Roger de Flor\'s death at the hands of timeline assassins, experiencing his first major loss and learning that his new path involves not just temporal power but terrible sacrifice, establishing death as a real consequence in a story about timeline manipulation.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Shock and grief',
      scene_tone: 'Violent and tragic',
      timeline_date: 'Post-Book 1 + 6 weeks',
      timeline_variant: 'Marketplace Between Timelines (Death Nexus Forming)',
      location: 'Between-Timeline Marketplace',
    },
    {
      scene_number: 2,
      scene_title: 'The Anchor Point',
      setup: 'As Roger\'s body collapses, something impossible happens: the point where he fell begins to exist simultaneously across multiple timelines, creating a death nexus—a convergence of grief visible from multiple realities at once. Francisco wants to reverse time, to undo the moment, but Dante appears and stops him: "You can\'t. This is an anchor point—his death is fixed across all timelines now. Touch it and you\'ll tear reality apart." Francisco demands to know why Roger was targeted, why his death creates this nexus; Dante reveals that Roger isn\'t human—he\'s something older, and killing him in one timeline kills him in all of them, but also means he\'ll eventually be reborn. Opposition intensifies through Francisco\'s desperate denial (his friend can\'t be gone), the gathering presence of temporal observers from multiple realities all drawn to the anchor point, and the terrible truth that Roger knew this would happen—his sacrifice was intentional. But as Dante shows Francisco how to perceive the nexus fully, they see it: Roger\'s death sends ripples not of loss but of *protection*—by becoming an anchor point, his death stabilizes the timelines around Francisco, making it harder for assassins to strike at his other allies. "The Eight of Wands," Dante explains quietly, "shows swift flight. He flew ahead of you to shield your path." The scene lands on Francisco understanding Roger chose this death to protect him.',
      symbolism: 'The death nexus represents the Eight of Wands\' convergence: all eight assassin trajectories meeting at a single point creates something that transcends individual timelines. Roger\'s sacrifice embodies the card\'s meaning—swift, decisive action that changes everything in an instant, arrows that can\'t be called back once loosed.',
      beat_goal: 'Francisco learns about anchor points and the nature of temporal mortality, discovering that Roger\'s death was both heroic sacrifice and strategic protection, forcing him to understand that swift action in timeline manipulation carries permanent consequences even when death itself isn\'t final.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Comprehension through grief',
      scene_tone: 'Solemn and revelatory',
      timeline_date: 'Post-Book 1 + 6 weeks (moments after Scene 1)',
      timeline_variant: 'Death Nexus (Multiple Timelines Converging)',
      location: 'Death Nexus - Anchor Point',
    },
    {
      scene_number: 3,
      scene_title: 'She Who Transcends',
      setup: 'As Francisco kneels by Roger\'s body at the nexus, reality tears open and *something divine* steps through—Salasa Atumari, a goddess whose grief transcends timeline boundaries, drawn to Roger\'s death like a beacon. Francisco wants to protect his friend\'s body from this overwhelming presence; Salasa wants only to mourn the man she\'s loved across countless realities and deaths. Opposition emerges from the dangerous instability of a divine being intersecting with a death nexus (the timelines around them begin warping violently), Francisco\'s confusion and protective anger (who is this woman and why does she claim to love Roger?), and Salasa\'s own barely-contained power threatening to shatter the anchor point Dante warned not to disturb. But as Salasa kneels across from Francisco, her grief so profound it makes reality weep temporal tears, she speaks: "This is his seventy-third death. Each time I find him, each time I lose him again. But this time... this time something changed. He died protecting someone who matters to the tapestry." She looks at Francisco with eyes that have seen millennia. "You don\'t know it yet, but you\'re worth dying for. And he\'ll be reborn knowing it." The scene lands on Francisco\'s first understanding that he\'s caught in something far larger than faction politics—something involving gods and recurring fates.',
      symbolism: 'Salasa\'s arrival embodies the Eight of Wands reaching beyond mortal comprehension: messages from divine realms arriving with terrifying swiftness. Her grief transcending timelines represents how love, like the wands\' flight, moves faster than mortal understanding and strikes with force that reshapes reality.',
      beat_goal: 'Francisco encounters Salasa Atumari for the first time through shared grief over Roger\'s death, introducing the divine perspective on mortality and establishing the pattern of Roger\'s deaths and rebirths that will echo through the series while adding romantic complexity to Francisco\'s journey.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Awe and expanded understanding',
      scene_tone: 'Mystical and intense',
      timeline_date: 'Post-Book 1 + 6 weeks (continuous)',
      timeline_variant: 'Death Nexus (Divine Intersection)',
      location: 'Death Nexus - Divine Manifestation',
    },
    {
      scene_number: 4,
      scene_title: 'The Temporal Funeral',
      setup: 'Salasa, demonstrating divine power that makes Francisco\'s temporal manipulation look like child\'s play, creates something unprecedented: a temporal funeral that occurs simultaneously across multiple realities, allowing different versions of Roger from various timelines to attend his own death ceremony. Francisco wants to understand how this is possible, why other Rogers exist to mourn this one; Salasa wants Francisco to witness the truth of timeline existence—that every person is infinite versions, and losing one means feeling all the others. Opposition builds through the ceremony\'s overwhelming nature (Francisco perceives dozens of Rogers simultaneously, each carrying different memories of their friendship), the temporal strain of maintaining such a convergence (even Salasa struggles to hold it stable), and Francisco\'s growing realization that if Roger can die and be reborn across timelines, so can he—and so can everyone he loves. But as the ceremony reaches its peak and the Rogers fade back to their own realities, one remains: a version from a timeline where Roger survived, who crosses into this reality to grasp Francisco\'s shoulder. "In my timeline, you\'re the one who died saving me," he says. "We take turns. That\'s what it means to be allies across eternity." The scene lands on Francisco accepting both the burden and gift of moving with divine swiftness—that speed means living intensely even when death is never far behind.',
      symbolism: 'The temporal funeral embodies the Eight of Wands\' ultimate meaning: multiple trajectories existing simultaneously, each arrow finding its target in different realities. The ceremony shows that swiftness isn\'t about avoiding death but about living and loving at a velocity that transcends single timelines—moving so fast you become eternal.',
      beat_goal: 'Francisco participates in Roger\'s temporal funeral across multiple realities, fully comprehending the implications of temporal mortality and his role in a pattern that transcends individual timelines, accepting that swift action and deep friendship are inseparable from the risk of loss and the promise of eternal connection.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Bittersweet acceptance',
      scene_tone: 'Ceremonial and transcendent',
      timeline_date: 'Post-Book 1 + 6 weeks (same day, evening)',
      timeline_variant: 'Temporal Funeral (Multiple Realities Overlapping)',
      location: 'Temporal Funeral Space - Across Multiple Timelines',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      // Scene 1: Arrows in Flight
      pages: 'Page 151 - 154',
      description: 'Francisco witnesses Roger de Flor\'s death as eight timeline assassins strike simultaneously, experiencing his first major loss and learning that swift heroic action and devastating attack arrive at the same velocity.',
      focus: 'Francisco\'s first experience with the death of a close ally, learning that timeline power involves terrible sacrifice',
      chapterSceneFocus: 'Ch51S1: Francisco witnesses Roger de Flor die from eight simultaneous timeline assassin strikes, experiences first major ally loss, learns swift action cuts both ways as Roger sacrifices himself with devastating speed',
      preliminarySceneFocus: 'Experiencing convergence of internal and external pressures',
      preliminarySceneDescription: 'Eight temporal assassins converging from different realities demonstrate that swift action applies equally to danger and heroism, forcing Francisco to witness sacrifice',
      narrativeFunction: 'Establishes death as real consequence in timeline manipulation story, introduces Roger\'s death pattern, and demonstrates Eight of Wands theme through simultaneous strikes',
      sensoryDetail: 'Air fracturing with displaced time sound, eight shimmering assassination trajectories appearing, Roger\'s body lighting up at eight impact points, ripples spreading across multiple realities',
      internalConflict: 'Francisco\'s helplessness watching friend die versus desperate need to act, horror at witnessing sacrifice versus understanding Roger chose this to save him',
      characterGrowthElement: 'Francisco experiences first major loss, beginning to understand that his path involves not just power but watching allies sacrifice themselves for the cause',
      seriesConnectionResonance: 'Roger\'s first death begins the pattern of deaths and rebirths that culminates in his final Book 9 sacrifice',
      sceneCardProgression: 114,
      realWorldContext: 'Between-timeline marketplace six weeks after leaving temporal monastery',
      timelineSignificance: 'Eight simultaneous strikes from different temporal angles creating death nexus',
      saveTheCatBeat: 'Fun and Games - pinch point where internal and external pressures converge',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Fast violent - sudden convergence and immediate sacrifice',
        tension_level: 'Extreme - eight simultaneous attacks impossible to defend',
        emotional_arc: 'Normal → Shock → Horror → Grief',
      }),
      learning_objectives: JSON.stringify([
        'Understand that swift action in timeline manipulation has permanent consequences',
        'Recognize that allies may sacrifice themselves to protect the greater mission',
        'Accept that speed applies equally to danger and heroism',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Roger\'s death pattern (seventy-three deaths across series)',
        'Eight of Wands theme (arrows can\'t be called back once loosed)',
        'Anchor points concept (deaths fixing events across timelines)',
      ]),
    },
    {
      // Scene 2: The Anchor Point
      pages: 'Page 155 - 158',
      description: 'Francisco learns about anchor points as Roger\'s death creates a nexus across timelines, discovering the sacrifice was intentional protection and that temporal mortality carries permanent consequences despite rebirth possibilities.',
      focus: 'Francisco discovers that Roger\'s death was both heroic sacrifice and strategic protection through anchor point creation',
      chapterSceneFocus: 'Ch51S2: Francisco learns anchor points fix deaths across all timelines, discovers Roger\'s sacrifice was intentional protection creating stability around Francisco, understands swift action has permanent consequences despite rebirth',
      preliminarySceneFocus: 'Understanding strategic nature of sacrifice and protection',
      preliminarySceneDescription: 'Death nexus formation reveals Roger\'s sacrifice wasn\'t just heroic but strategic, creating anchor point that protects Francisco from future assassin strikes',
      narrativeFunction: 'Establishes anchor point concept as key temporal mechanic, reveals Roger\'s non-human nature and rebirth pattern, shows sacrifice had protective strategic purpose',
      sensoryDetail: 'Death point existing simultaneously across multiple timelines, temporal observers gathering from various realities, ripples of protection spreading from anchor point',
      internalConflict: 'Francisco\'s desperate denial versus forced acceptance, desire to reverse time versus understanding that would tear reality apart, grief versus comprehension of protective intent',
      characterGrowthElement: 'Francisco learns to perceive temporal mechanics more deeply, understanding that some deaths serve purposes beyond individual loss',
      seriesConnectionResonance: 'Anchor point mechanics become crucial for understanding how Book 9 climax events are fixed across all realities',
      sceneCardProgression: 115,
      realWorldContext: 'Death nexus moments after Roger\'s fall, Francisco prevented from undoing the moment',
      timelineSignificance: 'Anchor point creation fixing Roger\'s death across all timelines permanently',
      saveTheCatBeat: 'Fun and Games - understanding pinch point implications',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium solemn - space for revelation and comprehension',
        tension_level: 'Moderate - internal tension of acceptance versus denial',
        emotional_arc: 'Denial → Desperation → Revelation → Understanding',
      }),
      learning_objectives: JSON.stringify([
        'Understand anchor points as moments fixed across all timelines',
        'Recognize that some sacrifices serve strategic protective purposes',
        'Accept that swift decisive action creates permanent consequences',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Roger\'s non-human nature (revealed more fully in later books)',
        'Rebirth pattern across timelines (crucial for series arc)',
        'Protective anchor points (used strategically in Books 6-9)',
      ]),
    },
    {
      // Scene 3: She Who Transcends
      pages: 'Page 159 - 162',
      description: 'Francisco encounters goddess Salasa Atumari through shared grief over Roger\'s seventy-third death, introducing divine perspective on mortality and establishing pattern of Roger\'s deaths and rebirths echoing through series.',
      focus: 'Francisco\'s first encounter with divine perspective on mortality through Salasa\'s transcendent grief',
      chapterSceneFocus: 'Ch51S3: Francisco encounters goddess Salasa Atumari grieving Roger\'s seventy-third death, learns about divine love transcending mortality, discovers he\'s caught in pattern involving gods and recurring fates',
      preliminarySceneFocus: 'Introducing divine perspective and romantic complexity',
      preliminarySceneDescription: 'Salasa\'s appearance demonstrates how divine grief and love move with terrifying swiftness, transcending timeline boundaries to find Roger across his many deaths',
      narrativeFunction: 'Introduces Salasa as key character, establishes Roger\'s death-rebirth cycle across series, adds divine/romantic complexity to Francisco\'s journey',
      sensoryDetail: 'Reality tearing open for divine manifestation, Salasa existing with overwhelming presence, timelines warping violently around divine-nexus intersection, reality weeping temporal tears',
      internalConflict: 'Francisco\'s protective anger versus awe at divine grief, confusion about who Salasa is versus recognition of profound ancient love, mortal scale versus divine perspective',
      characterGrowthElement: 'Francisco realizes he\'s involved in something far larger than faction politics—a pattern involving gods choosing mortality and recurring fates',
      seriesConnectionResonance: 'Salasa introduction begins exploration of gods choosing mortality that becomes central to Book 9 series resolution',
      sceneCardProgression: 116,
      realWorldContext: 'Death nexus as divine being intersects with anchor point, creating dangerous temporal instability',
      timelineSignificance: 'Divine intersection revealing Roger\'s seventy-three death cycle across realities',
      saveTheCatBeat: 'Fun and Games - expanding scope beyond mortal concerns',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Medium intense - balancing divine revelation with emotional weight',
        tension_level: 'High - dangerous divine-nexus intersection threatening stability',
        emotional_arc: 'Grief → Confusion → Awe → Expanded understanding',
      }),
      learning_objectives: JSON.stringify([
        'Understand that divine beings experience love and grief transcending timelines',
        'Recognize that mortal significance can matter to cosmic patterns',
        'Accept that some relationships echo across infinite realities and deaths',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Roger\'s seventy-three death pattern (Book 9 final sacrifice)',
        'Salasa\'s divine mortality choice theme (series resolution)',
        'Francisco\'s cosmic significance (tapestry pattern)',
      ]),
    },
    {
      // Scene 4: The Temporal Funeral
      pages: 'Page 163 - 165',
      description: 'Francisco participates in temporal funeral across multiple realities where different Rogers attend their own death ceremony, accepting that swift action and deep friendship are inseparable from loss and eternal connection.',
      focus: 'Francisco accepts the implications of temporal mortality and eternal friendship through multi-reality funeral ceremony',
      chapterSceneFocus: 'Ch51S4: Francisco witnesses temporal funeral across multiple realities with different Rogers attending, comprehends eternal nature of allies-across-timelines relationships, accepts swiftness means living intensely despite death proximity',
      preliminarySceneFocus: 'Accepting burden and gift of eternal friendship velocity',
      preliminarySceneDescription: 'Temporal funeral demonstrates that swiftness isn\'t about avoiding death but living and loving at velocity transcending single timelines, moving so fast you become eternal',
      narrativeFunction: 'Resolves chapter arc by establishing Francisco\'s acceptance of temporal mortality patterns and his role in eternal alliance cycles',
      sensoryDetail: 'Funeral occurring simultaneously across multiple realities, dozens of Rogers perceived at once each carrying different friendship memories, versions fading back to their timelines, alternate Roger grasping Francisco\'s shoulder',
      internalConflict: 'Francisco overwhelmed by infinite versions versus comprehending eternal patterns, grief at this Roger\'s loss versus acceptance of eternal connection, mortality fear versus embrace of intense living',
      characterGrowthElement: 'Francisco integrates understanding that allies across eternity take turns sacrificing, accepting both burden and gift of relationships transcending death',
      seriesConnectionResonance: 'Eternal allies pattern becomes Francisco\'s defining relationship framework through series, culminating in Book 9 mutual sacrifice understanding',
      sceneCardProgression: 117,
      realWorldContext: 'Evening of Roger\'s death, Salasa creating unprecedented multi-reality funeral convergence',
      timelineSignificance: 'Multiple realities overlapping as different Rogers attend this timeline\'s funeral',
      saveTheCatBeat: 'Fun and Games conclusion - accepting pinch point lessons about eternal velocity',
      sudowrite_metadata: JSON.stringify({
        pacing: 'Slow ceremonial - space for transcendent comprehension',
        tension_level: 'Moderate - temporal strain versus emotional resolution',
        emotional_arc: 'Confusion → Overwhelm → Comprehension → Acceptance',
      }),
      learning_objectives: JSON.stringify([
        'Comprehend that every person exists as infinite versions across timelines',
        'Accept that allies across eternity take turns sacrificing for each other',
        'Integrate understanding that swiftness means living intensely despite death',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Allies-across-eternity taking turns (crucial for Book 9)',
        'Francisco\'s own potential deaths in other timelines',
        'Divine swiftness as way of living rather than just moving fast',
      ]),
    },
  ];

  // Insert or update each scene
  for (let i = 0; i < scenesData.length; i++) {
    const sceneData = scenesData[i];
    const enhancement = enhancements[i];

    console.log(`\n📝 Processing Scene ${sceneData.scene_number}: ${sceneData.scene_title}`);

    // Insert basic scene data
    const [insertedScene] = await db
      .insert(scenes)
      .values({
        chapterId: ch51.id,
        chapterUniqueIdentifier: 'EA-051',
        sceneNumber: sceneData.scene_number,
        title: sceneData.scene_title,
        setup: sceneData.setup,
        symbolism: sceneData.symbolism,
        beatGoal: sceneData.beat_goal,
        pov: sceneData.pov,
        tense: sceneData.tense,
        core_emotion: truncate(sceneData.core_emotion, 255),
        scene_tone: truncate(sceneData.scene_tone, 255),
        timeline_date: sceneData.timeline_date,
        timeline_variant: sceneData.timeline_variant,
        location: sceneData.location,
      })
      .returning();

    console.log(`   ✅ Inserted scene with ID: ${insertedScene.id}`);

    // Update with enhanced narrative fields
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
        saveTheCatBeat: truncate(enhancement.saveTheCatBeat, 100),
        sudowrite_metadata: enhancement.sudowrite_metadata,
        learning_objectives: enhancement.learning_objectives,
        foreshadowing_elements: enhancement.foreshadowing_elements,
      })
      .where(eq(scenes.id, insertedScene.id));

    console.log(`   ✅ Updated with enhanced narrative fields`);
  }

  // Verify all fields are populated
  console.log('\n\n🔍 Verifying field completion...\n');

  const chapterScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, ch51.id));

  const allFields = [
    'pages', 'description', 'focus', 'chapterSceneFocus', 'preliminarySceneFocus',
    'preliminarySceneDescription', 'narrativeFunction', 'sensoryDetail', 'internalConflict',
    'characterGrowthElement', 'seriesConnectionResonance', 'sceneCardProgression',
    'realWorldContext', 'timelineSignificance', 'saveTheCatBeat', 'sudowrite_metadata',
    'learning_objectives', 'foreshadowing_elements', 'sceneNumber', 'title', 'setup',
    'symbolism', 'beatGoal', 'pov', 'tense', 'core_emotion', 'scene_tone', 'timeline_date',
    'timeline_variant', 'location', 'chapterUniqueIdentifier',
  ];

  for (const scene of chapterScenes.sort((a, b) => (a.sceneNumber || 0) - (b.sceneNumber || 0))) {
    const missingFields: string[] = [];
    const presentFields: string[] = [];

    for (const field of allFields) {
      const value = scene[field as keyof typeof scene];
      if (value === null || value === undefined) {
        missingFields.push(field);
      } else {
        presentFields.push(field);
      }
    }

    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ✅ Present: ${presentFields.length}/${allFields.length}`);
    console.log(`   ❌ Missing: ${missingFields.length}/${allFields.length}`);

    if (missingFields.length > 0) {
      console.log(`   Missing fields: ${missingFields.join(', ')}`);
    }
  }

  console.log('\n✅ EA-051 import complete!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
