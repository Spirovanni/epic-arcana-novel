import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('📝 Adding description field to EA-024 scenes...\n');

  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-024'))
    .limit(1);

  if (ch.length === 0) {
    console.error('❌ EA-024 not found');
    process.exit(1);
  }

  const chapter = ch[0];

  const ea024Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  const descriptions = [
    {
      // Scene 1: The Academy Crisis
      description:
        'Francisco and Zara arrive at dawn to discover the Academy fractured into three conflicting factions—Militant Guardians advocating preemptive strikes, Scholarly Preservationists focusing on knowledge protection, and Mystical Integrationists seeking cosmic force integration. Master Cornelius reveals that traditional leadership has failed to resolve the crisis threatening Academy unity. Francisco and Zara recognize this as their first real-world test of applying La Signora\'s harmonic principles to practical leadership challenges.',
    },
    {
      // Scene 2: The Harmonic Council
      description:
        'Francisco and Zara implement La Signora\'s teachings by creating a "Harmonic Council" with interwoven seating circles that place opposing faction members beside each other. Through mindful direction and protected emotional space, the session reveals each faction\'s core fears: Militants fear inadequate cosmic threat preparation, Preservationists fear losing ancient wisdom, and Integrationists fear spiritual disconnection. As empathetic understanding grows, the factions discover their conflicts mask complementary strengths essential for comprehensive cosmic defense.',
    },
    {
      // Scene 3: The Unified Academy Accords
      description:
        'In the afternoon sunlight of the Harmonic Gardens, Francisco and Zara guide the Academy factions in creating the Unified Academy Accords—an integrated framework where Militants lead tactical preparedness, Preservationists maintain wisdom archives, and Integrationists ensure spiritual alignment. The Accords establish interdependence: each group\'s success requires the others\' contributions. Amid elemental displays of natural harmony, the Academy witnesses conflict transformed into collaborative strength as Master Cornelius marvels at the achievement.',
    },
  ];

  for (let i = 0; i < ea024Scenes.length; i++) {
    const scene = ea024Scenes[i];
    const data = descriptions[i];

    if (!data) continue;

    await db
      .update(scenes)
      .set({
        description: data.description,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   Description added (${data.description.length} characters)`);
    console.log('');
  }

  console.log('🎉 EA-024 descriptions complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
