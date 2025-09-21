import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { calendarSettings, daySign, daySignMapping, dayOverride } from '@/lib/schema';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

const ImportDataSchema = z.object({
  settings: z.record(z.string()).optional(),
  daySigns: z.array(z.object({
    index0: z.number().min(0).max(19),
    name: z.string(),
    color: z.string().optional(),
    glyph: z.string().optional(),
    archetype: z.string(),
    theme: z.string(),
    reflection: z.string(),
    ritual: z.string(),
    keywords: z.string(),
  })).optional(),
  overrides: z.array(z.object({
    dayOfYear: z.number().min(1).max(365),
    title: z.string().optional(),
    description: z.string().optional(),
    ritual: z.string().optional(),
    tags: z.string().optional(),
  })).optional(),
});

/**
 * GET /api/import-export
 * Export all calendar data as JSON
 */
export async function GET() {
  try {
    // Get settings
    const settingsData = await db.select().from(calendarSettings);
    const settings: Record<string, string> = {};
    for (const setting of settingsData) {
      const key = setting.key.replace('calendar.', '');
      settings[key] = setting.value;
    }

    // Get day signs with mappings
    const daySignsData = await db
      .select({
        id: daySign.id,
        index0: daySign.index0,
        name: daySign.name,
        color: daySign.color,
        glyph: daySign.glyph,
        archetype: daySignMapping.archetype,
        theme: daySignMapping.theme,
        reflection: daySignMapping.reflection,
        ritual: daySignMapping.ritual,
        keywords: daySignMapping.keywords,
      })
      .from(daySign)
      .leftJoin(daySignMapping, eq(daySign.id, daySignMapping.daySignId))
      .orderBy(daySign.index0);

    // Get overrides
    const overridesData = await db
      .select()
      .from(dayOverride)
      .orderBy(dayOverride.dayOfYear);

    const exportData = {
      settings,
      daySigns: daySignsData,
      overrides: overridesData,
      exported: new Date().toISOString(),
      version: '1.0'
    };

    return NextResponse.json({
      success: true,
      data: exportData
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/import-export
 * Import calendar data from JSON
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const importData = ImportDataSchema.parse(body);

    const results = {
      settings: 0,
      daySigns: 0,
      overrides: 0,
      errors: [] as string[]
    };

    // Import settings
    if (importData.settings) {
      try {
        for (const [key, value] of Object.entries(importData.settings)) {
          await db
            .insert(calendarSettings)
            .values({ key: `calendar.${key}`, value })
            .onConflictDoUpdate({
              target: calendarSettings.key,
              set: { value, updatedAt: new Date() }
            });
          results.settings++;
        }
      } catch (error) {
        results.errors.push(`Settings import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Import day signs
    if (importData.daySigns) {
      try {
        for (const signData of importData.daySigns) {
          const { archetype, theme, reflection, ritual, keywords, ...daySignData } = signData;
          
          // Insert/update day sign
          const insertedSign = await db
            .insert(daySign)
            .values(daySignData)
            .onConflictDoUpdate({
              target: daySign.index0,
              set: { 
                name: daySignData.name,
                color: daySignData.color,
                glyph: daySignData.glyph,
                updatedAt: new Date()
              }
            })
            .returning();

          // Insert/update mapping
          await db
            .insert(daySignMapping)
            .values({
              daySignId: insertedSign[0].id,
              archetype,
              theme,
              reflection,
              ritual,
              keywords,
            })
            .onConflictDoUpdate({
              target: daySignMapping.daySignId,
              set: {
                archetype,
                theme,
                reflection,
                ritual,
                keywords,
                updatedAt: new Date()
              }
            });

          results.daySigns++;
        }
      } catch (error) {
        results.errors.push(`Day signs import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Import overrides
    if (importData.overrides) {
      try {
        for (const overrideData of importData.overrides) {
          await db
            .insert(dayOverride)
            .values(overrideData)
            .onConflictDoUpdate({
              target: dayOverride.dayOfYear,
              set: {
                title: overrideData.title,
                description: overrideData.description,
                ritual: overrideData.ritual,
                tags: overrideData.tags,
                updatedAt: new Date()
              }
            });
          results.overrides++;
        }
      } catch (error) {
        results.errors.push(`Overrides import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Import completed: ${results.settings} settings, ${results.daySigns} day signs, ${results.overrides} overrides`
    });

  } catch (error) {
    console.error('Import error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}