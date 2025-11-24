import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
  };

  try {
    // Test database connection
    console.log('[Health Check] Testing database connection...');
    const result = await sql`SELECT 1 as ping`;
    checks.database = {
      status: 'ok',
      responseTime: Date.now() - startTime + 'ms',
      result: result,
    };
  } catch (dbError) {
    console.error('[Health Check] Database error:', dbError);
    checks.database = {
      status: 'error',
      error: dbError instanceof Error ? dbError.message : String(dbError),
      stack: dbError instanceof Error ? dbError.stack : undefined,
    };
    return NextResponse.json(checks, { status: 503 });
  }

  try {
    // Test personality profiles table
    console.log('[Health Check] Testing personality_profiles table...');
    const profileCountResult = await sql`SELECT COUNT(*) as count FROM personality_profiles`;
    const profileCountArray = Array.isArray(profileCountResult) ? profileCountResult : [];
    const countValue = profileCountArray.length > 0 ? (profileCountArray[0] as any)?.count : 0;

    checks.personalityProfiles = {
      status: 'ok',
      count: countValue || 0,
    };
  } catch (tableError) {
    console.error('[Health Check] Table error:', tableError);
    checks.personalityProfiles = {
      status: 'error',
      error: tableError instanceof Error ? tableError.message : String(tableError),
    };
  }

  checks.overallStatus = checks.database.status === 'ok' ? 'healthy' : 'degraded';
  const statusCode = checks.overallStatus === 'healthy' ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}
