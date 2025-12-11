import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load env so the script works when run with tsx
dotenv.config();

const defaultTasks = [
  {
    taskId: 'character_arc_1',
    title:
      "Francisco: Initial state - Young law student with hidden poetic talent, struggling with father's expectations vs. personal desires. Academic pressure conflicts with creative impulses. Social naivety evident in his infatuation with Novella.",
    description: 'Character Arc 1',
    category: 'character_arcs',
  },
  {
    taskId: 'character_arc_2',
    title:
      "Novella: Intelligent daughter hiding behind conventions, representing Francisco's idealized view of love and knowledge.",
    description: 'Character Arc 2',
    category: 'character_arcs',
  },
  {
    taskId: 'character_arc_3',
    title:
      "Dante: Mysterious guide introduction - Hints at his chronicle manipulation abilities. Shows deeper knowledge of temporal mechanics than he initially reveals.",
    description: 'Character Arc 3',
    category: 'character_arcs',
  },
  {
    taskId: 'story_gap_1',
    title:
      "trionfi_system: Francisco's first unintentional activation shows him seeing the train pathway on the card - establishes cards as windows to other realities/timelines.",
    description: 'Story Gap 1',
    category: 'story_gaps_addressed',
  },
  {
    taskId: 'story_gap_2',
    title:
      'temporal_mechanics: The distant train grumbling represents the first temporal disturbance, setting up timeline awareness.',
    description: 'Story Gap 2',
    category: 'story_gaps_addressed',
  },
  {
    taskId: 'story_gap_3',
    title:
      "character_motivation: Francisco's preparation shows his growing courage despite fear - establishes his heroic potential beneath academic exterior.",
    description: 'Story Gap 3',
    category: 'story_gaps_addressed',
  },
  {
    taskId: 'series_connection_1',
    title:
      "book_9_parallel: Opening despair will transform into universal hope when Francisco gives up his singular greatness for humanity's potential.",
    description: 'Series Connection 1',
    category: 'series_connections',
  },
  {
    taskId: 'series_connection_2',
    title:
      "the_fool_journey: Francisco's first step as The Fool, unaware of the cosmic significance of his simple card game creation.",
    description: 'Series Connection 2',
    category: 'series_connections',
  },
  {
    taskId: 'series_connection_3',
    title:
      "timeline_convergence: This chapter's events will echo in the final book when all timelines converge into a single moment of choice.",
    description: 'Series Connection 3',
    category: 'series_connections',
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set.');
  }

  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    console.log('✅ Connected to database');

    // Find chapters that currently have no tasks but do have scenes (to limit to story chapters)
    const chaptersToSeed = await client.query(
      `
      select c.id, c.title
      from chapters c
      where not exists (
        select 1 from chapter_tasks t where t.chapter_id = c.id
      )
      and exists (
        select 1 from scenes s where s.chapter_id = c.id
      )
      order by c.id
      `,
    );

    console.log(`Found ${chaptersToSeed.rowCount} chapters with scenes and no tasks.`);

    for (const chapter of chaptersToSeed.rows) {
      console.log(`\nSeeding tasks for chapter ${chapter.id} (${chapter.title})`);

      for (const task of defaultTasks) {
        await client.query(
          `
          insert into chapter_tasks (chapter_id, task_id, title, description, category, completed)
          values ($1, $2, $3, $4, $5, false)
          on conflict (chapter_id, task_id) do update
            set title = excluded.title,
                description = excluded.description,
                category = excluded.category,
                updated_at = now();
          `,
          [chapter.id, task.taskId, task.title, task.description, task.category],
        );
      }

      console.log(`Seeded ${defaultTasks.length} tasks for ${chapter.title}`);
    }

    console.log('\n✨ Bulk seeding complete');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
