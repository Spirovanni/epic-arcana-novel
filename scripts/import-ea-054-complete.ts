import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-054: Adaptable (Book 2, Chapter 14)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-054'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-054 not found. Run create-ea-054-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Rigid Response Fails',
      setup: 'A critical timeline junction in 15th-century Venice is destabilizing. Francisco deploys a \'textbook\' Unity response: Byzantine enforcers to hold the perimeter, Alexandrians to calculate the fix. But the destabilization accelerates—it feeds on their energy. The enemy is not a random breach but a Faceless agent mirroring their tactics. The harder the Byzantines push, the stronger the anomaly gets. Francisco watches from the Command Center as his perfect system begins to crumble, realizing that Dagon knows their playbook better than they do.',
      symbolism: 'The Seven of Swords reversed—failed plans, clumsiness, getting caught in one\'s own trap. The \'feeding\' anomaly represents the danger of rigidity—force applied without adaptation only strengthens the problem. The failure of the \'perfect system\' symbolizes the limitation of pure Unity without Adaptability.',
      beat_goal: 'Demonstrate that the Unity Council\'s current methods are predictable and therefore vulnerable. Establish the \'Faceless\' enemy who turns strength into weakness. Drive Francisco to a moment of tactical crisis where he must abandon the \'proper\' way.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Alarm and frustration',
      scene_tone: 'Urgent and chaotic',
      timeline_date: '5/11/1320 - Morning',
      timeline_variant: 'Primary Timeline / Venetian Nexus',
      location: 'Temporal Command Center & Venetian Nexus (via monitor)',
    },
    {
      scene_number: 2,
      scene_title: 'Drawing the Seven of Swords',
      setup: 'Francisco retreats to his study, staring at the Seven of Swords card. He realizes they are being outplayed because they are being \'honorable\' and predictable. He calls a hasty war room meeting. He proposes a radical switch: The Byzantines won\'t fight; they\'ll cast the illusion. The Alexandrians won\'t calculate; they\'ll charge. The goal is to create \'noise\' that the Faceless cannot predict. The faction leaders resist—it goes against their nature. Francisco must convince them that facing a shapeshifter requires becoming formless.',
      symbolism: 'The Seven of Swords upright—strategy, cunning, mental agility. \'Becoming formless\' connects to \'Antifragile\' concepts—gaining from disorder. The card represents the pivot point: abandoning force for wit.',
      beat_goal: 'Francisco reframes the situation and rallies his allies to a risky, non-intuitive plan. Overcoming their internal rigidity (the internal Gatekeeper) to face the external Guardian.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Intellectual clarity and persuasive urgency',
      scene_tone: 'Argumentative but intellectual',
      timeline_date: '5/11/1320 - Afternoon',
      timeline_variant: 'Primary Timeline',
      location: 'Temporal Command Center - War Room',
    },
    {
      scene_number: 3,
      scene_title: 'The Feint and the Strike',
      setup: 'The plan goes into motion. The Faceless agent in Venice expects another energy containment field. Instead, they get chaos—Byzantine illusions creating fake breaches, while Alexandrian \'berserkers\' (using tech, not muscle) disrupt the local physics. The Faceless agent tries to adapt but pauses—confused by the lack of pattern. In that split second of hesitation, Francisco (projecting his consciousness) and a small strike team steal the stolen timeline energy back, collapsing the anomaly from the inside. They don\'t defeat the agent with power; they trick it into overextending.',
      symbolism: 'The Seven of Swords in action—stealing victory rather than winning it. The \'split second of hesitation\' represents the triumph of OODA loop speed (Observe-Orient-Decide-Act) over raw power. The \'theft\' of energy mirrors the card\'s traditional imagery of the thief sneaking away.',
      beat_goal: 'Execute the adaptive plan. Show the Faceless enemy defeated by unpredictability. Validate Francisco\'s growth as a strategist who can use his allies\' weaknesses as strengths.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Exhilaration and vindication',
      scene_tone: 'Fast-paced, clever, and triumphant',
      timeline_date: '5/11/1320 - Evening',
      timeline_variant: 'Venetian Nexus',
      location: 'Venice 1450 (Timeline Junction)',
    },
    {
      scene_number: 4,
      scene_title: 'The New Protocol',
      setup: 'Back at headquarters, the mood is different. The victory was messy and unorthodox, but it worked. Francisco debriefs the team. They establish a new \'Protocol 7\' (named for the card): when standard logic fails, switch to chaos. The factions are unsettled—they prefer order—but they respect the result. Francisco realizes this is just the beginning; Dagon has many faces, and they will need to be endlessly adaptable to survive. He looks at the timeline monitor; it\'s stable, but he sees how fragile that stability is.',
      symbolism: 'Protocol 7 represents the institutionalization of adaptability—making \'change\' a standard operating procedure. The \'unsettled\' feeling acknowledges that adaptability is uncomfortable, but necessary. The looking at the monitor reflects the heavy crown of leadership—vigilance.',
      beat_goal: 'Consolidate the lesson. Establish \'Adaptability\' not just as a one-time trick, but as a new doctrine for the Unity Council. Close the chapter with the team stronger but warier.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Sober satisfaction',
      scene_tone: 'Reflective and forward-looking',
      timeline_date: '5/11/1320 - Night',
      timeline_variant: 'Primary Timeline',
      location: 'Temporal Command Center',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 196 - 200',
      description: 'Francisco deploys a textbook Unity Council response to a Venetian timeline breach, but the destabilization accelerates as Dagon\'s Faceless agent mirrors and feeds on their rigid tactics, forcing Francisco to realize their methods are predictable and vulnerable.',
      focus: 'Demonstrating the vulnerability of rigid protocols against an adaptive enemy.',
      chapterSceneFocus: 'Ch54S1: Francisco\'s textbook response to a Venetian timeline breach fails catastrophically as a Faceless agent mirrors their tactics, turning Byzantine force into weakness and forcing the realization that Dagon knows their playbook better than they do.',
      preliminarySceneFocus: 'Standard response fails against adaptive enemy',
      preliminarySceneDescription: 'Unity Council\'s rigid protocols exploited by Faceless agent',
      narrativeFunction: 'Establishes the problem: predictable methods fail against shapeshifting enemies, driving Francisco to crisis moment.',
      sensoryDetail: 'Command Center monitoring displays, Venetian timeline junction destabilizing, Byzantine enforcers struggling, anomaly feeding on their energy, Francisco watching perfect system crumble.',
      internalConflict: 'Francisco\'s crisis between trusting the system he built versus abandoning the \'proper\' way for something unorthodox.',
      characterGrowthElement: 'Francisco begins transition from pure idealist to pragmatist, recognizing that fixed plans are brittle.',
      seriesConnectionResonance: 'Introduces Faceless agents who will recur throughout Books 3-6; establishes Francisco as trickster hero.',
      sceneCardProgression: 130,
      realWorldContext: 'Military doctrine failing against asymmetric warfare, rigid organizations outmaneuvered by adaptive opponents.',
      timelineSignificance: 'First major tactical failure for Unity Council, revealing vulnerability to infiltration and adaptation.',
      saveTheCatBeat: truncate('Fun and Games - testing the new world with initial failure', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'accelerating',
        narrative_mode: 'tactical_crisis',
      }),
      learning_objectives: JSON.stringify([
        'Understanding how rigid systems can be exploited',
        'Recognizing when standard protocols become liabilities',
        'The danger of predictability against adaptive enemies',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Faceless agents as recurring threat',
        'Infiltration vulnerability of Unity Council',
        'Need for Protocol 7 and adaptive thinking',
      ]),
    },
    {
      pages: 'Page 200 - 203',
      description: 'Francisco retreats to study the Seven of Swords, realizing they must become unpredictable to defeat a shapeshifter, and convinces resistant faction leaders to swap roles—Byzantines creating illusions while Alexandrians charge—embracing chaos over honor.',
      focus: 'Francisco reframes the crisis and rallies allies to an unorthodox adaptive strategy.',
      chapterSceneFocus: 'Ch54S2: Francisco studies the Seven of Swords and proposes a radical role swap where Byzantines create illusions and Alexandrians charge, convincing resistant faction leaders that facing a shapeshifter requires becoming formless themselves.',
      preliminarySceneFocus: 'Drawing strategy from Seven of Swords',
      preliminarySceneDescription: 'Francisco proposes radical adaptive plan to war room',
      narrativeFunction: 'Pivots from crisis to solution; demonstrates Francisco\'s strategic evolution from idealist to pragmatist.',
      sensoryDetail: 'Seven of Swords card imagery, war room meeting tension, faction leaders\' resistance, Francisco\'s persuasive urgency.',
      internalConflict: 'Francisco must overcome his own preference for honorable methods to embrace cunning and unpredictability.',
      characterGrowthElement: 'Francisco learns to reframe situations and persuade allies to abandon their comfort zones.',
      seriesConnectionResonance: 'Establishes Francisco\'s reputation as strategist-trickster that defines his leadership style in later books.',
      sceneCardProgression: 131,
      realWorldContext: 'Strategic reframing, convincing teams to adopt counterintuitive tactics, OODA loop thinking.',
      timelineSignificance: 'Birth of Protocol 7 concept—institutionalizing adaptability as doctrine.',
      saveTheCatBeat: truncate('Fun and Games - discovering the rules of the new world', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'deliberate',
        narrative_mode: 'strategic_pivot',
      }),
      learning_objectives: JSON.stringify([
        'Strategic reframing under pressure',
        'Persuading allies to embrace discomfort for tactical advantage',
        'The Seven of Swords as cunning strategy vs. theft',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Francisco as trickster hero archetype',
        'Faction discomfort with chaos foreshadows future tensions',
        'The plan\'s execution and potential consequences',
      ]),
    },
    {
      pages: 'Page 203 - 207',
      description: 'The adaptive plan executes: Byzantine illusions create chaos while Alexandrian tech disrupts physics, confusing the Faceless agent long enough for Francisco\'s strike team to steal back timeline energy and collapse the anomaly, winning through trickery rather than power.',
      focus: 'Executing the adaptive plan to defeat the Faceless agent through unpredictability.',
      chapterSceneFocus: 'Ch54S3: Francisco\'s adaptive plan succeeds as Byzantine illusions and Alexandrian disruption create unpredictable chaos, confusing the Faceless agent long enough for Francisco to steal back timeline energy and collapse the anomaly through cunning rather than force.',
      preliminarySceneFocus: 'Adaptive plan defeats Faceless agent',
      preliminarySceneDescription: 'Unpredictable tactics triumph over shapeshifting enemy',
      narrativeFunction: 'Executes the plan, validates Francisco\'s strategic evolution, demonstrates effectiveness of adaptability.',
      sensoryDetail: 'Byzantine illusions creating fake breaches, Alexandrian tech berserkers, Faceless agent\'s confusion, Francisco projecting consciousness, timeline energy theft, anomaly collapse.',
      internalConflict: 'Francisco\'s exhilaration balanced with recognition that this is just the beginning of endless adaptation.',
      characterGrowthElement: 'Francisco validates his growth as strategist who can weaponize allies\' weaknesses as strengths.',
      seriesConnectionResonance: 'Establishes tactical pattern that Francisco will refine in Books 3-6 against Dagon\'s forces.',
      sceneCardProgression: 132,
      realWorldContext: 'Asymmetric warfare victory, OODA loop triumph, strategic deception in action.',
      timelineSignificance: 'First major tactical victory using adaptive methods, proving flexibility beats rigid power.',
      saveTheCatBeat: truncate('Fun and Games - mastering the rules and winning', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very high',
        pacing: 'fast',
        narrative_mode: 'tactical_action',
      }),
      learning_objectives: JSON.stringify([
        'Witnessing adaptive tactics in action',
        'Understanding OODA loop speed advantage',
        'The Seven of Swords principle: stealing victory through cunning',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Dagon has many faces requiring endless adaptation',
        'Faction discomfort with messy victories',
        'Fragility of timeline stability',
      ]),
    },
    {
      pages: 'Page 207 - 210',
      description: 'Francisco debriefs the team and establishes Protocol 7—switching to chaos when logic fails—as new doctrine, with factions unsettled but respectful of results, recognizing they must be endlessly adaptable against Dagon\'s many faces while seeing the fragility of their stability.',
      focus: 'Consolidating the lesson and institutionalizing adaptability as Unity Council doctrine.',
      chapterSceneFocus: 'Ch54S4: Francisco establishes Protocol 7 as new Unity Council doctrine—embracing chaos when standard logic fails—with faction leaders unsettled but respectful, recognizing this messy victory marks the beginning of necessary endless adaptation against Dagon.',
      preliminarySceneFocus: 'Protocol 7 institutionalized as doctrine',
      preliminarySceneDescription: 'Adaptability becomes standard operating procedure',
      narrativeFunction: 'Consolidates the chapter\'s lesson, establishes new operating paradigm, sets up ongoing adaptive challenges.',
      sensoryDetail: 'Debrief atmosphere, faction leaders\' unsettled respect, timeline monitor showing stability, Francisco\'s vigilant gaze.',
      internalConflict: 'Francisco balances satisfaction with victory against awareness of fragility and ongoing responsibility.',
      characterGrowthElement: 'Francisco embodies the heavy crown of leadership—endless vigilance and adaptation required.',
      seriesConnectionResonance: 'Protocol 7 becomes recurring tactical framework throughout the series; establishes adaptive doctrine.',
      sceneCardProgression: 133,
      realWorldContext: 'Institutionalizing lessons learned, creating doctrine from tactical victories, organizational learning.',
      timelineSignificance: 'Formal adoption of adaptive doctrine marks shift in Unity Council operating philosophy.',
      saveTheCatBeat: truncate('Fun and Games - establishing new rules for the upside-down world', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'reflective',
        narrative_mode: 'consolidation',
      }),
      learning_objectives: JSON.stringify([
        'Institutionalizing tactical lessons as doctrine',
        'Balancing victory satisfaction with ongoing vigilance',
        'Accepting adaptability as permanent requirement not one-time trick',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Fragility of timeline stability',
        'Dagon\'s many faces requiring endless adaptation',
        'Faction discomfort that may resurface under pressure',
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
        chapterUniqueIdentifier: 'EA-054',
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

  console.log(`\n✅ EA-054 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
