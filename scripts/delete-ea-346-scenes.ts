import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function deleteEA346Scenes() {
    console.log('🗑️  Deleting EA-346 scenes from NeonDB...\n');

    try {
        // First, find the chapter for EA-346
        const chapters = await sql`
      SELECT id, title, unique_identifier 
      FROM chapters 
      WHERE chapter_number = 346
      LIMIT 1
    `;

        if (chapters.length === 0) {
            console.log('❌ EA-346 chapter not found');
            return;
        }

        const chapter = chapters[0];
        console.log(`✓ Found chapter: ${chapter.title} (${chapter.unique_identifier})`);
        console.log(`  Chapter ID: ${chapter.id}\n`);

        // Get existing scenes count
        const existingScenes = await sql`
      SELECT scene_number, title
      FROM scenes
      WHERE chapter_id = ${chapter.id}
    `;

        const sceneCount = existingScenes.length;
        console.log(`📊 Current scene count: ${sceneCount}\n`);

        if (sceneCount === 0) {
            console.log('ℹ️  No scenes to delete');
            return;
        }

        // Delete all scenes for this chapter
        const deletedScenes = await sql`
      DELETE FROM scenes
      WHERE chapter_id = ${chapter.id}
      RETURNING scene_number, title
    `;

        console.log(`✅ Deleted ${deletedScenes.length} scenes:`);
        deletedScenes.forEach((scene: any) => {
            console.log(`   - Scene ${scene.scene_number}: ${scene.title}`);
        });

        console.log('\n✓ Deletion complete - ready for re-import\n');

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

deleteEA346Scenes();
