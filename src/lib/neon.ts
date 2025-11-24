import { neon } from '@neondatabase/serverless';

// Cache the SQL instance per function invocation
let cachedSql: ReturnType<typeof neon> | null = null;

/**
 * Get or create the SQL client instance.
 * Uses lazy initialization and caching to handle serverless environments.
 */
function initSql() {
  if (cachedSql) {
    return cachedSql;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    const msg =
      'DATABASE_URL environment variable is not set. ' +
      'Ensure it is configured in Vercel Environment Variables or .env.local';
    console.error(msg);
    throw new Error(msg);
  }

  try {
    cachedSql = neon(databaseUrl);
    console.log('[Neon] Database connection initialized');
    return cachedSql;
  } catch (err) {
    console.error('[Neon] Failed to initialize connection:', err);
    throw err;
  }
}

/**
 * SQL query function with lazy initialization
 * Usage: sql`SELECT * FROM table WHERE id = ${id}`
 */
export const sql = ((
  strings: TemplateStringsArray,
  ...values: any[]
) => {
  try {
    return initSql()(strings, ...values);
  } catch (err) {
    console.error('[Neon Query] Error executing query:', err);
    throw err;
  }
}) as ReturnType<typeof neon>;
