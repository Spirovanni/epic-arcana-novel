import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Updates existing EA-346 scenes with missing beatGoal field
 */

function findChapterData(outline: any, eaId: string): any {
    const search = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return null;
        if (obj.id === eaId) return obj;

        for (const key of Object.keys(obj)) {
            const result = search(obj[key]);
            if (result) return result;
        }
        return null;
    };

    return search(outline);
}

function truncate(str: string | undefined, maxLength: number): string | null {
    if (!str) return null;
    return str.length > maxLength ? str.substring(0, maxLength) : str;
}

async function main() {
    const chapterNumber = 346;
    const eaId = `EA-${chapterNumber.toString().padStart(3, '0')}`;

    console.log(`🔄 Updating EA-346 scenes with missing beatGoal field...\n`);

    // Find the chapter
    const [chapter] = await db
        .select()
        .from(chapters)
        .where(eq(chapters.chapterNumber, chapterNumber))
        .limit(1);

    if (!chapter) {
        throw new Error(`Chapter ${chapterNumber} not found`);
    }

    console.log(`✅ Found chapter: ${chapter.title}\n`);

    // Read outline
    const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
    const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

    // Find chapter data
    const chapterData = findChapterData(outline, eaId);
    if (!chapterData || !chapterData.scenes) {
        throw new Error(`${eaId} scenes not found in outline`);
    }

    console.log(`✅ Found ${chapterData.scenes.length} scenes in outline\n`);

    for (const outlineScene of chapterData.scenes) {
        console.log(`📝 Updating Scene ${outlineScene.scene_number}: ${outlineScene.title}`);

        // Find existing scene
        const [existingScene] = await db
            .select()
            .from(scenes)
            .where(
                and(
                    eq(scenes.chapterId, chapter.id),
                    eq(scenes.sceneNumber, outlineScene.scene_number)
                )
            )
            .limit(1);

        if (!existingScene) {
            console.log(`   ⚠️  Scene ${outlineScene.scene_number} not found. Skipping.\n`);
            continue;
        }

        // Update with missing field (supporting both snake_case and camelCase)
        const updateData: any = {
            beatGoal: truncate(
                outlineScene.beatGoal || outlineScene.beat_goal,
                500
            ),
        };

        await db.update(scenes).set(updateData).where(eq(scenes.id, existingScene.id));
        console.log(`   ✅ Updated with beatGoal\n`);
    }

    console.log(`✅ Update complete!`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
