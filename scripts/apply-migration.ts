import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(DATABASE_URL);

async function main() {
  try {
    console.log('Applying migration: add chapter metadata to learning_resources...\n');

    await sql`ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS specific_task_group_title VARCHAR(255)`;
    console.log('✓ Added specific_task_group_title column');

    await sql`ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS focus_area VARCHAR(255)`;
    console.log('✓ Added focus_area column');

    await sql`ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS tagline TEXT`;
    console.log('✓ Added tagline column');

    console.log('\n✓ Migration applied successfully!');
  } catch (error) {
    console.error('Error applying migration:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
