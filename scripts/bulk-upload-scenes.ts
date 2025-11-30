import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

interface SceneData {
  scene_number: number;
  title: string;
  setup?: string;
  symbolism?: string;
  beat_goal?: string;
  focus?: string;
  description?: string;
  sensoryDetail?: string;
  sensory_detail?: string;
  internalConflict?: string;
  internal_conflict?: string;
  tarotSymbolism?: string;
  tarot_symbolism?: string;
  heroJourneyStage?: string;
  hero_journey_stage?: string;
  pages?: string;
  primaryTarotCard?: string;
  primary_tarot_card?: string;
  [key: string]: any;
}

interface ChapterData {
  chapter_number: number;
  title: string;
  scenes: SceneData[];
  [key: string]: any;
}

interface BookData {
  title: string;
  chapters: ChapterData[];
}

async function getChapterIdByNumber(chapterNumber: number): Promise<string | null> {
  try {
    const { stdout } = await execAsync(
      `psql "$DATABASE_URL" -t -c "SELECT id FROM chapters WHERE chapter_number = ${chapterNumber} LIMIT 1;" 2>&1`
    );
    const id = stdout.trim();
    return id || null;
  } catch (error) {
    return null;
  }
}

function escapeString(str: string | null | undefined): string {
  if (!str) return 'NULL';
  // Escape single quotes by doubling them
  const escaped = String(str).replace(/'/g, "''");
  return `'${escaped}'`;
}

function buildInsertStatement(
  sceneNumber: number,
  sceneData: SceneData,
  chapterId: string
): string {
  const title = escapeString(sceneData.title);
  const focus = escapeString(sceneData.focus);
  const description = escapeString(sceneData.description);
  const setup = escapeString(sceneData.setup);
  const sensoryDetail = escapeString(sceneData.sensory_detail || sceneData.sensoryDetail);
  const internalConflict = escapeString(sceneData.internal_conflict || sceneData.internalConflict);
  const beatGoal = escapeString(sceneData.beat_goal || sceneData.beatGoal);
  const symbolism = escapeString(sceneData.symbolism);
  const tarotSymbolism = escapeString(sceneData.tarot_symbolism || sceneData.tarotSymbolism);
  const heroJourneyStage = escapeString(sceneData.hero_journey_stage || sceneData.heroJourneyStage);
  const pages = escapeString(sceneData.pages);
  const primaryTarotCard = escapeString(sceneData.primary_tarot_card || sceneData.primaryTarotCard);

  return `INSERT INTO scenes (id, chapter_id, scene_number, title, focus, description, setup, sensory_detail, internal_conflict, beat_goal, symbolism, tarot_symbolism, hero_journey_stage, pages, primary_tarot_card, created_at, updated_at) VALUES (gen_random_uuid(), '${chapterId}'::uuid, ${sceneNumber}, ${title}, ${focus}, ${description}, ${setup}, ${sensoryDetail}, ${internalConflict}, ${beatGoal}, ${symbolism}, ${tarotSymbolism}, ${heroJourneyStage}, ${pages}, ${primaryTarotCard}, NOW(), NOW());`;
}

async function bulkUploadScenes() {
  try {
    console.log('🌱 Starting bulk scene upload to Neon DB...\n');

    const storylineDir = path.join(process.cwd(), 'lore', 'json', 'storyline');
    const bookFiles = fs.readdirSync(storylineDir)
      .filter(file =>
        (file.startsWith('Book_') && file.endsWith('_Database_Ready.json')) ||
        (file.includes('Database_Ready') && file.endsWith('.json'))
      )
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });

    console.log(`📚 Found ${bookFiles.length} book files to process\n`);

    let totalScenesProcessed = 0;
    let totalScenesAdded = 0;
    let totalChaptersMissed = 0;

    for (const bookFile of bookFiles) {
      const filePath = path.join(storylineDir, bookFile);
      console.log(`📖 Processing: ${bookFile}`);

      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const bookData: BookData = JSON.parse(fileContent);

        if (!bookData.chapters || bookData.chapters.length === 0) {
          console.warn(`  ⚠️  No chapters found, skipping...\n`);
          continue;
        }

        let sqlStatements: string[] = [];

        for (const chapterData of bookData.chapters) {
          const chapterNumber = chapterData.chapter_number;
          const chapterId = await getChapterIdByNumber(chapterNumber);

          if (!chapterId) {
            totalChaptersMissed++;
            console.warn(`  ⚠️  Chapter ${chapterNumber} not found in database`);
            continue;
          }

          if (chapterData.scenes && Array.isArray(chapterData.scenes)) {
            for (const sceneData of chapterData.scenes) {
              const sceneNumber = sceneData.scene_number;

              try {
                const insertStatement = buildInsertStatement(
                  sceneNumber,
                  sceneData,
                  chapterId
                );
                sqlStatements.push(insertStatement);
                totalScenesProcessed++;
              } catch (error: any) {
                console.error(`    ✗ Error building insert for scene ${sceneNumber}:`, error.message);
              }
            }
          }
        }

        // Execute all SQL statements for this book
        if (sqlStatements.length > 0) {
          console.log(`  📝 Inserting ${sqlStatements.length} scenes...`);

          // Create a temporary SQL file
          const tempSqlFile = `/tmp/scenes_${Date.now()}.sql`;
          fs.writeFileSync(tempSqlFile, sqlStatements.join('\n'));

          try {
            const { stdout, stderr } = await execAsync(
              `psql "$DATABASE_URL" -f ${tempSqlFile} 2>&1`
            );

            // Count successful inserts from output
            const insertCount = (stdout.match(/INSERT 0 1/g) || []).length;
            totalScenesAdded += insertCount;
            console.log(`  ✓ Successfully added ${insertCount} scenes`);

            if (stderr && stderr.includes('ERROR')) {
              console.error(`  ⚠️  Some errors occurred:\n${stderr}`);
            }
          } finally {
            // Clean up temp file
            fs.unlinkSync(tempSqlFile);
          }
        }

        console.log('');
      } catch (error: any) {
        console.error(`  ✗ Error processing ${bookFile}:`, error.message);
      }
    }

    // Final summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Bulk scene upload complete!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`   📊 Total scenes processed: ${totalScenesProcessed}`);
    console.log(`   ✓ Total scenes added: ${totalScenesAdded}`);
    console.log(`   ⚠️  Chapters not found: ${totalChaptersMissed}`);
    console.log('═══════════════════════════════════════════════════════\n');

    // Verify results
    console.log('📋 Verifying database...');
    try {
      const { stdout } = await execAsync(
        `psql "$DATABASE_URL" -c "SELECT COUNT(*) as total_scenes FROM scenes;" 2>&1`
      );
      console.log(stdout);
    } catch (error) {
      console.error('Failed to verify:', error);
    }

  } catch (error: any) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

bulkUploadScenes().then(() => {
  process.exit(0);
});
