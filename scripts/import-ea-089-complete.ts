import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-089: Calming Guidance (Book 3, Chapter 9)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-089'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-089 not found. Run create-ea-089-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Charter',
      setup: 'The docks. Fog. Francisco pays the boatman with the last of his university coin. He helps the family onboard. They are terrified. He speaks softly. \'You are safe with me.\'',
      symbolism: 'The Ferry. Leaving the shore.',
      beat_goal: 'The Departure. Establishing the mission.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Protective',
      scene_tone: 'Secretive',
      timeline_date: '6/4/1321 - Night',
      timeline_variant: 'River Docks',
      location: 'The Boat',
    },
    {
      scene_number: 2,
      scene_title: 'The Sickness',
      setup: 'Mid-river. The mother starts shaking. Temporal radiation. Francisco kneels. He can\'t heal it, but he can stabilize it. He places his hands on her. He guides her breath. \'In... Out... The time is here. The time is now.\'',
      symbolism: 'The Healer. The Breath.',
      beat_goal: 'The Crisis. Using magic for care.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Compassion',
      scene_tone: 'Intimate',
      timeline_date: '6/4/1321 - Midnight',
      timeline_variant: 'The Boat',
      location: 'Deck',
    },
    {
      scene_number: 3,
      scene_title: 'The Discussion',
      setup: 'The father asks Francisco why he is helping. \'I thought you were one of them.\' Francisco looks at the water. \'I was. Now I am just... moving.\' He explains the Six of Swords philosophy: You have to carry the swords (pain) with you, but you don\'t have to let them sink the boat.',
      symbolism: 'The Swords in the Boat. Baggage.',
      beat_goal: 'The Philosophy. Articulating the theme.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Melancholy',
      scene_tone: 'Philosophical',
      timeline_date: '6/4/1321 - 0200 Hours',
      timeline_variant: 'The Boat',
      location: 'Stern',
    },
    {
      scene_number: 4,
      scene_title: 'The Arrival',
      setup: 'Dawn. They reach the sanctuary (an old monastery). The water is calm. The journey is over for now. Francisco helps them off. He looks back at the river. He is ready for the next phase. He has found his center.',
      symbolism: 'The Far Shore. Safety.',
      beat_goal: 'Resolution. End of the immediate danger.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Calm',
      scene_tone: 'Hopeful',
      timeline_date: '6/4/1321 - Dawn',
      timeline_variant: 'Sanctuary',
      location: 'The Dock',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 121 - 125',
      description: 'Docks fog—Francisco boatman paying university-coin last family onboard helping terrified—softly speaking you-are-safe-with-me as Ferry shore-leaving departure mission-establishing protective secretive Emotional-Intelligence empathy transition Six-Swords journey-beginning EA-087-paradox refugees displaced.',
      focus: 'Departure establishing mission through ferry boarding.',
      chapterSceneFocus: 'Ch89S1: Docks fog Francisco boatman paying university-coin last family onboard helping terrified softly speaking you-safe-with-me as Ferry shore-leaving departure mission-establishes protective secretive Emotional-Intelligence empathy transition Six-Swords journey refugees EA-087-paradox displaced.',
      preliminarySceneFocus: 'Ferry shore-leaving protective secretive',
      preliminarySceneDescription: 'Departure establishes mission boarding refugee protecting',
      narrativeFunction: 'Establishes Six of Swords journey beginning; demonstrates Francisco protecting EA-087 paradox displaced refugees; shows Emotional Intelligence empathy practice; creates transition from trial to sanctuary.',
      sensoryDetail: 'Docks setting, fog atmosphere, Francisco presence, boatman paying, university coin last, family onboard helping, terrified refugees, softly speaking, you are safe with me promise, Ferry symbolism, shore leaving, departure beginning.',
      internalConflict: 'Francisco experiencing protective instinct—using last university coin for refugee safety, speaking softly to terrified family, accepting guide role instead of escaping alone.',
      characterGrowthElement: 'Francisco becoming Guide—stopping victim role starting leadership, protecting EA-087 paradox displaced family mirroring lost family, applying Emotional Intelligence empathy choosing responsibility over escape.',
      seriesConnectionResonance: 'Sanctuary Book 4 base establishing; human cost magic wars showing; magus responsibility defining; Six of Swords calm guidance introducing; refugee family protection beginning.',
      sceneCardProgression: 270,
      realWorldContext: 'Emotional Intelligence empathy practice, protective responsibility, sacrifice for others.',
      timelineSignificance: '6/4/1321 night—day after EA-088 trial escape, Francisco chartering boat for EA-087 displaced refugees, Six of Swords journey beginning river transition.',
      saveTheCatBeat: truncate('Refusal Call - accepting guide protector role', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'secretive_departure',
        narrative_mode: 'protective_committed',
      }),
      learning_objectives: JSON.stringify([
        'Emotional Intelligence empathy application',
        'Protective responsibility acceptance',
        'Guide role transformation beginning',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Temporal radiation sickness',
        'Mother shaking crisis',
        'Breath guidance teaching',
      ]),
    },
    {
      pages: 'Page 125 - 129',
      description: 'Mid-river mother shaking-starts temporal-radiation—Francisco kneeling healing-cant stabilizing-can hands-placing breath-guiding In-Out time-here time-now as Healer Breath crisis magic-care compassion intimate Wherever-You-Go mindfulness bonding temporal-sickness calming-guidance teaching.',
      focus: 'Crisis using magic care through breath guidance.',
      chapterSceneFocus: 'Ch89S2: Mid-river mother shaking-starts temporal-radiation Francisco kneeling healing-cant stabilizing-can hands-placing breath-guiding In-Out time-here time-now as Healer Breath crisis magic-care compassion intimate Wherever-You-Go mindfulness bonding temporal-sickness calming teaching.',
      preliminarySceneFocus: 'Healer Breath compassion intimate',
      preliminarySceneDescription: 'Crisis cares magic breathing guiding compassionately',
      narrativeFunction: 'Demonstrates Calming Guidance breathwork teaching; shows magic used for healing not fighting; creates bonding through compassionate care; establishes Wherever You Go mindfulness practice.',
      sensoryDetail: 'Mid-river setting, mother shaking, temporal radiation sickness, Francisco kneeling, healing impossibility, stabilizing capability, hands placing, breath guiding, In Out rhythm, time here time now mantra, Healer symbolism, Breath focus, compassionate care.',
      internalConflict: 'Francisco experiencing compassion—unable to heal temporal radiation but stabilizing through breath guidance, using magic gently for care not combat, teaching mindfulness present moment.',
      characterGrowthElement: 'Francisco embodying Healer Guide—teaching Calming Guidance breathwork for temporal sickness, applying Wherever You Go mindfulness present moment awareness, using magic compassionately for care bonding with refugee family.',
      seriesConnectionResonance: 'Calming Guidance technique establishing series tool; magic healing application showing; temporal radiation sickness mechanics defining; mindfulness practice demonstrating; compassionate Francisco revealing post-trial.',
      sceneCardProgression: 271,
      realWorldContext: 'Wherever You Go mindfulness practice, breathwork calming technique, compassionate caregiving.',
      timelineSignificance: '6/4/1321 midnight—mid-river journey, mother experiencing temporal radiation sickness, Francisco teaching Calming Guidance breathwork stabilizing crisis through mindfulness.',
      saveTheCatBeat: truncate('Refusal Call - magic care not combat', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'intimate_caring',
        narrative_mode: 'compassionate_present',
      }),
      learning_objectives: JSON.stringify([
        'Wherever You Go mindfulness mastery',
        'Calming Guidance breathwork technique',
        'Compassionate magic application',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Six Swords philosophy discussion',
        'Father questioning help',
        'Pain baggage carrying',
      ]),
    },
    {
      pages: 'Page 129 - 132',
      description: 'Father asking Francisco helping-why I-thought-you-were-one-of-them—water looking I-was now-just-moving—Six-Swords philosophy explaining swords-pain carry-must boat-sink letting-not as Swords-Boat Baggage philosophy theme-articulating melancholy philosophical water-ripple bread-offering mist-clearing theme-statement.',
      focus: 'Philosophy articulating theme through Six Swords explanation.',
      chapterSceneFocus: 'Ch89S3: Father asking Francisco helping-why thought-one-of-them water looking I-was now-just-moving Six-Swords philosophy explaining swords-pain carry-must boat-sink letting-not as Swords-Boat Baggage philosophy theme-articulates melancholy philosophical water-ripple bread-offering mist-clearing theme.',
      preliminarySceneFocus: 'Swords-Boat Baggage melancholy philosophical',
      preliminarySceneDescription: 'Philosophy articulates theme explaining Six-Swords carrying',
      narrativeFunction: 'Articulates Six of Swords core philosophy; demonstrates Francisco defining new identity through movement; creates theme statement about carrying pain without sinking; establishes father connection through bread offering.',
      sensoryDetail: 'Father asking, Francisco helping questioned, I thought you were one of them accusation, water looking, I was now just moving response, Six Swords philosophy, swords pain metaphor, carrying necessity, boat sinking prevention, water ripple, bread offering, mist clearing slightly.',
      internalConflict: 'Francisco experiencing melancholy—questioned about helping despite being one of them formerly, articulating new identity through movement not affiliation, explaining Six of Swords baggage philosophy carrying pain wisely.',
      characterGrowthElement: 'Francisco articulating Guide philosophy—explaining Six of Swords principle carrying swords pain without letting sink boat, defining identity through movement not past affiliation, accepting melancholy wisdom sharing with father bonding.',
      seriesConnectionResonance: 'Six of Swords philosophy establishing series principle; baggage carrying wisdom articulating; identity movement not affiliation defining; father bread offering connection creating; theme statement pain management.',
      sceneCardProgression: 272,
      realWorldContext: 'Six of Swords baggage philosophy, identity through movement, pain wise carrying.',
      timelineSignificance: '6/4/1321 0200 hours—2am boat journey, Francisco articulating Six of Swords philosophy to questioning father, defining new identity through movement explaining pain baggage carrying wisdom.',
      saveTheCatBeat: truncate('Refusal Call - philosophy articulated movement', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'philosophical_reflective',
        narrative_mode: 'melancholy_wise',
      }),
      learning_objectives: JSON.stringify([
        'Six of Swords philosophy understanding',
        'Pain baggage wise carrying',
        'Identity movement not affiliation defining',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Sanctuary monastery arrival',
        'Calm water reaching',
        'Center finding readiness',
      ]),
    },
    {
      pages: 'Page 132 - 135',
      description: 'Dawn sanctuary-reaching old-monastery water-calm journey-over-now—Francisco helping-off river looking-back next-phase ready center-found as Far-Shore Safety resolution danger-ended calm hopeful monastery-stone-walls birds-singing water-stillness bridge-Ch10 protector-role accepted Guide-complete.',
      focus: 'Resolution ending danger through sanctuary arrival.',
      chapterSceneFocus: 'Ch89S4: Dawn sanctuary-reaching old-monastery water-calm journey-over Francisco helping-off river looking-back next-phase ready center-found as Far-Shore Safety resolution danger-ended calm hopeful monastery-stone birds-singing water-stillness bridge-Ch10 protector-role accepted Guide-complete.',
      preliminarySceneFocus: 'Far-Shore Safety calm hopeful',
      preliminarySceneDescription: 'Arrival resolves danger sanctuary reaching center-found',
      narrativeFunction: 'Resolves Six of Swords journey arrival; demonstrates Francisco finding center through guiding; creates sanctuary Book 4 base establishing; bridges to Chapter 10 next phase readiness.',
      sensoryDetail: 'Dawn breaking, sanctuary reaching, old monastery, water calm, journey over now, Francisco helping off, river looking back, next phase ready, center found, Far Shore symbolism, Safety arrival, monastery stone walls, birds singing, water stillness.',
      internalConflict: 'Francisco experiencing calm—journey over with refugees safe, looking back at river symbolically, feeling center found through guide role, ready for next phase with protector identity accepted.',
      characterGrowthElement: 'Francisco completing Guide transformation—reaching sanctuary Far Shore with refugees safe, finding center through protective leadership, accepting protector role replacing victim identity, ready for next phase Book 4 base established.',
      seriesConnectionResonance: 'Sanctuary Book 4 base establishing location; Six of Swords completion calm waters; protector role acceptance defining; center finding through leadership; Guide identity solidifying replacing Technician coldness; next phase readiness.',
      sceneCardProgression: 273,
      realWorldContext: 'Center finding through service, protector role acceptance, calm leadership.',
      timelineSignificance: '6/4/1321 dawn—river journey complete, Francisco reaching sanctuary monastery with refugees safe, Six of Swords journey ending center found protector role accepted ready next phase.',
      saveTheCatBeat: truncate('Refusal Call - protector accepted center found', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'hopeful_arrival',
        narrative_mode: 'calm_centered',
      }),
      learning_objectives: JSON.stringify([
        'Center finding through service',
        'Protector role acceptance completion',
        'Six of Swords calm arrival mastery',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Sanctuary Book 4 base',
        'Next phase beginning Chapter 10',
        'Guide identity continuing',
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
        chapterUniqueIdentifier: 'EA-089',
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

  console.log(`\n✅ EA-089 import complete!`);
  console.log(`\n⛵ The Six of Swords journey is complete - Francisco has found his center as a protector and guide!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
