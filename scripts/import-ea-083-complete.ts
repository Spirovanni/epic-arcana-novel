import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-083: Introspection (Book 3, Chapter 3)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-083'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-083 not found. Run create-ea-083-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Walk',
      setup: 'Francisco walks through the student quarter. He sees the life he could have had. Marriage, tenure, comfort. It is beautiful. But it feels \'flat\'. The Eight of Cups isn\'t about leaving bad things; it\'s about leaving *good* things because they aren\'t *enough*.',
      symbolism: 'The stacked cups left behind. The moon overhead.',
      beat_goal: 'The Farewell. Letting go of the \'Normal\'.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Bittersweet',
      scene_tone: 'Nostalgic',
      timeline_date: '5/9/1321 - Night',
      timeline_variant: 'Bologna Streets',
      location: 'Student Quarter',
    },
    {
      scene_number: 2,
      scene_title: 'The Voice',
      setup: 'He stops at the Two Towers. The shadows lengthen. A figure steps out. It\'s Dante (or a homeless man who looks like him). \'You are looking for the path,\' the figure says. \'It is not on the map.\' Francisco realizes his guide is his own intuition.',
      symbolism: 'The Hermit (Book 9 foreshadowing). The Inner Voice.',
      beat_goal: 'The Confirmation. Spiritual alignment.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Clarity',
      scene_tone: 'Mystical',
      timeline_date: '5/9/1321 - Midnight',
      timeline_variant: 'Two Towers',
      location: 'Piazza di Porta Ravegnana',
    },
    {
      scene_number: 3,
      scene_title: 'The Insight',
      setup: 'He sits on a bench. He reviews his motives. Why infiltrate? Revenge? No. Curiosity? Partly. Duty? Yes. He realizes he cannot let the timeline be a cage. He fights for Free Will. This purpose gives him the strength to walk away from safety.',
      symbolism: 'The Staff. The Cloak. Taking up the burden.',
      beat_goal: 'The Motivation. Solidifying the \'Why\'.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Determination',
      scene_tone: 'Internal',
      timeline_date: '5/10/1321 - 0100 Hours',
      timeline_variant: 'The Bench',
      location: 'City Park',
    },
    {
      scene_number: 4,
      scene_title: 'The Decision',
      setup: 'He stands up. He turns his back on the University. He faces the direction of the Colonna Palace. He doesn\'t look back. The Eight of Cups is complete. He has left the emotional shore and is heading into the dark water.',
      symbolism: 'Crossing the Line. The Point of No Return.',
      beat_goal: 'The Action. Moving toward the danger.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Focus',
      scene_tone: 'Final',
      timeline_date: '5/10/1321 - 0200 Hours',
      timeline_variant: 'The Road',
      location: 'Via Zamboni',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 31 - 35',
      description: 'Francisco student-quarter walking life seeing could-have-had—marriage tenure comfort beautiful but flat-feeling—Eight Cups leaving not-bad leaving good not-enough as stacked cups moon overhead farewells letting-go Normal bittersweet nostalgic Untethered Soul emotional beat introspection begins ordinary-world shedding attachments.',
      focus: 'Farewell letting go Normal through Eight Cups introspection.',
      chapterSceneFocus: 'Ch83S1: Francisco quarter walking life could-have marriage tenure comfort beautiful flat—Eight Cups leaving good not-enough as stacked moon farewells letting Normal bittersweet nostalgic Untethered Soul emotional introspection ordinary sheds.',
      preliminarySceneFocus: 'Stacked cups moon farewells bittersweet',
      preliminarySceneDescription: 'Eight Cups leaves good not-enough nostalgically',
      narrativeFunction: 'Establishes Eight of Cups journey; demonstrates leaving good things; shows introspection beginning; creates nostalgic farewell.',
      sensoryDetail: 'Student quarter walking, life could-have-had seeing, marriage possibility, tenure comfort, beautiful appearance, flat feeling, Eight Cups not bad leaving, good things insufficient, stacked cups, moon overhead, Normal letting go.',
      internalConflict: 'Francisco experiencing bittersweet emotion—seeing beautiful life possible but feeling flat insufficient, recognizing good not enough for truth seeking.',
      characterGrowthElement: 'Francisco embodying Eight of Cups—leaving good things because insufficient for higher purpose, using Untethered Soul letting-go practice, beginning Ascetic shedding attachments.',
      seriesConnectionResonance: 'Eight Cups journey establishing; Hermit path foreshadowing; emotional detachment beginning; introspection self-awareness demonstrating; ordinary world leaving.',
      sceneCardProgression: 246,
      realWorldContext: 'Untethered Soul letting-go practice, introspection self-awareness, attachment shedding.',
      timelineSignificance: '5/9/1321 night—Francisco walking student quarter seeing life could-have-had, Eight Cups journey beginning leaving good for truth.',
      saveTheCatBeat: truncate('Setup - Eight Cups farewell to Normal', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'nostalgic_walking',
        narrative_mode: 'bittersweet_introspection',
      }),
      learning_objectives: JSON.stringify([
        'Untethered Soul letting-go practice',
        'Eight of Cups leaving good things',
        'Introspection self-awareness cultivation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Dante spirit guide meeting',
        'Inner voice confirmation',
        'Free Will motivation solidifying',
      ]),
    },
    {
      pages: 'Page 35 - 39',
      description: 'Two Towers stopping shadows lengthening—Dante figure stepping \'path looking map not-on\'—own-intuition guide realizing as Hermit Inner Voice confirms spiritual-alignment clarity mystical leaning tower starfield ragged cloak bells distant insight voice Book 9 foreshadows subconscious projection validates.',
      focus: 'Confirmation spiritual alignment through inner voice intuition.',
      chapterSceneFocus: 'Ch83S2: Two Towers shadows Dante stepping \'path map not-on\' intuition guide realizing as Hermit Inner Voice confirms spiritual-alignment clarity mystical tower starfield cloak bells insight voice Book 9 foreshadows subconscious validates projection.',
      preliminarySceneFocus: 'Hermit Inner Voice confirms mystical',
      preliminarySceneDescription: 'Spiritual alignment intuition guides clarifying mystically',
      narrativeFunction: 'Introduces Dante spirit guide; demonstrates inner voice intuition; provides spiritual confirmation; foreshadows Book 9 Hermit.',
      sensoryDetail: 'Two Towers stopping, shadows lengthening, Dante figure, stepping out, path looking, map not-on, own intuition, guide realization, leaning tower, starfield, ragged cloak, bells distant, spiritual alignment, clarity mystical.',
      internalConflict: 'Francisco experiencing clarity—recognizing own intuition as guide, receiving spiritual confirmation from subconscious projection, aligning purpose.',
      characterGrowthElement: 'Francisco meeting Dante as spirit guide—recognizing inner voice as true guide beyond maps, receiving subconscious validation for infiltration choice, foreshadowing Hermit journey Book 9.',
      seriesConnectionResonance: 'Hermit Book 9 foreshadowing; inner voice intuition establishing; Dante spirit guide introduction; spiritual alignment demonstrating; subconscious projection validation.',
      sceneCardProgression: 247,
      realWorldContext: 'Inner voice intuition trust, spiritual alignment, subconscious guidance.',
      timelineSignificance: '5/9/1321 midnight—Two Towers meeting Dante spirit guide, inner voice confirming path, spiritual alignment achieved.',
      saveTheCatBeat: truncate('Setup - spiritual confirmation received', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'mystical_revelation',
        narrative_mode: 'clarity_alignment',
      }),
      learning_objectives: JSON.stringify([
        'Inner voice intuition recognition',
        'Spiritual alignment achievement',
        'Subconscious guidance trust',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Motive review coming',
        'Free Will purpose solidifying',
        'Point of no return approaching',
      ]),
    },
    {
      pages: 'Page 39 - 42',
      description: 'Bench sitting motives reviewing—infiltrate why? revenge no curiosity partly duty yes—timeline cage cannot Free-Will fighting—purpose strength safety walk-away giving as Staff Cloak burden taking motivates solidifies Why determination internal Emotional Intelligence self-awareness steel introspection sense-of-destiny risks everything.',
      focus: 'Motivation solidifying Why through Free Will purpose.',
      chapterSceneFocus: 'Ch83S3: Bench sitting motives reviewing infiltrate why revenge-no curiosity-partly duty-yes—timeline cage Free-Will fighting purpose strength safety walk-away as Staff Cloak burden motivates Why determination internal Emotional Intelligence self-awareness steel destiny risks.',
      preliminarySceneFocus: 'Staff Cloak motivates burden determination',
      preliminarySceneDescription: 'Free Will purpose solidifies internal self-aware',
      narrativeFunction: 'Solidifies motivation for infiltration; demonstrates Free Will purpose; shows Emotional Intelligence self-awareness; creates internal steel.',
      sensoryDetail: 'Bench sitting, motives reviewing, infiltrate why, revenge no, curiosity partly, duty yes, timeline cage cannot, Free Will fighting, purpose giving strength, safety walk-away, Staff symbol, Cloak burden, taking up, motivation solidifying.',
      internalConflict: 'Francisco experiencing determination—reviewing motives honestly, recognizing Free Will purpose over revenge or curiosity, accepting burden for higher cause.',
      characterGrowthElement: 'Francisco using Emotional Intelligence self-awareness—reviewing motives deeply, solidifying Free Will fighting purpose against timeline cage, taking up Staff and Cloak burden for sense of destiny.',
      seriesConnectionResonance: 'Free Will theme establishing; timeline cage fighting; Emotional Intelligence self-awareness; sense of destiny motivation; emotional preparation for betrayal.',
      sceneCardProgression: 248,
      realWorldContext: 'Emotional Intelligence self-awareness, purpose clarification, burden acceptance.',
      timelineSignificance: '5/10/1321 0100 hours—Francisco reviewing motives, solidifying Free Will fighting purpose, emotional preparation for Vatican infiltration.',
      saveTheCatBeat: truncate('Setup - Free Will purpose solidified', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'internal_reflection',
        narrative_mode: 'determined_clarity',
      }),
      learning_objectives: JSON.stringify([
        'Emotional Intelligence self-awareness practice',
        'Purpose clarification methodology',
        'Burden acceptance for higher cause',
      ]),
      foreshadowing_elements: JSON.stringify([
        'University back-turning',
        'Palace direction facing',
        'Point of no return crossing',
      ]),
    },
    {
      pages: 'Page 42 - 45',
      description: 'Standing up University back-turning—Colonna Palace direction facing not-looking-back—Eight Cups complete emotional-shore left dark-water heading as Crossing Line Point No-Return acts danger moving-toward focus final boots crunching cobblestones cold air lungs city silence sleeping bridge Ch 4 introspection completes.',
      focus: 'Action moving toward danger through no return crossing.',
      chapterSceneFocus: 'Ch83S4: Standing University back-turning Palace facing not-looking-back—Eight Cups complete shore left dark-water as Crossing Line No-Return acts danger moving focus final boots crunching cobblestones air lungs city silence bridge Ch 4 introspection completes ordinary ends.',
      preliminarySceneFocus: 'Crossing Line No-Return focuses final',
      preliminarySceneDescription: 'Eight Cups completes dark-water heading danger-toward',
      narrativeFunction: 'Completes Eight of Cups journey; demonstrates point of no return; bridges to Chapter 4; shows final commitment to infiltration.',
      sensoryDetail: 'Standing up, University back-turning, Colonna Palace, direction facing, not looking back, Eight Cups complete, emotional shore, dark water heading, Crossing Line, Point No Return, danger moving, boots crunching, cobblestones, cold air, lungs filling, city silence, sleeping.',
      internalConflict: 'Francisco experiencing focus—turning back on University without looking, facing Palace direction resolutely, accepting point of no return with finality.',
      characterGrowthElement: 'Francisco completing Eight of Cups—leaving emotional shore definitively, heading into dark water without looking back, crossing point of no return toward Vatican infiltration danger.',
      seriesConnectionResonance: 'Point of no return establishing; Eight Cups complete; Hermit journey beginning; emotional detachment necessity; ordinary world leaving; Book 3 infiltration arc starting.',
      sceneCardProgression: 249,
      realWorldContext: 'Point of no return acceptance, commitment finality, purpose-driven action.',
      timelineSignificance: '5/10/1321 0200 hours—Francisco completing Eight Cups journey, crossing point of no return toward Colonna Palace, ordinary world definitively left.',
      saveTheCatBeat: truncate('Setup - point of no return crossed', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'final_commitment',
        narrative_mode: 'focused_resolve',
      }),
      learning_objectives: JSON.stringify([
        'Point of no return commitment',
        'Eight of Cups completion',
        'Purpose-driven action execution',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Chapter 4 Vatican entry',
        'Infiltration beginning',
        'Hermit path continuing',
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
        chapterUniqueIdentifier: 'EA-083',
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

  console.log(`\n✅ EA-083 import complete!`);
  console.log(`\n🚶 The Eight of Cups journey is complete - Francisco has crossed the point of no return.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
