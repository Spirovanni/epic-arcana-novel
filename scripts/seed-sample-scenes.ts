import { db } from '@/lib/db';
import { scenes } from '@/lib/schema';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Sample scene data for testing
const sampleScenes = [
  {
    id: randomUUID(),
    chapterId: '693c41cf-f53e-462a-aeee-d03834246afc', // Chapter 1
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: randomUUID(),
    chapterId: '693c41cf-f53e-462a-aeee-d03834246afc', // Chapter 1
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedSampleScenes() {
  try {
    console.log('🌱 Starting sample scene seed...\n');

    let addedCount = 0;
    let failedCount = 0;

    for (const sceneData of sampleScenes) {
      try {
        // Use raw insert with only the fields we know exist
        const result = await db.insert(scenes).values({
          id: sceneData.id,
          chapterId: sceneData.chapterId,
          sceneNumber: sceneData.sceneNumber,
          title: sceneData.title,
          focus: sceneData.focus,
          description: sceneData.description,
          setup: sceneData.setup,
          sensoryDetail: sceneData.sensoryDetail,
          internalConflict: sceneData.internalConflict,
          beatGoal: sceneData.beatGoal,
          symbolism: sceneData.symbolism,
          tarotSymbolism: sceneData.tarotSymbolism,
          heroJourneyStage: sceneData.heroJourneyStage,
          pages: sceneData.pages,
          primaryTarotCard: sceneData.primaryTarotCard,
          location: sceneData.location,
          pov: sceneData.pov,
          tense: sceneData.tense,
          core_emotion: sceneData.core_emotion,
          scene_tone: sceneData.scene_tone,
          timeline_date: sceneData.timeline_date,
          timeline_variant: sceneData.timeline_variant,
          createdAt: sceneData.createdAt,
          updatedAt: sceneData.updatedAt,
        }).returning();

        addedCount++;
        console.log(`✓ Added scene: ${sceneData.title} (Scene ${sceneData.sceneNumber})`);
      } catch (error: any) {
        failedCount++;
        console.error(`✗ Failed to add scene "${sceneData.title}":`, error.message.substring(0, 150));
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
