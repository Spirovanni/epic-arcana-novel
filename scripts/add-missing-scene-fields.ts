import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);

async function addMissingFields() {
  try {
    console.log('🔄 Adding missing scene fields...');
    
    // Check what fields are missing by comparing schema to actual columns
    const existingColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'scenes'
    `;
    
    const columnNames = existingColumns.map(row => row.column_name);
    console.log('Existing columns:', columnNames.length);
    
    const requiredFields = [
      'sensory_detail',
      'internal_conflict', 
      'beat_goal'
    ];
    
    for (const field of requiredFields) {
      if (!columnNames.includes(field)) {
        console.log(`Adding missing field: ${field}`);
        await sql`ALTER TABLE "scenes" ADD COLUMN ${sql(field)} text`;
      } else {
        console.log(`✓ Field already exists: ${field}`);
      }
    }
    
    console.log('✅ All required scene fields are now present');
    
  } catch (error) {
    console.error('❌ Error adding fields:', error);
  } finally {
    await sql.end();
  }
}

addMissingFields();