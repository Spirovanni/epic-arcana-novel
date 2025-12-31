import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-079: Quicken (Book 2, Chapter 39)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-079'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-079 not found. Run create-ea-079-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Skyfall',
      setup: 'The clouds break. Allied Cruisers drop into the atmosphere. The sonic boom flattens the drones. It is the cavalry. But the ground is shaking. The \'Raw\' timeline (EA-075) is rejecting them. Fissures open. The extraction point is 2 clicks North. \'Run!\'',
      symbolism: 'The Trumpet Blast. The Earthquake. The finish line.',
      beat_goal: 'The Start Gun. Immediate transition to movement.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Panic/Hope',
      scene_tone: 'Epic',
      timeline_date: '11/8/1320 - Dawn',
      timeline_variant: 'Base Zero',
      location: 'Base Zero',
    },
    {
      scene_number: 2,
      scene_title: 'The Sprint',
      setup: 'They are running. Drones are chasing. Rocks are falling. Francisco doesn\'t think. He shoots a drone, jumps a log, pulls a comrade up. It is fluid. He is in Flow (from Book 1). The Eight of Wands energy propels them. They are faster than fear.',
      symbolism: 'The Arrow. The blurred background. The tunnel vision of speed.',
      beat_goal: 'The Action. overcoming obstacles through speed.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Flow',
      scene_tone: 'Fast',
      timeline_date: '11/8/1320 - Early Morning',
      timeline_variant: 'The Gauntlet',
      location: 'The Wilderness',
    },
    {
      scene_number: 3,
      scene_title: 'The Link-Up',
      setup: 'They reach the Sky Bridge. It\'s a natural arch. The ship hovers above it. The ramp is down. But the bridge is cracking. The arch breaks. A chasm opens. Novella slides. Francisco grabs her. He swings her over. \'Go!\' He is the last one on the crumbling side.',
      symbolism: 'The chasm. The helping hand. The leap of faith.',
      beat_goal: 'The Climax (of the book). The final jump.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Selfless',
      scene_tone: 'Vertical',
      timeline_date: '11/8/1320 - Early Morning',
      timeline_variant: 'The Edge',
      location: 'The Sky Bridge',
    },
    {
      scene_number: 4,
      scene_title: 'The Ascension',
      setup: 'Francisco jumps. He falls. The ground rushes up. Then—light. The tractor beam catches him. He is yanked upward. He sees the ground explode below him. Base Zero, the Wall, the Generator—all gone. He is pulled into the ship bay. The airlock hisses shut. Silence. He is safe. The \'Flight\' is over.',
      symbolism: 'The Ascension. The womb of the ship. The silence after the storm.',
      beat_goal: 'Resolution. Book 2 ends.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Safety',
      scene_tone: 'Quiet finale',
      timeline_date: '11/8/1320 - Morning',
      timeline_variant: 'The Rescue Ship',
      location: 'Airlock',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 571 - 575',
      description: 'Clouds breaking Allied Cruisers dropping atmosphere—sonic boom flattening drones cavalry arriving—ground shaking Raw timeline rejecting—fissures opening extraction 2-clicks North \'Run!\' as Trumpet Earthquake finish-line triggers immediate movement start-gun panic-hope epic cue-response habit begins Book 2 climax escape finale.',
      focus: 'Start Gun triggering immediate movement through rescue arrival.',
      chapterSceneFocus: 'Ch79S1: Clouds breaking Cruisers dropping sonic boom cavalry—ground shaking Raw rejecting fissures opening 2-clicks \'Run\' as Trumpet Earthquake finish triggers movement start panic-hope epic cue-response habit climax begins.',
      preliminarySceneFocus: 'Trumpet Earthquake triggers finish epic',
      preliminarySceneDescription: 'Cavalry arrival forces immediate escape panic-hope',
      narrativeFunction: 'Triggers Book 2 finale escape; demonstrates Power of Habit cue-response; begins Eight of Wands speed sequence.',
      sensoryDetail: 'Clouds breaking, Allied Cruisers, atmosphere dropping, sonic boom, drones flattening, cavalry arrival, ground shaking, Raw timeline, rejection, fissures opening, extraction point, 2 clicks North, Run command, reality delaminating.',
      internalConflict: 'Francisco experiencing panic and hope simultaneously—recognizing rescue while facing immediate collapse threat.',
      characterGrowthElement: 'Francisco entering Eight of Wands mode—shifting to pure speed and direct action, relying on Atomic Habits automatic responses developed throughout Book 2.',
      seriesConnectionResonance: 'Book 2 climax beginning; Eight of Wands speed establishing; narrative momentum propelling to Book 3; missing piece left behind setup.',
      sceneCardProgression: 230,
      realWorldContext: 'Power of Habit cue-response, automatic action, escape urgency.',
      timelineSignificance: '11/8/1320 dawn—rescue arrival triggering final escape sequence, Raw timeline rejecting presence beginning Book 2 finale.',
      saveTheCatBeat: truncate('Finale - rescue triggers escape sequence', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'epic_trigger',
        narrative_mode: 'panic_hope_urgent',
      }),
      learning_objectives: JSON.stringify([
        'Power of Habit cue-response',
        'Eight of Wands direct action',
        'Automatic response under pressure',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Sprint through obstacles',
        'Flow state activation',
        'Sky Bridge crossing',
      ]),
    },
    {
      pages: 'Page 575 - 578',
      description: 'Running drones chasing rocks falling—Francisco not-thinking shooting jumping pulling—fluid Flow Book 1—Eight Wands energy propelling faster-than-fear as Arrow blurred tunnel-vision speed overcomes obstacles through action chasing fast muscle-memory habits automatic landscape heartbeat footfall extraction growing.',
      focus: 'Action overcoming obstacles through speed and flow.',
      chapterSceneFocus: 'Ch79S2: Running drones chasing falling rocks—Francisco not-thinking shooting jumping pulling fluid Flow—Eight Wands propelling faster-fear as Arrow blurred tunnel speed overcomes obstacles fast habits automatic heartbeat-footfall extraction grows.',
      preliminarySceneFocus: 'Arrow blurred tunnel speeds fast',
      preliminarySceneDescription: 'Flow propels faster-than-fear overcoming obstacles',
      narrativeFunction: 'Demonstrates Eight of Wands speed in action; shows Flow state from Book 1; relies on Atomic Habits muscle memory.',
      sensoryDetail: 'Running, drones chasing, rocks falling, Francisco not-thinking, drone shooting, log jumping, comrade pulling, fluid action, Flow state, Eight Wands energy, faster than fear, landscape blur, heartbeat sound, footfall matching, extraction point growing larger.',
      internalConflict: 'Francisco experiencing Flow—transcending thought to pure action, relying on trained responses without conscious decision.',
      characterGrowthElement: 'Francisco embodying Eight of Wands arrows in flight—using Atomic Habits automatic responses, achieving Flow state speed where action precedes thought.',
      seriesConnectionResonance: 'Flow state from Book 1 callback; Eight of Wands speed demonstration; Atomic Habits muscle memory; faster-than-fear momentum.',
      sceneCardProgression: 231,
      realWorldContext: 'Flow state achievement, muscle memory reliance, speed over thought.',
      timelineSignificance: '11/8/1320 early morning—sprinting through collapsing timeline using trained habits, Flow state carrying team toward extraction.',
      saveTheCatBeat: truncate('Finale - Flow state speeds through obstacles', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'fast_chase',
        narrative_mode: 'flow_automatic',
      }),
      learning_objectives: JSON.stringify([
        'Flow state pure action',
        'Atomic Habits muscle memory',
        'Eight of Wands speed energy',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Sky Bridge arrival',
        'Chasm opening',
        'Final leap required',
      ]),
    },
    {
      pages: 'Page 578 - 582',
      description: 'Sky Bridge reaching natural arch—ship hovering ramp down—bridge cracking arch breaking chasm opening—Novella sliding Francisco grabbing swinging-over \'Go!\'—last crumbling side as chasm hand leap-of-faith climaxes Book final jump vertical selfless momentum-conquers-gravity leap Link-Up.',
      focus: 'Climax executing final jump through selfless momentum.',
      chapterSceneFocus: 'Ch79S3: Sky Bridge arch ship hovering ramp—cracking breaking chasm opening—Novella sliding Francisco grabbing swinging \'Go\' last crumbling as chasm hand leap climaxes Book jump vertical selfless momentum-gravity conquers leaps.',
      preliminarySceneFocus: 'Chasm hand leap climaxes vertically',
      preliminarySceneDescription: 'Selfless momentum conquers gravity Book climax',
      narrativeFunction: 'Delivers Book 2 climax; demonstrates selfless heroism; shows momentum conquering gravity; requires leap of faith.',
      sensoryDetail: 'Sky Bridge reaching, natural arch, ship hovering, ramp down, bridge cracking, arch breaking, chasm opening, Novella sliding, Francisco grabbing, swinging over, Go command, last position, crumbling side, helping hand, leap of faith.',
      internalConflict: 'Francisco experiencing selfless instinct—prioritizing Novella safety over own, accepting last-position risk willingly.',
      characterGrowthElement: 'Francisco demonstrating Eight of Wands momentum—using speed to conquer gravity, embodying selfless leadership by being last, requiring leap of faith for Book 2 climax.',
      seriesConnectionResonance: 'Book 2 climax peak; momentum conquers gravity theme; selfless leadership completion; transition to Book 3 setup; leap of faith archetype.',
      sceneCardProgression: 232,
      realWorldContext: 'Momentum over gravity, selfless leadership, leap of faith.',
      timelineSignificance: '11/8/1320 early morning—Book 2 climactic moment, Francisco last across crumbling bridge requiring final leap to escape.',
      saveTheCatBeat: truncate('Finale - selfless leap climaxes Book 2', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'maximum',
        pacing: 'vertical_climax',
        narrative_mode: 'selfless_heroic',
      }),
      learning_objectives: JSON.stringify([
        'Momentum conquering gravity',
        'Selfless leadership demonstration',
        'Leap of faith courage',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Tractor beam catch',
        'Timeline implosion',
        'Book 2 conclusion',
      ]),
    },
    {
      pages: 'Page 582 - 585',
      description: 'Francisco jumping falling ground rushing—light tractor beam catching yanking upward—ground exploding Base Wall Generator gone—ship bay pulling airlock hissing shut—silence safety Flight over as Ascension womb ship storm-silence resolves Book 2 ends quiet-finale pressurization limbs-checking timeline shrinking viewport.',
      focus: 'Resolution ending Book 2 through safe ascension.',
      chapterSceneFocus: 'Ch79S4: Francisco jumping falling rushing ground—light beam catching yanking up—exploding Base Wall Generator gone—bay pulling airlock hissing silence safety Flight over as Ascension womb storm-silence resolves Book 2 quiet-finale pressurization limbs timeline viewport.',
      preliminarySceneFocus: 'Ascension womb silences storm quietly',
      preliminarySceneDescription: 'Safe Flight concludes Book 2 finale resolved',
      narrativeFunction: 'Resolves Book 2 finale; delivers safe rescue; shows timeline implosion; concludes Flight arc; sets up Book 3.',
      sensoryDetail: 'Jump, fall, ground rushing, light appearance, tractor beam, catching, yanking upward, ground explosion, Base Zero destruction, Wall gone, Generator gone, ship bay pull, airlock hiss, shut, silence, safety, pressurization hiss, limbs checking, timeline shrinking, viewport view.',
      internalConflict: 'Francisco experiencing safety—processing survival after extreme danger, recognizing loss of base while accepting rescue.',
      characterGrowthElement: 'Francisco completing Return with Elixir—escaping with team and lessons learned, achieving Master of Two Worlds by surviving impossible timeline, ready for Book 3.',
      seriesConnectionResonance: 'Book 2 conclusion; Flight arc complete; Return with Elixir achieved; Master of Two Worlds transition; Book 3 setup with missing piece; narrative momentum continuing.',
      sceneCardProgression: 233,
      realWorldContext: 'Safe conclusion, loss and gain balance, transition preparation.',
      timelineSignificance: '11/8/1320 morning—Book 2 finale complete, successful escape with timeline implosion, Francisco and team rescued ready for Book 3.',
      saveTheCatBeat: truncate('Finale - Book 2 concludes safe escape', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high-then-quiet',
        pacing: 'quiet_finale_resolution',
        narrative_mode: 'safe_relief',
      }),
      learning_objectives: JSON.stringify([
        'Book 2 conclusion achieved',
        'Return with Elixir complete',
        'Master of Two Worlds transition',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Book 3 beginning',
        'Missing piece significance',
        'Larger conflict awaiting',
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
        chapterUniqueIdentifier: 'EA-079',
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

  console.log(`\n✅ EA-079 import complete!`);
  console.log(`\n🎉 Book 2 finale complete - Francisco and team successfully escaped!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
