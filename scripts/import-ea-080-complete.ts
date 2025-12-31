import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const truncate = (str: string | undefined | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

async function main() {
  console.log('📖 Importing EA-080: Isolation (Book 2, Chapter 40)...\n');

  // Get or verify chapter exists
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-080'))
    .limit(1);

  if (!chapter) {
    console.error('❌ Chapter EA-080 not found. Run create-ea-080-chapter.ts first.');
    process.exit(1);
  }

  console.log(`✅ Found chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Scene data from outline
  const sceneData = [
    {
      scene_number: 1,
      scene_title: 'The Quarantine',
      setup: 'White light. Hum of engines. Francisco wakes up in a bio-bed. A droid is scanning him. He is safe. But he is locked in. The silence is deafening after the screaming sky of EA-079. He checks his pockets. The \'Seed\' (Ace of Disks fragment) is still there.',
      symbolism: 'The Womb/Tomb. The White Room. The transition.',
      beat_goal: 'The Decompression. Processing the shift in reality.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Numbness',
      scene_tone: 'Clinical',
      timeline_date: '11/8/1320 - Late Morning',
      timeline_variant: 'Rescue Ship Med-Bay',
      location: 'Med-Bay',
    },
    {
      scene_number: 2,
      scene_title: 'The Debrief',
      setup: 'A General appearing on a screen. Asking for the report. \'What did you find in the Raw Timeline?\' Francisco lies smoothly. \'Just rocks and monsters.\' He hoards the truth (Four of Disks). He realizes the Institution cannot be trusted with the power of Creation (Ace).',
      symbolism: 'The Mask. The miser holding the coin.',
      beat_goal: 'The Choice. Deciding to withhold information.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Cunning',
      scene_tone: 'Interrogative',
      timeline_date: '11/8/1320 - Afternoon',
      timeline_variant: 'Rescue Ship Med-Bay',
      location: 'Med-Bay',
    },
    {
      scene_number: 3,
      scene_title: 'The Mirror',
      setup: 'He is allowed to shower. He sees himself in the steel mirror. Scars, dirt, grey in his hair that wasn\'t there a week ago. He tries to smile like the \'Student\' he was. It looks wrong. He practices the \'Hero\' face. That works. He accepts the role.',
      symbolism: 'The Reflection. The Persona. The loss of innocence.',
      beat_goal: 'The Transformation. Accepting the new self.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Resignation',
      scene_tone: 'Intimate',
      timeline_date: '11/8/1320 - Evening',
      timeline_variant: 'Rescue Ship Bathroom',
      location: 'Med-Bay',
    },
    {
      scene_number: 4,
      scene_title: 'The Return',
      setup: 'The airlock cycles. The \'Clean\' light turns green. The door opens. Crowds, cheers, cameras. Novella is there, waiting. He steps out. He waves. He hugs her. But he feels like an actor on a stage. He is the Master of Two Worlds, but he belongs to neither.',
      symbolism: 'The Stage. The Crossing of the Return Threshold.',
      beat_goal: 'Resolution. End of Book 2.',
      pov: '3rd Person Limited (Francisco)',
      tense: 'Past Tense',
      core_emotion: 'Melancholy triumph',
      scene_tone: 'Public vs Private',
      timeline_date: '11/8/1320 - Night',
      timeline_variant: 'The Hangar Bay',
      location: 'Main Base',
    },
  ];

  // Enhanced narrative data for each scene
  const enhancements = [
    {
      pages: 'Page 586 - 590',
      description: 'White light engine-hum—Francisco waking bio-bed droid scanning—safe but locked-in—silence deafening after screaming sky—pocket-checking Seed Ace fragment still-there as Womb/Tomb White Room transition decompresses processing reality-shift pause numb clinical quarantine solitude temporal-decontamination begins Book 2 epilogue.',
      focus: 'Decompression processing reality shift through quarantine pause.',
      chapterSceneFocus: 'Ch80S1: White light bio-bed waking droid scanning—safe locked silence deafening screaming-sky-after—Seed checking still-there as Womb White Room transition decompresses reality-shift pause numb clinical solitude quarantine epilogue begins.',
      preliminarySceneFocus: 'Womb White Room decompresses pause',
      preliminarySceneDescription: 'Quarantine solitude processes reality shift numbly',
      narrativeFunction: 'Establishes post-rescue isolation; introduces Four of Disks hoarding; demonstrates psychological toll; begins Book 2 epilogue.',
      sensoryDetail: 'White light, engine hum, bio-bed waking, droid scanning, safety feeling, locked-in state, silence deafening, screaming sky contrast, pocket checking, Seed presence, Ace fragment, sterile environment, temporal decontamination.',
      internalConflict: 'Francisco experiencing numbness—processing extreme transition from chaos to sterile safety, isolation after intense connection.',
      characterGrowthElement: 'Francisco entering Four of Disks holding-tight mode—hoarding Ace seed secret, beginning Magus transformation from Student, accepting isolation burden.',
      seriesConnectionResonance: 'Four of Disks hoarding establishing; hidden trauma growing to Ivory Tower problem later books; Ace seed kept secret; PTSD addressing; psychological toll.',
      sceneCardProgression: 234,
      realWorldContext: 'Solitude value, psychological decompression, post-trauma processing.',
      timelineSignificance: '11/8/1320 late morning—2 hours post-rescue, quarantine beginning Francisco transformation from Student to guarded Veteran Magus.',
      saveTheCatBeat: truncate('Final Image - isolation after rescue begins', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'low',
        pacing: 'clinical_pause',
        narrative_mode: 'numb_decompression',
      }),
      learning_objectives: JSON.stringify([
        'Solitude value recognition',
        'Four of Disks hoarding beginning',
        'Psychological toll processing',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Secret keeping decision',
        'Magus transformation',
        'Institution distrust',
      ]),
    },
    {
      pages: 'Page 590 - 593',
      description: 'General screen-appearing report-asking \'Raw Timeline find?\'—Francisco smooth-lying \'rocks monsters\'—truth hoarding Four Disks—Institution cannot-trust Creation power Ace realizing as Mask miser coin-holding chooses withholding information secret cunning interrogative debrief pulse-steady lie cold-sweat back hologram flickering.',
      focus: 'Choice withholding information through secret hoarding.',
      chapterSceneFocus: 'Ch80S2: General screen report-asking Raw-find—Francisco smooth-lying \'rocks monsters\' truth-hoarding Four Disks—Institution distrust Ace-power realizing as Mask miser coin chooses withhold secret cunning interrogative pulse-steady lie cold-sweat hologram.',
      preliminarySceneFocus: 'Mask miser coins secret cunning',
      preliminarySceneDescription: 'Institution distrust hoards truth interrogatively cunning',
      narrativeFunction: 'Demonstrates Four of Disks hoarding decision; establishes secrets kept from authority; shows cunning development; explains institutional distrust.',
      sensoryDetail: 'General appearing, screen hologram, report request, Raw Timeline question, smooth lie, rocks monsters claim, truth hoarding, Four Disks energy, Institution distrust, Creation power, Ace recognition, pulse steady monitor, lie maintaining, cold sweat, hologram flicker.',
      internalConflict: 'Francisco experiencing cunning calculation—choosing to deceive authority, recognizing power too dangerous to share, accepting moral compromise.',
      characterGrowthElement: 'Francisco embodying Four of Disks miser—hoarding truth like coins, developing cunning mask, accepting that Institution cannot be trusted with Ace power.',
      seriesConnectionResonance: 'Secrets kept explaining future behavior; Four coins physical token keeping; institutional distrust establishing; Magus cunning developing; power hoarding.',
      sceneCardProgression: 235,
      realWorldContext: 'Strategic information withholding, institutional distrust, power protection.',
      timelineSignificance: '11/8/1320 afternoon—6 hours post-rescue, critical decision to hoard Ace seed secret establishing Francisco distrust of authority.',
      saveTheCatBeat: truncate('Final Image - secret hoarding decision made', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'interrogative_tension',
        narrative_mode: 'cunning_deception',
      }),
      learning_objectives: JSON.stringify([
        'Four of Disks hoarding strategy',
        'Strategic information withholding',
        'Institutional distrust development',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Mirror transformation coming',
        'Student to Magus shift',
        'Hero face practicing',
      ]),
    },
    {
      pages: 'Page 593 - 596',
      description: 'Shower allowed steel mirror seeing—scars dirt grey-hair week-ago absent—Student smile-trying looks wrong—Hero face practicing works—role accepting as Reflection Persona innocence-loss transforms accepting new-self resigned intimate Deep Work internal-focus character-beat transformation Student-gone Magus-remains.',
      focus: 'Transformation accepting new self through persona shift.',
      chapterSceneFocus: 'Ch80S3: Steel mirror shower seeing scars dirt grey-hair new—Student smile wrong Hero face works—role accepting as Reflection Persona innocence-loss transforms new-self resigned intimate Deep Work internal character Student-gone Magus-remains accepts.',
      preliminarySceneFocus: 'Reflection Persona loses innocence resigned',
      preliminarySceneDescription: 'Transformation accepts Hero role intimately internal',
      narrativeFunction: 'Demonstrates Student to Magus transformation; shows innocence loss acceptance; establishes Hero persona adoption; completes character arc.',
      sensoryDetail: 'Shower allowance, steel mirror, self-seeing, scars presence, dirt marks, grey hair, week-ago absence, Student smile attempt, wrong appearance, Hero face practice, working expression, role acceptance, reflection study, persona crafting.',
      internalConflict: 'Francisco experiencing resignation—accepting Student death, practicing Hero mask, recognizing permanent transformation, mourning innocence loss.',
      characterGrowthElement: 'Francisco completing transformation—accepting Student is gone, Magus remains, practicing Hero persona for public consumption, using Deep Work internal focus.',
      seriesConnectionResonance: 'Magus transformation complete; Hero persona establishing; innocence loss addressing; Deep Work internal focus; hidden trauma growing; psychological toll.',
      sceneCardProgression: 236,
      realWorldContext: 'Deep Work internal focus, persona development, identity transformation.',
      timelineSignificance: '11/8/1320 evening—10 hours post-rescue, Francisco accepting permanent transformation from Student to Magus through mirror reflection.',
      saveTheCatBeat: truncate('Final Image - transformation accepted in mirror', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'intimate_reflection',
        narrative_mode: 'resigned_acceptance',
      }),
      learning_objectives: JSON.stringify([
        'Deep Work internal focus value',
        'Identity transformation acceptance',
        'Persona development necessity',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Public return coming',
        'Actor on stage feeling',
        'Master of Two Worlds belonging to neither',
      ]),
    },
    {
      pages: 'Page 596 - 600',
      description: 'Airlock cycling Clean light green—door opening crowds cheers cameras—Novella waiting stepping waving hugging—actor stage-feeling Master Two Worlds belonging-neither as Stage Return Threshold crosses resolves Book 2 ends melancholy triumph public-private finale crowd-roar muffled hug warm-distant hand Seed-closing pocket Final Image epilogue concludes.',
      focus: 'Resolution ending Book 2 through threshold return.',
      chapterSceneFocus: 'Ch80S4: Airlock Clean green door opening—crowds cheers cameras Novella waiting waving hugging—actor stage-feeling Master Two Worlds belonging-neither as Stage Threshold crosses resolves Book 2 melancholy triumph public-private crowd-muffled hug-distant Seed-closing Final Image.',
      preliminarySceneFocus: 'Stage Threshold crosses belonging-neither',
      preliminarySceneDescription: 'Master Two Worlds returns melancholy triumphant',
      narrativeFunction: 'Resolves Book 2 epilogue; demonstrates Master of Two Worlds isolation; shows public vs private split; completes Final Image beat.',
      sensoryDetail: 'Airlock cycling, Clean light green, door opening, crowds presence, cheers sound, cameras flashing, Novella waiting, stepping out, waving gesture, hugging embrace, actor feeling, stage sensation, crowd roar muffled, hug warm but distant, hand closing, Seed in pocket.',
      internalConflict: 'Francisco experiencing melancholy triumph—feeling disconnected from celebration, performing Hero role while feeling isolated, belonging to neither world.',
      characterGrowthElement: 'Francisco achieving Master of Two Worlds—crossing Return Threshold transformed, performing Hero while feeling isolated, completing Book 2 journey ready to lie to everyone he serves.',
      seriesConnectionResonance: 'Master of Two Worlds complete; Book 2 conclusion; hidden trauma continuing; Ivory Tower problem beginning; Final Image establishing tone; Book 3 setup.',
      sceneCardProgression: 237,
      realWorldContext: 'Public vs private identity, heroic isolation, performance necessity.',
      timelineSignificance: '11/8/1320 night—12 hours post-rescue, Francisco returning to civilization transformed, Book 2 Final Image complete, ready for Book 3.',
      saveTheCatBeat: truncate('Final Image - Book 2 ends isolated triumph', 100),
      sudowrite_metadata: JSON.stringify({
        intensity: 'medium',
        pacing: 'melancholy_finale',
        narrative_mode: 'public_private_split',
      }),
      learning_objectives: JSON.stringify([
        'Master of Two Worlds achievement',
        'Public vs private identity management',
        'Book 2 journey completion',
      ]),
      foreshadowing_elements: JSON.stringify([
        'Book 3 beginning',
        'Ivory Tower problem developing',
        'Hidden trauma continuing',
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
        chapterUniqueIdentifier: 'EA-080',
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

  console.log(`\n✅ EA-080 import complete!`);
  console.log(`\n🎊 BOOK 2 COMPLETE! Francisco's journey from Student to Magus is done.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
