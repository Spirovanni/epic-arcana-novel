import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('📍 Adding location field to EA-026 scenes...\n');

  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-026'))
    .limit(1);

  if (ch.length === 0) {
    console.error('❌ EA-026 not found');
    process.exit(1);
  }

  const chapter = ch[0];

  const ea026Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  const locations = [
    {
      // Scene 1: The First Assignment - already has location
      location: null, // Already set from outline
    },
    {
      // Scene 2: The Overcorrection Crisis
      location: 'Academy Satellite Facility - Destini',
    },
    {
      // Scene 3: Dynamic Balance Mastery
      location: 'Destini Central Balance Chamber',
    },
  ];

  for (let i = 0; i < ea026Scenes.length; i++) {
    const scene = ea026Scenes[i];
    const data = locations[i];

    if (!data || !data.location) continue;

    await db
      .update(scenes)
      .set({
        location: data.location,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   Location: ${data.location}`);
    console.log('');
  }

  console.log('🎉 EA-026 locations complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
