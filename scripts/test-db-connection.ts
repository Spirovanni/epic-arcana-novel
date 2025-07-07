import 'dotenv/config';
import { Pool } from 'pg';

async function testDbConnection() {
  console.log('Attempting to connect to the database...');
  
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('🔴 DATABASE_URL is not defined in your .env file.');
    return;
  }

  console.log('Found DATABASE_URL. Creating a new pool...');

  const pool = new Pool({
    connectionString,
  });

  try {
    console.log('Connecting to the pool...');
    const client = await pool.connect();
    console.log('🟢 Successfully connected to the database!');
    
    console.log('Running a simple query (SELECT NOW())...');
    const result = await client.query('SELECT NOW()');
    console.log('Query successful. Current time from DB:', result.rows[0].now);

    client.release();
    await pool.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('🔴 Failed to connect to the database.');
    console.error(error);
  }
}

testDbConnection(); 