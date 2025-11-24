import { Client } from '@neondatabase/serverless';

/**
 * Add color columns to personality_chapter_mappings table
 */
async function addColorColumns() {
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();

  try {
    console.log('Starting migration to add color columns...\n');

    // Add the color columns
    await client.query(`
      ALTER TABLE personality_chapter_mappings
      ADD COLUMN IF NOT EXISTS color_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS rgb_hex VARCHAR(7),
      ADD COLUMN IF NOT EXISTS color_symbolism TEXT
    `);

    console.log('✓ Successfully added color columns\n');

    // Verify columns exist
    const checkResult = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'personality_chapter_mappings'
      ORDER BY column_name
    `);

    console.log('Current columns in personality_chapter_mappings:');
    (checkResult.rows as any[]).forEach((row) => {
      console.log(`  - ${row.column_name}`);
    });

    console.log('\n✓ Migration complete!\n');

  } catch (error) {
    console.error('Error adding color columns:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the migration
addColorColumns()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
