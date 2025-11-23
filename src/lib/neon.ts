import { neon } from '@neondatabase/serverless';

// Ensure DATABASE_URL is available (should be loaded by the calling script)
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Please ensure it is loaded from .env or .env.local before importing this module.'
  );
}

export const sql = neon(databaseUrl);
