import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chapters, scenes } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { config } from 'dotenv';

// Load environment variables
config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(connectionString);
const db = drizzle(sql);

const BOOK_ID = "3e26f59f-da2d-4f26-acd6-f68ed1a4af8d"; // Book 1 ID
const CHAPTER_NUMBER = 1;

async function updateChapter1Redesign() {
  try {
    console.log('🔄 Starting Chapter 1 redesign update...');

    // First, find the existing Chapter 1
    const existingChapters = await db.select()
      .from(chapters)
      .where(eq(chapters.bookId, BOOK_ID))
      .where(eq(chapters.chapterNumber, CHAPTER_NUMBER));

    if (existingChapters.length === 0) {
      console.log('❌ No existing Chapter 1 found');
      return;
    }

    const existingChapter = existingChapters[0];
    console.log(`📖 Found existing Chapter 1: ${existingChapter.title}`);

    // Update the chapter with new data
    await db.update(chapters)
      .set({
        title: "The Awakening Call",
        summary: "Francisco Petrarch, a young law student at Bologna University in 1321, experiences his darkest moment of academic despair during a crowded lecture. Feeling isolated and questioning his path, he discovers the mysterious Trionfi cards in his possession. His first tentative interaction with the cards reveals disturbing visions of metal rails, strange tunnels, and distant sounds that hint at worlds beyond his understanding. This pivotal moment marks Francisco's first contact with the cosmic forces that will transform him from an ordinary student into the Master of Two Worlds, setting the foundation for his epic journey ahead.",
        description: "Francisco's academic despair transforms into cosmic awakening as he discovers the mysterious Trionfi cards for the first time. This opening chapter establishes the emotional and spiritual distance Francisco must travel from ordinary law student to eventual Master of Two Worlds, while introducing the cosmic forces that will shape his destiny.",
        updatedAt: new Date()
      })
      .where(eq(chapters.id, existingChapter.id));

    console.log('✅ Updated Chapter 1 basic information');

    // Delete existing scenes for Chapter 1
    await db.delete(scenes)
      .where(eq(scenes.chapterId, existingChapter.id));

    console.log('🗑️ Removed existing Chapter 1 scenes');

    // Add new scenes
    const newScenes = [
      {
        chapterId: existingChapter.id,
        sceneNumber: 1,
        title: "The Weight of Academic Despair",
        description: "Francisco experiences his lowest point during a crowded university lecture, feeling completely isolated and questioning his purpose at Bologna University.",
        setup: "Francisco sits in the back of a packed lecture hall at the University of Bologna, surrounded by eager students but feeling utterly alone. The professor drones about legal precedents while Francisco's mind wanders to his deeper questions about life's meaning. The weight of his father's expectations clashes with his secret poetic aspirations, creating a suffocating sense of despair. As fellow students take notes enthusiastically, Francisco stares out the window wondering if this path is truly his destiny, unaware that cosmic forces are already beginning to stir around him.",
        beatGoal: "Establish Francisco's ordinary world baseline and his profound sense of despair that will contrast with his eventual transformation to Master of Two Worlds.",
        tarotSymbolism: "The Nine of Swords represents the dark night of the soul, the mental anguish that Francisco experiences before his cosmic awakening begins.",
        timeline_date: "2/13/1321",
        timeline_variant: "Prime Timeline",
        location: "University of Bologna - Main Lecture Hall",
        pov: "Third Person Limited (Francisco)",
        core_emotion: "Profound despair and existential questioning",
        scene_tone: "Heavy, introspective, and melancholic"
      },
      {
        chapterId: existingChapter.id,
        sceneNumber: 2,
        title: "The Discovery of the Cards",
        description: "While alone in his study after the disheartening lecture, Francisco discovers a mysterious set of cards in his belongings that he doesn't remember acquiring.",
        setup: "Returning to his modest student quarters after the lecture, Francisco slumps at his wooden desk surrounded by law books and unfinished poetry. As he reaches for his writing materials, his hand brushes against an unfamiliar object—a deck of beautifully illustrated cards wrapped in dark silk. Though he has no memory of acquiring them, the cards feel strangely familiar in his hands. The artwork is unlike anything he has seen before, with symbols and figures that seem to shift slightly when viewed from different angles. Despite his rational legal training, Francisco feels an inexplicable pull toward these mysterious Trionfi cards.",
        beatGoal: "Introduce the cosmic element (Trionfi cards) that will transform Francisco's ordinary world and begin his hero's journey.",
        tarotSymbolism: "The discovery of the cards themselves represents the call to adventure, the moment when cosmic forces first make contact with Francisco's ordinary world.",
        timeline_date: "2/13/1321",
        timeline_variant: "Prime Timeline", 
        location: "Francisco's Student Quarters - Study Room",
        pov: "Third Person Limited (Francisco)",
        core_emotion: "Curiosity mixed with inexplicable recognition",
        scene_tone: "Mysterious, intriguing, and slightly unsettling"
      },
      {
        chapterId: existingChapter.id,
        sceneNumber: 3,
        title: "The First Cosmic Vision",
        description: "Francisco's tentative interaction with the cards triggers his first supernatural experience—a vision of metal rails, strange tunnels, and distant sounds from another world.",
        setup: "As evening shadows lengthen across his room, Francisco carefully examines one of the cards by candlelight. The image shows a city square with an arched pathway, but as he focuses on the details, he notices something impossible—what appear to be two metal rails running through the scene and disappearing into a tunnel. The longer he stares, the more the image seems to come alive, and suddenly Francisco hears it: a distant, rhythmic grumbling growing steadily louder. The sound is unlike anything from his medieval world—mechanical, powerful, and approaching. The card grows warm in his hands as the vision intensifies, and Francisco realizes he is witnessing something from beyond his understanding, a glimpse of worlds and times yet to come.",
        beatGoal: "Complete Francisco's first contact with cosmic forces and establish the supernatural elements that will drive the entire series forward.",
        tarotSymbolism: "The metal rails and approaching train represent the path of destiny that Francisco must follow, connecting different worlds and times through the power of the Trionfi cards.",
        timeline_date: "2/13/1321",
        timeline_variant: "Prime Timeline",
        location: "Francisco's Student Quarters - Study Room (with cosmic overlay)",
        pov: "Third Person Limited (Francisco)",
        core_emotion: "Awe, fear, and the thrill of cosmic awakening",
        scene_tone: "Mystical, transformative, and foreshadowing"
      }
    ];

    // Insert new scenes
    for (const scene of newScenes) {
      await db.insert(scenes).values(scene);
      console.log(`✅ Added Scene ${scene.sceneNumber}: "${scene.title}"`);
    }

    console.log('🎉 Chapter 1 redesign completed successfully!');
    console.log('📊 Summary:');
    console.log('  - Updated chapter title: "The Awakening Call"');
    console.log('  - Updated chapter summary and description');
    console.log('  - Added 3 new detailed scenes with timeline dates');
    console.log('  - Timeline: 2/13/1321 in Bologna, Italy');
    console.log('  - Arc: Academic despair → Cosmic awakening');

  } catch (error) {
    console.error('❌ Error updating Chapter 1:', error);
  } finally {
    await sql.end();
  }
}

updateChapter1Redesign();