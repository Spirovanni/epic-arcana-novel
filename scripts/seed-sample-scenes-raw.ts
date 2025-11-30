import { db } from '@/lib/db';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

async function seedSampleScenes() {
  try {
    console.log('🌱 Starting sample scene seed (raw SQL)...\n');

    // Get the first chapter ID from the database
    const chapters = await db.query.chapters.findMany({
      limit: 1,
    });

    if (!chapters || chapters.length === 0) {
      console.error('❌ No chapters found in database');
      process.exit(1);
    }

    const chapterId = chapters[0].id;
    console.log(`Using chapter ID: ${chapterId}\n`);

    const sampleScenes = [
      {
        id: randomUUID(),
        chapterId,
        sceneNumber: 1,
        title: 'The University of Bologna',
        focus: 'Francisco\'s Introduction',
        description: 'In the first chapter, we are introduced to Francisco Petrarch, a young man attending the University of Bologna in 1321. He is struggling with feelings of despair and isolation, as he feels disconnected from his peers and his own family.',
        setup: 'Francisco arrives at the university feeling lost and alone',
        sensoryDetail: 'The smell of old parchment and the distant bells of the cathedral',
        internalConflict: 'Desire for adventure versus fear of the unknown',
        beatGoal: 'Advance the narrative through scene 1',
        symbolism: 'The university represents the threshold between old and new knowledge',
        tarotSymbolism: 'The Fool\'s Journey begins',
        heroJourneyStage: 'The Call to Adventure',
        pages: '10-15',
        primaryTarotCard: 'The Fool',
        location: 'University of Bologna, Italy',
        pov: '3rd Person Limited',
        tense: 'Past Tense',
        core_emotion: 'Tension and conflict',
        scene_tone: 'Dramatic and intense',
        timeline_date: '1/10/1320',
        timeline_variant: 'Prime Timeline',
      },
      {
        id: randomUUID(),
        chapterId,
        sceneNumber: 2,
        title: 'The Encounter with Novella',
        focus: 'A Chance Meeting',
        description: 'Francisco Petrarch attends a crowded lecture at the University of Bologna, feeling isolated and disconnected despite being surrounded by people. During the lecture, he accidentally encounters Novella d\'Andrea, the daughter of Giovanni d\'Andrea, who is covering her father\'s lecture from behind a screen.',
        setup: 'Francisco sits in the lecture hall, unaware of the woman behind the screen',
        sensoryDetail: 'The rustle of fabric as Novella moves behind the ornate screen',
        internalConflict: 'Recognition that someone else understands his isolation',
        beatGoal: 'Introduce the secondary protagonist',
        symbolism: 'The screen represents barriers between worlds',
        tarotSymbolism: 'Meeting of the Magician and the High Priestess',
        heroJourneyStage: 'Meeting with the Mentor/Guide',
        pages: '16-22',
        primaryTarotCard: 'The Magician',
        location: 'University Lecture Hall, Bologna',
        pov: '3rd Person Limited',
        tense: 'Past Tense',
        core_emotion: 'Tension and conflict',
        scene_tone: 'Dramatic and intense',
        timeline_date: '1/10/1320',
        timeline_variant: 'Prime Timeline',
      },
    ];

    let addedCount = 0;
    let failedCount = 0;

    for (const scene of sampleScenes) {
      try {
        // Use raw SQL to insert
        const result = await db.execute(
          db.raw(
            `INSERT INTO scenes (
              id, chapter_id, scene_number, title, focus, description,
              setup, sensory_detail, internal_conflict, beat_goal, symbolism,
              tarot_symbolism, hero_journey_stage, pages, primary_tarot_card,
              location, pov, tense, core_emotion, scene_tone,
              timeline_date, timeline_variant, created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6,
              $7, $8, $9, $10, $11,
              $12, $13, $14, $15,
              $16, $17, $18, $19, $20,
              $21, $22, NOW(), NOW()
            )`,
            [
              scene.id, scene.chapterId, scene.sceneNumber, scene.title, scene.focus, scene.description,
              scene.setup, scene.sensoryDetail, scene.internalConflict, scene.beatGoal, scene.symbolism,
              scene.tarotSymbolism, scene.heroJourneyStage, scene.pages, scene.primaryTarotCard,
              scene.location, scene.pov, scene.tense, scene.core_emotion, scene.scene_tone,
              scene.timeline_date, scene.timeline_variant,
            ]
          )
        );

        addedCount++;
        console.log(`✓ Added scene: ${scene.title} (Scene ${scene.sceneNumber})`);
      } catch (error: any) {
        failedCount++;
        console.error(`✗ Failed to add scene "${scene.title}":`, error.message.substring(0, 200));
      }
    }

    console.log('\n✅ Sample scene seeding complete!');
    console.log(`   ✓ Scenes added: ${addedCount}`);
    console.log(`   ✗ Scenes failed: ${failedCount}`);

  } catch (error: any) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

seedSampleScenes().then(() => {
  process.exit(0);
});
