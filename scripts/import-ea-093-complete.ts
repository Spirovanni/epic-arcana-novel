import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-093: Illumination (Book 3, Chapter 13)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-093'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-093 not found. Run create-ea-093-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Writer',
      setup: 'Francisco alone. Candlelight. He is trying to put the indescribable into words. \'Illumination\' requires clarity. He drafts the First Principle: \'Time is not a river; it is a sea.\' He feels the weight of history.',
      symbolism: 'The Quill. The Book.',
      beat_goal: 'The Synthesis. Creating the lore.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Inspiration',
      scene_tone: 'Quiet',
      timeline_date: '6/8/1321 - Dawn',
      timeline_variant: 'Sanctuary',
      location: 'Library',
    },
    {
      scene_number: 2,
      scene_title: 'The Assembly',
      setup: 'The 12 gather. They expect battle plans. Francisco gives them philosophy. He explains the \'Hierophant\'s\' role: to bridge the gap between the chaotic divine (Time) and the human mind. He challenges them to learn.',
      symbolism: 'The Teacher. The Classroom.',
      beat_goal: 'The Call. Demanding intellectual growth.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Authority',
      scene_tone: 'Formal',
      timeline_date: '6/8/1321 - Morning',
      timeline_variant: 'Sanctuary',
      location: 'Main Hall',
    },
    {
      scene_number: 3,
      scene_title: 'The Vision',
      setup: 'The Rite of Illumination. Francisco links their minds (briefly). They *see* the timeline as he sees it. The vastness. The beauty. The terror. Some weep. Some laugh. They are \'Illuminated.\'',
      symbolism: 'The Light. The Key.',
      beat_goal: 'The Transformation. Sharing the burden.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Transcendence',
      scene_tone: 'Mystical',
      timeline_date: '6/8/1321 - Noon',
      timeline_variant: 'Sanctuary',
      location: 'Main Hall',
    },
    {
      scene_number: 4,
      scene_title: 'The Oath',
      setup: 'The Aftermath. They are shaken but resolute. They swear to protect the timeline, not just for themselves, but for existence. They are now the Order of the Eternal. Francisco accepts their vow.',
      symbolism: 'The Circle. The Vow.',
      beat_goal: 'Resolution. The birth of the Order.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Solemnity',
      scene_tone: 'Ritualistic',
      timeline_date: '6/8/1321 - Sunset',
      timeline_variant: 'Sanctuary',
      location: 'Courtyard',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 181 - 185',
      description: 'Francisco alone candlelight—indescribable words-putting Illumination clarity-requiring—First-Principle drafting Time-not-river-is-sea history-weight feeling as Quill Book synthesis lore-creating inspiration quiet Mastery knowledge-codifying Hierophant becoming Magus-no-longer-Francisco threshold-crossing.',
      focus: 'Synthesis creating lore through First Principle writing.',
      chapterSceneFocus: 'Ch93S1: Francisco alone candlelight indescribable words-putting Illumination clarity-requiring First-Principle drafting Time-not-river-is-sea history-weight feeling as Quill Book synthesis lore-creates inspiration quiet Mastery knowledge-codifies Hierophant becoming Magus threshold-crossing.',
      preliminarySceneFocus: 'Quill Book inspiration quiet',
      preliminarySceneDescription: 'Writer synthesizes lore creating First-Principle inspired',
      narrativeFunction: 'Establishes Hierophant role through First Principle writing; demonstrates Mastery codifying knowledge into lore; shows Francisco alone synthesizing indescribable temporal concepts; creates threshold crossing preparation becoming Magus.',
      sensoryDetail: 'Francisco alone, candlelight atmosphere, indescribable concepts, words attempting, Illumination requirement, clarity seeking, First Principle drafting, Time is not a river it is a sea quote, history weight, Quill symbolism, Book imagery, synthesis work, lore creating.',
      internalConflict: 'Francisco experiencing inspiration—attempting to codify indescribable temporal concepts into words, feeling history weight responsibility, drafting First Principle Time is sea not river foundational teaching, preparing Hierophant spiritual leader role.',
      characterGrowthElement: 'Francisco becoming Hierophant—applying Mastery principle codifying temporal magic knowledge, writing First Principles founding Order lore, transitioning from Francisco to Magus spiritual intellectual leader through synthesis sacred academic work.',
      seriesConnectionResonance: 'Order of Eternal establishing founding; First Principles lore creating persisting centuries; Hierophant Major Arcana transformation; magic systems rules explaining; Magus identity completing Francisco shedding; threshold crossing beginning.',
      sceneCardProgression: 286,
      realWorldContext: 'Mastery knowledge codification, spiritual leadership preparation, foundational writing.',
      timelineSignificance: '6/8/1321 dawn—day after EA-092 Three Cups celebration, Francisco alone library writing First Principles, Hierophant transformation beginning threshold crossing Magus becoming lore codifying.',
      saveTheCatBeat: truncate('Threshold Crossing - First Principle written Magus', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'quiet_contemplative',
        narrative_mode: 'inspired_weighty',
      }),
      learning_objectives: JSON.stringify([
        'Mastery knowledge codification practice',
        'Spiritual leadership foundation building',
        'First Principles foundational writing',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Twelve gathering assembly',
        'Philosophy not battle plans',
        'Hierophant role explaining',
      ]),
    },
    {
      pages: 'Page 185 - 189',
      description: 'Twelve gathering battle-plans expecting—Francisco philosophy giving Hierophant-role explaining chaotic-divine-Time human-mind gap-bridging—learning challenging as Teacher Classroom call intellectual-growth demanding authority formal dust-motes light attentive-faces diagram-floor refugees-Students transitioning.',
      focus: 'Call demanding intellectual growth through Hierophant teaching.',
      chapterSceneFocus: 'Ch93S2: Twelve gathering battle-plans expecting Francisco philosophy giving Hierophant-role explaining chaotic-divine-Time human-mind gap-bridging learning challenging as Teacher Classroom call intellectual-growth demands authority formal dust-motes light attentive-faces diagram-floor refugees-Students transitioning.',
      preliminarySceneFocus: 'Teacher Classroom authority formal',
      preliminarySceneDescription: 'Assembly calls intellectual-growth demanding teaching challenging',
      narrativeFunction: 'Demonstrates Hierophant Teacher role bridging divine Time and human mind; shows twelve expecting battle plans receiving philosophy shift; creates intellectual growth call challenging students; establishes refugees to Students transformation.',
      sensoryDetail: 'Twelve gathering, battle plans expecting, Francisco presenting, philosophy giving, Hierophant role explaining, chaotic divine Time concept, human mind connection, gap bridging instruction, learning challenging, dust motes in light, attentive faces, diagram floor drawn, formal atmosphere.',
      internalConflict: 'Francisco experiencing authority—explaining Hierophant role bridging chaotic divine Time and human comprehension, challenging twelve to intellectual growth not just battle tactics, establishing spiritual teacher identity commanding respect.',
      characterGrowthElement: 'Francisco embodying Hierophant Teacher—explaining role bridging divine Time chaos to human understanding, demanding intellectual growth from twelve refugees transforming to Students, establishing sacred academic spiritual leadership formal instruction beginning.',
      seriesConnectionResonance: 'Hierophant spiritual teacher establishing; refugees to Students transformation; Organization rebellion structure explaining; magic systems temporal rules teaching; Order intellectual foundation building; shift battle tactics to philosophy.',
      sceneCardProgression: 287,
      realWorldContext: 'Hierophant spiritual teaching, intellectual growth demanding, sacred academic instruction.',
      timelineSignificance: '6/8/1321 morning—hours after First Principles writing, Francisco assembling twelve expecting battle plans giving philosophy, Hierophant Teacher role explaining demanding intellectual growth refugees to Students.',
      saveTheCatBeat: truncate('Threshold Crossing - Hierophant teaching philosophy', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'formal_instructive',
        narrative_mode: 'authoritative_challenging',
      }),
      learning_objectives: JSON.stringify([
        'Hierophant spiritual teaching role mastery',
        'Intellectual growth demanding leadership',
        'Sacred academic instruction establishing',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Rite Illumination minds linking',
        'Timeline seeing vastness beauty terror',
        'Illuminated becoming transformation',
      ]),
    },
    {
      pages: 'Page 189 - 192',
      description: 'Rite-Illumination Francisco minds-linking briefly—timeline seeing vastness beauty terror—weeping laughing Illuminated-becoming as Light Key transformation burden-sharing transcendence mystical Hero-Thousand-Faces threshold-crossing climax-spiritual vision-sharing overwhelming-beautiful Order-founding.',
      focus: 'Transformation sharing burden through Illumination vision.',
      chapterSceneFocus: 'Ch93S3: Rite-Illumination Francisco minds-linking briefly timeline seeing vastness beauty terror weeping laughing Illuminated-becoming as Light Key transformation burden-shares transcendence mystical Hero-Thousand-Faces threshold-crosses climax-spiritual vision-shares overwhelming-beautiful Order-founding.',
      preliminarySceneFocus: 'Light Key transcendence mystical',
      preliminarySceneDescription: 'Vision transforms burden-sharing Illuminating transcendent mystically',
      narrativeFunction: 'Climaxes Hierophant Illumination rite through minds linking vision sharing; demonstrates Hero with Thousand Faces threshold crossing transformation; shows timeline vastness beauty terror experiencing together; creates Illuminated becoming spiritual climax overwhelming beautiful.',
      sensoryDetail: 'Rite of Illumination performing, Francisco minds linking, briefly connecting, timeline seeing, vastness experiencing, beauty witnessing, terror feeling, some weeping, some laughing, Illuminated becoming, Light symbolism, Key imagery, transformation occurring, burden sharing, transcendence achieving, mystical atmosphere.',
      internalConflict: 'Francisco experiencing transcendence—linking minds sharing timeline vision burden twelve experiencing, showing vastness beauty terror overwhelming beautiful together, achieving Illumination transformation threshold crossing Hero Thousand Faces climax spiritual.',
      characterGrowthElement: 'Francisco completing Hierophant transformation—performing Illumination rite linking minds sharing timeline vision burden, achieving Hero with Thousand Faces threshold crossing spiritual climax, creating Illuminated Students through overwhelming beautiful transcendent experience founding Order.',
      seriesConnectionResonance: 'Illumination rite establishing Order foundation; threshold crossing Hero Journey Major Arcana significance; timeline vision sharing burden demonstrating; Illuminated Students creating persisting centuries; magic systems temporal understanding deepening; spiritual climax transformation.',
      sceneCardProgression: 288,
      realWorldContext: 'Hero Thousand Faces threshold crossing, Illumination mystical experience, burden sharing transformation.',
      timelineSignificance: '6/8/1321 noon—midday after morning assembly, Francisco performing Rite Illumination linking minds, twelve seeing timeline vastness beauty terror, threshold crossing transformation Illuminated becoming Order founding climax.',
      saveTheCatBeat: truncate('Threshold Crossing - Illuminated vision shared', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'mystical_transcendent',
        narrative_mode: 'transcendent_overwhelming',
      }),
      learning_objectives: JSON.stringify([
        'Hero Thousand Faces threshold crossing mastery',
        'Illumination mystical experience sharing',
        'Burden sharing transformation achieving',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Oath swearing timeline protecting',
        'Order Eternal birth',
        'Vow accepting Francisco responsibility',
      ]),
    },
    {
      pages: 'Page 192 - 195',
      description: 'Aftermath shaken-but-resolute—timeline protecting swearing not-just-themselves existence—Order-Eternal now Francisco vow-accepting as Circle Vow resolution Order-birth solemnity ritualistic kneeling-figures sun-setting stone responsibility-weight settling New-Era Magus-complete centuries-persisting.',
      focus: 'Resolution birthing Order through oath swearing.',
      chapterSceneFocus: 'Ch93S4: Aftermath shaken-but-resolute timeline protecting swearing not-just-themselves existence Order-Eternal now Francisco vow-accepting as Circle Vow resolution Order-births solemnity ritualistic kneeling-figures sun-setting stone responsibility-weight settling New-Era Magus-complete centuries-persisting.',
      preliminarySceneFocus: 'Circle Vow solemnity ritualistic',
      preliminarySceneDescription: 'Oath resolves Order-birth swearing solemn ritualistic',
      narrativeFunction: 'Resolves Hierophant transformation through Order of Eternal birth; demonstrates oath swearing protecting timeline existence not just selves; shows New Era beginning through vow accepting Francisco responsibility; establishes organization persisting centuries timeline.',
      sensoryDetail: 'Aftermath moment, shaken feeling, resolute determination, timeline protecting oath, swearing commitment, not just themselves, existence protecting, Order of Eternal naming, Francisco vow accepting, Circle symbolism, Vow ritual, resolution completing, Order birth, solemnity atmosphere, ritualistic ceremony, kneeling figures, setting sun, stone courtyard, responsibility weight settling.',
      internalConflict: 'Francisco experiencing solemnity—accepting Order Eternal vows twelve swearing protect timeline existence, feeling responsibility weight settling New Era beginning, completing Magus transformation Hierophant spiritual intellectual leader founding organization persisting centuries.',
      characterGrowthElement: 'Francisco achieving Magus completion—accepting Order of Eternal vows twelve swearing timeline existence protection, establishing New Era spiritual intellectual leader Hierophant, founding organization persisting centuries timeline demonstrating ultimate threshold crossing transformation complete no longer Francisco.',
      seriesConnectionResonance: 'Order of Eternal founding persisting centuries timeline establishing; New Era beginning Major Arcana transformation completing; organization rebellion structure formalizing; timeline existence protection oath sacred establishing; Magus identity complete Hierophant spiritual leader; threshold crossing Hero Journey.',
      sceneCardProgression: 289,
      realWorldContext: 'Order founding ceremony, oath sacred commitment, New Era beginning responsibility.',
      timelineSignificance: '6/8/1321 sunset—evening after noon Illumination vision, twelve swearing Order Eternal oath protecting timeline existence, Francisco accepting vows Magus complete Hierophant, New Era beginning organization persisting centuries threshold crossed.',
      saveTheCatBeat: truncate('Threshold Crossing - Order born Magus complete', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'ritualistic_solemn',
        narrative_mode: 'solemn_resolute',
      }),
      learning_objectives: JSON.stringify([
        'Order founding ceremony ritual mastery',
        'Oath sacred commitment understanding',
        'New Era beginning responsibility acceptance',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Order persisting centuries timeline',
        'Organization continuing Book 4',
        'Magus spiritual leader established',
      ]),
    },
  ];

  // Process each scene
  for (let i = 0; i < sceneData.length; i++) {
    const scene = sceneData[i];
    const enhancement = enhancements[i];

    console.log(`\n📝 Processing Scene ${scene.scene_number}: ${scene.scene_title}`);

    // Insert base scene data
    const [insertedScene] = await db
      .insert(scenes)
      .values({
        chapterId: chapter.id,
        chapterUniqueIdentifier: 'EA-093',
        sceneNumber: scene.scene_number,
        title: scene.scene_title,
        setup: scene.setup,
        symbolism: scene.symbolism,
        beatGoal: scene.beat_goal,
        pov: scene.pov,
        tense: scene.tense,
        core_emotion: scene.core_emotion,
        scene_tone: scene.scene_tone,
        timeline_date: scene.timeline_date,
        timeline_variant: scene.timeline_variant,
        location: scene.location,
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
        saveTheCatBeat: enhancement.saveTheCatBeat,
        sudowrite_metadata: enhancement.sudowrite_metadata,
        learning_objectives: enhancement.learning_objectives,
        foreshadowing_elements: enhancement.foreshadowing_elements,
      })
      .where(eq(scenes.id, insertedScene.id));

    console.log(`   ✅ Updated with enhanced narrative fields`);
  }

  // Verify all scenes have complete data
  console.log('\n\n🔍 Verifying field completion...\n');

  const allScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  for (const scene of allScenes) {
    const fields = Object.keys(scene);
    const populatedFields = fields.filter(key => {
      const value = scene[key as keyof typeof scene];
      return value !== null && value !== undefined;
    });

    const requiredFields = 31;
    const presentCount = populatedFields.length;
    const missingCount = requiredFields - presentCount;

    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ✅ Present: ${presentCount}/${requiredFields}`);
    if (missingCount > 0) {
      console.log(`   ❌ Missing: ${missingCount}/${requiredFields}`);
    }
  }

  console.log(`\n✅ EA-093 import complete!`);
  console.log(`\n🔑 The Hierophant transformation - The Order of the Eternal is born, the Magus is complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
