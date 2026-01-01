import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-090: Removal (Book 3, Chapter 10)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-090'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-090 not found. Run create-ea-090-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Overcrowding',
      setup: 'Sanctuary mess hall. Loud. A fight breaks out over a piece of bread. Francisco intervenes. The noise is overwhelming. He can\'t hear himself think (or the timeline). He realizes the clutter is dangerous.',
      symbolism: 'The Noise. The Choking Weeds.',
      beat_goal: 'The Problem. Identifying the unsustainable state.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Frustration',
      scene_tone: 'Chaotic',
      timeline_date: '6/5/1321 - Noon',
      timeline_variant: 'Sanctuary',
      location: 'Mess Hall',
    },
    {
      scene_number: 2,
      scene_title: 'The Hard Choice',
      setup: 'Francisco\'s study. Quiet. La Signora shows the ledger. \'We have food for three days.\' If they keep everyone, everyone starves. If they cut the group, the core survives. Francisco stares at the Three of Swords card on his desk.',
      symbolism: 'The Ledger. The Sword.',
      beat_goal: 'The Decision. Logic vs Emotion.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Resolve',
      scene_tone: 'Cold',
      timeline_date: '6/5/1321 - Afternoon',
      timeline_variant: 'Sanctuary',
      location: 'Study',
    },
    {
      scene_number: 3,
      scene_title: 'The Announcement',
      setup: 'Courtyard. Rain. Francisco stands on a crate. He announces the plan. The families will go to Santa Lucia. The fighters will stay. The reaction is shock, then anger, then sadness. The \'Heartbreak\' of the Three of Swords.',
      symbolism: 'The Rain (Tears). The Separation.',
      beat_goal: 'The Action. Delivering the bad news.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Pain',
      scene_tone: 'Tragic',
      timeline_date: '6/5/1321 - Evening',
      timeline_variant: 'Sanctuary',
      location: 'Courtyard',
    },
    {
      scene_number: 4,
      scene_title: 'The Silence',
      setup: 'The boats are gone. The Sanctuary is empty, quiet. Just the 12 core members left. It feels huge and echoing. Francisco sits alone. He has \'cleared the clutter,\' but it hurts. La Signora puts a hand on his shoulder. \'Now we can work,\' she says.',
      symbolism: 'The Empty Room. Clarity cost.',
      beat_goal: 'Resolution. The new status quo.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Hollow',
      scene_tone: 'Quiet',
      timeline_date: '6/5/1321 - Night',
      timeline_variant: 'Sanctuary',
      location: 'Main Hall',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 136 - 140',
      description: 'Sanctuary mess-hall loud—bread-fight breaking-out Francisco intervening—noise overwhelming think-hearing-cant timeline-hearing-cant—clutter dangerous-realizing as Noise Choking-Weeds problem unsustainable-state identifying frustration chaotic Essentialism non-essential cost pressure-cooker breaking-point overcrowding.',
      focus: 'Problem identifying unsustainable state through overcrowding chaos.',
      chapterSceneFocus: 'Ch90S1: Sanctuary mess-hall loud bread-fight breaking Francisco intervening noise overwhelming think-cant timeline-cant clutter dangerous-realizing as Noise Choking-Weeds problem unsustainable-state identifies frustration chaotic Essentialism non-essential cost pressure-cooker breaking overcrowding.',
      preliminarySceneFocus: 'Noise Choking-Weeds frustration chaotic',
      preliminarySceneDescription: 'Overcrowding problem unsustainable identifying chaotically frustrated',
      narrativeFunction: 'Establishes Three of Swords necessity through overcrowding crisis; demonstrates Essentialism non-essential cost understanding; shows sanctuary breaking point unsustainable; creates pressure cooker chaos preventing work.',
      sensoryDetail: 'Sanctuary mess hall, loud noise, bread fight breaking, Francisco intervening, noise overwhelming, thinking impossibility, timeline hearing impossibility, clutter recognition, dangerous realization, Noise symbolism, Choking Weeds imagery, chaos atmosphere.',
      internalConflict: 'Francisco experiencing frustration—overwhelmed by noise preventing timeline hearing, recognizing clutter danger to mission, identifying unsustainable overcrowding state requiring painful action.',
      characterGrowthElement: 'Francisco becoming Pruner—recognizing Essentialism necessity through overcrowding chaos, understanding non-essential elements cost mission effectiveness, preparing for Three of Swords painful separation leadership.',
      seriesConnectionResonance: 'Three of Swords heartbreak preparing; Essentialism principle necessity demonstrating; logistics war explaining rebel group feeding; moral cost general sacrifices showing; exiles Book 8 return establishing.',
      sceneCardProgression: 274,
      realWorldContext: 'Essentialism non-essential cost, overcrowding crisis management, leadership pressure.',
      timelineSignificance: '6/5/1321 noon—day after EA-089 sanctuary arrival, overcrowding breaking point reached, Francisco recognizing Three of Swords removal necessity through chaos preventing mission work.',
      saveTheCatBeat: truncate('Pressure - overcrowding unsustainable crisis', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'chaotic_overwhelming',
        narrative_mode: 'frustrated_overwhelmed',
      }),
      learning_objectives: JSON.stringify([
        'Essentialism non-essential cost understanding',
        'Overcrowding crisis recognition',
        'Leadership pressure decision necessity',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Ledger showing three days food',
        'Three of Swords card staring',
        'Logic vs emotion decision',
      ]),
    },
    {
      pages: 'Page 140 - 144',
      description: 'Francisco study quiet—La-Signora ledger showing food-three-days—everyone-keep everyone-starves group-cut core-survives—Three-Swords-card desk staring as Ledger Sword decision logic-emotion resolve cold red-ink ledger dust light-beam jaw-clenched choice pressure Deep-Work Deep-Work.',
      focus: 'Decision choosing logic emotion through ledger reality.',
      chapterSceneFocus: 'Ch90S1: Francisco study quiet La-Signora ledger showing food-three-days everyone-keep everyone-starves group-cut core-survives Three-Swords-card desk staring as Ledger Sword decision logic-emotion resolve cold red-ink ledger dust light-beam jaw-clenched choice pressure Deep-Work.',
      preliminarySceneFocus: 'Ledger Sword resolve cold',
      preliminarySceneDescription: 'Choice decides logic-emotion coldly resolving ledger',
      narrativeFunction: 'Demonstrates Three of Swords decision logic vs emotion; shows ledger harsh reality three days food; creates Francisco resolve through cold calculation; establishes Deep Work principle focus necessity.',
      sensoryDetail: 'Francisco study, quiet atmosphere, La Signora presence, ledger showing, food three days reality, everyone keep everyone starves logic, group cut core survives calculation, Three of Swords card, desk staring, red ink ledger, dust light beam, jaw clenched resolve.',
      internalConflict: 'Francisco experiencing resolve—staring at Three of Swords card understanding necessity, choosing logic over emotion for core survival, accepting Pruner role making unpopular painful choice.',
      characterGrowthElement: 'Francisco embodying Pruner leader—making Three of Swords decision separating families from fighters, choosing logic over emotion for mission survival, accepting Deep Work clarity through removal non-essential clutter.',
      seriesConnectionResonance: 'Three of Swords heartbreak decision; Deep Work focus principle establishing; moral cost general sacrifices demonstrating; logistics war rebel group feeding explaining; ledger reality harsh truth.',
      sceneCardProgression: 275,
      realWorldContext: 'Deep Work focus necessity, logic vs emotion leadership, harsh reality acceptance.',
      timelineSignificance: '6/5/1321 afternoon—hours after mess hall chaos, Francisco studying ledger with La Signora, making Three of Swords decision separating families fighters for core survival through cold logic.',
      saveTheCatBeat: truncate('Pressure - logic chosen emotion painful decision', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'cold_decisive',
        narrative_mode: 'resolved_calculating',
      }),
      learning_objectives: JSON.stringify([
        'Deep Work focus principle mastery',
        'Logic vs emotion leadership necessity',
        'Three of Swords painful choice acceptance',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Courtyard announcement rain',
        'Families Santa Lucia sending',
        'Heartbreak Three of Swords reaction',
      ]),
    },
    {
      pages: 'Page 144 - 147',
      description: 'Courtyard rain—Francisco crate-standing plan-announcing families-Santa-Lucia fighters-stay—reaction shock anger sadness Heartbreak-Three-Swords as Rain-Tears Separation action bad-news delivering pain tragic Life-Changing-Magic discarding-gratitude emotional-climax community-pierced.',
      focus: 'Action delivering bad news through heartbreak announcement.',
      chapterSceneFocus: 'Ch90S3: Courtyard rain Francisco crate-standing plan-announcing families-Santa-Lucia fighters-stay reaction shock anger sadness Heartbreak-Three-Swords as Rain-Tears Separation action bad-news delivers pain tragic Life-Changing-Magic discarding-gratitude emotional-climax community-pierced.',
      preliminarySceneFocus: 'Rain-Tears Separation pain tragic',
      preliminarySceneDescription: 'Announcement delivers bad-news heartbreak separating tragically',
      narrativeFunction: 'Climaxes Three of Swords heartbreak through announcement; demonstrates Life-Changing Magic discarding with gratitude principle; shows community pierced reaction shock anger sadness; creates tragic separation moment.',
      sensoryDetail: 'Courtyard setting, rain falling, Francisco standing crate, plan announcing, families Santa Lucia destination, fighters staying, reaction shock, anger following, sadness settling, Heartbreak Three of Swords, Rain as Tears symbolism, Separation moment, bad news delivery, painful atmosphere.',
      internalConflict: 'Francisco experiencing pain—delivering Three of Swords heartbreak announcement to community, watching shock anger sadness reactions, feeling sword pierce own heart through necessary separation causing suffering.',
      characterGrowthElement: 'Francisco executing Pruner leadership—announcing Three of Swords separation families fighters, applying Life-Changing Magic discarding with gratitude principle, enduring community heartbreak reaction accepting moral cost general sacrifices.',
      seriesConnectionResonance: 'Three of Swords heartbreak climax executing; exiles Book 8 establishing departure; Life-Changing Magic principle demonstrating; moral cost leadership showing; community piercing necessary sacrifice.',
      sceneCardProgression: 276,
      realWorldContext: 'Life-Changing Magic discarding gratitude, leadership heartbreak delivery, necessary separation pain.',
      timelineSignificance: '6/5/1321 evening—hours after decision made, Francisco announcing Three of Swords separation plan courtyard rain, community reacting shock anger sadness heartbreak families fighters separating Santa Lucia.',
      saveTheCatBeat: truncate('Pressure - heartbreak announced separation delivered', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'tragic_climactic',
        narrative_mode: 'pained_resolute',
      }),
      learning_objectives: JSON.stringify([
        'Life-Changing Magic discarding gratitude practice',
        'Leadership heartbreak delivery courage',
        'Three of Swords separation necessity acceptance',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Boats departure silence',
        'Sanctuary empty echoing',
        'Core twelve members remaining',
      ]),
    },
    {
      pages: 'Page 147 - 150',
      description: 'Boats gone sanctuary empty-quiet—twelve-core-members just huge-feeling echoing—Francisco alone-sitting cleared-clutter hurts—La-Signora shoulder-hand now-we-can-work as Empty-Room Clarity-cost resolution new-status-quo hollow quiet footsteps-echo rain-smell space-available realizing bridge-Ch11.',
      focus: 'Resolution establishing new status quo through empty clarity.',
      chapterSceneFocus: 'Ch90S4: Boats gone sanctuary empty-quiet twelve-core-members just huge-feeling echoing Francisco alone-sitting cleared-clutter hurts La-Signora shoulder-hand now-we-can-work as Empty-Room Clarity-cost resolution new-status hollow quiet footsteps-echo rain-smell space-available bridge-Ch11.',
      preliminarySceneFocus: 'Empty-Room Clarity-cost hollow quiet',
      preliminarySceneDescription: 'Resolution status-quo empty clarity hurting quietly',
      narrativeFunction: 'Resolves Three of Swords separation completion; demonstrates Clarity cost through empty sanctuary; shows twelve core members remaining lean fighting force; bridges to Chapter 11 work phase beginning.',
      sensoryDetail: 'Boats gone, sanctuary empty quiet, twelve core members only, huge feeling space, echoing hall, Francisco sitting alone, cleared clutter completion, hurting heart, La Signora hand shoulder, now we can work statement, footsteps echo, rain smell, space available realization.',
      internalConflict: 'Francisco experiencing hollow feeling—cleared clutter hurting despite necessity, sitting alone in empty sanctuary, accepting Clarity cost through Three of Swords heartbreak for mission focus Deep Work enabling.',
      characterGrowthElement: 'Francisco completing Pruner transformation—enduring Three of Swords heartbreak aftermath hollow feeling, accepting Clarity cost empty sanctuary for Deep Work focus, establishing lean core twelve members fighting force ready mission work.',
      seriesConnectionResonance: 'Exiles Book 8 return establishing departure group; Deep Work focus phase beginning; Three of Swords cost accepting; moral cost leadership demonstrating; lean fighting force creating mission effectiveness; sanctuary work phase starting.',
      sceneCardProgression: 277,
      realWorldContext: 'Clarity cost acceptance, Deep Work focus enabling, leadership aftermath pain.',
      timelineSignificance: '6/5/1321 night—families departed sanctuary, Francisco experiencing Three of Swords aftermath hollow feeling, twelve core members remaining ready Deep Work mission focus Chapter 11 beginning.',
      saveTheCatBeat: truncate('Pressure - clarity cost painful empty work ready', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'quiet_hollow',
        narrative_mode: 'hollow_accepting',
      }),
      learning_objectives: JSON.stringify([
        'Clarity cost acceptance mastery',
        'Deep Work focus enabling through removal',
        'Leadership aftermath pain endurance',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Chapter 11 work phase beginning',
        'Lean fighting force mission ready',
        'Exiles returning Book 8',
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
        chapterUniqueIdentifier: 'EA-090',
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

  console.log(`\n✅ EA-090 import complete!`);
  console.log(`\n💔 The Three of Swords has pierced the heart - painful clarity enables the mission forward!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
