import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-062: Resolve (Book 2, Chapter 22)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-062'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-062 not found. Run create-ea-062-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Inventory',
      setup: 'Francisco stands in the warehouse. It\'s half empty. The Quartermaster reads the list: food for 3 weeks, power for 2. The victory feels hollow when looked at through a spreadsheet. This is the Seven of Disks moment—looking at the tree and seeing not enough fruit. He realizes they can\'t go back to normal. \'Normal\' is too expensive.',
      symbolism: 'The Empty Granary. The Ledger. The truth of numbers.',
      beat_goal: 'Establish the constraint. Victory didn\'t fix the logistics.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Sober realization',
      scene_tone: 'Cold and echoey',
      timeline_date: '7/14/1320 - Morning',
      timeline_variant: 'Sanctuary Supply Depot',
      location: 'The Warehouse',
    },
    {
      scene_number: 2,
      scene_title: 'Opportunity Cost',
      setup: 'The Council table. Three projects on the board: 1. Rescue the lost scouts (Novella\'s choice). 2. Repair the Library (The Scholars\' choice). 3. Upgrade the Shield (Francisco\'s instinct). They only have power for one. The debate is heated. This isn\'t good vs. evil; it\'s good vs. playing the long game. Francisco realizes that saying \'Yes\' to the Shield means saying \'No\' to the scouts. It\'s a trolley problem.',
      symbolism: 'The Crossroads. The Scales. The weight of the crown.',
      beat_goal: 'The Conflict. Values vs. Survival.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Frustrated responsibility',
      scene_tone: 'Tense debate',
      timeline_date: '7/14/1320 - Midday',
      timeline_variant: 'Sanctuary HQ',
      location: 'The War Room',
    },
    {
      scene_number: 3,
      scene_title: 'Pruning',
      setup: 'Francisco goes to the Archives to tell the Scholars they are being shut down. It breaks his heart—he loves the history. But the Shield is vital. An old actuary, \'The Gardener\', stops him. \'Do not apologize, Francisco. A tree that isn\'t pruned dies.\' He gives Francisco the keys. It\'s permission to be the bad guy for the greater good. Francisco turns off the lights. The history goes dark so the future can have light.',
      symbolism: 'The Pruning Shears. Darkness for the sake of Light. \'Killing the darling\'.',
      beat_goal: 'The Action. Making the hard call.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Melancholy resolve',
      scene_tone: 'Bittersweet',
      timeline_date: '7/14/1320 - Afternoon',
      timeline_variant: 'Sanctuary Archives',
      location: 'The Archives',
    },
    {
      scene_number: 4,
      scene_title: 'The Pivot',
      setup: 'The announcement is made. Some people are angry. Some are relieved someone finally made a decision. The energy grid re-routes. The Shield hums to life, stronger than before. Francisco watches the monitor. He feels older. Novella stands next to him. \'I hate it,\' she says. \'I know,\' he replies. \'But we\'re safe.\' They stand in the blue glow, separated by the choice but unified by the survival.',
      symbolism: 'The Blue Light. The \'New Course\' locked in. The distance between \'Right\' and \'Necessary\'.',
      beat_goal: 'Resolution. The path is set.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Grim satisfaction',
      scene_tone: 'Technological and cold',
      timeline_date: '7/14/1320 - Evening',
      timeline_variant: 'Operations Deck',
      location: 'The Shield Control',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 316 - 320',
      description: 'Francisco stands in half-empty warehouse as Quartermaster lists food for 3 weeks, power for 2—victory feeling hollow through spreadsheet lens in Seven of Disks moment seeing not enough fruit on tree—realizing normal is too expensive to afford anymore.',
      focus: 'Establishing constraint that victory didn\'t fix logistics.',
      chapterSceneFocus: 'Ch62S1: Half-empty warehouse inventory reveals food for 3 weeks, power for 2—victory hollow through numbers showing Seven of Disks assessment of insufficient resources—Francisco realizing normal operations too expensive to sustain.',
      preliminarySceneFocus: 'Empty granary reveals constraint',
      preliminarySceneDescription: 'Spreadsheet truth shows victory\'s hollow logistics',
      narrativeFunction: 'Establishes resource crisis; introduces Seven of Disks assessment theme; sets up difficult choices.',
      sensoryDetail: 'Half-empty warehouse, Quartermaster reading list, 3-week food supply, 2-week power, hollow victory feeling, spreadsheet reality, empty granary, insufficient fruit.',
      internalConflict: 'Francisco confronting gap between military victory and logistical sustainability.',
      characterGrowthElement: 'Francisco moving from reactive celebration to proactive assessment—accepting numbers over optimism.',
      seriesConnectionResonance: 'Establishes resource scarcity as ongoing constraint; enables focus on Unity Project.',
      sceneCardProgression: 162,
      realWorldContext: 'Post-victory reality check, resource constraints, spreadsheet truth over emotion.',
      timelineSignificance: 'Week after reconstruction—resource assessment reveals unsustainable current operations.',
      saveTheCatBeat: truncate('Midpoint - accounting reveals resource crisis', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'sober_assessment',
        narrative_mode: 'cold_logistics',
      }),
      learning_objectives: JSON.stringify([
        'Victory doesn\'t solve logistics',
        'Seven of Disks honest assessment',
        'Normal becomes unaffordable luxury',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Trolley problem debate coming',
        'Heritage Project shutdown',
        'Shield prioritization decision',
      ]),
    },
    {
      pages: 'Page 320 - 323',
      description: 'Council table with three projects—rescue lost scouts (Novella), repair Library (Scholars), upgrade Shield (Francisco)—only power for one creating heated debate of good vs. good vs. long game, Francisco realizing yes to Shield means no to scouts in trolley problem.',
      focus: 'Conflict between values and survival.',
      chapterSceneFocus: 'Ch62S2: Three projects compete for single power allocation—rescue scouts, repair Library, upgrade Shield—heated debate creating trolley problem as Francisco realizes choosing Shield survival means abandoning scouts representing values versus necessity.',
      preliminarySceneFocus: 'Trolley problem forces choice',
      preliminarySceneDescription: 'Good versus good in resource scarcity',
      narrativeFunction: 'Creates moral dilemma; demonstrates leadership burden; shows values versus survival tension.',
      sensoryDetail: 'Council table, three projects displayed, power for one, heated debate, good vs. good conflict, trolley problem realization, crossroads symbolism, crown weight.',
      internalConflict: 'Francisco weighing moral values against strategic survival necessity.',
      characterGrowthElement: 'Francisco accepting that leadership means choosing between good options, not good versus evil.',
      seriesConnectionResonance: 'Trolley problem becomes leadership archetype; Shield upgrade enables later defensive capacity.',
      sceneCardProgression: 163,
      realWorldContext: 'Moral dilemmas in scarcity, leadership burden, choosing between values and survival.',
      timelineSignificance: 'Strategic pivot from broad operations to focused survival priorities.',
      saveTheCatBeat: truncate('Midpoint - values versus survival debate', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'tense_debate',
        narrative_mode: 'moral_conflict',
      }),
      learning_objectives: JSON.stringify([
        'Good versus good decisions hardest',
        'Leadership as choosing priorities',
        'Opportunity cost reality',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Shield choice coming',
        'Gardener\'s wisdom',
        'Pruning metaphor application',
      ]),
    },
    {
      pages: 'Page 323 - 327',
      description: 'Francisco visits Archives to announce Scholar shutdown—heartbreaking as he loves history but Shield is vital—old actuary Gardener stopping him with "tree that isn\'t pruned dies" giving keys as permission to be bad guy—Francisco turning off lights so history goes dark enabling future light.',
      focus: 'Making hard call through pruning action.',
      chapterSceneFocus: 'Ch62S3: Francisco heartbroken shutting down Archives Scholars loving history but prioritizing Shield—Gardener actuary giving permission saying unpruned trees die—turning off lights so history darkness enables future light as necessary pruning.',
      preliminarySceneFocus: 'Pruning shears cut for growth',
      preliminarySceneDescription: 'Darkness for light, killing darlings',
      narrativeFunction: 'Executes difficult decision; provides elder validation; establishes pruning as necessary growth.',
      sensoryDetail: 'Archives visit, Scholar shutdown announcement, heartbreak, history love, vital Shield, Gardener actuary, pruning wisdom, keys given, lights turned off, darkness falling.',
      internalConflict: 'Francisco balancing love of history against vital defense needs.',
      characterGrowthElement: 'Francisco accepting elder permission to make unpopular necessary decisions for greater good.',
      seriesConnectionResonance: 'Pruning becomes leadership philosophy; Gardener wisdom recurs; darkness-for-light trade-off theme.',
      sceneCardProgression: 164,
      realWorldContext: 'Killing darlings, pruning for growth, permission to make hard calls.',
      timelineSignificance: 'Heritage Project shutdown redirects power to Shield upgrade enabling defensive capacity.',
      saveTheCatBeat: truncate('Midpoint - pruning sentimental for vital', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'bittersweet_action',
        narrative_mode: 'melancholy_resolve',
      }),
      learning_objectives: JSON.stringify([
        'Pruning as necessary growth tool',
        'Elder validation for hard choices',
        'Darkness enabling future light',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Blue glow resolution',
        'Novella\'s emotional response',
        'Unity through survival choice',
      ]),
    },
    {
      pages: 'Page 327 - 330',
      description: 'Announcement made with mixed reactions—some angry, some relieved by decision—energy grid re-routing as Shield hums stronger—Francisco watching monitor feeling older, Novella beside him hating it, both knowing they\'re safe standing in blue glow separated by choice but unified by survival.',
      focus: 'Resolution setting path forward.',
      chapterSceneFocus: 'Ch62S4: Announcement creating mixed anger and relief reactions—energy re-routing strengthening Shield—Francisco feeling older watching with Novella both hating choice knowing safety, standing in blue glow separated by decision unified by survival necessity.',
      preliminarySceneFocus: 'Blue glow locks new course',
      preliminarySceneDescription: 'Right and Necessary diverge in resolution',
      narrativeFunction: 'Resolves chapter; establishes consequences; shows emotional cost of leadership; unifies through shared sacrifice.',
      sensoryDetail: 'Announcement made, anger and relief mixed, energy grid re-routing, Shield humming stronger, monitor watching, feeling older, blue glow, separation and unity.',
      internalConflict: 'Francisco accepting age of leadership—choosing survival over righteousness.',
      characterGrowthElement: 'Francisco completing transformation from addition to subtraction leadership—doing less better.',
      seriesConnectionResonance: 'Blue glow becomes technological safety symbol; Novella-Francisco tension over pragmatism continues.',
      sceneCardProgression: 165,
      realWorldContext: 'Leadership aging, necessary versus right, unity through shared hard choices.',
      timelineSignificance: 'Strategic pivot complete—focused operations enabling Book 2 endgame Unity Project.',
      saveTheCatBeat: truncate('Midpoint - path set through hard choice', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'cold_resolution',
        narrative_mode: 'technological_closure',
      }),
      learning_objectives: JSON.stringify([
        'Leadership ages through hard choices',
        'Unity through shared sacrifice',
        'Necessary versus right divergence',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Unity Project focus enabled',
        'Book 3 heavier sacrifices',
        'Continued resource management theme',
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
        chapterUniqueIdentifier: 'EA-062',
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

  console.log(`\n✅ EA-062 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
