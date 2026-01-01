import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-096: Mental Agility (Book 3, Chapter 16)...\n');

  // Find the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-096'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-096 not found. Run create-ea-096-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene 1: The Trap
  console.log('📝 Processing Scene 1: The Trap');
  const scene1Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-096',
    sceneNumber: 1,
    title: 'The Trap',
    setup: 'The Broken Bridge. It looks enticingly easy to cross. Francisco stops the team. He senses the \'Stiffness\' of the air. The enemy expects him to be desperate. He needs to be \'Agile.\'',
    symbolism: 'The Baited Hook.',
    beatGoal: 'The Recognition. Seeing the game.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Suspicion',
    scene_tone: 'Quiet Tension',
    timeline_date: '6/11/1321 - Afternoon',
    timeline_variant: 'Forest',
    location: 'Bridge',
  };

  const [insertedScene1] = await db.insert(scenes).values(scene1Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene1.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 226 - 229',
      description: 'Broken-Bridge appearing enticingly-easy crossing-inviting Francisco team-stopping suspicion-sensing air-stiffness feeling wrong birds-quiet unnatural enemy-expecting desperation frontal-thinking Mental-Agility requiring Page-Swords mode-shifting Challenge-recognizing game-seeing trap-awareness dawning bait-obvious once-noticed Alertness-heightening reconnaissance-beginning.',
      focus: truncate('Francisco recognizing ambush trap at bridge.', 255),
      chapterSceneFocus: truncate('Ch96S1: Broken-Bridge enticingly-easy Francisco team-stopping suspicion-sensing air-stiffness birds-quiet enemy-expecting desperation Mental-Agility requiring Page-Swords mode-shifting Challenge-recognizing game-seeing trap-awareness Alertness-heightening.', 255),
      preliminarySceneFocus: truncate('Francisco sensing trap suspicion alertness', 255),
      preliminarySceneDescription: 'Francisco recognizes ambush setup through environmental awareness',
      narrativeFunction: 'Introduces Page of Swords Mental Agility through trap recognition Challenge presenting; demonstrates System 2 analytical thinking engaging Thinking Fast and Slow principle; establishes Fun and Games beat intellectual combat beginning; shows enemy competence Inquisitor M worthy opponent strategic planning Francisco tactical awareness matching.',
      sensoryDetail: 'Bridge wood weathered gray appearing structurally sound deceptively inviting, air stiffness unnatural silence pressing atmosphere wrong-feeling, birds absent chirping ceased warning-sign obvious, forest sounds muted dampened magical-interference suggesting, Francisco breath shallow careful observation-mode entering hyper-awareness activated, team footsteps halting Francisco hand-raising stop-signal urgent.',
      internalConflict: 'Francisco balancing urgency mission-progress versus caution trap-awareness survival-prioritizing; desire to trust versus instinct questioning environment-reading; confidence in abilities versus respect for enemy-competence Inquisitor M strategic mind matching; System 1 quick-reaction urge versus System 2 analytical-thinking deliberate-process engaging.',
      characterGrowthElement: 'Francisco demonstrating Mental Agility Page of Swords teaching pattern-recognition through subtle-cues environmental-awareness; Thinking Fast and Slow System 2 engaging deliberate analytical-thinking over reactive-impulse; showing leadership through caution team-protection decision-making modeling strategic-thinking teaching moment creating.',
      seriesConnectionResonance: 'EA-095 Focused Anguish vigilance now manifesting tactical-awareness here; Inquisitor M establishing as recurring-villain intellectual-opponent worthy strategic; magic limitations showing ambush relying on psychology not just power; Fun and Games beat contrasting EA-095 dark-tone with clever-playful tactical-challenge intellectual-combat.',
      sceneCardProgression: 298,
      realWorldContext: '1321 medieval forest travel dangerous exposed vulnerable, bridge crossing strategic-chokepoint ambush-location ideal tactical, environmental awareness survival-skill critical pre-industrial era, bird behavior natural-warning system hunters recognizing, broken infrastructure common post-conflict areas trap-potential obvious strategic-minds.',
      timelineSignificance: '6/11/1321 Afternoon—day after EA-095 morning Burden scene, scouts reporting suspicious-activity Francisco investigating mission-beginning, Fun and Games beat opening intellectual-combat Inquisitor M challenge establishing Part 2 tactical-conflict demonstrating.',
      saveTheCatBeat: 'Fun and games (event/conflict) trap recognition',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Broken bridge enticingly easy birds silent',
        emotional_core: 'Suspicion alertness game-recognizing',
        character_state: 'Francisco cautious analytical hyper-aware'
      }),
      learning_objectives: JSON.stringify([
        'Thinking, Fast and Slow - engaging System 2 analytical thinking over reactive System 1 impulse',
        'The Obstacle Is the Way - recognizing trap as information revealing enemy position strategy'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Inquisitor M strategic competence establishing recurring threat',
        'Rune trap Scene 2-3 will trigger revealing enemy',
        'Page of Swords wit Scene 3 mocking enemies teaching moment'
      ]),
    })
    .where(eq(scenes.id, insertedScene1.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 2: The Pivot
  console.log('📝 Processing Scene 2: The Pivot');
  const scene2Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-096',
    sceneNumber: 2,
    title: 'The Pivot',
    setup: 'Francisco explains the plan. No magic. Just physics. They will trigger the trap with a counter-weight. He is grinning. This is the \'Fun and Games\' beat. He enjoys outsmarting them. The Page of Swords loves a puzzle.',
    symbolism: 'The Fulcrum.',
    beatGoal: 'The Plan. Creative problem solving.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Mischief',
    scene_tone: 'Active',
    timeline_date: '6/11/1321 - Afternoon',
    timeline_variant: 'Forest',
    location: 'Underbrush',
  };

  const [insertedScene2] = await db.insert(scenes).values(scene2Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene2.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 230 - 234',
      description: 'Francisco plan-explaining no-magic just-physics counterweight-using trap-triggering remote-safe grinning-mischievous Fun-Games beat-embodying outsmarting-enjoying Page-Swords puzzle-loving team-instructing rope-knotting stone-positioning lever-physics demonstrating creative-problem-solving Process-detailing hand-gestures quick animated excitement-visible tactical-mind working.',
      focus: truncate('Francisco planning physics-based trap trigger feint.', 255),
      chapterSceneFocus: truncate('Ch96S2: Francisco plan-explaining no-magic just-physics counterweight-using trap-triggering grinning-mischievous Fun-Games outsmarting-enjoying Page-Swords puzzle-loving creative-problem-solving Process-detailing hand-gestures quick excitement-visible.', 255),
      preliminarySceneFocus: truncate('Francisco explaining counterweight plan grinning mischief', 255),
      preliminarySceneDescription: 'Francisco devises physics-based plan to trigger trap remotely',
      narrativeFunction: 'Develops Page of Swords Mental Agility through creative problem-solving Process demonstrating; embodies Fun and Games beat intellectual-enjoyment tactical-puzzle relishing; shows magic limitations physics-solution more-elegant teaching moment; establishes Francisco leadership through teaching explaining team-building collaborative-planning fostering.',
      sensoryDetail: 'Rope fibers rough hands-working intricate-knots tying Francisco fingers-nimble practiced, stone heavy granite smooth selecting counterweight perfect-mass calculating, underbrush concealing team hidden observers safe-distance positioning, Francisco hands gesturing quick animated explaining enthusiastic teaching-mode engaged, team eyes following tracking understanding dawning minds-engaged puzzle-solving collaborative, forest floor soft mulch kneeling workspace natural.',
      internalConflict: 'Francisco enjoying intellectual-challenge puzzle-solving versus awareness danger-real lives-risking; mischief playful-enjoyment versus responsibility leadership team-safety prioritizing; pride in cleverness-tactical versus humility enemy-competence respecting; teaching-desire sharing-knowledge versus time-pressure execution-urgency balancing.',
      characterGrowthElement: 'Francisco demonstrating Page of Swords essence wit-intelligence over brute-force preferring; Mental Agility teaching creative-solutions finding constraints-within working magic-limitations acknowledging; leadership-style collaborative explaining teaching rather than commanding dictating trust-building team-development fostering; Fun and Games showing joy-intellectual challenge-embracing resilience-maintaining.',
      seriesConnectionResonance: 'Scene 1 trap-recognition leading to this solution-creation mental-process demonstrating; magic limitations theme continuing EA-095 vigilance now tactical-creativity expressing; Scene 3 execution will validate this planning process-trust establishing; Inquisitor M opponent-worthy making victory-sweeter intellectual-match providing; Page of Swords contrasting Nine of Swords EA-095 playful-clever versus anxious-dark.',
      sceneCardProgression: 299,
      realWorldContext: '1321 medieval physics understanding lever-systems pulley-mechanics basic engineering available, rope-craft essential-skill travelers soldiers commonly-knowing, counterweight principles siege-warfare catapults familiar application, teaching-through-doing medieval pedagogy standard hands-on learning, team-collaboration survival-necessity coordinated-action requiring trust-building.',
      timelineSignificance: '6/11/1321 Afternoon—continuing Scene 1 same-afternoon reconnaissance immediate-planning, Francisco Mental Agility demonstrating creative-solution devising, Scene 3 sunset execution hours-away preparation critical Fun and Games beat Process-phase establishing.',
      saveTheCatBeat: 'Fun and games (event/conflict) plan devising',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Intricate knots heavy stone quick hand gestures',
        emotional_core: 'Mischief excitement puzzle-solving joy',
        character_state: 'Francisco grinning animated teaching',
        key_visual_details: [
          'The intricate knots of the rope',
          'The heavy stone',
          'Francisco\'s quick hand gestures'
        ]
      }),
      learning_objectives: JSON.stringify([
        'The Obstacle Is the Way - using trap as opportunity turning enemy strategy against them',
        'Thinking, Fast and Slow - System 2 creative problem-solving deliberate planning physics-based solution'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Counterweight mechanism Scene 3 will execute successfully',
        'No magic approach demonstrating limitations theme continuing',
        'Team collaboration building trust future missions enabling'
      ]),
    })
    .where(eq(scenes.id, insertedScene2.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 3: The Trigger
  console.log('📝 Processing Scene 3: The Trigger');
  const scene3Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-096',
    sceneNumber: 3,
    title: 'The Trigger',
    setup: 'They drop the stone. The bridge explodes in purple fire. The hidden Inquisitors jump out, shouting \'Attack!\' But there is no one there. Francisco watches from the ridge. He has wasted their resources and revealed their position.',
    symbolism: 'The Smoke and Mirrors.',
    beatGoal: 'The Execution. The feint.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Satisfaction',
    scene_tone: 'Exciting',
    timeline_date: '6/11/1321 - Sunset',
    timeline_variant: 'Forest',
    location: 'Ridge',
  };

  const [insertedScene3] = await db.insert(scenes).values(scene3Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene3.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 235 - 238',
      description: 'Stone-dropping counterweight-releasing bridge-exploding purple-fire magical rune-trap triggered Inquisitors-hidden jumping-out Attack-shouting no-one-there empty-space confusion-evident Francisco ridge-watching safe-distance observing resources-wasted position-revealed Execution-successful feint-complete Satisfaction-feeling tactical-victory intellectual-triumph Smoke-Mirrors illusion-mastery.',
      focus: truncate('Trap triggering remotely revealing confused enemies.', 255),
      chapterSceneFocus: truncate('Ch96S3: Stone-dropping bridge-exploding purple-fire Inquisitors-jumping Attack-shouting no-one-there Francisco ridge-watching resources-wasted position-revealed Execution-successful feint-complete Satisfaction tactical-victory Climax-Intellectual Smoke-Mirrors.', 255),
      preliminarySceneFocus: truncate('Trap exploding enemies revealed confused victory', 255),
      preliminarySceneDescription: 'Remote trigger reveals hidden enemies wasting their resources',
      narrativeFunction: 'Resolves Page of Swords Mental Agility through successful Execution feint-demonstrating Climax intellectual-combat peak; validates Scene 2 planning process-trust establishing tactical-thinking rewarding; demonstrates Obstacle Is the Way turning enemy-trap into information-advantage strategic-victory; reveals enemy-competence Inquisitor M strategic but outsmarted Francisco superior-tactics proving.',
      sensoryDetail: 'Stone falling air-whistling descent-rapid gravity-accelerating impact-moment suspense-building, bridge exploding sudden violent purple-fire magical rune-energy releasing heat-wave expanding, Inquisitors emerging underbrush-from shouting attack-cries coordinated-movement military-discipline showing, confusion-dawning faces-visible target-absent realization-spreading empty-space confronting, Francisco ridge-position elevated safe-distance panoramic-view tactical-advantage observing, sunset light orange-red dramatic backlighting scene-illuminating theatrical-moment.',
      internalConflict: 'Francisco feeling satisfaction-tactical victory-savoring versus awareness danger-still-present ongoing-threat; pride in outsmarting-enemies intellectual-superiority demonstrating versus humility next-time they-adapt learning; enjoyment moment-celebrating versus urgency escape-executing time-limited window; Page of Swords wit-desire mocking-urge versus strategic-silence position-not-revealing discipline-maintaining.',
      characterGrowthElement: 'Francisco mastering Page of Swords feint-execution tactical-deception demonstrating Mental Agility practical-application successful; Obstacle Is the Way embodying enemy-attack transformed into advantage-strategic resources-wasted position-revealed; leadership-validation team-trust earned plan-execution successful collaborative-victory achieving; intellectual-confidence building competence-tactical deepening strategic-mind developing.',
      seriesConnectionResonance: 'Scene 1 trap-recognition and Scene 2 planning culminating here execution-successful mental-process complete; Inquisitor M establishing worthy-opponent but outsmarted this-round ongoing-rivalry foreshadowing; magic limitations validated physics-solution succeeding elegant-simple; Fun and Games beat peak-moment intellectual-victory celebrating contrasting EA-095 dark-anxiety with playful-triumph tactical-joy; Scene 4 will extract lesson teaching-moment.',
      sceneCardProgression: 300,
      realWorldContext: '1321 medieval magical-combat rune-traps expensive resources-limited wasting-significant tactical-loss, Inquisitor coordination showing military-training Vatican resources-substantial organizational-capacity, ridge position tactical-advantage elevation providing sightlines-superior ancient-warfare principle, sunset timing visibility-shifting escape-enabling darkness-approaching tactical-window, feint military-tactic deception-strategy ancient-principle Sun-Tzu Art of War.',
      timelineSignificance: '6/11/1321 Sunset—hours after Scene 2 afternoon planning execution-timing perfect, trap-triggering successful enemy-revealing resources-wasting tactical-victory Francisco Mental Agility demonstrating, Scene 4 night return teaching-moment extracting Fun and Games Climax intellectual-peak achieving.',
      saveTheCatBeat: 'Fun and games (event/conflict) execution climax',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Bridge exploding purple fire enemies shouting empty space',
        emotional_core: 'Satisfaction triumph tactical-victory',
        character_state: 'Francisco observing safe calculating victorious'
      }),
      learning_objectives: JSON.stringify([
        'The Obstacle Is the Way - turning enemy trap into strategic advantage information revealing',
        'Thinking, Fast and Slow - System 2 planning validated tactical-execution successful deliberate-thinking rewarded'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Inquisitor M will adapt next encounter learning from defeat',
        'Page of Swords wit Scene 4 teaching moment extracting',
        'Ongoing rivalry Francisco versus Inquisitor M intellectual-combat continuing'
      ]),
    })
    .where(eq(scenes.id, insertedScene3.id));

  console.log(`   ✅ Updated with enhanced narrative fields\n`);

  // Scene 4: The Lesson
  console.log('📝 Processing Scene 4: The Lesson');
  const scene4Data = {
    chapterId: chapter.id,
    chapterUniqueIdentifier: 'EA-096',
    sceneNumber: 4,
    title: 'The Lesson',
    setup: 'Back at camp. Francisco teaches the \'Page of Swords\' lesson. \'The mind is sharper than the blade.\' They debrief. He encourages them to think of three ways they could have died, and three ways they could have won.',
    symbolism: 'The Whetstone.',
    beatGoal: 'Resolution. Mental toughness.',
    pov: '3rd Person Limited (Francisco)',
    tense: 'Past Tense',
    core_emotion: 'Pride',
    scene_tone: 'Didactic',
    timeline_date: '6/11/1321 - Night',
    timeline_variant: 'Sanctuary',
    location: 'Campfire',
  };

  const [insertedScene4] = await db.insert(scenes).values(scene4Data).returning();
  console.log(`   ✅ Inserted scene with ID: ${insertedScene4.id}`);

  await db
    .update(scenes)
    .set({
      pages: 'Page 239 - 240',
      description: 'Camp-returning night-falling campfire-gathering Francisco teaching-mode Page-Swords lesson-extracting mind-sharper-than-blade stating debriefing-team three-ways died-could three-ways won-could encouraging mental-toughness building Resolution-achieving Integration-demonstrating Pride-feeling team-growth witnessing learning-visible Whetstone-symbolism sharpening-minds firelight-dancing laughter-sharing camaraderie-building.',
      focus: truncate('Francisco teaching mental toughness lesson debriefing team.', 255),
      chapterSceneFocus: truncate('Ch96S4: Camp-returning Francisco teaching Page-Swords mind-sharper-than-blade debriefing three-ways died-won encouraging mental-toughness Resolution Pride team-growth Integration Whetstone-sharpening firelight-dancing laughter-sharing.', 255),
      preliminarySceneFocus: truncate('Francisco teaching mental-toughness lesson debriefing', 255),
      preliminarySceneDescription: 'Francisco extracts Page of Swords lesson teaching mental toughness',
      narrativeFunction: 'Resolves Page of Swords Mental Agility through Integration teaching-moment lesson-extracting; demonstrates Resolution mental-toughness building three-scenarios exercise critical-thinking developing; establishes Francisco leadership-pedagogy teaching-style collaborative learning-focused team-development prioritizing; completes Fun and Games beat intellectual-victory translating into wisdom-practical growth-sustainable.',
      sensoryDetail: 'Campfire flames dancing orange-yellow heat-radiating warmth-providing circle-gathering intimate, night darkness surrounding forest-sounds crickets-chirping nocturnal-life active peaceful-contrast mission-tension, team faces firelight-illuminated expressions-animated discussion-engaged minds-active learning-visible, Francisco dagger-sharpening whetstone-scraping rhythmic-sound meditative teaching-accompanying symbolic-action, laughter genuine warm camaraderie-evident bonds-strengthening trust-deepening, smoke rising spiral-patterns stars-above.',
      internalConflict: 'Francisco feeling pride team-performance victory-celebrating versus awareness complacency-danger next-encounter harder; satisfaction teaching-effective learning-visible versus concern sustainability long-term vigilance-maintaining; enjoyment camaraderie-moment connection-team versus isolation Hierophant-role leadership-burden distance-creating; confidence tactical-mind versus humility continuous-learning enemy-adapting reality.',
      characterGrowthElement: 'Francisco demonstrating Page of Swords complete-teaching wit-intelligence translating into wisdom-practical Mental Agility pedagogy; leadership-evolution from commander to teacher collaborative-learning fostering team-empowerment building; mental-toughness modeling three-scenarios exercise resilience-developing critical-thinking encouraging; Integration showing tactical-victory must yield growth-sustainable learning-continuous principle establishing.',
      seriesConnectionResonance: 'Scene 3 tactical-victory now translating teaching-moment wisdom-extracting; EA-095 Nine of Swords dark-burden contrasting with this Page of Swords playful-teaching leadership-balance showing; EA-093 Hierophant teaching-role deepening pedagogy-developing Order-building continuing; Fun and Games beat complete intellectual-combat enjoyed lesson-learned growth-achieved; future-missions this training-foundation enabling.',
      sceneCardProgression: 301,
      realWorldContext: '1321 medieval campfire communal-space social-bonding military-tradition debriefing, oral-tradition teaching storytelling-pedagogy knowledge-transfer primary medieval-education, dagger-sharpening practical-maintenance symbolic-ritual warrior-culture discipline-demonstrating, three-scenarios exercise tactical-thinking medieval-strategy training-method, night-teaching relaxed-atmosphere informal-learning social-bonding combining effectiveness-pedagogical.',
      timelineSignificance: '6/11/1321 Night—hours after Scene 3 sunset trap-success returning Sanctuary safe, Francisco teaching Page of Swords lesson Mental Agility Integration complete, Fun and Games beat resolved intellectual-victory wisdom-yielding team-growth demonstrating mental-toughness building EA-096 complete.',
      saveTheCatBeat: 'Fun and games (event/conflict) resolution teaching',
      sudowrite_metadata: JSON.stringify({
        visual_anchor: 'Campfire dancing Francisco sharpening dagger team laughing',
        emotional_core: 'Pride satisfaction teaching camaraderie',
        character_state: 'Francisco teaching proud satisfied pedagogical',
        key_character_moments: [
          'The laughter of the team',
          'The firelight dancing',
          'Francisco sharpening his dagger'
        ]
      }),
      learning_objectives: JSON.stringify([
        'Page of Swords teaching - The mind is sharper than the blade Mental Agility wit-intelligence',
        'Thinking, Fast and Slow - three-scenarios exercise engaging System 2 critical-thinking deliberate-analysis',
        'The Obstacle Is the Way - extracting lesson from victory continuous-learning resilience-building'
      ]),
      foreshadowing_elements: JSON.stringify([
        'Mental toughness training future missions enabling harder challenges',
        'Three-scenarios exercise methodology recurring teaching-tool',
        'Team bonds strengthening collective-capability building Order-foundation'
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

  console.log('\n✅ EA-096 import complete!\n');
  console.log('📋 The Page of Swords Mental Agility - The mind is sharper than the blade!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
