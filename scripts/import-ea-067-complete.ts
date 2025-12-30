import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-067: Open Minded (Book 2, Chapter 27)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-067'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-067 not found. Run create-ea-067-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Dead End',
      setup: 'The Council meets. The map is red. Every escape route is blocked. The \'Experts\' (Alexandrian Tacticians) are listing the ways they will die. It is a \'Fixed Mindset\' trap. They are re-running old simulations. Francisco feels the trap closing—not just the enemy, but the trap of conventional thinking. He remembers his meditation (EA-066). He stops the briefing. \'Stop telling me what we can\'t do. Tell me what we haven\'t tried.\'',
      symbolism: 'The Echo Chamber. The circle of people all nodding at bad news. The \'Wall\' on the map.',
      beat_goal: 'Establish the intellectual blockage. The old way is dead.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Frustrated urgency',
      scene_tone: 'Stifling',
      timeline_date: '7/28/1320 - Late Evening',
      timeline_variant: 'The Broken Redoubt (War Room)',
      location: 'War Room',
    },
    {
      scene_number: 2,
      scene_title: 'The Wild Idea',
      setup: 'A silence follows Francisco\'s demand. A young engineer (Knight of Rings equivalent) speaks up from the back. \'We could invert the polarity of the shield generator.\' The experts laugh. \'That would blow us up.\' Francisco silences the room. \'How?\' The engineer explains: use the shield not to block, but to *pull* the enemy in, then collapse the timeline bubble. It\'s a \'Trojan Horse\' strategy. It requires \'Range\'—thinking across physics and chrono-mechanics.',
      symbolism: 'The Voice from the Back. The Knight offering the Ring (Idea). The inversion of \'Defense\' to \'Offense\'.',
      beat_goal: 'The Pivot. Discovering the potential solution. Overcoming the social pressure to conform.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Spark of hope',
      scene_tone: 'Tense but shifting',
      timeline_date: '7/28/1320 - Late Evening',
      timeline_variant: 'War Room',
      location: 'War Room',
    },
    {
      scene_number: 3,
      scene_title: 'The Friction',
      setup: 'The plan is debated. The risks are 90%. The experts try to kill it with logic. Francisco has to fight for the *possibility* of the idea. He uses \'Cognitive Flexibility\'. He asks \'What if we modify it?\' He starts drawing on the map. He combines the engineer\'s tech with his own time-slowing ability to stabilize the \'blow up\' risk. They jam on the idea. It evolves from a \'suicide pact\' to a \'gamble\'. The energy in the room shifts from despair to manic creativity.',
      symbolism: 'The Jazz Session. Improvisation. The mixing of Blue (Logic) and Red (Passion) to make Purple (Magic).',
      beat_goal: 'Refine the idea. Secure buy-in. Transform the team from critics to co-conspirators.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Creative flow',
      scene_tone: 'Fast-paced and cerebral',
      timeline_date: '7/28/1320 - Night',
      timeline_variant: 'War Room',
      location: 'War Room',
    },
    {
      scene_number: 4,
      scene_title: 'The Green Light',
      setup: 'The plan is theoretical. They need to commit. Francisco looks at the engineer. \'Can you build it?\' \'In 4 hours.\' \'Do it.\' He dismisses the council. He walks out with the engineer. He has bet the entire resistance on a \'Knight\'s\' gamble. He feels the thrill of the \'Open Mind\'. He realizes that this is how they win—not by being stronger, but by being weirder.',
      symbolism: 'The Handshake. The passing of the baton. The opening of the door.',
      beat_goal: 'Resolution. The decision is made. The \'Abyss\' has a path through it.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Electrified resolve',
      scene_tone: 'Decisive',
      timeline_date: '7/28/1320 - Late Night',
      timeline_variant: 'Corridor',
      location: 'Corridor outside War Room',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 391 - 395',
      description: 'Council meeting with red map showing all escape routes blocked—Alexandrian Experts listing death scenarios in Fixed Mindset trap re-running old simulations—Francisco feeling trap of conventional thinking not just enemy, remembering EA-066 meditation, stopping briefing demanding "Tell me what we haven\'t tried" breaking intellectual blockage.',
      focus: 'Establishing intellectual blockage where old way is dead.',
      chapterSceneFocus: 'Ch67S1: Red map Council with blocked routes—Experts listing deaths in Fixed Mindset simulation trap—Francisco recognizing conventional thinking trap remembering meditation, demanding untried solutions breaking intellectual blockage as echo chamber nodding at wall.',
      preliminarySceneFocus: 'Echo chamber traps thinking',
      preliminarySceneDescription: 'Fixed mindset re-runs old failures',
      narrativeFunction: 'Establishes Dark Night crisis; demonstrates conventional thinking failure; shows Francisco applying EA-066 wisdom.',
      sensoryDetail: 'Council meeting, red map, blocked routes, Expert death lists, Fixed Mindset trap, old simulations, trap closing, conventional thinking, meditation memory, briefing stopped.',
      internalConflict: 'Francisco recognizing intellectual trap as dangerous as physical trap—breaking free through open-minded demand.',
      characterGrowthElement: 'Francisco applying Philosopher King wisdom demanding cognitive flexibility over expert certainty—breaking echo chamber.',
      seriesConnectionResonance: 'Culture of listening beginning; innovation from bottom theme; fixed versus growth mindset.',
      sceneCardProgression: 182,
      realWorldContext: 'Echo chambers, fixed mindset traps, conventional wisdom failing in crisis.',
      timelineSignificance: 'Hours after EA-066 reflection—Francisco applying wisdom to escape Abyss through open-minded thinking.',
      saveTheCatBeat: truncate('Dark Night of the Soul - intellectual blockage threatens', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'stifling_urgency',
        narrative_mode: 'frustrated_breakthrough',
      }),
      learning_objectives: JSON.stringify([
        'Echo chambers blocking innovation',
        'Fixed mindset versus growth mindset',
        'Conventional wisdom trap in crisis',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Knight engineer speaking up',
        'Wild idea from back row',
        'Cognitive flexibility solution',
      ]),
    },
    {
      pages: 'Page 395 - 398',
      description: 'Silence after Francisco\'s demand—young Knight engineer from back suggesting shield polarity inversion—Experts laughing at explosion risk—Francisco silencing room asking "How?"—engineer explaining Trojan Horse pulling enemy in then collapsing timeline bubble requiring Range thinking across physics and chrono-mechanics.',
      focus: 'Pivot discovering potential solution overcoming conformity pressure.',
      chapterSceneFocus: 'Ch67S2: Young engineer from back suggesting shield polarity inversion—Experts mocking explosion risk—Francisco silencing to ask "How?"—Trojan Horse explanation pulling enemy into timeline collapse requiring Range cross-disciplinary thinking as Voice from Back offers Knight\'s Ring idea.',
      preliminarySceneFocus: 'Voice from back offers ring',
      preliminarySceneDescription: 'Defense inverts to offensive trap',
      narrativeFunction: 'Introduces breakthrough idea from unexpected source; demonstrates rank-blind listening; shows Range thinking value.',
      sensoryDetail: 'Demand silence, young engineer speaking, back row, shield polarity inversion, Expert laughter, room silenced, How question, Trojan Horse explanation, pulling enemy, timeline collapse.',
      internalConflict: 'Francisco choosing to listen to low-rank outsider over experienced experts—applying open-minded principle.',
      characterGrowthElement: 'Francisco embodying Knight of Wands openness—recognizing breakthrough can come from anywhere, overriding social hierarchy.',
      seriesConnectionResonance: 'Innovation from bottom established; hybrid magic-tech bridge beginning; culture of best idea wins.',
      sceneCardProgression: 183,
      realWorldContext: 'Breakthrough from unexpected sources, rank-blind innovation, cross-disciplinary thinking.',
      timelineSignificance: 'Wild idea offering escape from Abyss—shield inversion becoming hybrid weapon foundation.',
      saveTheCatBeat: truncate('Dark Night of the Soul - wild idea sparks hope', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'tense_shifting',
        narrative_mode: 'hope_spark',
      }),
      learning_objectives: JSON.stringify([
        'Innovation from unexpected sources',
        'Range thinking value',
        'Overcoming conformity pressure',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Plan debate friction coming',
        'Cognitive flexibility refinement',
        'Risk evolution from suicide to gamble',
      ]),
    },
    {
      pages: 'Page 398 - 402',
      description: 'Plan debate with 90% risk—Experts killing idea with logic—Francisco fighting for possibility using Cognitive Flexibility asking "What if we modify it?"—drawing on map combining engineer tech with time-slowing to stabilize explosion risk—jamming evolving suicide pact to gamble as energy shifts from despair to manic creativity.',
      focus: 'Refining idea securing buy-in transforming critics to co-conspirators.',
      chapterSceneFocus: 'Ch67S3: Debating 90% risk plan as Experts logic-kill it—Francisco fighting for possibility with Cognitive Flexibility modification questions—map-drawing combining tech and time-slowing stabilizing risk—jazzy improvisation evolving suicide to gamble shifting despair to manic creativity.',
      preliminarySceneFocus: 'Jazz session improvises purple',
      preliminarySceneDescription: 'Logic and passion mix creative magic',
      narrativeFunction: 'Demonstrates collaborative innovation; shows cognitive flexibility in action; transforms opposition to partnership.',
      sensoryDetail: 'Plan debate, 90% risk, Expert logic attacks, possibility fight, Cognitive Flexibility, modification questions, map drawing, tech-magic combination, time-slowing stabilization, jamming, suicide evolution to gamble.',
      internalConflict: 'Francisco maintaining belief in possibility while pragmatically addressing risks through creative synthesis.',
      characterGrowthElement: 'Francisco facilitating jazz session collaboration—synthesizing diverse inputs into viable plan through cognitive flexibility.',
      seriesConnectionResonance: 'Hybrid magic-tech technique foundation; collaborative innovation culture; Purple (synthesis) over binary thinking.',
      sceneCardProgression: 184,
      realWorldContext: 'Collaborative innovation, cognitive flexibility, synthesis over binary choices.',
      timelineSignificance: 'Plan refinement through synthesis—establishing Book 3 hybrid weapon foundation.',
      saveTheCatBeat: truncate('Dark Night of the Soul - creativity transforms despair', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'fast_cerebral',
        narrative_mode: 'creative_flow',
      }),
      learning_objectives: JSON.stringify([
        'Cognitive flexibility in practice',
        'Collaborative improvisation value',
        'Synthesis creating third options',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Commitment decision coming',
        '4-hour build timeline',
        'Weirdness as winning strategy',
      ]),
    },
    {
      pages: 'Page 402 - 405',
      description: 'Theoretical plan requiring commitment—Francisco asking engineer "Can you build it?" receiving "In 4 hours" answer—giving "Do it" order dismissing council—walking out with engineer having bet resistance on Knight\'s gamble—feeling Open Mind thrill realizing winning through weirdness not strength.',
      focus: 'Resolution making decision finding Abyss path through.',
      chapterSceneFocus: 'Ch67S4: Commitment moment—Francisco asking build feasibility receiving 4-hour answer—ordering execution dismissing council—walking out having bet resistance on Knight gamble feeling Open Mind thrill realizing weirdness-over-strength winning strategy as handshake opens door through Abyss.',
      preliminarySceneFocus: 'Handshake baton opens door',
      preliminarySceneDescription: 'Weirdness wins over strength bet',
      narrativeFunction: 'Resolves chapter through decisive commitment; establishes weirdness strategy; empowers low-rank contributor.',
      sensoryDetail: 'Theoretical plan, commitment need, build question, 4-hour answer, Do it order, council dismissed, engineer walkout, resistance bet, Knight gamble, Open Mind thrill, weirdness realization.',
      internalConflict: 'Francisco accepting uncertainty while committing fully—embracing weirdness as strategic advantage.',
      characterGrowthElement: 'Francisco completing open-minded transformation—betting on wild idea and empowering unexpected hero, choosing growth over safety.',
      seriesConnectionResonance: 'Weirdness as strategy established; Knight empowerment theme; hybrid weapon becomes staple; culture of best idea wins solidified.',
      sceneCardProgression: 185,
      realWorldContext: 'Decisive commitment under uncertainty, empowering contributors, unconventional strategy.',
      timelineSignificance: 'Abyss escape path found through open-minded gamble—4-hour countdown to hybrid weapon implementation.',
      saveTheCatBeat: truncate('Dark Night of the Soul - commitment opens path', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'decisive_momentum',
        narrative_mode: 'electrified_resolve',
      }),
      learning_objectives: JSON.stringify([
        'Decisive commitment under uncertainty',
        'Growth mindset choosing risk',
        'Weirdness as strategic advantage',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Hybrid weapon build beginning',
        'Book 3 weapon staple',
        'Culture of innovation continuing',
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
        chapterUniqueIdentifier: 'EA-067',
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

  console.log(`\n✅ EA-067 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
