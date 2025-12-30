import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-061: Steady Force (Book 2, Chapter 21)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-061'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-061 not found. Run create-ea-061-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'Waking Up in Ruins',
      setup: 'Francisco wakes up. His body feels like lead (Ten of Wands). He crawls out of the makeshift cot. He steps onto the balcony. The Plaza is a wreck. People are sitting in the dust, shell-shocked. There is no cheering. Just the sound of someone coughing. He feels the crushing weight of responsibility—he led them into this. He almost goes back inside. But he sees a child trying to stack two bricks together. He forces himself to walk down the stairs.',
      symbolism: 'The Ten of Wands reversed—being crushed by the burden. The \'Wreckage\' as a mirror of his internal state.',
      beat_goal: 'Establish the cost. Move the hero from \'Victim\' to \'Laborer\'.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Despair fighting with duty',
      scene_tone: 'Grey and quiet',
      timeline_date: '7/7/1320 - Morning',
      timeline_variant: 'Sanctuary (Ruined)',
      location: 'The Plaza Balcony',
    },
    {
      scene_number: 2,
      scene_title: 'Triage',
      setup: 'The Council meeting is grim. The Alexandrians have the math: \'Structural integrity is at 12%. Evacuation is the logical outcome.\' The Medicis agree; they want to retreat to a timeline they own. Francisco enters, looking like death. He doesn\'t argue the math. He argues the narrative. \'If we leave, we are refugees again. If we stay, we are owners.\' La Signora backs him, not with words, but by burning the evacuation plans on the table. \'Diligence,\' she says. \'We fix it.\'',
      symbolism: 'Burning the Ships. The choice between \'Easy\' (Quitting) and \'Hard\' (Diligence).',
      beat_goal: 'The Decision. Committing to the hard path.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Stubborn resolve',
      scene_tone: 'Contentious',
      timeline_date: '7/7/1320 - Noon',
      timeline_variant: 'Sanctuary HQ',
      location: 'The Map Room',
    },
    {
      scene_number: 3,
      scene_title: 'The Heavy Lift',
      setup: 'The work begins. It is physical and magical. To re-align the anchors, they need to carry raw reality-shards. They are heavy—conceptually heavy (carrying the weight of what *could* have been). Francisco tries to carry too much. He collapses. His friends (Marco, Novella, even the defector Alexandrians) pick up the slack. They form a human chain, passing the burden. Francisco realizes the Ten of Wands isn\'t about carrying it all; it\'s about realizing you have ten wands and ten friends.',
      symbolism: 'The Ten of Wands upright—burden sharing. The \'Human Chain\' as the structure of the Alliance.',
      beat_goal: 'The Action. Show the collective effort.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Humility',
      scene_tone: 'Sweaty and communal',
      timeline_date: '7/7/1320 - Afternoon',
      timeline_variant: 'The Anchor Chamber',
      location: 'The Reality Core',
    },
    {
      scene_number: 4,
      scene_title: 'The New Normal',
      setup: 'Night falls. The hum returns, but it\'s different—lower, grittier. A patch job, but a solid one. They sit around fires in the plaza. They are too tired to celebrate. They just eat and sleep. Francisco looks at the scars on the buildings. They aren\'t perfect anymore. They look like they\'ve been through a war. And that makes them more real. He sleeps without nightmares for the first time in weeks.',
      symbolism: 'Kintsugi (Golden Repair)—beauty in the brokenness. The \'Scar\' as a medal.',
      beat_goal: 'Resolution. Acceptance of the new state.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Peaceful exhaustion',
      scene_tone: 'Quiet and secure',
      timeline_date: '7/7/1320 - Night',
      timeline_variant: 'Sanctuary (Repaired)',
      location: 'The Plaza',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 301 - 305',
      description: 'Francisco wakes with lead-heavy body crawling from makeshift cot to balcony—viewing wrecked Plaza with shell-shocked dust-sitting people and coughing sounds—feeling crushing responsibility for leading them here, almost retreating until seeing child stacking bricks, forcing himself down stairs.',
      focus: 'Establishing cost and moving hero from victim to laborer.',
      chapterSceneFocus: 'Ch61S1: Francisco wakes exhausted viewing ruined Plaza with shell-shocked survivors—crushing responsibility weight almost sending him back inside until child stacking bricks inspires him to descend stairs choosing labor over despair.',
      preliminarySceneFocus: 'Aftermath reveals devastating cost',
      preliminarySceneDescription: 'Lead-heavy hero faces wreckage responsibility',
      narrativeFunction: 'Establishes post-battle consequences; shows physical/emotional toll; introduces child-as-inspiration motif.',
      sensoryDetail: 'Lead-heavy body, makeshift cot, wrecked Plaza, shell-shocked people sitting in dust, coughing sounds, crushing responsibility weight, child stacking bricks.',
      internalConflict: 'Francisco battling despair over leading people into devastation while duty pulls him toward rebuilding.',
      characterGrowthElement: 'Francisco choosing laborer role over victim role—inspired by child\'s simple reconstruction effort.',
      seriesConnectionResonance: 'Establishes Ten of Wands burden theme; child-stacking-bricks becomes recurring hope symbol.',
      sceneCardProgression: 158,
      realWorldContext: 'Post-crisis leadership, responsibility weight, finding inspiration in small acts.',
      timelineSignificance: 'Morning after Dagon\'s assault—transition from survival to recovery begins.',
      saveTheCatBeat: truncate('Midpoint - picking up pieces after battle', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'slow_awakening',
        narrative_mode: 'grey_aftermath',
      }),
      learning_objectives: JSON.stringify([
        'Leadership burden after crisis',
        'Choosing action over despair',
        'Small acts inspiring recovery',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Evacuation debate coming',
        'La Signora\'s decisive action',
        'Burden-sharing lesson ahead',
      ]),
    },
    {
      pages: 'Page 305 - 308',
      description: 'Grim Council meeting with Alexandrians calculating 12% structural integrity recommending evacuation, Medicis agreeing to retreat—Francisco entering death-like arguing narrative over math, defining staying as ownership versus refugee status—La Signora backing by burning evacuation plans declaring diligence.',
      focus: 'Decision to commit to hard path over easy quitting.',
      chapterSceneFocus: 'Ch61S2: Council debating evacuation with 12% structural integrity math—Francisco arguing narrative over calculation defining staying as ownership not refugee status—La Signora burning evacuation plans to commit to diligent repair.',
      preliminarySceneFocus: 'Burning ships commits to repair',
      preliminarySceneDescription: 'Narrative defeats math in hard choice',
      narrativeFunction: 'Creates pivotal decision; demonstrates leadership through narrative over logic; shows La Signora\'s decisive support.',
      sensoryDetail: 'Grim meeting, 12% structural integrity calculation, evacuation recommendation, death-like Francisco appearance, burning evacuation plans, diligence declaration.',
      internalConflict: 'Francisco choosing identity as owners over logical retreat to refugee status.',
      characterGrowthElement: 'Francisco arguing narrative identity over mathematical logic—learning meaning defines choices more than efficiency.',
      seriesConnectionResonance: 'Establishes "burning ships" commitment motif; La Signora as decisive action partner.',
      sceneCardProgression: 159,
      realWorldContext: 'Choosing hard right over easy wrong, identity defining decisions, commitment over retreat.',
      timelineSignificance: 'Critical decision shifting from potential evacuation to committed reconstruction.',
      saveTheCatBeat: truncate('Midpoint - committing to rebuild over retreat', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'contentious_debate',
        narrative_mode: 'decisive_commitment',
      }),
      learning_objectives: JSON.stringify([
        'Narrative versus mathematical decision-making',
        'Identity as owner versus refugee',
        'Burning ships as commitment device',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Physical labor coming',
        'Burden-sharing realization',
        'Community healing through work',
      ]),
    },
    {
      pages: 'Page 308 - 312',
      description: 'Physical and magical work begins carrying conceptually-heavy reality-shards to re-align anchors—Francisco trying to carry too much collapsing—friends forming human chain passing burden—realizing Ten of Wands means ten wands and ten friends sharing load not solo carrying.',
      focus: 'Showing collective effort through burden-sharing action.',
      chapterSceneFocus: 'Ch61S3: Carrying conceptually-heavy reality-shards to re-align anchors—Francisco collapsing from carrying too much—friends forming human chain to pass burden teaching Ten of Wands means sharing load with ten friends not solo carrying.',
      preliminarySceneFocus: 'Human chain shares burden',
      preliminarySceneDescription: 'Collapse teaches collective effort value',
      narrativeFunction: 'Demonstrates burden-sharing lesson; shows community strength; reveals Francisco\'s growth through humility.',
      sensoryDetail: 'Physical and magical work, conceptually-heavy reality-shards, Francisco collapsing, friends picking up slack, human chain formation, burden passing.',
      internalConflict: 'Francisco learning humility through collapse—accepting he cannot and should not carry everything alone.',
      characterGrowthElement: 'Francisco discovering leadership means enabling others to share burden rather than solo heroism.',
      seriesConnectionResonance: 'Human chain becomes Alliance symbol; burden-sharing as organizational principle.',
      sceneCardProgression: 160,
      realWorldContext: 'Collective action, learning delegation, strength through community not individualism.',
      timelineSignificance: 'Physical reconstruction begins through coordinated community effort.',
      saveTheCatBeat: truncate('Midpoint - collective burden-sharing in action', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'physical_labor',
        narrative_mode: 'communal_effort',
      }),
      learning_objectives: JSON.stringify([
        'Burden-sharing versus solo heroism',
        'Community as structural strength',
        'Humility through collapse and acceptance',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Kintsugi aesthetic emerging',
        'Scars as medals concept',
        'New normal acceptance',
      ]),
    },
    {
      pages: 'Page 312 - 315',
      description: 'Night falls with different hum returning—lower, grittier but solid patch job—sitting around plaza fires too tired to celebrate, just eating and sleeping—Francisco viewing building scars as war-marks making them more real, sleeping without nightmares first time in weeks.',
      focus: 'Resolution through accepting new scarred but real state.',
      chapterSceneFocus: 'Ch61S4: Different hum returns as solid patch job—exhausted survivors sitting around fires too tired to celebrate—Francisco viewing building scars as war-marks increasing realness, sleeping nightmare-free first time in weeks accepting new normal.',
      preliminarySceneFocus: 'Kintsugi beauty in brokenness',
      preliminarySceneDescription: 'Scars make sanctuary more real',
      narrativeFunction: 'Resolves chapter through acceptance; establishes kintsugi aesthetic; shows peaceful exhaustion as victory.',
      sensoryDetail: 'Night falling, different lower grittier hum, solid patch job, plaza fires, too-tired-to-celebrate sitting, eating and sleeping, building scars, war-look realness, nightmare-free sleep.',
      internalConflict: 'Francisco finding peace in imperfection—accepting scarred sanctuary as more authentic than pristine version.',
      characterGrowthElement: 'Francisco completing acceptance arc—understanding scars prove survival and authenticity over perfection.',
      seriesConnectionResonance: 'Kintsugi becomes aesthetic philosophy; scars-as-medals theme; nightmare-free sleep as healing marker.',
      sceneCardProgression: 161,
      realWorldContext: 'Beauty in brokenness, acceptance over perfection, authentic struggle over pristine facade.',
      timelineSignificance: 'Sanctuary achieves new stable state—scarred but functional, setting baseline for future.',
      saveTheCatBeat: truncate('Midpoint - accepting scarred new normal', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'low',
        pacing: 'quiet_resolution',
        narrative_mode: 'peaceful_acceptance',
      }),
      learning_objectives: JSON.stringify([
        'Kintsugi aesthetic—beauty in repair',
        'Scars as authenticity markers',
        'Peace through acceptance not perfection',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Long war continuing',
        'Decentralization need emerging',
        'Community resilience established',
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
        chapterUniqueIdentifier: 'EA-061',
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

  console.log(`\n✅ EA-061 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
