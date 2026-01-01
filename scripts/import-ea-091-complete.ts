import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-091: Courage (Book 3, Chapter 11)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-091'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-091 not found. Run create-ea-091-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Disguise',
      setup: 'Just outside Bologna. Vittoria helps Francisco with his cassock. He looks different—shaved, severe. \'If they catch you, I don\'t know you.\' He swallows his fear. \'Courage isn\'t the absence of fear,\' he quotes.',
      symbolism: 'The Mask. The False Face.',
      beat_goal: 'The Preparation. Raising the stakes.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Anxiety',
      scene_tone: 'Tense',
      timeline_date: '6/6/1321 - Dusk',
      timeline_variant: 'Outskirts',
      location: 'Safehouse',
    },
    {
      scene_number: 2,
      scene_title: 'The Lion\'s Den',
      setup: 'Inside the Cathedral. High mass is ending. Incense. Soldiers at the doors. Francisco walks with purpose (Seven of Swords—swift movement). He nods to a guard. The guard nods back. He is inside.',
      symbolism: 'Walking on Thin Ice. The Wolf in Sheep\'s Clothing.',
      beat_goal: 'The Infiltration. Crossing lines.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Focus',
      scene_tone: 'Suspense',
      timeline_date: '6/6/1321 - Night',
      timeline_variant: 'Bologna',
      location: 'Cathedral Nave',
    },
    {
      scene_number: 3,
      scene_title: 'The Theft',
      setup: 'The Archives. He picks the lock (magically quiet). He finds the scroll case marked \'Temporal Containment\'. He takes it. He leaves a decoy. He hears footsteps. Captain Reyes is doing rounds.',
      symbolism: 'The 7 of Swords (Taking the Swords).',
      beat_goal: 'The Objective. Securing the prize.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Fear',
      scene_tone: 'High Stakes',
      timeline_date: '6/6/1321 - Night',
      timeline_variant: 'Bologna',
      location: 'Archives',
    },
    {
      scene_number: 4,
      scene_title: 'The Bluff',
      setup: 'Reyes stops him in the hallway. \'Father, I don\'t know your face.\' Francisco uses \'Courage\'. He doesn\'t run. He scolds Reyes for interrupting a \'holy mission from the Bishop.\' His voice doesn\'t shake. Reyes apologizes and lets him pass. Francisco walks out into the cool night air, adrenaline crashing.',
      symbolism: 'The Tongue as Sword.',
      beat_goal: 'The Escape. Emotional payoff.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Relief',
      scene_tone: 'Triumphant',
      timeline_date: '6/6/1321 - Midnight',
      timeline_variant: 'Bologna',
      location: 'Cathedral Steps',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 151 - 155',
      description: 'Bologna-outside Vittoria cassock-helping Francisco—shaved severe different-looking If-catch-you dont-know-you—fear swallowing Courage-isnt-absence-fear quoting as Mask False-Face preparation stakes-raising anxiety tense Feel-Fear-Do-Anyway threshold Vatican-troop-movements needing priest-disguise.',
      focus: 'Preparation raising stakes through priest disguise.',
      chapterSceneFocus: 'Ch91S1: Bologna-outside Vittoria cassock-helping Francisco shaved severe different If-catch dont-know fear swallowing Courage-isnt-absence-fear quoting as Mask False-Face preparation stakes-raising anxiety tense Feel-Fear-Do-Anyway threshold Vatican-troop needing priest-disguise.',
      preliminarySceneFocus: 'Mask False-Face anxiety tense',
      preliminarySceneDescription: 'Disguise prepares stakes raising anxiously fearful',
      narrativeFunction: 'Establishes Seven of Swords heist beginning through priest disguise; demonstrates Feel the Fear and Do It Anyway principle; shows Vittoria intelligence network contact; creates threshold crossing preparing infiltration.',
      sensoryDetail: 'Bologna outside, Vittoria helping, cassock donning, Francisco appearance, shaved severe, different looking, If catch you dont know warning, fear swallowing, Courage isnt absence fear quote, Mask symbolism, False Face imagery, preparation moment, stakes raising.',
      internalConflict: 'Francisco experiencing anxiety—preparing priest disguise infiltration Bologna Cathedral, swallowing fear understanding Courage not absence fear but action despite terror, crossing threshold into Vatican enemy territory.',
      characterGrowthElement: 'Francisco becoming Spy—donning priest disguise proving outsmart Church not just outmagic, applying Feel the Fear and Do It Anyway principle acting when terrified, preparing Seven of Swords heist Vatican troop movements intelligence.',
      seriesConnectionResonance: 'Intelligence network Vittoria establishing; Vatican presence scale demonstrating; stolen scroll Keystone Book 4 plot foreshadowing; Seven of Swords spy archetype beginning; Courage defining acting terrified.',
      sceneCardProgression: 278,
      realWorldContext: 'Feel the Fear and Do It Anyway practice, disguise preparation, courage definition.',
      timelineSignificance: '6/6/1321 dusk—day after EA-090 Three Swords separation, Francisco preparing priest disguise infiltration Bologna Cathedral, Seven of Swords heist beginning Vatican intelligence gathering.',
      saveTheCatBeat: truncate('Pinch - disguise prepared stakes raised', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'high',
        pacing: 'tense_preparation',
        narrative_mode: 'anxious_determined',
      }),
      learning_objectives: JSON.stringify([
        'Feel the Fear and Do It Anyway mastery',
        'Courage definition understanding action despite terror',
        'Seven of Swords spy preparation',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Cathedral high mass infiltration',
        'Guard nodding past',
        'Archives lock picking theft',
      ]),
    },
    {
      pages: 'Page 155 - 159',
      description: 'Cathedral inside high-mass ending—incense soldiers-doors—Francisco purpose-walking Seven-Swords swift-movement guard-nodding nods-back inside as Walking-Thin-Ice Wolf-Sheep infiltration lines-crossing focus suspense chanting-echo armor-glint confessional-shadow action heist.',
      focus: 'Infiltration crossing lines through Cathedral entry.',
      chapterSceneFocus: 'Ch91S2: Cathedral inside high-mass ending incense soldiers-doors Francisco purpose-walking Seven-Swords swift-movement guard-nodding nods-back inside as Walking-Thin-Ice Wolf-Sheep infiltration lines-crosses focus suspense chanting-echo armor-glint confessional-shadow action heist.',
      preliminarySceneFocus: 'Walking-Thin-Ice Wolf-Sheep focus suspense',
      preliminarySceneDescription: 'Infiltration crosses lines purposefully suspenseful focused',
      narrativeFunction: 'Demonstrates Seven of Swords swift movement infiltration; shows Wolf in Sheep Clothing disguise working; creates suspense through Vatican Cathedral penetration; establishes action heist beginning.',
      sensoryDetail: 'Cathedral inside, high mass ending, incense atmosphere, soldiers at doors, Francisco walking purposefully, Seven of Swords movement, guard nodding, nods back receiving, inside successfully, chanting echo, armor glint, confessional shadow, infiltration atmosphere.',
      internalConflict: 'Francisco experiencing focus—walking purposefully through Cathedral maintaining priest disguise, nodding to guards crossing lines into Vatican heart, Walking on Thin Ice awareness every moment danger.',
      characterGrowthElement: 'Francisco executing Spy infiltration—crossing Vatican Cathedral threshold successfully through Seven of Swords swift purposeful movement, maintaining Wolf in Sheep Clothing disguise convincingly, proving outsmart Church capability intelligence gathering.',
      seriesConnectionResonance: 'Vatican Cathedral penetration demonstrating; Seven of Swords spy execution showing; intelligence network operation revealing; Bologna Cathedral archives accessing; heist suspense establishing.',
      sceneCardProgression: 279,
      realWorldContext: 'Seven of Swords infiltration tactics, disguise maintenance, line crossing courage.',
      timelineSignificance: '6/6/1321 night—evening after disguise preparation, Francisco successfully infiltrating Bologna Cathedral during high mass, Seven of Swords heist action beginning Vatican intelligence gathering mission.',
      saveTheCatBeat: truncate('Pinch - infiltrated Cathedral crossed lines', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'very-high',
        pacing: 'suspenseful_infiltration',
        narrative_mode: 'focused_alert',
      }),
      learning_objectives: JSON.stringify([
        'Seven of Swords infiltration tactics mastery',
        'Disguise maintenance under pressure',
        'Line crossing courage execution',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Archives lock picking magically',
        'Temporal Containment scroll finding',
        'Captain Reyes footsteps hearing',
      ]),
    },
    {
      pages: 'Page 159 - 162',
      description: 'Archives lock-picking magically-quiet—scroll-case Temporal-Containment marked finding taking—decoy leaving footsteps-hearing Reyes-Captain rounds-doing as Seven-Swords Taking-Swords objective prize-securing fear high-stakes Daring-Greatly vulnerability-action climax-action stolen-scroll Keystone-Book-4.',
      focus: 'Objective securing prize through scroll theft.',
      chapterSceneFocus: 'Ch91S3: Archives lock-picking magically-quiet scroll-case Temporal-Containment marked finding taking decoy leaving footsteps-hearing Reyes-Captain rounds-doing as Seven-Swords Taking-Swords objective prize-secures fear high-stakes Daring-Greatly vulnerability-action climax-action stolen-scroll Keystone-Book-4.',
      preliminarySceneFocus: 'Seven-Swords Taking-Swords fear high-stakes',
      preliminarySceneDescription: 'Theft secures prize objective scroll taking fearfully',
      narrativeFunction: 'Climaxes Seven of Swords theft Taking the Swords; demonstrates Daring Greatly vulnerability in action principle; shows Temporal Containment scroll securing Keystone Book 4 plot; creates high stakes fear Captain Reyes footsteps hearing.',
      sensoryDetail: 'Archives setting, lock picking magically, quiet spell, scroll case finding, Temporal Containment marking, scroll taking, decoy leaving, footsteps hearing, Captain Reyes presence, rounds doing, Seven of Swords imagery, Taking Swords moment, objective securing, prize obtained.',
      internalConflict: 'Francisco experiencing fear—securing Temporal Containment scroll objective hearing Captain Reyes footsteps approaching, executing Daring Greatly vulnerability exposing self to danger for intelligence, high stakes theft completing Seven of Swords mission.',
      characterGrowthElement: 'Francisco achieving Spy objective—stealing Temporal Containment scroll containing Keystone Book 4 information, applying Daring Greatly principle acting vulnerably despite fear, executing Seven of Swords Taking Swords climax proving intelligence gathering capability.',
      seriesConnectionResonance: 'Stolen scroll Keystone Book 4 plot establishing; Temporal Containment information securing; Vatican intelligence gathering succeeding; Captain Reyes obstacle introducing; Seven of Swords theft completing; Daring Greatly vulnerability demonstrating.',
      sceneCardProgression: 280,
      realWorldContext: 'Daring Greatly vulnerability action, Seven of Swords theft execution, high stakes fear management.',
      timelineSignificance: '6/6/1321 night continuing—Cathedral archives infiltrated, Francisco stealing Temporal Containment scroll Keystone information, Captain Reyes footsteps heard approaching creating Seven of Swords climax tension.',
      saveTheCatBeat: truncate('Pinch - scroll stolen Reyes approaching', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'high_stakes_theft',
        narrative_mode: 'fearful_executing',
      }),
      learning_objectives: JSON.stringify([
        'Daring Greatly vulnerability action mastery',
        'Seven of Swords theft execution',
        'High stakes fear management courage',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Reyes hallway confrontation',
        'Bluff holy mission Bishop',
        'Voice not shaking escape',
      ]),
    },
    {
      pages: 'Page 162 - 165',
      description: 'Reyes hallway-stopping Father-face-dont-know—Francisco Courage-using not-running scolding-Reyes holy-mission-Bishop interrupting voice-not-shaking—Reyes apologizing passing-letting cool-night-air walking adrenaline-crashing as Tongue-Sword escape payoff-emotional relief triumphant back-sweat pillar-leaning scroll-sleeve tucked.',
      focus: 'Escape achieving payoff through bluff triumph.',
      chapterSceneFocus: 'Ch91S4: Reyes hallway-stopping Father-face-dont-know Francisco Courage-using not-running scolding-Reyes holy-mission-Bishop interrupting voice-not-shaking Reyes apologizing passing-letting cool-night-air walking adrenaline-crashing as Tongue-Sword escape payoff-emotional relief triumphant back-sweat pillar-leaning scroll-sleeve.',
      preliminarySceneFocus: 'Tongue-Sword relief triumphant escape',
      preliminarySceneDescription: 'Bluff escapes payoff triumphantly relieved adrenaline',
      narrativeFunction: 'Resolves Seven of Swords heist through Tongue as Sword bluff; demonstrates Courage principle not running but confronting; shows emotional payoff relief triumph escape; establishes intelligence mission success Vatican outsmarted.',
      sensoryDetail: 'Reyes stopping hallway, Father face dont know challenge, Francisco using Courage, not running choice, scolding Reyes, holy mission Bishop claim, interrupting accusation, voice not shaking control, Reyes apologizing, passing letting, cool night air, walking outside, adrenaline crashing, back sweat, pillar leaning, scroll sleeve tucked.',
      internalConflict: 'Francisco experiencing relief—confronted by Captain Reyes using Courage Tongue as Sword bluffing holy mission Bishop, voice not shaking maintaining control despite terror, escaping successfully into cool night adrenaline crash triumph.',
      characterGrowthElement: 'Francisco completing Spy transformation—bluffing Captain Reyes successfully through Courage Tongue as Sword not running but confronting, escaping with stolen scroll proving outsmart Church capability, realizing Courage acting when terrified not absence fear.',
      seriesConnectionResonance: 'Seven of Swords heist success completing; stolen scroll Keystone Book 4 securing; Courage definition establishing acting terrified; intelligence network operation demonstrating; Vatican outsmarted proving; Captain Reyes obstacle overcome bluffing.',
      sceneCardProgression: 281,
      realWorldContext: 'Courage Tongue as Sword bluffing, adrenaline management, triumph relief balance.',
      timelineSignificance: '6/6/1321 midnight—late night Cathedral escape, Francisco bluffing Captain Reyes successfully, walking free with stolen Temporal Containment scroll, Seven of Swords heist mission complete Courage triumph.',
      saveTheCatBeat: truncate('Pinch - bluffed escaped scroll secured', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'extreme',
        pacing: 'triumphant_escape',
        narrative_mode: 'relieved_triumphant',
      }),
      learning_objectives: JSON.stringify([
        'Courage Tongue as Sword bluffing mastery',
        'Adrenaline crash management triumph',
        'Seven of Swords heist completion',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Stolen scroll Keystone Book 4 use',
        'Vatican intelligence continuing',
        'Captain Reyes remembering encounter',
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
        chapterUniqueIdentifier: 'EA-091',
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

  console.log(`\n✅ EA-091 import complete!`);
  console.log(`\n🗡️ The Seven of Swords heist succeeds - Courage is acting when terrified!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
