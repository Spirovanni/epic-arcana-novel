import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎨 Completing ALL EA-026 scene fields...\n');

  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-026'))
    .limit(1);

  if (ch.length === 0) {
    console.error('❌ EA-026 not found');
    process.exit(1);
  }

  const chapter = ch[0];
  console.log(`✅ Found EA-026: ${chapter.title}\n`);

  const ea026Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  console.log(`📝 Adding all fields to ${ea026Scenes.length} scenes...\n`);

  // Complete data for all three scenes
  const sceneData = [
    {
      // Scene 1: The First Assignment
      pages: 'Page 376 - 380',
      description:
        'At dawn in the Equilibrium Gardens, Francisco and Zara receive their first cosmic assignment from Master Cornelius. The Academy\'s satellite facility Destini is experiencing dangerous energy fluctuations threatening cosmic trade routes. Master Cornelius warns them that the solution requires finding the perfect balance point—too much intervention could destabilize further, too little could allow catastrophe. Francisco and Zara realize their new cosmic abilities come with the profound responsibility of knowing precisely how much power to use and when.',
      focus: 'Francisco and Zara receive first assignment and learn that cosmic service requires balance, not maximum power',
      chapterSceneFocus: 'Ch26S1: Understanding that having cosmic power requires learning when to use it and when to hold back',
      preliminarySceneFocus: 'Dawn assignment reveals that cosmic service is about finding balance points, not applying maximum power',
      preliminarySceneDescription:
        'In the Equilibrium Gardens where opposing elements demonstrate perfect natural balance, Master Cornelius assigns Francisco and Zara their first cosmic mission. The Academy\'s satellite facility Destini faces dangerous energy fluctuations. Francisco\'s instinct is to analyze and solve immediately; Zara wants to protect everyone from danger. But Master Cornelius teaches them their first lesson: cosmic service isn\'t about maximum intervention but finding precise balance between too much and too little action.',
      narrativeFunction:
        'Establishes the central theme that cosmic power requires restraint and wisdom. This scene frames their first assignment as a teaching moment about the responsibility that comes with enhanced abilities.',
      sensoryDetail:
        'Dawn light illuminating the Equilibrium Gardens where fire fountains dance beside water streams, earth pillars stand balanced with air currents swirling between them. Master Cornelius\'s calm voice creating teaching space. The visual beauty of perfect natural balance. Temperature cool morning air warming with sunrise. Sense of eager anticipation mixed with learning gravity.',
      internalConflict:
        'Francisco struggles between his enhanced cosmic perception showing him possible solutions and Master Cornelius\'s warning that immediate action might create worse problems. He must resist his scholar instinct to apply knowledge immediately and learn to discern when action serves versus when it harms.',
      characterGrowthElement:
        'Francisco learns that wisdom isn\'t just knowing what to do but knowing when to do it. His cosmic agent transformation requires integrating power with restraint, understanding that maximum capability doesn\'t mean maximum intervention.',
      seriesConnectionResonance:
        'This first assignment establishes the balance principle that governs all Francisco and Zara\'s cosmic interventions throughout the series. Learning when not to act becomes as important as knowing how to act.',
      sceneCardProgression: 33,
      realWorldContext:
        'The assignment mirrors real leadership situations where having power or knowledge doesn\'t automatically mean using it. Draws from medical ethics (do no harm), strategic patience in negotiations, and ecological principles of minimal intervention for maximum system health. References the Taoist concept of wu wei (effortless action) and research on iatrogenic harm showing how well-intentioned interventions can create worse outcomes.',
      timelineSignificance:
        'This first cosmic assignment establishes Francisco and Zara as operational cosmic agents with real responsibilities. Their success or failure will determine their reputation and future assignment complexity.',
      saveTheCatBeat: 'Fun and Games - Learning the Rules of Cosmic Service',
      sudowrite_metadata: {
        sudowrite_pov_guidance:
          'Third Person Limited anchored in Francisco\'s consciousness. Show his eager anticipation of first assignment mixed with the sobering weight of Master Cornelius\'s teaching about balance. Render his enhanced cosmic perception showing him energy patterns across vast distances—the ability feels powerful and demanding of use. Portray his internal tension: the scholar impulse to apply his knowledge immediately versus the wisdom to pause and understand systemic dynamics. When Master Cornelius warns about too much or too little intervention, show Francisco\'s recognition that cosmic agent status brings responsibility, not just power.',
        sudowrite_emotional_arc:
          'Begin with Francisco\'s excitement about first real cosmic assignment. Build through growing awareness that having power means learning restraint. Peak at the moment he recognizes that cosmic service requires discernment more than strength. Resolve in humble determination to learn balance alongside capability.',
        sudowrite_sensory_emphasis:
          'Emphasize dawn light revealing the Equilibrium Gardens\' perfect natural balance—fire and water coexisting, earth and air in harmony. Visual beauty of opposing elements creating stable systems. Sound of Master Cornelius\'s teaching voice. Temperature shift from cool dawn to warm morning. The energetic quality of eagerness balanced with gravity of responsibility.',
      },
      learning_objectives: {
        integration:
          'Thich Nhat Hanh\'s teaching on "right action" manifests as Francisco learns that knowing how to act requires knowing when to act. Goleman\'s impulse control research shows in resisting the urge to immediately apply capabilities. Sinek\'s "Infinite Game" thinking appears in recognizing that cosmic service is about long-term system health, not immediate problem-solving wins.',
        terminal_objectives: [
          'Recognize that having power creates responsibility to use it wisely, not maximally',
          'Develop discernment about when intervention helps versus when it harms',
          'Integrate capability with restraint, understanding balance as dynamic principle',
        ],
      },
      foreshadowing_elements: [
        'The Destini facility crisis previews larger cosmic imbalances requiring similar wisdom',
        'Master Cornelius\'s teaching about balance becomes template for all cosmic interventions',
        'Francisco\'s enhanced perception showing distant patterns hints at future cosmic-scale awareness',
        'Zara\'s protective instinct needing temperance foreshadows ongoing growth in discernment',
        'The Equilibrium Gardens becoming significant location for balance training',
        'References to "cosmic trade routes" hint at larger universal infrastructure to protect',
      ],
    },
    {
      // Scene 2: The Overcorrection Crisis
      pages: 'Page 381 - 385',
      description:
        'Mid-morning at Destini facility, Francisco and Zara confront chaotic energy fluctuations directly. Francisco identifies the root cause and wants to apply full power for correction. Zara wants to shield everyone from harm. They attempt a measured intervention that initially seems successful—but within minutes, overcorrection alarms sound. Their "balanced" approach has swung the facility to the opposite extreme, creating inverse cascade threatening dimensional breach. Francisco and Zara recognize their lesson: balance isn\'t static middle ground but understanding dynamic systems.',
      focus: 'Francisco and Zara discover that their first balanced approach overcorrects, teaching them about dynamic systems',
      chapterSceneFocus: 'Ch26S2: Learning that balance requires understanding dynamic systems, not just finding middle ground',
      preliminarySceneFocus: 'Mid-morning crisis reveals that static balance attempts can create opposite-extreme overcorrections',
      preliminarySceneDescription:
        'Aboard the Destini facility, Francisco and Zara face erratic crystal cores and dimensional distortions. Francisco quickly identifies the problem; Zara senses the crew\'s fear. They attempt measured intervention—careful frequency adjustments with selective shielding. Initially it works, but within minutes overcorrection alarms sound. Their balanced approach has created inverse cascade toward opposite extreme, threatening dimensional breach worse than the original problem. They discover that true balance requires understanding systemic dynamics, not applying static solutions.',
      narrativeFunction:
        'Demonstrates that initial understanding of balance is insufficient for cosmic service. This scene forces Francisco and Zara to recognize that systems are dynamic, requiring continuous perception and adjustment rather than one-time fixes.',
      sensoryDetail:
        'Crystal matrix cores pulsing with erratic light patterns creating visible air distortions. Discordant frequencies felt as vibrations through facility structure. Sound of alarms escalating from silence to urgent warnings. Visual shift from seeming stability to inverse cascade indicators. Temperature fluctuating with energy swings. Crew\'s faces shifting from relief to renewed panic.',
      internalConflict:
        'Zara struggles with the realization that her protective instinct, even when measured, created harm. She must confront that her cosmic guardianship abilities don\'t automatically confer cosmic wisdom—that protection without systemic understanding can endanger the very people she\'s trying to shield.',
      characterGrowthElement:
        'Zara learns that good intentions combined with power but lacking systemic wisdom can create worse outcomes than doing nothing. She discovers that true cosmic guardianship requires humility to pause and understand before protecting.',
      seriesConnectionResonance:
        'This overcorrection experience becomes Zara\'s foundational teaching about the dangers of reactive protection. Throughout the series, she will repeatedly face the choice between immediate protective action and patient systemic understanding.',
      sceneCardProgression: 34,
      realWorldContext:
        'Overcorrection mirrors real phenomena in economics (policy overcorrections causing opposite crises), medicine (treatments creating rebound effects), and engineering (control systems oscillating when gains are too high). Draws from systems theory showing how interventions in complex systems can produce counterintuitive results. References Meadows\' "Thinking in Systems" and the principle that the cure can be worse than the disease.',
      timelineSignificance:
        'Nearly causing a dimensional breach on their first assignment could have ended Francisco and Zara\'s cosmic agent careers. Their ability to recognize and learn from this failure becomes as important as preventing the breach itself.',
      saveTheCatBeat: 'Midpoint - False Victory Becomes Crisis',
      sudowrite_metadata: {
        sudowrite_pov_guidance:
          'Third Person Limited from Zara\'s perspective. Show her dual experience: the facility\'s physical danger through her cosmic guardianship senses and the emotional danger to crew through her empathic awareness. Render her confident implementation of protective shielding, the relief when stabilization seems successful, then the shock and self-doubt when overcorrection alarms sound. Portray her recognition that her protective instinct, unchecked by systemic understanding, nearly created catastrophe worse than the original problem.',
        sudowrite_emotional_arc:
          'Open with Zara\'s determined confidence facing the facility crisis. Build through the satisfaction of seemingly successful intervention. Peak at the horrifying moment when overcorrection becomes apparent—her protection attempt creating greater danger. Resolve in humbling recognition that power without wisdom serves no one.',
        sudowrite_sensory_emphasis:
          'Crystal cores\' erratic pulsing creating rainbow distortions in air. Vibrations of discordant frequencies felt through entire body. Initial silence when stabilization seems achieved. Sudden alarm sounds shattering the relief. Visual cascade of indicators showing inverse swing toward opposite extreme. Crew faces shifting from gratitude to terror. Temperature swings becoming more extreme.',
      },
      learning_objectives: {
        integration:
          'Thich Nhat Hanh\'s teaching on "looking deeply" manifests as the need to understand systems before intervening. Goleman\'s work on consequences of impulsive action shows in the overcorrection crisis. Sinek\'s emphasis on "Why" appears in recognizing the need to understand purpose of system dynamics, not just fix surface problems.',
        terminal_objectives: [
          'Recognize that well-intentioned interventions without systemic understanding can worsen problems',
          'Develop humility to admit when initial approach fails and requires complete rethinking',
          'Understand that complex systems require dynamic perception, not static solutions',
        ],
      },
      foreshadowing_elements: [
        'The overcorrection pattern previews future cosmic-scale intervention challenges',
        'Dimensional breach threat hints at the high stakes of cosmic agent failures',
        'Crew\'s shifting emotions preview Francisco and Zara\'s impact on those they serve',
        'The facility\'s systemic nature foreshadows larger universal systems requiring similar understanding',
        'References to "inverse cascade" hint at cosmic forces that reverse when pushed too hard',
        'Zara\'s protective instinct creating danger becomes recurring growth edge throughout series',
      ],
    },
    {
      // Scene 3: Dynamic Balance Mastery
      pages: 'Page 386 - 390',
      description:
        'Afternoon at Destini\'s Central Balance Chamber, Francisco and Zara pause all interventions to deeply observe the facility\'s systemic rhythms. Francisco realizes his impulse to immediately solve was itself imbalance. Zara discovers her protective shielding prevented natural self-correction. They perceive that the facility\'s imbalance originated from previous technicians forcing stability rather than allowing dynamic equilibrium. Using minimal, precisely timed micro-adjustments to dimensional anchors, they create space for the facility\'s own harmonic systems to self-regulate. The station discovers its own dynamic equilibrium, transforming from chaos to stable functionality through their mastery of knowing when to act and when to allow.',
      focus: 'Francisco and Zara master dynamic balance through minimal intervention empowering system self-regulation',
      chapterSceneFocus: 'Ch26S3: Demonstrating that true cosmic service means minimal intervention empowering natural self-regulation',
      preliminarySceneFocus: 'Afternoon mastery emerges through patient observation and minimal precisely-timed adjustments',
      preliminarySceneDescription:
        'In the Central Balance Chamber, Francisco and Zara achieve breakthrough by pausing all action to observe. Francisco learns that rushing to solve is itself imbalance; sometimes witnessing serves better than analyzing. Zara discovers that shielding everyone from all discomfort prevented the facility\'s natural self-correction. Together they perceive that previous technicians\' constant controlling interventions prevented the station from learning self-regulation. Through minimal micro-adjustments creating space for natural processes, they enable the facility\'s own harmonic systems to find sustainable equilibrium. Master Cornelius witnesses his agents embodying cosmic service: balance as dynamic partnership, not static control.',
      narrativeFunction:
        'Completes the balance learning arc by showing Francisco and Zara discover that effective cosmic service means empowering systems to self-regulate rather than controlling them. This scene establishes their cosmic agent methodology for the entire series.',
      sensoryDetail:
        'Afternoon light settling over the Central Balance Chamber creating stable illumination. Shifting energy patterns between harmony and chaos visible as flowing light. Sound of discordant frequencies gradually harmonizing into sustainable rhythm. Crystal cores\' pulsing slowing from erratic to steady self-regulating pattern. Temperature stabilizing into comfortable equilibrium. Crew\'s faces transforming from fear to wonder to profound relief.',
      internalConflict:
        'Francisco must override his strongest identity trait—the scholar\'s need to analyze and solve—long enough to simply witness and trust natural processes. He struggles to accept that sometimes the highest service is patient observation rather than brilliant intervention.',
      characterGrowthElement:
        'Francisco integrates his scholarly nature with cosmic wisdom, learning that true intelligence includes knowing when not to act. He discovers that mastery isn\'t about always having solutions but about discerning when solutions help versus when they prevent natural healing.',
      seriesConnectionResonance:
        'This dynamic balance mastery becomes Francisco and Zara\'s signature approach throughout the series. Their reputation grows not for overwhelming power but for minimal elegant interventions that empower systems to heal themselves.',
      sceneCardProgression: 35,
      realWorldContext:
        'Dynamic balance mastery mirrors therapeutic approaches emphasizing patient empowerment over provider control, permaculture principles of minimal intervention for maximum yield, and agile methodologies of continuous small adjustments versus big bang solutions. Draws from complexity science showing that resilient systems maintain their own equilibrium when given space. References the difference between dependency-creating aid and capacity-building support.',
      timelineSignificance:
        'Successfully completing their first assignment with breakthrough understanding establishes Francisco and Zara as exceptionally wise cosmic agents. Their dynamic balance approach becomes studied and emulated by other cosmic practitioners across timelines.',
      saveTheCatBeat: 'The Reward - Mastery Through Wisdom',
      sudowrite_metadata: {
        sudowrite_pov_guidance:
          'Third Person Limited back to Francisco\'s consciousness. Show his experience of letting go of the need to solve, the difficult surrender of pausing all intervention to simply observe. Render the gradual shift in his perception as he begins seeing the facility not as problem requiring his solution but as system capable of its own healing given proper support. Portray the moment of breakthrough when he and Zara synchronize minimal adjustments that create space rather than forcing outcomes. When the facility finds its own equilibrium, show his profound recognition that this is what cosmic service means.',
        sudowrite_emotional_arc:
          'Begin with Francisco\'s frustrated determination after overcorrection failure. Build through the difficult discipline of pausing to observe rather than rushing to fix. Peak at the breakthrough moment when he perceives the facility\'s capacity for self-regulation. Resolve in deep satisfaction mixed with humble recognition that wisdom transcends individual brilliance.',
        sudowrite_sensory_emphasis:
          'Afternoon light quality creating contemplative atmosphere. Visual shift from chaotic energy patterns to harmonizing flows. Sound of frequencies moving from discord to harmony over two hours. Crystal cores\' pulsing settling into self-sustaining rhythm. Temperature achieving stable equilibrium. The quality of energy in chamber transforming from desperate to confident. Crew\'s wonder as they witness mastery.',
      },
      learning_objectives: {
        integration:
          'Thich Nhat Hanh\'s "being peace" manifests as Francisco and Zara embodying balanced presence that enables system healing. Goleman\'s research on self-regulation shows in recognizing systems\' innate capacity for equilibrium when not over-controlled. Sinek\'s "Infinite Game" perspective appears in building system capacity for ongoing self-regulation rather than creating dependency on external fixes.',
        terminal_objectives: [
          'Master the art of minimal intervention that empowers rather than controls',
          'Recognize when witnessing and allowing serve better than analyzing and solving',
          'Embody dynamic balance as partnership with natural processes rather than dominance over them',
        ],
      },
      foreshadowing_elements: [
        'Dynamic balance approach becomes their signature cosmic service methodology',
        'The two-hour patient process previews that cosmic service sometimes requires extended presence',
        'Facility discovering self-regulation hints at empowering other cosmic systems similarly',
        'Master Cornelius\'s approval establishes their growing reputation among cosmic authorities',
        'The principle of "minimal intervention for maximum empowerment" becomes their teaching to others',
        'References to natural self-regulation preview cosmic forces\' own capacity for balance when supported',
      ],
    },
  ];

  // Update each scene
  for (let i = 0; i < ea026Scenes.length; i++) {
    const scene = ea026Scenes[i];
    const data = sceneData[i];

    if (!data) continue;

    await db
      .update(scenes)
      .set({
        pages: data.pages,
        description: data.description,
        focus: data.focus,
        chapterSceneFocus: data.chapterSceneFocus,
        preliminarySceneFocus: data.preliminarySceneFocus,
        preliminarySceneDescription: data.preliminarySceneDescription,
        narrativeFunction: data.narrativeFunction,
        sensoryDetail: data.sensoryDetail,
        internalConflict: data.internalConflict,
        characterGrowthElement: data.characterGrowthElement,
        seriesConnectionResonance: data.seriesConnectionResonance,
        sceneCardProgression: data.sceneCardProgression,
        realWorldContext: data.realWorldContext,
        timelineSignificance: data.timelineSignificance,
        saveTheCatBeat: data.saveTheCatBeat,
        sudowrite_metadata: data.sudowrite_metadata,
        learning_objectives: data.learning_objectives,
        foreshadowing_elements: data.foreshadowing_elements,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   📄 Pages: ${data.pages}`);
    console.log(`   🎯 Focus: ${data.focus.substring(0, 50)}...`);
    console.log(`   🎬 Save The Cat Beat: ${data.saveTheCatBeat}`);
    console.log(`   ✓ All 16 fields updated`);
    console.log('');
  }

  console.log('🎉 EA-026 all fields complete and uploaded to Neon DB!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
