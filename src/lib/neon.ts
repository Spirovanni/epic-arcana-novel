import { neon } from '@neondatabase/serverless';

let sqlInstance: ReturnType<typeof neon> | null = null;

/**
 * Get or create the SQL client instance.
 * Defers initialization until first use to avoid errors during module loading.
 */
function getSql() {
  if (!sqlInstance) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL is not configured. ' +
        'Set it in your Vercel environment variables or .env.local file.'
      );
    }
    sqlInstance = neon(databaseUrl);
  }
  return sqlInstance;
}

/**
 * Template literal function that lazily initializes the database connection.
 * Usage: sql`SELECT * FROM table WHERE id = ${id}`
 */
export function sql(strings: TemplateStringsArray, ...values: any[]) {
  return getSql()(strings, ...values);
}
