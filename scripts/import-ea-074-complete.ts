import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-074: Problem Solving (Book 2, Chapter 34)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-074'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-074 not found. Run create-ea-074-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Blockade',
      setup: 'The Slipstream turns red. The lead scout ship vanishes—erased by a mine. The fleet halts. The radar shows thousands of distortion points ahead. Dagon\'s fleet is 30 minutes behind. The Captain says \'We have to turn back.\' Francisco says \'No. We solve it.\' The stakes are total. If he is wrong, everyone dies.',
      symbolism: 'The Gordian Knot. The Red Wall. The ticking clock.',
      beat_goal: 'The Crisis. Define the problem constraints.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Suppressed panic',
      scene_tone: 'High pressure',
      timeline_date: '10/30/1320 - Late Morning',
      timeline_variant: 'Command Deck',
      location: 'The Bridge',
    },
    {
      scene_number: 2,
      scene_title: 'The Dissection',
      setup: 'Francisco isolates himself. He pulls up the sensor data. He ignores the screams of the Council. He looks at the pattern. He uses \'The McKinsey Mind\' hypothesis approach. Hypothesis A: It\'s a sensor net. Hypothesis B: It\'s a velocity trap. He tests B by throwing a probe at high speed. It explodes. He throws one at low speed. It passes. \'It\'s a fear trap. It punishes running.\'',
      symbolism: 'The Queen of Swords holding the scales. The Microscope. The silence in the center of the storm.',
      beat_goal: 'The Hypothesis. Finding the key.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Clinical detachment',
      scene_tone: 'Quietly intense',
      timeline_date: '10/30/1320 - Late Morning',
      timeline_variant: 'The Bridge',
      location: 'The Bridge',
    },
    {
      scene_number: 3,
      scene_title: 'The Crawl',
      setup: 'Francisco gives the order: \'Ahead slow. 5% impulse.\' The Council goes crazy. \'They will catch us!\' Francisco draws his sword (metaphorically/literally). \'Anyone who increases speed gets stunned.\' He imposes his will. The fleet creeps forward. The mines drift past, inches from the hulls. They do not detonate. The tension is unbearable. It is a test of nerve.',
      symbolism: 'Walking through fire. The discipline of the slow step. The Queen of Swords cutting through the panic.',
      beat_goal: 'The Action. Testing the solution under fire.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Steel will',
      scene_tone: 'Suspenseful',
      timeline_date: '10/30/1320 - Noon',
      timeline_variant: 'The Minefield',
      location: 'The Bridge',
    },
    {
      scene_number: 4,
      scene_title: 'The Clear Air',
      setup: 'The last ship clears the field. The mines dissolve behind them, effectively blocking Dagon (who is moving too fast to stop). The logic trap works both ways. Dagon\'s vanguard hits the field and is erased. Francisco allows himself to exhale. He sheathes the \'Sword\'. He has solved the puzzle. The Slipstream opens up ahead—clear, blue, and free. They have escaped.',
      symbolism: 'The breaking of the clouds. The Sword returning to the scabbard. The open sky.',
      beat_goal: 'Resolution. The Flight is successful.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Exhausted triumph',
      scene_tone: 'Relieved',
      timeline_date: '10/30/1320 - Early Afternoon',
      timeline_variant: 'Open Slipstream',
      location: 'The Bridge',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 496 - 500',
      description: 'Slipstream turning red as lead scout ship vanishes erased by mine—fleet halting with radar showing thousands distortion points ahead—Dagon fleet 30 minutes behind—Captain urging turn back rejected by Francisco \"No. We solve it\" as total stakes risking everyone dying through Gordian Knot Red Wall ticking clock crisis defining problem constraints.',
      focus: 'Crisis defining problem constraints with total stakes.',
      chapterSceneFocus: 'Ch74S1: Red Slipstream scout erasure mine—fleet halt thousands distortions radar Dagon 30 minutes—turn back rejected Francisco solving total death stakes as Gordian Red Wall clock crisis defines suppressed panic high-pressure problem constraints obstacle.',
      preliminarySceneFocus: 'Gordian Red Wall ticks crisis',
      preliminarySceneDescription: 'Total stakes force problem definition urgently',
      narrativeFunction: 'Establishes final obstacle; creates ticking clock tension; demonstrates Queen of Swords necessity.',
      sensoryDetail: 'Slipstream red, scout ship vanishing, mine erasure, fleet halt, radar distortion thousands, Dagon 30 minutes, Captain turn-back urge, Francisco rejection, solve declaration, total stakes, everyone-dies risk.',
      internalConflict: 'Francisco suppressing panic while accepting total responsibility—wrong decision means complete annihilation.',
      characterGrowthElement: 'Francisco entering Queen of Swords mode—suppressing emotion to engage ice-cold analytical focus under extreme pressure.',
      seriesConnectionResonance: 'Problem Solving 101 root cause definition; intellectual climax balancing physical action; Queen of Swords ruthless clarity necessity.',
      sceneCardProgression: 210,
      realWorldContext: 'Crisis problem definition, high-stakes decision-making, analytical thinking under pressure.',
      timelineSignificance: '10/30/1320 late morning—2 hours into flight, Dagon\'s final trap encountered requiring intellectual solution.',
      saveTheCatBeat: truncate('Break into 3 - final obstacle intellectual crisis', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'high_pressure_crisis',
        narrative_mode: 'suppressed_panic',
      }),
      learning_objectives: JSON.stringify([
        'Problem definition under pressure',
        'Root cause identification',
        'Analytical thinking in crisis',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Hypothesis testing coming',
        'McKinsey Mind approach',
        'Fear trap revelation',
      ]),
    },
    {
      pages: 'Page 500 - 503',
      description: 'Francisco isolating pulling sensor data—ignoring Council screams looking at pattern—using McKinsey Mind hypothesis approach testing Hypothesis A sensor net versus Hypothesis B velocity trap—high-speed probe exploding, low-speed passing—revealing \"fear trap punishing running\" as Queen Swords holds scales Microscope finding silence center storm key hypothesis.',
      focus: 'Hypothesis finding key through analytical dissection.',
      chapterSceneFocus: 'Ch74S2: Francisco isolating with sensor data ignoring Council screams—McKinsey Mind hypothesizing sensor net versus velocity trap—probe testing high-speed exploding low-speed passing—revealing fear trap as Queen scales Microscope silence finds hypothesis key analytically quietly intense.',
      preliminarySceneFocus: 'Queen scales Microscope silences storm',
      preliminarySceneDescription: 'Hypothesis testing reveals fear trap quietly',
      narrativeFunction: 'Demonstrates systematic problem-solving; reveals counterintuitive solution; shows clinical detachment value.',
      sensoryDetail: 'Francisco isolation, sensor data pull, Council screams ignored, pattern looking, McKinsey Mind, Hypothesis A B, sensor net, velocity trap, high-speed probe, explosion, low-speed passing, fear trap revelation, running punishment, holographic mines pulsing heartbeats, Francisco unmoving eyes, helmsman sweat neck.',
      internalConflict: 'Francisco maintaining clinical detachment—ignoring emotional pressure to focus purely on data and logic.',
      characterGrowthElement: 'Francisco embodying Queen of Swords analytical precision—using McKinsey Mind systematic hypothesis testing, finding truth through detachment.',
      seriesConnectionResonance: 'McKinsey Mind framework demonstration; pattern recognition for Book 6 heist; trust intellect over emotion establishing.',
      sceneCardProgression: 211,
      realWorldContext: 'Hypothesis testing methodology, systematic analysis, clinical problem-solving.',
      timelineSignificance: '10/30/1320 late morning—critical breakthrough revealing counterintuitive solution requiring methodical approach.',
      saveTheCatBeat: truncate('Break into 3 - analytical breakthrough finds key', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'quietly_intense_analysis',
        narrative_mode: 'clinical_detachment',
      }),
      learning_objectives: JSON.stringify([
        'McKinsey Mind hypothesis testing',
        'Systematic analysis framework',
        'Clinical detachment value',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Slow crawl order coming',
        'Council resistance',
        'Nerve test execution',
      ]),
    },
    {
      pages: 'Page 503 - 507',
      description: 'Francisco ordering \"Ahead slow. 5% impulse\" driving Council crazy \"They will catch us!\"—drawing sword threatening stun anyone increasing speed—imposing will as fleet creeps forward—mines drifting inches from hulls not detonating—unbearable tension testing nerve as walking fire disciplined slow step Queen Swords cuts panic executing climax solution under fire suspensefully.',
      focus: 'Action testing solution under fire through nerve test.',
      chapterSceneFocus: 'Ch74S3: Slow 5% order driving Council crazy catch-threat—sword drawn stunning speed-increase threat—will imposed fleet creeping mines inches not detonating—unbearable nerve tension as fire-walking disciplined Queen cuts panic testing logic-over-instinct solution climax suspensefully.',
      preliminarySceneFocus: 'Fire-walk disciplines Queen cutting',
      preliminarySceneDescription: 'Nerve test executes logic over instinct',
      narrativeFunction: 'Executes counterintuitive solution; demonstrates leadership will; creates maximum tension climax.',
      sensoryDetail: 'Slow order, 5% impulse, Council crazy reaction, catch warning, sword drawing, stun threat, speed increase warning, will imposition, fleet creeping, mines drifting, inches proximity, hulls, non-detonation, unbearable tension, nerve test.',
      internalConflict: 'Francisco imposing steel will—trusting logic over survival instinct, maintaining control against panic.',
      characterGrowthElement: 'Francisco demonstrating Queen of Swords ruthless clarity—cutting through panic with sword threat, trusting critical thinking over instinct.',
      seriesConnectionResonance: 'Critical thinking trust-over-instinct; ruthless leadership clarity; pattern recognition pattern executing.',
      sceneCardProgression: 212,
      realWorldContext: 'Leadership under extreme pressure, trusting analysis over instinct, nerve testing.',
      timelineSignificance: '10/30/1320 noon—fleet executing counterintuitive crawl through minefield with Dagon approaching.',
      saveTheCatBeat: truncate('Break into 3 - nerve-testing solution execution', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'suspenseful_crawl',
        narrative_mode: 'steel_will',
      }),
      learning_objectives: JSON.stringify([
        'Logic over instinct execution',
        'Leadership will under pressure',
        'Counterintuitive solution trust',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Clear field success',
        'Dagon trap reversal',
        'Sword sheathing triumph',
      ]),
    },
    {
      pages: 'Page 507 - 510',
      description: 'Last ship clearing field with mines dissolving behind—blocking Dagon moving too fast to stop—logic trap working both ways as Dagon vanguard erased—Francisco exhaling sheathing Sword puzzle solved—Slipstream opening clear blue free ahead as clouds break scabbard returns open sky resolves Flight successful crossing relieved exhausted triumph.',
      focus: 'Resolution showing Flight successful through puzzle solved.',
      chapterSceneFocus: 'Ch74S4: Last ship clearing mines dissolving Dagon-blocking—too-fast Dagon vanguard erased by logic trap—Francisco exhaling Sword-sheathing puzzle-solved—clear blue free Slipstream as clouds break scabbard sky open resolving Flight crossing relieved exhausted triumphant.',
      preliminarySceneFocus: 'Clouds break scabbard opens sky',
      preliminarySceneDescription: 'Puzzle solved Flight succeeds triumphantly relieved',
      narrativeFunction: 'Resolves Flight arc; demonstrates problem-solving payoff; establishes Queen of Swords complete integration.',
      sensoryDetail: 'Last ship clearing, mines dissolving, Dagon blocking, too-fast movement, logic trap reversal, vanguard erasure, Francisco exhale, Sword sheathing, puzzle solution, Slipstream opening, clear blue, freedom, helmsman slumping console, Francisco hand trembling adrenaline fading, blue light timeline filling room.',
      internalConflict: 'Francisco experiencing exhausted triumph—allowing relief after maintaining ice-cold focus throughout crisis.',
      characterGrowthElement: 'Francisco completing Queen of Swords integration—successfully channeling ruthless clarity to solve intellectual crisis, trusting brain as much as Wand.',
      seriesConnectionResonance: 'Pattern recognition for Book 6; intellect trust established; Flight successful completing Road Back; logic trap elegant solution.',
      sceneCardProgression: 213,
      realWorldContext: 'Problem-solving validation, analytical success, intellectual triumph.',
      timelineSignificance: '10/30/1320 early afternoon—successful Flight escape through Queen of Swords problem-solving, Book 2 major arc complete.',
      saveTheCatBeat: truncate('Break into 3 - intellectual triumph completes Flight', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'relieved_resolution',
        narrative_mode: 'exhausted_triumph',
      }),
      learning_objectives: JSON.stringify([
        'Problem-solving methodology validation',
        'Intellectual approach success',
        'Queen of Swords integration complete',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Book 3 continuation',
        'Trust intellect theme continuing',
        'Pattern recognition future use',
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
        chapterUniqueIdentifier: 'EA-074',
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

  console.log(`\n✅ EA-074 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
