import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-097: Triumph (Book 3, Chapter 17)...\n');

  // Find the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-097'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-097 not found. Run create-ea-097-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene 1: The Descent
  console.log('📝 Processing Scene 1: The Descent');
  const scene1Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-097',
    sceneNumber: 1,
    title: 'The Descent',
    setup: 'The entrance to the Sunken Crypt. Dark water. Francisco leads the way. He is confident now. \'Trust the math,\' he tells the Scribe. They dive.',
    symbolism: 'Into the Subconscious (Water).',
    beatGoal: 'The Threshold. Entering the danger zone.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Excitement',
    scene_tone: 'Adventure',
    timeline_date: '6/12/1321 - Day',
    timeline_variant: 'Crypt',
    location: 'Entrance',
  };

  const [insertedScene1] = await db.insert(scenes).values(scene1Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene1.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 241 - 245',
      description: 'Sunken-Crypt entrance-reaching dark-water pooling ancient-stone submerged Francisco leading-confident Trust-the-math Scribe-telling diving-together Threshold-crossing danger-zone entering Subconscious-water symbolism Journey-beginning Excitement-building expedition-launching team-coordinated breath-spells casting Mental-Agility EA-096 applying underwater-navigation magic-practical confidence-high Triumph-approaching.',
      focus: truncate('Francisco leading team diving into Sunken Crypt.', 255),
      chapterSceneFocus: truncate('Ch97S1: Sunken-Crypt entrance dark-water Francisco leading-confident Trust-the-math Scribe-telling diving-together Threshold-crossing danger-zone Subconscious-water Journey-beginning Excitement-building expedition-launching Mental-Agility applying underwater-navigation.', 255),
      preliminarySceneFocus: truncate('Francisco leading dive confident threshold crossing', 255),
      preliminarySceneDescription: 'Francisco confidently leads team diving into Sunken Crypt entrance',
      narrativeFunction: 'Introduces Nine of Cups Triumph chapter through confident Journey beginning Threshold-crossing; demonstrates Francisco leadership confidence post EA-096 Mental Agility success applying lessons practical; establishes Old World Contrast resolution Road of Trials advancement Keystone-quest progress; shows team competence coordinated expedition magic-breathing underwater-navigation.',
      sensoryDetail: 'Water dark murky cold surface-tension breaking diving-descent smooth, stone ancient worn moss-covered slippery texture rough underwater, breath-spell tingling lungs magic-air providing oxygen-flow supernatural comfortable, light-spell casting blue-white glow illuminating darkness penetrating visibility-limited eerie, pressure increasing depth-descending ears-popping adjustment requiring, Francisco voice confident calm reassuring team-leading.',
      internalConflict: 'Francisco feeling confidence-high post EA-096 victory Mental Agility proving versus awareness danger-real crypt-unknown threats-potential; excitement Keystone-discovery approaching versus responsibility team-safety protecting leadership-burden; pride in math-calculations Scribe-research trusting versus humility magic-limitations acknowledging uncertainty-accepting; Triumph-feeling emerging premature possibly hubris-seed planting.',
      characterGrowthElement: 'Francisco demonstrating Grit persistence Keystone-quest continuing Road of Trials advancement; confidence-building from EA-096 tactical-success translating into leadership-assured decisive; Nine of Cups Triumph beginning wish-fulfillment approaching satisfaction-earning through competence-demonstrated team-coordination successful; Journey-initiation threshold-crossing hero-advancement.',
      seriesConnectionResonance: 'EA-096 Mental Agility breathing-spells applying practical-lesson continued; EA-094 Goal Setting Keystone-objective now pursuing actively expedition-launched; Keystone location definitively approaching MacGuffin-quest advancing story-central; team competence establishing major-objective winning capability-demonstrating; Sunken Crypt Ancients-connection hinting builder-mystery introducing.',
      sceneCardProgression: 302,
      realWorldContext: '1321 medieval underwater-exploration magical-means enabling breath-spells physics-defying, ancient-crypts treasure-repositories dungeon-delving adventure-archetype classic, team-coordination essential survival-dependent trust-requiring leadership-critical, mathematical-confidence Scribe-research calculations-trusting medieval-scholarship applying, darkness-underwater claustrophobic dangerous-environment psychological-pressure building.',
      timelineSignificance: '6/12/1321 Day—day after EA-096 night teaching-lesson, expedition-launched Sunken Crypt reaching Keystone-location approaching, Old World Contrast resolution beginning Road of Trials Scene VII advancing, Nine of Cups Triumph chapter-opening Journey-beginning Threshold-crossing MacGuffin-discovery imminent.',
      saveTheCatBeat: 'Old world contrast (resolution) journey beginning',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Dark water ancient stone diving confident blue light',
        emotional_core: 'Excitement confidence journey anticipation',
        character_state: 'Francisco confident leading assured'
      }),
      learning_objectives: JSON.stringify([
        'Grit - persistence in Keystone quest continuing Road of Trials',
        'Mental Agility application - breath spells from EA-096 lessons practical use'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Triumph feeling emerging hubris seed planting Scene 4',
        'Keystone discovery Scene 3 approaching MacGuffin reveal',
        'Ancients connection crypt builders mystery deepening'
      ]),
    })
    .where(eq(scenes.id, insertedScene1.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 2: The Guardian
  console.log('📝 Processing Scene 2: The Guardian');
  const scene2Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-097',
    sceneNumber: 2,
    title: 'The Guardian',
    setup: 'The Puzzle Door. A construct guards it. It asks a riddle of time. Francisco answers it, not with magic, but with philosophy (learned in EA-093). The door opens. The construct bows.',
    symbolism: 'The Sphinx.',
    beatGoal: 'The Test. Proving worthiness.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Confidence',
    scene_tone: 'Mythic',
    timeline_date: '6/12/1321 - Day',
    timeline_variant: 'Crypt',
    location: 'Inner Chamber',
  };

  const [insertedScene2] = await db.insert(scenes).values(scene2Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene2.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 246 - 249',
      description: 'Puzzle-Door reaching construct-guardian ancient standing riddle-time asking test-presenting Francisco answering-philosophy not-magic EA-093 Hierophant-wisdom applying door-opening grinding-stone construct-bowing worthiness-proved Sphinx-symbolism Test-passing Confidence-demonstrating Mythic-tone obstacle-overcoming knowledge-intellectual triumph-building.',
      focus: truncate('Francisco solving riddle with philosophy proving worthiness.', 255),
      chapterSceneFocus: truncate('Ch97S2: Puzzle-Door construct-guardian riddle-time asking Francisco answering-philosophy EA-093 Hierophant-wisdom door-opening construct-bowing worthiness-proved Sphinx-symbolism Test-passing Confidence-demonstrating Mythic-tone obstacle-overcoming.', 255),
      preliminarySceneFocus: truncate('Francisco philosophy riddle solving worthiness proving', 255),
      preliminarySceneDescription: 'Francisco solves time riddle with philosophy not magic proving worthy',
      narrativeFunction: 'Develops Nine of Cups Triumph through Test-passing Obstacle-overcoming worthiness-proving; validates EA-093 Hierophant philosophy-wisdom practical-application knowledge-intellectual over magic-brute; demonstrates Francisco growth-character Magus-evolution teaching-internalized; establishes Mythic-tone epic-scale Ancients-builders respect-earning; shows competence-team major-objective winning capability-validated.',
      sensoryDetail: 'Stone grinding deep resonant door-mechanism ancient activating sound-powerful, bioluminescent moss glowing soft green-blue light-natural eerie beautiful illuminating chamber-inner, construct voice calm measured inhuman-yet-wise riddle-speaking philosophical-tone, Francisco breath steady thinking-deliberate answer-formulating confidence-internal, door opening massive stone-slabs moving slow-weight grinding-scraping gap-widening reveal-dramatic, construct bowing fluid-graceful respect-showing acknowledgment-worthiness.',
      internalConflict: 'Francisco recognizing moment-critical riddle-answer defining access-determining versus confidence-earned philosophy-learned EA-093 trusting; temptation magic-using force-brute versus wisdom philosophy-intellectual answer-proper respecting test-nature; pride in knowledge-accumulated Hierophant-teachings versus humility Ancients-wisdom greater-acknowledging; Confidence-feeling validated-justified versus awareness hubris-potential growing.',
      characterGrowthElement: 'Francisco demonstrating EA-093 Hierophant teaching-integration philosophy-wisdom practical-application showing learning-internalized; Nine of Cups Triumph earning through worthiness-proving intellectual-merit not just power-magical; Confidence-building justified-competence demonstrating growth-authentic; Man\'s Search for Meaning aim-finding purpose-quest validated Keystone-worthy proving.',
      seriesConnectionResonance: 'EA-093 Hierophant illumination philosophy-teaching now paying-off riddle-solving enabling; Ancients-builders establishing crypt-creators Keystone-makers respect-demanding worthiness-testing; Scene 1 Journey-beginning now advancing Obstacle-overcoming progress-demonstrating; Scene 3 Prize-discovery unlocking door-opening access-enabling; construct-bowing foreshadowing respect-Ancients Francisco-earning significance-future.',
      sceneCardProgression: 303,
      realWorldContext: '1321 medieval philosophy-education Francisco-training Bologna-university EA-093 teaching applying, riddle-tests ancient-tradition wisdom-proving mythological-archetype Sphinx-parallel, construct-guardians magical-automatons ancient-technology supernatural-beings, time-riddles philosophical-nature metaphysical-understanding requiring not just knowledge-factual, worthiness-proving medieval-chivalry honor-codes merit-demonstrating tradition.',
      timelineSignificance: '6/12/1321 Day—continuing Scene 1 same-day crypt-descent deeper-progressing, Puzzle-Door reaching Guardian-test passing philosophy-proving EA-093 wisdom-applying, Scene 3 Keystone-discovery enabling door-opening access-granting, Old World Contrast resolution advancing Test-passing worthiness-validated Road of Trials progression.',
      saveTheCatBeat: 'Old world contrast (resolution) test passing',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Stone grinding bioluminescent moss construct calm voice',
        emotional_core: 'Confidence worthiness mythic awe',
        character_state: 'Francisco assured philosophical worthy',
        key_visual_details: [
          'The grinding of stone',
          'The bioluminescent moss',
          'The calm voice of the construct'
        ]
      }),
      learning_objectives: JSON.stringify([
        'EA-093 Hierophant philosophy wisdom practical application demonstrating',
        'Man\'s Search for Meaning - finding aim purpose quest validated worthy proving'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Ancients builders respect Francisco earning future significance',
        'Construct bowing acknowledgment worthiness deeper meaning',
        'Philosophy over magic theme continuing intellectual merit emphasized'
      ]),
    })
    .where(eq(scenes.id, insertedScene2.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 3: The Prize
  console.log('📝 Processing Scene 3: The Prize');
  const scene3Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-097',
    sceneNumber: 3,
    title: 'The Prize',
    setup: 'The Keystone revealed. It is beautiful. It pulses with light. The team stares in awe. Francisco touches the barrier. It is strong. He smiles. \'We know where it is. That is enough for today.\'',
    symbolism: 'The Grail. The Wish.',
    beatGoal: 'The Discovery. The midpoint high.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Greed/Desire',
    scene_tone: 'Wondrous',
    timeline_date: '6/12/1321 - Day',
    timeline_variant: 'Crypt',
    location: 'Sanctum',
  };

  const [insertedScene3] = await db.insert(scenes).values(scene3Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene3.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 250 - 253',
      description: 'Keystone-revealed beautiful pulsing-light energy-humming stasis-field floating team-staring awe-struck Grail-symbolism Wish-granted Francisco barrier-touching strong-powerful resisting smiling-satisfied knowledge-enough today-sufficient Climax-Discovery midpoint-high Greed-Desire feeling MacGuffin-located quest-advanced Triumph-complete Wondrous-tone prize-beheld.',
      focus: truncate('Keystone discovered beautiful pulsing MacGuffin revealed.', 255),
      chapterSceneFocus: truncate('Ch97S3: Keystone-revealed beautiful pulsing-light stasis-field team-awe Francisco barrier-touching strong smiling-satisfied knowledge-enough Climax-Discovery midpoint-high Grail-Wish Triumph-complete Wondrous-tone MacGuffin-located.', 255),
      preliminarySceneFocus: truncate('Keystone revealed beautiful awe discovery triumph', 255),
      preliminarySceneDescription: 'Keystone revealed in all its beauty team awestruck discovery complete',
      narrativeFunction: 'Resolves Nine of Cups Triumph through Discovery-Climax Keystone-revealed MacGuffin-located wish-granted; delivers midpoint-high Old World Contrast resolution quest-advanced major-objective achieved; demonstrates team-competence winning-major validation-capabilities establishing; embodies Grail-Wish symbolism desire-fulfilled satisfaction-earned Man\'s Search for Meaning aim-found; sets-up Scene 4 hubris celebration-excessive Triumph-peak before-fall.',
      sensoryDetail: 'Keystone pulsing rhythmic light-golden warm-glow filling sanctum illuminating ancient-stone, energy humming low-frequency vibration-felt bones-resonating power-tangible overwhelming, stasis-field shimmering transparent barrier-magical containment-perfect floating-suspended weightless-appearing, team faces awe-illuminated wonder-struck mouths-open eyes-wide speechless-moment reverent, Francisco fingers barrier-touching resistance-solid magic-strong impenetrable-yet yielding-slightly testing-careful, sanctum atmosphere charged electric anticipation-fulfilled quest-realized.',
      internalConflict: 'Francisco feeling Greed-Desire possession-wanting Keystone-claiming versus wisdom patience-strategic knowing barrier-strong extraction-planning needed; Triumph-satisfaction quest-advanced versus awareness challenge-real retrieval-difficult ahead; pride in success-team accomplishment-major versus humility power-Keystone greater-than-him respect-requiring; Nine of Cups wish-granted satisfaction-complete versus La-Signora warning-unspoken what-comes-after-nine awareness-subconscious.',
      characterGrowthElement: 'Francisco demonstrating Man\'s Search for Meaning aim-found purpose-realized Keystone-quest validating life-direction confirming; Nine of Cups Triumph earning through persistence-Grit competence-team coordination-successful; wisdom-strategic showing patience knowledge-enough today extraction-planning valuing over greed-immediate grabbing-reckless; leadership-maturity decision-making sound retreat-tactical.',
      seriesConnectionResonance: 'EA-094 Goal Setting Keystone-objective now realized MacGuffin-located definitively quest-advanced; Scene 1-2 Journey-Test culminating here Discovery-reward earned worthiness-proved; Scene 4 celebration will contrast hubris-danger Triumph-peak unstable; Keystone-location establishing extraction-challenge future-chapters Book-3 central-conflict; Ancients-builders power-demonstrating stasis-field technology-advanced mystery-deepening.',
      sceneCardProgression: 304,
      realWorldContext: '1321 medieval quest-narrative Grail-parallel MacGuffin-discovery midpoint-classic structural, stasis-field magical-technology ancient-power preserving artifact-protecting, sanctum sacred-space inner-sanctum architectural-climax dungeon-delving reward-chamber, light-pulsing power-visual artifact-significance conveying awe-inspiring moment-reverent, barrier-touching tactile-confirmation reality-physical dream-realized tangible-proof.',
      timelineSignificance: '6/12/1321 Day—continuing Scene 2 same-day Guardian-test passed door-opened sanctum-entered, Keystone-discovered MacGuffin-revealed quest-advanced midpoint-high achieved, Scene 4 celebration same-night hubris-emerging Triumph-peak unstable, Old World Contrast resolution Climax-Discovery Road of Trials major-advancement Book-3 turning-point.',
      saveTheCatBeat: 'Old world contrast (resolution) discovery climax',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Keystone pulsing golden light stasis field floating awe',
        emotional_core: 'Greed desire wonder triumph satisfaction',
        character_state: 'Francisco satisfied strategic awestruck'
      }),
      learning_objectives: JSON.stringify([
        'Man\'s Search for Meaning - finding aim purpose Keystone quest validated realized',
        'Grit - persistence rewarded discovery achieved through determination',
        'Nine of Cups - wish granted satisfaction earned through competence'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Barrier strong extraction difficult future challenge',
        'Scene 4 hubris celebration excessive Triumph unstable',
        'La Signora awareness what comes after nine reversal pending'
      ]),
    })
    .where(eq(scenes.id, insertedScene3.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 4: The Hubris
  console.log('📝 Processing Scene 4: The Hubris');
  const scene4Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-097',
    sceneNumber: 4,
    title: 'The Hubris',
    setup: 'Campfire outside the crypt. They pass a bottle. Everyone is celebrating. Francisco feels like a god. \'Nothing can stop us.\' La Signora watches the shadows. She sees the Nine of Cups reversed in the embers.',
    symbolism: 'The Gluttony. The False Peak.',
    beatGoal: 'Resolution. Setting up the fall.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Arrogance',
    scene_tone: 'Ominous Celebration',
    timeline_date: '6/12/1321 - Night',
    timeline_variant: 'Crypt Entrance',
    location: 'Campfire',
  };

  const [insertedScene4] = await db.insert(scenes).values(scene4Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene4.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 254 - 255',
      description: 'Campfire-outside crypt-entrance bottle-passing celebrating-team Francisco god-feeling Nothing-can-stop-us declaring Arrogance-peak La-Signora shadows-watching Nine-Cups-reversed embers-seeing ominous-awareness Gluttony-symbolism False-Peak celebration Resolution-dark fall-setup Hubris-complete Triumph-unstable wine-spilled voice-loud arms-crossed contrast-ominous.',
      focus: truncate('Francisco arrogant celebrating La Signora seeing ominous signs.', 255),
      chapterSceneFocus: truncate('Ch97S4: Campfire celebrating Francisco god-feeling Nothing-can-stop-us Arrogance La-Signora shadows-watching Nine-Cups-reversed embers-seeing Gluttony False-Peak Resolution fall-setup Hubris-complete wine-spilled voice-loud arms-crossed.', 255),
      preliminarySceneFocus: truncate('Francisco hubris celebration La-Signora ominous warning', 255),
      preliminarySceneDescription: 'Francisco celebrates arrogantly while La Signora sees ominous reversed Nine',
      narrativeFunction: 'Resolves Nine of Cups Triumph through Resolution-dark Hubris-establishing fall-setup Pivot to Chapter-18 EA-098; demonstrates Arrogance-peak Francisco god-complex developing Nothing-can-stop-us declaring overconfidence-dangerous; contrasts celebration-surface with ominous-undercurrent La-Signora tarot-awareness reversed-Nine foreshadowing; embodies Gluttony False-Peak symbolism satisfaction-excessive unstable Triumph-fragile; completes Old World Contrast resolution Triumph-moment before reversal-incoming.',
      sensoryDetail: 'Campfire flames crackling orange-red sparks-rising smoke-drifting night-air cold contrasting warmth-circle, bottle passing hands-rough wine-spilling red-staining ground earth-dark liquid-wasted celebration-excessive, Francisco voice loud booming confidence-absolute laughter-unrestrained god-like feeling-invincible, La-Signora position peripheral shadows-inhabiting arms-crossed posture-closed face-concerned watching-observant, embers glowing red-orange patterns-shifting Nine-Cups-reversed image-appearing ominous-sign, team voices overlapping celebratory-chaotic awareness-lacking danger-oblivious.',
      internalConflict: 'Francisco feeling Arrogance-absolute god-complex emerging Nothing-can-stop-us believing versus wisdom-buried caution-abandoned hubris-consuming; Triumph-satisfaction justified-earned versus excess-celebration dangerous-overconfidence; pride in team-competence success-major versus blindness to reversal-pending fall-approaching; La-Signora concern-unvoiced versus Francisco-listening unwilling confidence-intoxicated literally-figuratively.',
      characterGrowthElement: 'Francisco demonstrating Nine of Cups reversed-shadow Triumph-excessive becoming Gluttony-arrogance satisfaction-earned corrupting into hubris-dangerous; showing character-flaw god-complex emerging leadership-strength becoming weakness-overconfidence; teaching-moment negative cautionary-tale pride-before-fall classic-archetype; La-Signora wisdom-contrast tarot-knowledge possessing awareness-tragic Francisco-lacking.',
      seriesConnectionResonance: 'Scene 3 Discovery-Climax intoxication-success leading here celebration-excessive hubris-emerging; EA-093 Hierophant burden-leadership now corrupting god-complex developing; EA-096 Mental Agility confidence-tactical becoming arrogance-strategic overreach; Chapter-18 EA-098 will deliver fall-consequence reversal-Nine Triumph-unstable collapsing; tarot-progression Nine-Cups peak-highest before Ten-completion reversal-danger always-present.',
      sceneCardProgression: 305,
      realWorldContext: '1321 medieval celebration-victory drinking-ritual bonding-team traditional wine-sharing, campfire communal-space night-gathering social-bonding storytelling, hubris-classical Greek-tragedy hamartia fatal-flaw pride-excessive gods-angering, tarot-reading embers-divination folk-practice medieval-superstition La-Signora knowledge-esoteric, False-Peak psychological-phenomenon success-premature celebrating overconfidence-breeding failure-inviting.',
      timelineSignificance: '6/12/1321 Night—same-day Scene 3 Discovery-Climax hours-after celebration-beginning, Francisco Arrogance-peak god-complex declaring Nothing-can-stop-us hubris-complete, La-Signora Nine-Cups-reversed seeing fall-foreshadowing, Chapter-18 EA-098 reversal-incoming Triumph-unstable collapsing-imminent, Old World Contrast resolution-complete False-Peak achieved fall-setup established.',
      saveTheCatBeat: 'Old world contrast (resolution) hubris setup',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Campfire flames wine spilling embers reversed-Nine shadows',
        emotional_core: 'Arrogance hubris ominous celebration excessive',
        character_state: 'Francisco arrogant god-like La-Signora concerned observant',
        key_character_moments: [
          'Francisco\'s loud voice',
          'The spilled wine',
          'La Signora\'s crossed arms'
        ]
      }),
      learning_objectives: JSON.stringify([
        'Nine of Cups reversed - Triumph excessive becoming Gluttony arrogance hubris dangerous',
        'Pride before fall - classical hubris teaching overconfidence inviting reversal',
        'Tarot wisdom - La Signora knowledge what comes after nine awareness tragic'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Chapter 18 EA-098 fall reversal Nine Cups collapse imminent',
        'La Signora reversed Nine embers specific prophecy validated',
        'Nothing can stop us Francisco declaring ironic reversal coming',
        'Wine spilled symbolic waste excess Gluttony theme',
        'God feeling hubris peak before divine retribution classic'
      ]),
    })
    .where(eq(scenes.id, insertedScene4.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Verify all scenes
  console.log('🔍 Verifying field completion...\n');
  const allScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  for (const scene of allScenes) {
    const fields = [
      'chapterId', 'chapterUniqueIdentifier', 'sceneNumber', 'title', 'setup',
      'symbolism', 'beatGoal', 'pov', 'tense', 'core_emotion', 'scene_tone',
      'timeline_date', 'timeline_variant', 'location', 'pages', 'description',
      'focus', 'chapterSceneFocus', 'preliminarySceneFocus', 'preliminarySceneDescription',
      'narrativeFunction', 'sensoryDetail', 'internalConflict', 'characterGrowthElement',
      'seriesConnectionResonance', 'sceneCardProgression', 'realWorldContext',
      'timelineSignificance', 'saveTheCatBeat', 'sudowrite_metadata',
      'learning_objectives', 'foreshadowing_elements'
    ];

    const presentFields = fields.filter(field => {
      const value = scene[field as keyof typeof scene];
      return value !== null && value !== undefined && value !== '';
    });

    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ✅ Present: ${presentFields.length}/${fields.length - 1}`);
  }

  console.log('\n✅ EA-097 import complete!\n');
  console.log('📋 The Nine of Cups Triumph - The wish granted, but hubris looms!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
