import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-085: Severing Ties (Book 3, Chapter 5)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-085'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-085 not found. Run create-ea-085-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Resignation',
      setup: 'University of Bologna. Night. Francisco slips into the Dean\'s office. He places the letter on the desk. He looks at his nameplate: \'Professor Petrarch\'. He takes it and drops it in the trash.',
      symbolism: 'The Nameplate. The shedding of the Title.',
      beat_goal: 'The Professional Death. Cutting the career tie.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Regret',
      scene_tone: 'Quiet',
      timeline_date: '5/10/1321 - Night',
      timeline_variant: 'University',
      location: 'Dean\'s Office',
    },
    {
      scene_number: 2,
      scene_title: 'The Unsent Letter',
      setup: 'Francisco sits in a tavern, writing by candlelight. He describes why he has to leave. He tells his parents he loves them. He tries to explain the magic without sounding mad. Then he stops. sending it would endanger them. He folds it up.',
      symbolism: 'The Sealed Letter. Communication cut.',
      beat_goal: 'The Emotional Death. Formatting the closure.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Grief',
      scene_tone: 'Intimate',
      timeline_date: '5/10/1321 - Early Morning',
      timeline_variant: 'Tavern',
      location: 'Corner Table',
    },
    {
      scene_number: 3,
      scene_title: 'The Ritual',
      setup: 'River Reno. Dawn is just a gray line. Francisco builds a small fire. He throws the letter in. Then his journals. The knowledge burns. He watches the ashes float on the water.',
      symbolism: 'The Ten of Swords (Dawn after darkness). Transformation by Fire.',
      beat_goal: 'The Release. The physical act of letting go.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Empty',
      scene_tone: 'Ritualistic',
      timeline_date: '5/10/1321 - Dawn',
      timeline_variant: 'Riverbank',
      location: 'River Reno',
    },
    {
      scene_number: 4,
      scene_title: 'The Departure',
      setup: 'Sun up. Francisco stands on the hill overlooking Bologna. No luggage, just his cloak and his tools. He turns away. La Signora is waiting for him with a carriage. \'Ready?\' she asks. \'No,\' he says. \'But let\'s go.\'',
      symbolism: 'The Turning Back. The New Horizon.',
      beat_goal: 'Resolution. Acceptance of the new path.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Resignation',
      scene_tone: 'Cinematic',
      timeline_date: '5/10/1321 - Morning',
      timeline_variant: 'Hilltop',
      location: 'Road out of Bologna',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 61 - 65',
      description: 'University night Francisco slipping Dean office—resignation letter placing desk nameplate Professor-Petrarch looking—trash dropping takes as Nameplate Title-shedding Professional-Death career-tie cutting Official-End regret quiet Essentialism non-essential eliminating ghost-moving Xavi-erasing Magus-living reaction hitting-bottom.',
      focus: 'Professional Death cutting career tie through resignation.',
      chapterSceneFocus: 'Ch85S1: University night Francisco Dean office slipping resignation placing nameplate Professor-Petrarch looking trash dropping as Nameplate Title-sheds Professional-Death career-cuts Official-End regret quiet Essentialism non-essential eliminates ghost Xavi-erases Magus reaction.',
      preliminarySceneFocus: 'Nameplate Title-sheds quiet regret',
      preliminarySceneDescription: 'Professional Death career-cuts eliminating non-essential',
      narrativeFunction: 'Establishes identity erasure beginning; demonstrates professional ties severing; shows Essentialism practice; creates ghost-like movement.',
      sensoryDetail: 'University night, Dean office slipping, resignation letter, desk placement, nameplate Professor Petrarch, looking at, trash dropping, title shedding, career tie cutting, old paper smell, wax scent, former ambition place.',
      internalConflict: 'Francisco experiencing regret—cutting career ties permanently, erasing Professor Petrarch identity, eliminating non-essential academic life for Magus necessity.',
      characterGrowthElement: 'Francisco becoming Ghost—erasing Xavi Petrarch so Magus can live, practicing Essentialism eliminating non-essential, severing professional ties through quiet resignation.',
      seriesConnectionResonance: 'Missing years beginning; official absence from history; disappearance logistics explaining; Ten Swords hitting bottom; identity erasure starting.',
      sceneCardProgression: 254,
      realWorldContext: 'Essentialism non-essential elimination, identity shedding, professional closure.',
      timelineSignificance: '5/10/1321 night—post-trauma hours later, Francisco resigning from University beginning identity erasure, Ten Swords reaction starting.',
      saveTheCatBeat: truncate('Reaction - professional identity erased', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'low-medium',
        pacing: 'quiet_ghostly',
        narrative_mode: 'regretful_necessity',
      }),
      learning_objectives: JSON.stringify([
        'Essentialism non-essential elimination practice',
        'Professional closure ritual understanding',
        'Identity shedding necessity recognition',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Unsent letter writing',
        'Emotional closure seeking',
        'Journal burning ritual',
      ]),
    },
    {
      pages: 'Page 65 - 68',
      description: 'Francisco tavern sitting candlelight writing—leaving why describing parents loving telling—magic explaining mad not-sounding—stopping sending endanger-would folding as Sealed-Letter Communication-cut Emotional-Death closure-formatting Internal-Monologue grief intimate quill scratching wax dripping tear ink-blotting unsent danger-protecting.',
      focus: 'Emotional Death formatting closure through unsent letter.',
      chapterSceneFocus: 'Ch85S2: Francisco tavern candlelight writing leaving why parents loving—magic explaining mad-not—stopping endanger-sending folding as Sealed-Letter Communication-cuts Emotional-Death closure-formats Internal-Monologue grief intimate quill scratching wax dripping tear ink unsent protects.',
      preliminarySceneFocus: 'Sealed-Letter cuts Communication grief',
      preliminarySceneDescription: 'Emotional Death formats closure intimately unsent',
      narrativeFunction: 'Demonstrates emotional closure attempt; shows parental love expression; creates unsent protection decision; establishes grief processing.',
      sensoryDetail: 'Tavern sitting, candlelight writing, leaving explanation, parental love expression, magic explanation attempt, madness avoiding, stopping writing, sending danger recognition, folding letter, quill scratching, wax dripping table, tear blotting ink.',
      internalConflict: 'Francisco experiencing grief—wanting to explain departure to parents, expressing love through letter, recognizing sending would endanger them, choosing silence for protection.',
      characterGrowthElement: 'Francisco processing grief through unsent letter—explaining magic impossibly, expressing parental love, choosing their safety over closure communication, formatting emotional death.',
      seriesConnectionResonance: 'Emotional closure ritual; parental protection choosing; unsent communication burden; grief processing demonstrating; missing years explaining.',
      sceneCardProgression: 255,
      realWorldContext: 'Emotional closure seeking, protective silence, grief expression writing.',
      timelineSignificance: '5/10/1321 early morning—tavern letter writing, emotional closure attempting, parental protection choosing over communication.',
      saveTheCatBeat: truncate('Reaction - emotional closure attempted unsent', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'intimate_writing',
        narrative_mode: 'grieving_protective',
      }),
      learning_objectives: JSON.stringify([
        'Emotional closure ritual importance',
        'Protective silence necessity understanding',
        'Grief expression through writing',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Letter burning ritual',
        'Journal destruction',
        'Transformation by fire',
      ]),
    },
    {
      pages: 'Page 68 - 72',
      description: 'River Reno dawn gray-line—Francisco fire building letter throwing journals then—knowledge burning ashes water-floating watching as Ten Swords Dawn-after-darkness Transformation-Fire releases physical letting-go climaxes empty ritualistic Letting-Go surrender dawn-after hitting-bottom rising-can worst-happened freedom strange-relief.',
      focus: 'Release physical letting go through burning ritual.',
      chapterSceneFocus: 'Ch85S3: River Reno dawn gray Francisco fire building letter throwing journals knowledge burning ashes floating as Ten Swords Dawn-darkness Transformation-Fire releases letting-go climaxes empty ritualistic Letting-Go surrender hitting-bottom rising worst-happened freedom relief strange.',
      preliminarySceneFocus: 'Ten Swords Dawn-Fire transforms empty',
      preliminarySceneDescription: 'Burning releases letting-go ritualistic surrender',
      narrativeFunction: 'Climaxes identity erasure; demonstrates Ten of Swords transformation; shows knowledge destruction ritual; creates strange relief freedom.',
      sensoryDetail: 'River Reno, dawn gray line, fire building, letter throwing, journals burning, knowledge destroying, ashes floating water, Ten Swords, dawn after darkness, transformation by fire, physical letting go, empty feeling, ritualistic burning.',
      internalConflict: 'Francisco experiencing emptiness—burning letter and journals destroying past knowledge, feeling swords responsibility pinning down, experiencing strange relief from hitting bottom freedom.',
      characterGrowthElement: 'Francisco achieving Ten of Swords transformation—burning past completely, surrendering through Letting Go practice, hitting bottom enabling rise, finding freedom in worst-happened acceptance.',
      seriesConnectionResonance: 'Burned secrets returning Book 6; knowledge destruction ritual; Ten Swords dawn after darkness; hitting bottom transformation; missing years physical evidence destruction.',
      sceneCardProgression: 256,
      realWorldContext: 'Letting Go surrender practice, ritual burning catharsis, hitting bottom freedom.',
      timelineSignificance: '5/10/1321 dawn—River Reno burning journals and letter, Ten Swords transformation ritual, hitting bottom enabling rise through destruction.',
      saveTheCatBeat: truncate('Reaction - past burned transformation ritual', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'ritualistic_cathartic',
        narrative_mode: 'empty_relieved',
      }),
      learning_objectives: JSON.stringify([
        'Letting Go surrender practice mastery',
        'Ritual burning cathartic transformation',
        'Hitting bottom freedom recognition',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Bologna hilltop viewing',
        'La Signora carriage waiting',
        'New path acceptance',
      ]),
    },
    {
      pages: 'Page 72 - 75',
      description: 'Sun up Francisco hill Bologna-overlooking standing—luggage no cloak tools just—turning-away La-Signora carriage waiting Ready asking No saying But-lets-go as Turning-Back New-Horizon resolves new-path accepting resignation cinematic roofs red-tile sun glowing staff hand-tightening understanding nod bridge Chapter-6 departure Ghost complete.',
      focus: 'Resolution accepting new path through departure.',
      chapterSceneFocus: 'Ch85S4: Sun Francisco hill Bologna-overlooking no-luggage cloak tools—turning La-Signora carriage waiting Ready No But-go as Turning-Back New-Horizon resolves path-accepts resignation cinematic roofs glowing staff tightening nod understanding bridge Ch-6 departure Ghost completes.',
      preliminarySceneFocus: 'Turning-Back New-Horizon resolves cinematic',
      preliminarySceneDescription: 'Departure accepts new-path resignedly understanding',
      narrativeFunction: 'Resolves identity erasure arc; demonstrates new path acceptance; introduces La Signora guide; bridges to Chapter 6 infiltration beginning.',
      sensoryDetail: 'Sun up, Francisco standing, hill overlooking Bologna, no luggage, cloak tools only, turning away, La Signora, carriage waiting, Ready question, No answer, But lets go, red tile roofs, sun glowing, staff hand tightening, understanding nod.',
      internalConflict: 'Francisco experiencing resignation—not ready but going anyway, accepting new path despite unpreparedness, understanding no return from identity erasure.',
      characterGrowthElement: 'Francisco completing Ghost transformation—accepting new path with La Signora, acknowledging unreadiness while committing anyway, turning back on Bologna embracing New Horizon infiltration.',
      seriesConnectionResonance: 'Missing years official beginning; La Signora truth-knowing guide; new path acceptance; Ghost identity complete; Chapter 6 bridge to infiltration; Bologna departure final.',
      sceneCardProgression: 257,
      realWorldContext: 'New path acceptance despite unreadiness, guide trusting, final departure.',
      timelineSignificance: '5/10/1321 morning—Bologna hilltop final viewing, La Signora carriage departure, new path accepting despite unreadiness, Ghost identity complete beginning infiltration.',
      saveTheCatBeat: truncate('Reaction - new path accepted departure', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'cinematic_departure',
        narrative_mode: 'resigned_commitment',
      }),
      learning_objectives: JSON.stringify([
        'New path acceptance despite unreadiness',
        'Guide trusting necessity understanding',
        'Final departure commitment execution',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Chapter 6 infiltration beginning',
        'La Signora guide role',
        'Magus identity full embrace',
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
        chapterUniqueIdentifier: 'EA-085',
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

  console.log(`\n✅ EA-085 import complete!`);
  console.log(`\n🔥 The Ten of Swords transformation is complete - Francisco has burned his past and embraced the future.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
