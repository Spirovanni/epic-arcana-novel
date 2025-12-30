import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-070: Regeneration (Book 2, Chapter 30)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-070'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-070 not found. Run create-ea-070-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Triage',
      setup: 'Francisco wakes up. Pain. Noise. He stumbles out of the medical tent. The base is half-destroyed. People are crying. A young medic is overwhelmed. Francisco steps in. He doesn\'t use magic; he uses order. He categorizes the damage. \'Green. Red. Black.\' He forces the chaos into a system again. He sees the cost of his \'Valor\'—the broken bodies of those he saved.',
      symbolism: 'The Wounded King. The Ashes. The stark reality of the \'Morning After\'.',
      beat_goal: 'Assess the damage. Face the cost.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Grim responsibility',
      scene_tone: 'Somber',
      timeline_date: '7/30/1320 - Morning',
      timeline_variant: 'The Ruined Redoubt',
      location: 'The Infirmary',
    },
    {
      scene_number: 2,
      scene_title: 'Antifragile',
      setup: 'The Engineer (from EA-068) is looking at the breached wall. \'We can rebuild it as it was.\' Francisco shakes his head. \'No. Build it stronger.\' He points to the wreckage of Dagon\'s war mashines. \'Use their armor.\' They start welding the enemy\'s strength into their own defense. It is the core concept of Antifragility—the shock makes the system better. The work is therapeutic. The sound of construction replaces the sound of weeping.',
      symbolism: 'Kintsugi (repairing with gold). Turning the poison into the cure. The Nine of Wands (the bandaged defender).',
      beat_goal: 'The Pivot from Grief to Action. Regeneration begins.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Constructive anger',
      scene_tone: 'Building momentum',
      timeline_date: '7/31/1320 - Morning',
      timeline_variant: 'The Perimeter',
      location: 'The Breach',
    },
    {
      scene_number: 3,
      scene_title: 'The Ritual',
      setup: 'The physical work is done, but the morale is still low. They need to bury the dead. Francisco organizes a ceremony. It\'s not religious; it\'s temporal. They \'lock\' the memories of the fallen into the timeline foundation. They become part of the base\'s history. It honors the grief without letting it paralysis them. Francisco speaks: \'They are the mortar. We are the stone.\'',
      symbolism: 'The Funeral Pyre / The Cornerstone. Transforming ghosts into ancestors.',
      beat_goal: 'Emotional Closure. Binding the team together.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Solemnity',
      scene_tone: 'Sacred',
      timeline_date: '8/1/1320 - Afternoon',
      timeline_variant: 'The Memorial Garden',
      location: 'The Central Courtyard',
    },
    {
      scene_number: 4,
      scene_title: 'The Strengthened Bone',
      setup: 'A week later. The Redoubt is different. Ugly, perhaps, with its patchwork armor, but impenetrable. The team is different too. They move with a \'survivor\'s swagger\'. They know they can take the hit. Francisco stands on the new wall (Nine of Wands imagery). He is vigilant. He knows Dagon will come again. But he smiles. \'Let them come.\' They have regenerated.',
      symbolism: 'The Scar. The Fortified Hill. The shift from \'Pre-War Innocence\' to \'Post-War Strength\'.',
      beat_goal: 'Resolution. The Boon is integrated. They are ready for the next phase.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Quiet confidence',
      scene_tone: 'Strong',
      timeline_date: '8/5/1320 - Morning',
      timeline_variant: 'The Iron Redoubt',
      location: 'The Wall',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 436 - 440',
      description: 'Francisco waking with pain and noise—stumbling from medical tent seeing half-destroyed base with crying people, overwhelmed young medic—stepping in using order not magic categorizing damage \"Green. Red. Black.\"—forcing chaos into system seeing Valor\'s cost through broken bodies saved as Wounded King faces Morning After ashes.',
      focus: 'Assessing damage and facing cost of victory.',
      chapterSceneFocus: 'Ch70S1: Francisco waking in pain stumbling to half-destroyed base with overwhelmed medic—using order not magic to categorize damage forcing chaos into system—seeing Valor cost through broken saved bodies as Wounded King faces stark Morning After reality.',
      preliminarySceneFocus: 'Wounded King faces ashes cost',
      preliminarySceneDescription: 'Order system confronts valor price',
      narrativeFunction: 'Establishes aftermath reality; shows leadership through practical triage; demonstrates cost of heroism.',
      sensoryDetail: 'Waking pain, noise, medical tent stumble, half-destroyed base, crying people, overwhelmed medic, order imposed, Green Red Black categorization, chaos systematized, broken bodies, Valor cost.',
      internalConflict: 'Francisco processing guilt over casualties while maintaining leadership responsibility—facing cost of his choices.',
      characterGrowthElement: 'Francisco integrating Nine of Wands—tired, bandaged but still leading, learning responsibility includes facing consequences of victory.',
      seriesConnectionResonance: 'Power of Full Engagement energy management; aftermath consequences theme; leadership as facing costs not just winning.',
      sceneCardProgression: 194,
      realWorldContext: 'Triage methodology, aftermath management, facing leadership costs.',
      timelineSignificance: 'Post-Siege + 1 day (7/30/1320)—Francisco beginning regeneration process by facing battle aftermath.',
      saveTheCatBeat: truncate('Break into Three - aftermath reality faced', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'somber_assessment',
        narrative_mode: 'grim_responsibility',
      }),
      learning_objectives: JSON.stringify([
        'Triage as leadership tool',
        'Facing consequences of decisions',
        'Order conquering chaos in crisis',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Antifragile rebuilding coming',
        'Enemy wreckage repurposing',
        'Stronger-not-same theme',
      ]),
    },
    {
      pages: 'Page 440 - 443',
      description: 'Engineer looking at breached wall proposing rebuild as-was—Francisco rejecting for \"Build it stronger\" pointing to Dagon war machine wreckage \"Use their armor\"—welding enemy strength into own defense as Antifragility core concept shock improving system—therapeutic work construction sounds replacing weeping as Kintsugi repairs with gold.',
      focus: 'Pivoting from Grief to Action as Regeneration begins.',
      chapterSceneFocus: 'Ch70S2: Engineer proposing wall rebuild as-was rejected for stronger—Francisco ordering Dagon armor welding into defense—Antifragility shock improving system as therapeutic construction replaces weeping turning poison to cure through Nine Wands Kintsugi bandaged defender repair.',
      preliminarySceneFocus: 'Kintsugi turns poison to cure',
      preliminarySceneDescription: 'Antifragile building from enemy wreckage',
      narrativeFunction: 'Demonstrates antifragility principle; transforms grief into constructive action; establishes physical regeneration metaphor.',
      sensoryDetail: 'Breached wall, as-was proposal, stronger rejection, Dagon wreckage pointing, armor welding, enemy strength integration, Antifragility demonstration, therapeutic work, construction sounds, weeping replacement.',
      internalConflict: 'Francisco channeling anger constructively—refusing to return to weakness, demanding growth from trauma.',
      characterGrowthElement: 'Francisco embodying Nine of Wands resilience—using scars to build strength, integrating damage into fortification.',
      seriesConnectionResonance: 'Antifragile direct demonstration; Kintsugi as metaphor; regenerative building becoming Book 5 technique.',
      sceneCardProgression: 195,
      realWorldContext: 'Antifragility principles, therapeutic labor, building from adversity.',
      timelineSignificance: 'Post-Siege + 2 days (7/31/1320)—physical regeneration beginning through antifragile reconstruction.',
      saveTheCatBeat: truncate('Break into Three - action replaces grief', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium-high',
        pacing: 'building_momentum',
        narrative_mode: 'constructive_anger',
      }),
      learning_objectives: JSON.stringify([
        'Antifragility in practice',
        'Constructive anger channeling',
        'Therapeutic labor value',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Ritual ceremony coming',
        'Emotional closure needed',
        'Morale transformation',
      ]),
    },
    {
      pages: 'Page 443 - 446',
      description: 'Physical work complete but morale low—needing to bury dead, Francisco organizing ceremony not religious but temporal—locking fallen memories into timeline foundation making them base history—honoring grief without paralysis as Francisco declares \"They are the mortar. We are the stone.\" transforming ghosts into ancestors through Funeral Pyre Cornerstone.',
      focus: 'Emotional Closure binding team together through ritual.',
      chapterSceneFocus: 'Ch70S3: Physical complete but morale low requiring burial—Francisco organizing temporal not religious ceremony locking fallen into timeline foundation—honoring grief without paralysis declaring \"mortar and stone\" transforming ghosts to ancestors through Funeral Pyre Cornerstone binding team.',
      preliminarySceneFocus: 'Pyre Cornerstone binds ancestors',
      preliminarySceneDescription: 'Temporal ritual honors without paralyzing',
      narrativeFunction: 'Provides emotional closure; honors sacrifice meaningfully; binds team through shared ritual.',
      sensoryDetail: 'Physical work done, low morale, burial need, ceremony organization, temporal not religious, memory locking, timeline foundation, base history integration, grief honor, paralysis avoidance, mortar stone declaration.',
      internalConflict: 'Francisco balancing grief acknowledgment with forward momentum—honoring without dwelling.',
      characterGrowthElement: 'Francisco demonstrating Nine of Wands wisdom—integrating loss into foundation, making strength from sorrow.',
      seriesConnectionResonance: 'Temporal magic ritual innovation; bonding through trauma; healing practices for Book 5.',
      sceneCardProgression: 196,
      realWorldContext: 'Ritual closure, meaningful memorialization, grief integration.',
      timelineSignificance: 'Post-Siege + 3 days (8/1/1320)—emotional regeneration through ritual completing recovery process.',
      saveTheCatBeat: truncate('Break into Three - ritual provides closure', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'sacred_ceremony',
        narrative_mode: 'solemn_closure',
      }),
      learning_objectives: JSON.stringify([
        'Meaningful ritual design',
        'Grief integration not avoidance',
        'Community bonding through ceremony',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Strengthened team emerging',
        'Survivor swagger development',
        'Vigilant readiness state',
      ]),
    },
    {
      pages: 'Page 446 - 450',
      description: 'Week later Redoubt different—ugly patchwork armor but impenetrable with team moving survivor\'s swagger knowing they can take hits—Francisco on new wall with Nine Wands vigilance knowing Dagon will return—smiling \"Let them come\" as regeneration completes shifting Pre-War Innocence to Post-War Strength through Scar Fortified Hill.',
      focus: 'Resolution integrating Boon preparing for next phase.',
      chapterSceneFocus: 'Ch70S4: Week-later Redoubt ugly impenetrable patchwork with survivor swagger team confident—Francisco on wall with Nine Wands vigilance anticipating Dagon return—smiling \"Let them come\" completing regeneration as Scar shifts innocence to strength through Fortified Hill Boon integration.',
      preliminarySceneFocus: 'Scar fortifies Post-War strength',
      preliminarySceneDescription: 'Regeneration completes vigilant readiness',
      narrativeFunction: 'Resolves regeneration arc; establishes new baseline strength; prepares for Act Three challenges.',
      sensoryDetail: 'Week passage, Redoubt transformation, ugly patchwork, impenetrable armor, survivor swagger, hit confidence, wall standing, Nine Wands vigilance, Dagon anticipation, smile, Let them come declaration.',
      internalConflict: 'Francisco embodying quiet confidence—vigilant without fear, ready without desperation.',
      characterGrowthElement: 'Francisco completing Nine of Wands integration—rest without losing readiness, strength through scars, regeneration as active recovery.',
      seriesConnectionResonance: 'Rest as active recovery principle; antifragile system complete; unbreakable loyalty through shared trauma.',
      sceneCardProgression: 197,
      realWorldContext: 'Active recovery building capacity, post-traumatic growth, vigilant confidence.',
      timelineSignificance: 'Post-Siege + 1 week (8/5/1320)—regeneration complete with Francisco and team ready for Act Three, stronger from adversity.',
      saveTheCatBeat: truncate('Break into Three - strengthened and ready', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'strong_resolution',
        narrative_mode: 'quiet_confidence',
      }),
      learning_objectives: JSON.stringify([
        'Active recovery principles',
        'Post-traumatic growth',
        'Vigilance without fear',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Act Three beginning',
        'Dagon return inevitable',
        'Team unbreakable loyalty',
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
        chapterUniqueIdentifier: 'EA-070',
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

  console.log(`\n✅ EA-070 import complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
