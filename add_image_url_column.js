const { Client } = require('pg');
require('dotenv').config();

async function addImageUrlColumn() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    const result = await client.query(`
      ALTER TABLE characters ADD COLUMN IF NOT EXISTS image_url varchar(255);
    `);
    
    console.log('Successfully added image_url column to characters table');
    console.log('Result:', result);
  } catch (error) {
    console.error('Error adding column:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

addImageUrlColumn();