import { neon } from '@neondatabase/serverless';

let sqlInstance: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!sqlInstance) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      const errorMsg =
        'DATABASE_URL environment variable is not set. ' +
        'Please configure it in your deployment platform (Vercel, etc.) or local .env file. ' +
        'Get your Neon connection string from: https://console.neon.tech/app/projects';
      console.error('❌ Database Configuration Error:', errorMsg);
      throw new Error(errorMsg);
    }

    sqlInstance = neon(databaseUrl);
  }

  return sqlInstance;
}

// Lazy-load database connection - works with both template literals and direct calls
export const sql = ((strings: TemplateStringsArray, ...values: any[]) => {
  // Template literal call
  return getSql()(strings, ...values);
}) as ReturnType<typeof neon>;
