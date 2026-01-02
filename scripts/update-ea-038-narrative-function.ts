import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Updates EA-038 scenes with narrative_function field
 */

async function main() {
  console.log('📖 Updating EA-038 scenes with narrative function...\n');

  const narrativeFunctions = [
    {
      scene_number: 1,
      narrative_function:
        'Establishes the post-climax integration phase where Francisco and Zara must process and understand their transformation before teaching others. This scene demonstrates that achieving cosmic power is only the beginning—true mastery requires profound self-understanding and inner wisdom to use power responsibly and guide others safely.',
    },
    {
      scene_number: 2,
      narrative_function:
        "Demonstrates Francisco and Zara's new roles as wisdom keepers and guides, particularly highlighting Zara's natural affinity for The High Priestess archetype. This scene shows how their inner wisdom translates into practical teaching—perceiving each seeker's readiness and offering the precise guidance needed for authentic transformation rather than superficial power-seeking.",
    },
    {
      scene_number: 3,
      narrative_function:
        "Completes Book 1's arc by establishing the wisdom temple and teaching tradition that will guide the series. This scene demonstrates that Francisco and Zara's true elixir isn't cosmic power itself but the inner knowledge of how transformation works—making authentic awakening accessible to all sincere seekers while protecting it from those seeking power for ego gratification.",
    },
  ];

  for (const data of narrativeFunctions) {
    const [scene] = await db
      .select()
      .from(scenes)
      .where(
        and(
          eq(scenes.chapterUniqueIdentifier, 'EA-038'),
          eq(scenes.sceneNumber, data.scene_number)
        )
      )
      .limit(1);

    if (!scene) {
      console.log(`❌ Scene ${data.scene_number} not found`);
      continue;
    }

    await db
      .update(scenes)
      .set({ narrativeFunction: data.narrative_function })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${data.scene_number}: Narrative function updated`);
  }

  console.log('\n✅ Update complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
