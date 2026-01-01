import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-084: Trauma (Book 3, Chapter 4)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-084'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-084 not found. Run create-ea-084-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Confrontation',
      setup: 'The library. Gherardo is drunk on wine and jealousy. He has been watching Francisco \'shine\' (EA-081) and feeling his own shadow. He confronts Francisco. \'You think you are better than us.\'',
      symbolism: 'Cain and Abel. The Shadow Self.',
      beat_goal: 'The Conflict. The verbal attack.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Shock',
      scene_tone: 'Tense',
      timeline_date: '5/10/1321 - 0300 Hours',
      timeline_variant: 'Petrarch Home',
      location: 'Library',
    },
    {
      scene_number: 2,
      scene_title: 'The Spilled Cup',
      setup: 'Gherardo throws the wine glass. It shatters. Red wine stains the rug (blood). He lunges. The physical fight. It is messy, ugly. Brothers fighting. Francisco refuses to use magic until Gherardo pulls a knife.',
      symbolism: 'The Five of Cups (3 spilled). The breaking of the bond.',
      beat_goal: 'The Violence. The physical attack.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Horror',
      scene_tone: 'Visceral',
      timeline_date: '5/10/1321 - 0310 Hours',
      timeline_variant: 'Petrarch Home',
      location: 'Library',
    },
    {
      scene_number: 3,
      scene_title: 'The Wound',
      setup: 'Francisco catches the blade with a kinetic shield, but it knicks his palm. He pushes Gherardo back with a blast of air. Gherardo hits the wall. Silence. Francisco looks at his bleeding hand. Gherardo looks at him with terror and hate. \'Demon.\'',
      symbolism: 'The Mark. The Stigma. The separation.',
      beat_goal: 'The Climax (of the scene). The magic used against family.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Guilt',
      scene_tone: 'Tragic',
      timeline_date: '5/10/1321 - 0315 Hours',
      timeline_variant: 'Petrarch Home',
      location: 'Library',
    },
    {
      scene_number: 4,
      scene_title: 'The Departure',
      setup: 'Francisco grabs his bag. He steps over the broken glass. He looks back once. Gherardo is sobbing on the floor. Francisco walks out into the rain. He has lost his past. He is officially the Magus now. Solemnly, he heads to the Colonna Palace to begin his double life.',
      symbolism: 'The Exile. The Rain washing away the past.',
      beat_goal: 'Resolution. Transition to Colonna.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Grim acceptance',
      scene_tone: 'Noir',
      timeline_date: '5/10/1321 - 0330 Hours',
      timeline_variant: 'The Street',
      location: 'Outside the Home',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 46 - 50',
      description: 'Library Gherardo drunk wine jealousy—Francisco shine watching shadow feeling—confronting \'better than us think\'—as Cain Abel Shadow Self conflicts verbal-attacks escalates shock tense Body Keeps Score trauma enacted catalyst immediate-reaction Refusal Call jealousy consumes brother-war begins.',
      focus: 'Conflict verbal attack through jealousy confrontation.',
      chapterSceneFocus: 'Ch84S1: Library Gherardo drunk jealousy Francisco shine-watching shadow feeling—\'better us\' confronting as Cain Abel Shadow conflicts verbal-attacks escalates shock tense Body Score trauma enacted catalyst Refusal jealousy consumes brother-war begins.',
      preliminarySceneFocus: 'Cain Abel Shadow conflicts tense',
      preliminarySceneDescription: 'Jealousy confronts verbal attack escalating shocked',
      narrativeFunction: 'Establishes brother confrontation; demonstrates jealousy consuming Gherardo; begins Five of Cups trauma; creates Catalyst event.',
      sensoryDetail: 'Library setting, Gherardo drunk, wine presence, jealousy consuming, Francisco shining EA-081, shadow feeling, confrontation, better-than-us accusation, Cain Abel dynamic, Shadow Self, verbal attack, shock.',
      internalConflict: 'Francisco experiencing shock—confronted by brother jealousy, recognizing shadow resentment built from radiance, unprepared for hatred.',
      characterGrowthElement: 'Francisco entering Exile mode—confronted by Cain jealousy from Abel radiance, Body Keeps Score trauma beginning, family fallout catalyzing infiltration commitment.',
      seriesConnectionResonance: 'Brother war beginning echoing series finale; Gherardo villain origin; family fallout explaining exile; trauma hardening Francisco; scar origin.',
      sceneCardProgression: 250,
      realWorldContext: 'Body Keeps the Score trauma enactment, sibling jealousy, shadow projection.',
      timelineSignificance: '5/10/1321 0300 hours—hour after leaving University, Francisco confronted by jealous Gherardo at family home, Catalyst trauma beginning.',
      saveTheCatBeat: truncate('Catalyst - jealousy confrontation begins', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'tense_confrontation',
        narrative_mode: 'shocked_unprepared',
      }),
      learning_objectives: JSON.stringify([
        'Body Keeps Score trauma recognition',
        'Sibling jealousy dynamics understanding',
        'Shadow Self projection awareness',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Physical violence escalation',
        'Wine glass shattering',
        'Magic defensive use against family',
      ]),
    },
    {
      pages: 'Page 50 - 54',
      description: 'Gherardo wine-glass throwing shattering—red wine rug-staining blood—lunging physical-fight messy ugly brothers—Francisco magic refusing knife-pulling until as Five Cups 3-spilled bond-breaking violence physical-attacks breaks visceral horror wine-smell letter-opener glint pupils dilated Breaking Point trauma.',
      focus: 'Violence physical attack through bond breaking.',
      chapterSceneFocus: 'Ch84S2: Gherardo glass throwing shattering wine rug blood—lunging fight messy brothers Francisco magic-refusing knife until as Five Cups spilled bond-breaks violence physical breaks visceral horror wine-smell opener glint pupils Breaking trauma enacted.',
      preliminarySceneFocus: 'Five Cups spilled bond-breaks visceral',
      preliminarySceneDescription: 'Violence attacks physically breaking horror messy',
      narrativeFunction: 'Demonstrates Five of Cups imagery; shows physical violence escalation; creates bond-breaking moment; establishes trauma viscerality.',
      sensoryDetail: 'Wine glass throwing, shattering, red wine, rug staining, blood symbolism, lunging, physical fight, messy ugly, brothers fighting, magic refusing, knife pulling, Five Cups, 3 spilled, bond breaking, wine smell, letter opener glint, dilated pupils.',
      internalConflict: 'Francisco experiencing horror—fighting brother physically, refusing magic until knife threat, witnessing bond destruction, feeling visceral trauma.',
      characterGrowthElement: 'Francisco experiencing Five of Cups trauma—seeing three cups spilled (family relationship), physical violence forcing defensive stance, bond breaking through jealousy rage.',
      seriesConnectionResonance: 'Five Cups imagery establishing; brother war violence; trauma visceral demonstration; Breaking Point creating; scar origin wound.',
      sceneCardProgression: 251,
      realWorldContext: 'Physical violence trauma, family bond breaking, defensive escalation.',
      timelineSignificance: '5/10/1321 0310 hours—10 minutes into confrontation, physical violence erupting, Five Cups bond breaking through knife attack.',
      saveTheCatBeat: truncate('Catalyst - violence breaks family bond', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'visceral_violence',
        narrative_mode: 'horror_shock',
      }),
      learning_objectives: JSON.stringify([
        'Trauma visceral impact understanding',
        'Family violence dynamics recognition',
        'Defensive escalation necessity',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Magic defensive use',
        'Demon accusation coming',
        'Permanent separation approaching',
      ]),
    },
    {
      pages: 'Page 54 - 57',
      description: 'Francisco blade catching kinetic-shield knicking palm—Gherardo air-blast pushing wall-hitting—silence bleeding-hand looking terror-hate \'Demon\'—as Mark Stigma separation climaxes magic family-against used guilt tragic Rising Strong reckoning change wound scar permanent brother-war stigma marks.',
      focus: 'Climax using magic against family through stigma marking.',
      chapterSceneFocus: 'Ch84S3: Francisco blade kinetic-shield catching palm knicking—Gherardo air-pushing wall hitting silence hand bleeding terror-hate \'Demon\' as Mark Stigma separation climaxes magic family-used guilt tragic Rising Strong reckoning change wound scar brother-war stigma.',
      preliminarySceneFocus: 'Mark Stigma separates tragic guilt',
      preliminarySceneDescription: 'Magic family-against climaxes demon-marked guiltily',
      narrativeFunction: 'Climaxes confrontation with magic use; creates permanent wound scar; demonstrates demon stigma marking; establishes Rising Strong reckoning.',
      sensoryDetail: 'Blade catching, kinetic shield, palm knicking, Gherardo air blast, wall hitting, silence falling, bleeding hand, terror looking, hate seeing, Demon accusation, Mark receiving, Stigma creating, separation finalizing.',
      internalConflict: 'Francisco experiencing guilt—using magic against family defensively, earning demon label, recognizing permanent separation, accepting stigma mark.',
      characterGrowthElement: 'Francisco receiving permanent scar—using magic defensively against family earning demon stigma, Rising Strong reckoning with family loss, accepting Mark as Magus identity separation.',
      seriesConnectionResonance: 'Scar permanent keeping series; demon stigma establishing; brother war hatred origin; magic family-against trauma; Rising Strong reckoning demonstrating.',
      sceneCardProgression: 252,
      realWorldContext: 'Rising Strong reckoning practice, stigma marking, defensive magic necessity.',
      timelineSignificance: '5/10/1321 0315 hours—15 minutes into fight, magic used defensively, demon stigma received, permanent wound scar created.',
      saveTheCatBeat: truncate('Catalyst - demon mark stigmatizes', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'tragic_climax',
        narrative_mode: 'guilty_reckoning',
      }),
      learning_objectives: JSON.stringify([
        'Rising Strong reckoning necessity',
        'Stigma marking trauma impact',
        'Defensive magic moral complexity',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Final departure',
        'Rain washing past',
        'Colonna Palace heading',
      ]),
    },
    {
      pages: 'Page 57 - 60',
      description: 'Francisco bag grabbing glass stepping-over—looking-back once Gherardo floor sobbing—rain walking-out past losing Magus officially—Colonna Palace double-life beginning solemnly as Exile Rain past-washing resolves Colonna transitions noir grim-acceptance rain blood-mixing door closing hood pulling End Beginning Catalyst complete.',
      focus: 'Resolution transitioning Colonna through exile departure.',
      chapterSceneFocus: 'Ch84S4: Francisco bag grabbing glass stepping-over looking-back Gherardo sobbing—rain walking-out past lost Magus officially Palace double-life solemnly as Exile Rain past-washes resolves Colonna transitions noir grim-acceptance rain blood door closing hood End Beginning Catalyst.',
      preliminarySceneFocus: 'Exile Rain washes noir grim',
      preliminarySceneDescription: 'Departure resolves Magus officially transitioning Palace',
      narrativeFunction: 'Resolves Catalyst trauma; demonstrates final departure; transitions to Colonna Palace; establishes Magus exile identity.',
      sensoryDetail: 'Bag grabbing, glass stepping over, looking back once, Gherardo sobbing floor, rain walking, past losing, Magus officially, Colonna Palace, double life beginning, rain mixing blood, door closing forever, hood pulling up.',
      internalConflict: 'Francisco experiencing grim acceptance—leaving family forever, accepting Magus exile identity, transitioning to double life with resolve.',
      characterGrowthElement: 'Francisco becoming Exile officially—leaving family home forever with trauma hardening, accepting Magus identity fully, heading to Colonna Palace for infiltration double life beginning.',
      seriesConnectionResonance: 'Exile identity establishing; family never returning explaining; Magus official becoming; double life beginning; brother war continuing; trauma hardening Francisco.',
      sceneCardProgression: 253,
      realWorldContext: 'Exile acceptance, identity transition, double life beginning.',
      timelineSignificance: '5/10/1321 0330 hours—30 minutes post-confrontation, Francisco leaving family forever, heading to Colonna Palace beginning infiltration, Catalyst complete.',
      saveTheCatBeat: truncate('Catalyst - exile departure to infiltration', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'noir_departure',
        narrative_mode: 'grim_acceptance',
      }),
      learning_objectives: JSON.stringify([
        'Exile identity acceptance',
        'Trauma hardening understanding',
        'Double life transition navigation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Colonna Palace arrival Chapter 5',
        'Infiltration beginning',
        'Double life complications',
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
        chapterUniqueIdentifier: 'EA-084',
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

  console.log(`\n✅ EA-084 import complete!`);
  console.log(`\n💔 The Catalyst trauma is complete - Francisco has lost his family forever.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
