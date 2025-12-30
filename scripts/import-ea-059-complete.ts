import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-059: Loyalty (Book 2, Chapter 19)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-059'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-059 not found. Run create-ea-059-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Mask Falls',
      setup: 'Francisco is in a strategy meeting. A new recruit, a woman named "Serafina," offers the perfect solution to a logistics issue. It is flawless. Too flawless. Her smile is too even. Her posture is too composed. Francisco thanks her, but his eyes narrow. Later, he asks La Signora, "How many of the new recruits are like her?" She replies, "Seventeen." He knows that Dagon has seeded the Sanctuary with "Perfect Citizens"—operatives conditioned to be perfect, emotionless, loyal to the programming. They are the rot from the inside.',
      symbolism: 'The "Perfect Citizen"—the uncanny valley of humanity. The "Smile That Doesn\'t Reach the Eyes." The Page of Cups reversed—emotional shallowness disguised as grace.',
      beat_goal: 'Introduce the threat. Establish the paranoia. Francisco realizes the enemy is inside the walls.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Suspicion and unease',
      scene_tone: 'Tense and watchful',
      timeline_date: '6/29/1320 - Morning',
      timeline_variant: 'Sanctuary HQ',
      location: 'The Strategy Room',
    },
    {
      scene_number: 2,
      scene_title: 'The Audition',
      setup: 'Francisco designs a "test." He announces a public moment where he will "step down" temporarily, pretending to be overwhelmed. It is theater. He watches the reactions. The real allies respond with concern, frustration, offers of help. The "Perfect Citizens" respond with... nothing. Polite nods. No emotional investment. They are waiting for orders. Francisco makes a list. Seventeen names. He does not act yet. He needs to understand the mechanism first.',
      symbolism: 'The "Audition"—testing authenticity through crisis. The Queen of Swords—cold observation. The "List" as judgment.',
      beat_goal: 'Francisco gathers evidence. He learns how to distinguish real loyalty from programmed compliance.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Calculated detachment',
      scene_tone: 'Clinical and strategic',
      timeline_date: '6/29/1320 - Afternoon',
      timeline_variant: 'Sanctuary Courtyard',
      location: 'The Public Square',
    },
    {
      scene_number: 3,
      scene_title: 'The Queen of Blades',
      setup: 'La Signora confronts him. She knows what he is planning. She says, "If you expel them, you reveal that you know. Dagon will change tactics." Francisco replies, "If I keep them, they will sabotage us from within." She pours him tea (black, bitter). She says, "Then you must turn them." Francisco realizes—these are not irredeemable. They are victims. The conditioning can be broken. It requires an "Emotional Shock." He must show them what they have lost—humanity, messiness, passion. The Queen of Swords cuts, but she cuts to heal.',
      symbolism: 'The "Tea Ceremony"—ritual of clarity. The Queen of Swords—surgical precision. The "Emotional Shock" as defibrillation.',
      beat_goal: 'Shift from punishment to rehabilitation. Francisco chooses the harder path—redemption over expulsion.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Compassionate resolve',
      scene_tone: 'Intense and reflective',
      timeline_date: '6/29/1320 - Evening',
      timeline_variant: 'La Signora\'s Quarters',
      location: 'The Tea Room',
    },
    {
      scene_number: 4,
      scene_title: 'I Am Not Who You Think',
      setup: 'Francisco gathers the seventeen. He does not accuse. He simply speaks. He tells them his story—his failures, his fears, his anger at Dagon. He shows them the "Scar" (a literal mark from a failed ritual, a reminder of his imperfection). He says, "I am not a leader because I am perfect. I am a leader because I survived being broken." One by one, the conditioning fractures. They weep. They rage. They remember. Not all of them break free—but enough. The ones who remain are no longer "Perfect Citizens." They are flawed, messy, and loyal. Francisco learns: Loyalty is not obedience. It is choosing to stay when you see the truth.',
      symbolism: 'The "Scar"—badge of survival. The Page of Cups upright—reawakening emotion. The "Weeping" as baptism.',
      beat_goal: 'Resolution. Francisco redeems the redeemable. The chapter ends with a harder-won, but deeper, loyalty.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Cathartic vulnerability',
      scene_tone: 'Raw and transformative',
      timeline_date: '6/29/1320 - Night',
      timeline_variant: 'Sanctuary Chapel',
      location: 'The Gathering Hall',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 270 - 274',
      description: 'During strategy meeting, Francisco notices recruit Serafina offering perfect solution with unsettling flawlessness—too-even smile, too-composed posture—later learning from La Signora that seventeen new recruits show same pattern, realizing Dagon seeded Sanctuary with Perfect Citizen sleeper agents conditioned for emotionless perfection.',
      focus: 'Introducing internal infiltrator threat and establishing paranoia.',
      chapterSceneFocus: 'Ch59S1: Francisco notices Serafina\'s uncannily perfect strategy contribution during meeting—flawless solutions with too-even smile—discovering seventeen recruits show same emotionless pattern as Dagon\'s Perfect Citizen infiltrators programmed to rot Sanctuary from within.',
      preliminarySceneFocus: 'Uncanny perfection reveals infiltration',
      preliminarySceneDescription: 'Perfect Citizens discovered among new recruits',
      narrativeFunction: 'Establishes new internal threat; introduces paranoia; creates moral complexity around loyalty versus conditioning.',
      sensoryDetail: 'Flawless logistics solution, too-even smile, composed posture, narrowed eyes, seventeen identical patterns, emotionless perfection, rot from inside.',
      internalConflict: 'Francisco wrestling with paranoia while recognizing genuine threat requiring careful response.',
      characterGrowthElement: 'Francisco developing sophisticated threat detection beyond obvious enemies to subtle infiltration.',
      seriesConnectionResonance: 'Perfect Citizens become recurring threat type; establishes Dagon\'s psychological warfare tactics.',
      sceneCardProgression: 150,
      realWorldContext: 'Recognizing manipulated people, uncanny valley detection, internal security threats.',
      timelineSignificance: 'Discovery of Perfect Citizen infiltration requiring new counter-tactics beyond external defense.',
      saveTheCatBeat: truncate('Fun and Games - discovering enemy within the walls', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'paranoid_discovery',
        narrative_mode: 'infiltration_reveal',
      }),
      learning_objectives: JSON.stringify([
        'Uncanny valley as threat detection',
        'Emotional authenticity versus conditioning',
        'Internal security vulnerabilities',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Test of vulnerability coming',
        'Redemption versus expulsion choice',
        'La Signora\'s strategic counsel',
      ]),
    },
    {
      pages: 'Page 274 - 277',
      description: 'Francisco designs theatrical test by publicly announcing temporary step-down—watching reactions as real allies respond with concern and help offers while Perfect Citizens show polite nods but no emotional investment, waiting for orders—gathering evidence by listing seventeen names without acting yet to understand conditioning mechanism first.',
      focus: 'Gathering evidence and learning to distinguish loyalty from compliance.',
      chapterSceneFocus: 'Ch59S2: Francisco stages public step-down announcement as test—observing real allies respond with concern and offers while Perfect Citizens show only polite nods lacking emotional investment—listing seventeen names while studying conditioning mechanism before acting.',
      preliminarySceneFocus: 'Testing authenticity through crisis',
      preliminarySceneDescription: 'Staged vulnerability reveals true allies',
      narrativeFunction: 'Demonstrates Francisco\'s strategic sophistication; establishes loyalty detection methodology; builds tension.',
      sensoryDetail: 'Public step-down announcement, concerned responses, frustrated allies, help offers, polite nods, emotionless waiting, seventeen-name list, calculated observation.',
      internalConflict: 'Francisco maintaining clinical detachment while staging personal vulnerability as strategic theater.',
      characterGrowthElement: 'Francisco mastering strategic manipulation while maintaining moral purpose—using theater for protection.',
      seriesConnectionResonance: 'Vulnerability-as-weapon becomes Francisco\'s signature tactic; establishes authenticity testing methodology.',
      sceneCardProgression: 151,
      realWorldContext: 'Crisis response revealing true character, authenticity testing, strategic vulnerability.',
      timelineSignificance: 'Development of counter-conditioning tactics through emotional authenticity testing.',
      saveTheCatBeat: truncate('Fun and Games - testing loyalty through staged crisis', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'strategic_observation',
        narrative_mode: 'clinical_testing',
      }),
      learning_objectives: JSON.stringify([
        'Staged vulnerability as detection tool',
        'Authentic emotion versus programmed response',
        'Strategic patience before action',
      ]),
      foreshadowing_elements: JSON.stringify([
        'La Signora\'s intervention coming',
        'Redemption path versus expulsion',
        'Emotional shock as solution',
      ]),
    },
    {
      pages: 'Page 277 - 280',
      description: 'La Signora confronts Francisco about expulsion plan—debating whether revealing knowledge changes Dagon\'s tactics versus keeping infiltrators risking sabotage—pouring bitter black tea while suggesting turning Perfect Citizens instead, Francisco realizing conditioning-break requires emotional shock showing lost humanity, choosing surgical redemption over punishment per Queen of Swords precision.',
      focus: 'Shifting from punishment to rehabilitation through harder redemption path.',
      chapterSceneFocus: 'Ch59S3: La Signora debates Francisco\'s expulsion plan over bitter tea—arguing expulsion reveals knowledge while keeping them risks sabotage—suggesting turning Perfect Citizens through emotional shock breaking conditioning to restore lost humanity as Queen of Swords cuts to heal.',
      preliminarySceneFocus: 'Redemption chosen over expulsion',
      preliminarySceneDescription: 'Tea ceremony reveals rehabilitation path',
      narrativeFunction: 'Introduces redemption theme; deepens La Signora\'s wisdom role; raises moral complexity above simple solutions.',
      sensoryDetail: 'Confrontation energy, strategic debate, bitter black tea pouring, ritual clarity, surgical precision concept, emotional shock defibrillation, harder path choice.',
      internalConflict: 'Francisco choosing compassionate difficulty over expedient punishment despite strategic risks.',
      characterGrowthElement: 'Francisco embracing rehabilitation complexity over simple expulsion—developing mature leadership choosing harder right path.',
      seriesConnectionResonance: 'Establishes Francisco\'s redemption philosophy; La Signora as moral counsel; emotional shock as therapeutic tool.',
      sceneCardProgression: 152,
      realWorldContext: 'Choosing rehabilitation over punishment, breaking psychological conditioning, compassionate intervention.',
      timelineSignificance: 'Shift from defensive paranoia to active rehabilitation strategy against Dagon\'s conditioning.',
      saveTheCatBeat: truncate('Fun and Games - choosing redemption over expulsion', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'intense_debate',
        narrative_mode: 'philosophical_resolution',
      }),
      learning_objectives: JSON.stringify([
        'Redemption as harder but right choice',
        'Breaking psychological conditioning',
        'Surgical precision versus blanket solutions',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Scar revelation coming',
        'Vulnerability as healing tool',
        'Not all conditioning breaks',
      ]),
    },
    {
      pages: 'Page 280 - 283',
      description: 'Francisco gathers seventeen Perfect Citizens—not accusing but sharing story of failures, fears, anger at Dagon—showing literal ritual scar as imperfection badge while explaining leadership through surviving brokenness—watching conditioning fracture as they weep, rage, remember, with enough breaking free as flawed messy loyal people, learning loyalty is choosing to stay seeing truth not obedience.',
      focus: 'Resolving through redemption and redefining loyalty as chosen presence.',
      chapterSceneFocus: 'Ch59S4: Francisco gathers seventeen showing ritual scar while sharing failure story—explaining leadership through survived brokenness not perfection—watching conditioning fracture as enough weep, rage, remember into flawed messy loyalty, learning staying despite truth defines real loyalty over obedience.',
      preliminarySceneFocus: 'Vulnerability breaks conditioning',
      preliminarySceneDescription: 'Scar-sharing transforms Perfect Citizens',
      narrativeFunction: 'Resolves chapter arc; redefines loyalty; demonstrates vulnerability as strength; shows limits of redemption.',
      sensoryDetail: 'Seventeen gathered faces, shared story, displayed ritual scar, imperfection badge, fracturing conditioning, weeping release, raging recovery, remembering humanity, flawed messiness, chosen loyalty.',
      internalConflict: 'Francisco offering complete vulnerability while accepting not all will break free from conditioning.',
      characterGrowthElement: 'Francisco completes arc from paranoia to redemption—understanding loyalty requires mutual vulnerability and truth.',
      seriesConnectionResonance: 'Scar becomes Francisco\'s symbol; vulnerability-as-weapon perfected; loyalty redefined for series.',
      sceneCardProgression: 153,
      realWorldContext: 'Vulnerability breaking conditioning, authentic leadership, choosing imperfect humanity over programmed perfection.',
      timelineSignificance: 'Successful counter-conditioning establishes sanctuary culture of authentic loyalty over obedience.',
      saveTheCatBeat: truncate('Fun and Games - vulnerability redeems the redeemable', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very high',
        pacing: 'cathartic_transformation',
        narrative_mode: 'raw_redemption',
      }),
      learning_objectives: JSON.stringify([
        'Loyalty as chosen presence versus obedience',
        'Vulnerability as transformative force',
        'Accepting limits of redemption',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Scar symbolism continuing',
        'Some Perfect Citizens remaining programmed',
        'Loyalty culture established',
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
        chapterUniqueIdentifier: 'EA-059',
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

  console.log(`\n✅ EA-059 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
