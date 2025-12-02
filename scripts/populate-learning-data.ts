/**
 * Populate Learning System Tables
 *
 * This script parses l_outline.json and populates:
 * - learning_resources: Master table of books/sources
 * - learning_resource_chapters: Junction table (resource to chapter)
 * - connection_points: Individual connection points
 * - terminal_learning_objectives: Individual learning objectives
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  learningResources,
  learningResourceChapters,
  connectionPoints,
  terminalLearningObjectives,
  chapters,
} from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Parse outline file
const outlineFilePath = path.join(__dirname, '..', 'data', 'l_outline.json');
const outlineData = JSON.parse(fs.readFileSync(outlineFilePath, 'utf-8'));

// Initialize database connection
const client = postgres(DATABASE_URL);
const db = drizzle(client);

interface SpecificTaskGroup {
  all_chapter: number;
  chapter?: number;
  chapter_number?: number;
  specific_task_group_books_influenced_by?: {
    [bookId: string]: {
      title?: string;
      connect_points?: {
        [key: string]: string;
      };
      terminal_learning_objectives?: {
        [key: string]: {
          bloom_level?: string;
          description?: string;
        } | string;
      };
    };
  };
}

interface LearningResource {
  id: string;
  resourceId: string;
  title: string;
  author?: string;
}

// Map to track created learning resources
const resourcesMap = new Map<string, LearningResource>();

// Step 1: Extract all unique learning resources
async function extractLearningResources() {
  console.log('Step 1: Extracting learning resources...');

  const outline = outlineData as any;
  const trilogies = outline.SelfImprovementSeries?.Books?.trilogies || {};

  for (const [trilogyKey, trilogy] of Object.entries(trilogies)) {
    const trilogyBooks = (trilogy as any).trilogy_books || {};

    for (const [bookKey, book] of Object.entries(trilogyBooks)) {
      const taskMasters = (book as any).task_masters || {};

      for (const [tmKey, taskMaster] of Object.entries(taskMasters)) {
        const majorTaskGroups = (taskMaster as any).major_task_groups || {};

        for (const [mtgKey, majorTaskGroup] of Object.entries(
          majorTaskGroups
        )) {
          const specificTaskGroups = (majorTaskGroup as any)
            .Specific_task_groups || {};

          for (const [stgKey, specificTaskGroup] of Object.entries(
            specificTaskGroups
          )) {
            const stg = specificTaskGroup as SpecificTaskGroup;
            const booksInfluenced =
              stg.specific_task_group_books_influenced_by || {};

            for (const [resourceKey, bookData] of Object.entries(
              booksInfluenced
            )) {
              if (!resourcesMap.has(resourceKey)) {
                const title = (bookData as any).title || resourceKey;

                const newResource: LearningResource = {
                  id: '',
                  resourceId: resourceKey,
                  title,
                };

                resourcesMap.set(resourceKey, newResource);
                console.log(`  - Found resource: ${resourceKey} = "${title}"`);
              }
            }
          }
        }
      }
    }
  }

  console.log(`Total unique resources found: ${resourcesMap.size}\n`);
}

// Step 2: Insert learning resources into database
async function insertLearningResources() {
  console.log('Step 2: Inserting learning resources into database...');

  for (const [resourceKey, resource] of resourcesMap.entries()) {
    try {
      const result = await db
        .insert(learningResources)
        .values({
          resourceId: resource.resourceId,
          title: resource.title,
          author: undefined,
          sectionOfFocus: undefined,
          sectionDescription: undefined,
          connectionFocusArea: undefined,
        })
        .returning({ id: learningResources.id });

      if (result.length > 0) {
        resource.id = result[0].id;
        console.log(
          `  ✓ Inserted: ${resource.resourceId} (ID: ${resource.id})`
        );
      }
    } catch (error: any) {
      if (error.code === '23505') {
        // Unique constraint violation
        const existing = await db
          .select()
          .from(learningResources)
          .where(eq(learningResources.resourceId, resource.resourceId))
          .limit(1);

        if (existing.length > 0) {
          resource.id = existing[0].id;
          console.log(
            `  → Already exists: ${resource.resourceId} (ID: ${resource.id})`
          );
        }
      } else {
        console.error(
          `  ✗ Error inserting ${resource.resourceId}:`,
          error.message
        );
      }
    }
  }

  console.log();
}

// Step 3: Process chapters and create connections
async function processChapters() {
  console.log('Step 3: Processing chapters and creating connections...');

  let totalConnections = 0;
  let totalConnectionPoints = 0;
  let totalObjectives = 0;

  const outline = outlineData as any;
  const trilogies = outline.SelfImprovementSeries?.Books?.trilogies || {};

  for (const [trilogyKey, trilogy] of Object.entries(trilogies)) {
    const trilogyBooks = (trilogy as any).trilogy_books || {};

    for (const [bookKey, book] of Object.entries(trilogyBooks)) {
      const taskMasters = (book as any).task_masters || {};

      for (const [tmKey, taskMaster] of Object.entries(taskMasters)) {
        const majorTaskGroups = (taskMaster as any).major_task_groups || {};

        for (const [mtgKey, majorTaskGroup] of Object.entries(
          majorTaskGroups
        )) {
          const specificTaskGroups = (majorTaskGroup as any)
            .Specific_task_groups || {};

          for (const [stgKey, specificTaskGroup] of Object.entries(
            specificTaskGroups
          )) {
            const stg = specificTaskGroup as SpecificTaskGroup;

            // Determine chapter number - try multiple fields
            const chapterNumber =
              stg.all_chapter || stg.chapter || stg.chapter_number || 1;

            // Find the matching chapter in database
            const dbChapters = await db
              .select()
              .from(chapters)
              .where(eq(chapters.chapterNumber, chapterNumber))
              .limit(1);

            if (!dbChapters.length) {
              console.log(
                `  ⚠ Warning: Could not find chapter ${chapterNumber} in database`
              );
              continue;
            }

            const dbChapter = dbChapters[0];
            const booksInfluenced = stg.specific_task_group_books_influenced_by || {};

            // Process each resource for this chapter
            for (const [resourceKey, bookData] of Object.entries(
              booksInfluenced
            )) {
              const resource = resourcesMap.get(resourceKey);
              if (!resource || !resource.id) {
                console.log(
                  `  ⚠ Warning: Resource ${resourceKey} not found in map`
                );
                continue;
              }

              // Create junction table entry
              try {
                await db
                  .insert(learningResourceChapters)
                  .values({
                    learningResourceId: resource.id,
                    chapterId: dbChapter.id,
                    orderIndex: 0,
                  });

                totalConnections++;
              } catch (error: any) {
                if (error.code !== '23505') {
                  // Ignore duplicate errors
                  console.error(
                    `  ✗ Error creating connection for chapter ${chapterNumber}:`,
                    error.message
                  );
                }
              }

              const bookDataObj = bookData as any;
              const connectPoints = bookDataObj.connect_points || {};
              const objectives = bookDataObj.terminal_learning_objectives || {};

              // Process connection points
              for (const [pointKey, pointText] of Object.entries(
                connectPoints
              )) {
                const pointNumber =
                  parseInt(pointKey.replace('point', '')) || 0;

                try {
                  await db
                    .insert(connectionPoints)
                    .values({
                      learningResourceId: resource.id,
                      chapterId: dbChapter.id,
                      pointNumber,
                      description: pointText,
                    });

                  totalConnectionPoints++;
                } catch (error: any) {
                  if (error.code !== '23505') {
                    console.error(
                      `  ✗ Error inserting connection point:`,
                      error.message
                    );
                  }
                }
              }

              // Process learning objectives
              for (const [objKey, objData] of Object.entries(objectives)) {
                const objectiveNumber =
                  parseInt(objKey.replace('objective', '')) || 0;
                const description =
                  typeof objData === 'string'
                    ? objData
                    : (objData as any).description || '';
                const bloomLevel =
                  typeof objData === 'string'
                    ? undefined
                    : (objData as any).bloom_level;

                try {
                  await db
                    .insert(terminalLearningObjectives)
                    .values({
                      learningResourceId: resource.id,
                      chapterId: dbChapter.id,
                      objectiveNumber,
                      description,
                      bloomLevel,
                    });

                  totalObjectives++;
                } catch (error: any) {
                  if (error.code !== '23505') {
                    console.error(
                      `  ✗ Error inserting learning objective:`,
                      error.message
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  console.log(`  ✓ Created ${totalConnections} resource-chapter connections`);
  console.log(`  ✓ Created ${totalConnectionPoints} connection points`);
  console.log(`  ✓ Created ${totalObjectives} learning objectives\n`);
}

// Main execution
async function main() {
  console.log('====================================');
  console.log('Learning System Data Population');
  console.log('====================================\n');

  try {
    await extractLearningResources();
    await insertLearningResources();
    await processChapters();

    console.log('====================================');
    console.log('✓ Population Complete!');
    console.log('====================================');
  } catch (error) {
    console.error('Error during population:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
