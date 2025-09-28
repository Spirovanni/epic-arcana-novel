/**
 * Human Framework Calendar - 365-day Mayan-inspired calendar system
 * 
 * Structure:
 * Q1: 81 days (80 active + 1 rest day)
 * Q2: 81 days (80 active + 1 rest day) 
 * Mid-Band: 41 days (20 Exile + 1 Midpoint + 20 Renewal)
 * Q3: 81 days (80 active + 1 rest day)
 * Q4: 81 days (80 active + 1 rest day)
 * Total: 365 days
 * 
 * 20-day cadence runs across active days only
 */

import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, sql } from 'drizzle-orm';
import { calendarSettings, daySign, daySignMapping, dayOverride } from './schema';
import postgres from 'postgres';
import { getBookColorForDay } from './bookColors';

// Types
export type HfSegment = 'Q1' | 'Q2' | 'MID_A' | 'MIDPOINT' | 'MID_B' | 'Q3' | 'Q4';
export type DetoxPhase = 'NONE' | 'EXILE_1_20' | 'MIDPOINT' | 'RENEWAL_1_20';
export type LeapPolicy = 'duplicate' | 'skip' | 'insert_after_Q4';

export interface HfCalendarResult {
  dateISO: string;
  dayOfYear365: number;
  segment: HfSegment;
  intraSegmentIndex: number;
  isRestDay: boolean;
  isMidpoint: boolean;
  isActiveDay: boolean;
  twentyDayWeekIndex: number; // 0-19 only for active days
  detoxPhase: DetoxPhase;
  daySignIndex?: number; // Only for active days
  daySignName?: string;
  archetype?: string;
  theme?: string;
  reflection?: string;
  ritual?: string;
  keywords?: string;
  color?: string;
  glyph?: string;
  overrideTitle?: string;
  overrideDescription?: string;
  overrideRitual?: string;
  overrideTags?: string;
}

export interface CalendarConfig {
  anchor: Date;
  leapPolicy: LeapPolicy;
}

// Default 20 Mayan day-signs
export const DEFAULT_DAY_SIGNS = [
  'Imix', 'Ik\'', 'Ak\'bal', 'K\'an', 'Chikchan', 'Kimi', 
  'Manik\'', 'Lamat', 'Muluk', 'Ok', 'Chuwen', 'Eb\'',
  'B\'en', 'Ix', 'Men', 'Kib\'', 'Kab\'an', 'Etz\'nab\'', 
  'Kawak', 'Ajaw'
];

// Segment boundaries (1-based day indices)
const SEGMENT_BOUNDARIES = {
  Q1: { start: 1, end: 81 },
  Q2: { start: 82, end: 162 },
  MID_A: { start: 163, end: 182 },
  MIDPOINT: { start: 183, end: 183 },
  MID_B: { start: 184, end: 203 },
  Q3: { start: 204, end: 284 },
  Q4: { start: 285, end: 365 }
} as const;

// Database connection (we'll use the existing connection)
const connectionString = process.env.DATABASE_URL!;
const connection = postgres(connectionString);
const db = drizzle(connection);

/**
 * Get calendar configuration from database
 */
export async function getCalendarConfig(): Promise<CalendarConfig> {
  try {
    const settings = await db
      .select()
      .from(calendarSettings)
      .where(eq(calendarSettings.key, 'calendar.anchor'))
      .union(
        db.select()
          .from(calendarSettings)
          .where(eq(calendarSettings.key, 'calendar.leapPolicy'))
      );

    const config: CalendarConfig = {
      anchor: new Date(new Date().getFullYear(), 0, 1), // Default: Jan 1 of current year
      leapPolicy: 'duplicate'
    };

    for (const setting of settings) {
      if (setting.key === 'calendar.anchor') {
        config.anchor = new Date(setting.value);
      } else if (setting.key === 'calendar.leapPolicy') {
        config.leapPolicy = setting.value as LeapPolicy;
      }
    }

    return config;
  } catch (error) {
    // Return defaults if DB is not available
    return {
      anchor: new Date(new Date().getFullYear(), 0, 1),
      leapPolicy: 'duplicate'
    };
  }
}

/**
 * Calculate day of year (1-365) handling leap years according to policy
 */
export function dayOfYear365(date: Date, anchor: Date, leapPolicy: LeapPolicy): number {
  const year = anchor.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const timeDiff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  
  // Handle leap year
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  
  if (isLeapYear && dayOfYear > 59) { // After Feb 28
    switch (leapPolicy) {
      case 'duplicate':
        // Feb 29 gets same sacred day as Feb 28
        return dayOfYear === 60 ? 59 : dayOfYear - 1;
      case 'skip':
        // Skip Feb 29 entirely
        return dayOfYear === 60 ? dayOfYear + 1 : (dayOfYear > 60 ? dayOfYear - 1 : dayOfYear);
      case 'insert_after_Q4':
        // Feb 29 becomes day 366, but we normalize to 365-day cycle
        return dayOfYear > 60 ? dayOfYear - 1 : dayOfYear;
    }
  }
  
  return Math.max(1, Math.min(365, dayOfYear));
}

/**
 * Resolve which segment a day belongs to
 */
export function resolveSegment(dayOfYear365: number): { segment: HfSegment; intraSegmentIndex: number } {
  for (const [segment, bounds] of Object.entries(SEGMENT_BOUNDARIES)) {
    if (dayOfYear365 >= bounds.start && dayOfYear365 <= bounds.end) {
      return {
        segment: segment as HfSegment,
        intraSegmentIndex: dayOfYear365 - bounds.start + 1
      };
    }
  }
  
  // Fallback
  return { segment: 'Q1', intraSegmentIndex: 1 };
}

/**
 * Check if a day is a rest day (81st day of quarters)
 */
export function isRestDay(segment: HfSegment, intraSegmentIndex: number): boolean {
  return ['Q1', 'Q2', 'Q3', 'Q4'].includes(segment) && intraSegmentIndex === 81;
}

/**
 * Check if a day is the midpoint day
 */
export function isMidpoint(segment: HfSegment): boolean {
  return segment === 'MIDPOINT';
}

/**
 * Check if a day is an active day (advances 20-day cadence)
 */
export function isActiveDay(segment: HfSegment, intraSegmentIndex: number): boolean {
  if (isMidpoint(segment) || isRestDay(segment, intraSegmentIndex)) {
    return false;
  }
  return true;
}

/**
 * Calculate active day index (for 20-day cadence)
 */
export function calculateActiveIndex(dayOfYear365: number): number {
  let activeIndex = 0;
  
  for (let day = 1; day < dayOfYear365; day++) {
    const { segment, intraSegmentIndex } = resolveSegment(day);
    if (isActiveDay(segment, intraSegmentIndex)) {
      activeIndex++;
    }
  }
  
  // Add current day if it's active
  const { segment, intraSegmentIndex } = resolveSegment(dayOfYear365);
  if (isActiveDay(segment, intraSegmentIndex)) {
    activeIndex++;
  }
  
  return activeIndex;
}

/**
 * Get 20-day week index (0-19)
 */
export function getTwentyDayWeekIndex(dayOfYear365: number): number {
  const activeIndex = calculateActiveIndex(dayOfYear365);
  return (activeIndex - 1) % 20;
}

/**
 * Determine detox phase
 */
export function getDetoxPhase(segment: HfSegment): DetoxPhase {
  switch (segment) {
    case 'MID_A':
      return 'EXILE_1_20';
    case 'MIDPOINT':
      return 'MIDPOINT';
    case 'MID_B':
      return 'RENEWAL_1_20';
    default:
      return 'NONE';
  }
}

/**
 * Main calendar resolver function
 */
export async function resolveHfCalendar(date: Date): Promise<HfCalendarResult> {
  const config = await getCalendarConfig();
  const dayOfYear = dayOfYear365(date, config.anchor, config.leapPolicy);
  const { segment, intraSegmentIndex } = resolveSegment(dayOfYear);
  
  const result: HfCalendarResult = {
    dateISO: date.toISOString().split('T')[0],
    dayOfYear365: dayOfYear,
    segment,
    intraSegmentIndex,
    isRestDay: isRestDay(segment, intraSegmentIndex),
    isMidpoint: isMidpoint(segment),
    isActiveDay: isActiveDay(segment, intraSegmentIndex),
    twentyDayWeekIndex: getTwentyDayWeekIndex(dayOfYear),
    detoxPhase: getDetoxPhase(segment)
  };

  // Add day sign info for active days
  if (result.isActiveDay) {
    try {
      const daySignData = await db
        .select({
          id: daySign.id,
          name: daySign.name,
          color: daySign.color,
          glyph: daySign.glyph,
          archetype: daySignMapping.archetype,
          theme: daySignMapping.theme,
          reflection: daySignMapping.reflection,
          ritual: daySignMapping.ritual,
          keywords: daySignMapping.keywords
        })
        .from(daySign)
        .leftJoin(daySignMapping, eq(daySign.id, daySignMapping.daySignId))
        .where(eq(daySign.index0, result.twentyDayWeekIndex));

      if (daySignData.length > 0) {
        const sign = daySignData[0];
        result.daySignIndex = result.twentyDayWeekIndex;
        result.daySignName = sign.name;
        result.color = sign.color || getBookColorForDay(dayOfYear);
        result.glyph = sign.glyph || undefined;
        result.archetype = sign.archetype || undefined;
        result.theme = sign.theme || undefined;
        result.reflection = sign.reflection || undefined;
        result.ritual = sign.ritual || undefined;
        result.keywords = sign.keywords || undefined;
      } else {
        // If no day sign data, provide fallback info
        result.daySignIndex = result.twentyDayWeekIndex;
        result.daySignName = `Day ${result.twentyDayWeekIndex + 1}`;
        result.color = getBookColorForDay(dayOfYear);
        result.theme = 'Sacred Calendar Day';
        result.reflection = 'Reflect on the energy of this day';
      }
    } catch (error) {
      console.warn('Failed to fetch day sign data:', error);
    }
  }

  // Add override data for rest days and midpoint
  if (result.isRestDay || result.isMidpoint) {
    try {
      const override = await db
        .select()
        .from(dayOverride)
        .where(eq(dayOverride.dayOfYear, dayOfYear));

      if (override.length > 0) {
        const data = override[0];
        result.overrideTitle = data.title || undefined;
        result.overrideDescription = data.description || undefined;
        result.overrideRitual = data.ritual || undefined;
        result.overrideTags = data.tags || undefined;
      }
    } catch (error) {
      console.warn('Failed to fetch override data:', error);
    }
  }

  return result;
}

/**
 * Get multiple days at once (for calendar views)
 */
export async function resolveHfCalendarRange(
  startDate: Date, 
  endDate: Date
): Promise<HfCalendarResult[]> {
  const results: HfCalendarResult[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    results.push(await resolveHfCalendar(new Date(currentDate)));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return results;
}

/**
 * Get full year calendar - optimized bulk version
 */
export async function getFullYearCalendar(year?: number): Promise<HfCalendarResult[]> {
  const targetYear = year || new Date().getFullYear();
  const results: HfCalendarResult[] = [];
  
  try {
    const config = await getCalendarConfig();
    
    // Bulk load all day signs and mappings once
    const daySignsData = await db
      .select({
        index0: daySign.index0,
        name: daySign.name,
        color: daySign.color,
        glyph: daySign.glyph,
        archetype: daySignMapping.archetype,
        theme: daySignMapping.theme,
        reflection: daySignMapping.reflection,
        ritual: daySignMapping.ritual,
        keywords: daySignMapping.keywords
      })
      .from(daySign)
      .leftJoin(daySignMapping, eq(daySign.id, daySignMapping.daySignId));
    
    // Create a map for quick lookups
    const daySignMap = new Map();
    daySignsData.forEach(sign => {
      daySignMap.set(sign.index0, sign);
    });
    
    // Bulk load all overrides for the year
    const overridesData = await db
      .select()
      .from(dayOverride);
    
    const overrideMap = new Map();
    overridesData.forEach(override => {
      overrideMap.set(override.dayOfYear, override);
    });
    
    // Generate all days for the year
    for (let dayOfYear = 1; dayOfYear <= 365; dayOfYear++) {
      const date = new Date(targetYear, 0, dayOfYear - 1);
      // Use the loop dayOfYear directly instead of recalculating to avoid duplicates
      const { segment, intraSegmentIndex } = resolveSegment(dayOfYear);
      
      const result: HfCalendarResult = {
        dateISO: date.toISOString().split('T')[0],
        dayOfYear365: dayOfYear,
        segment,
        intraSegmentIndex,
        isRestDay: isRestDay(segment, intraSegmentIndex),
        isMidpoint: isMidpoint(segment),
        isActiveDay: isActiveDay(segment, intraSegmentIndex),
        twentyDayWeekIndex: getTwentyDayWeekIndex(dayOfYear),
        detoxPhase: getDetoxPhase(segment)
      };
      
      // Add day sign info for active days
      if (result.isActiveDay) {
        const daySignData = daySignMap.get(result.twentyDayWeekIndex);
        if (daySignData) {
          result.daySignIndex = result.twentyDayWeekIndex;
          result.daySignName = daySignData.name;
          result.color = daySignData.color || getBookColorForDay(dayOfYear);
          result.glyph = daySignData.glyph || undefined;
          result.archetype = daySignData.archetype || undefined;
          result.theme = daySignData.theme || undefined;
          result.reflection = daySignData.reflection || undefined;
          result.ritual = daySignData.ritual || undefined;
          result.keywords = daySignData.keywords || undefined;
        } else {
          // If no day sign data, provide fallback info
          result.daySignIndex = result.twentyDayWeekIndex;
          result.daySignName = `Day ${result.twentyDayWeekIndex + 1}`;
          result.color = getBookColorForDay(dayOfYear);
          result.theme = 'Sacred Calendar Day';
          result.reflection = 'Reflect on the energy of this day';
        }
      }
      
      // Add override data for rest days and midpoint
      if (result.isRestDay || result.isMidpoint) {
        const override = overrideMap.get(dayOfYear);
        if (override) {
          result.overrideTitle = override.title || undefined;
          result.overrideDescription = override.description || undefined;
          result.overrideRitual = override.ritual || undefined;
          result.overrideTags = override.tags || undefined;
        }
      }
      
      results.push(result);
    }
    
    return results;
  } catch (error) {
    console.error('Error generating full year calendar:', error);
    throw error;
  }
}

/**
 * Seed default calendar settings
 */
export async function seedCalendarDefaults(): Promise<void> {
  const currentYear = new Date().getFullYear();
  const defaultAnchor = new Date(currentYear, 0, 1).toISOString();
  
  // Upsert default settings
  await db
    .insert(calendarSettings)
    .values([
      { key: 'calendar.anchor', value: defaultAnchor },
      { key: 'calendar.leapPolicy', value: 'duplicate' }
    ])
    .onConflictDoUpdate({
      target: calendarSettings.key,
      set: { 
        value: sql`excluded.value`, 
        updatedAt: sql`now()` 
      }
    });

  // Seed default day signs if they don't exist
  const existingSigns = await db.select().from(daySign);
  
  if (existingSigns.length === 0) {
    const signData = DEFAULT_DAY_SIGNS.map((name, index) => ({
      index0: index,
      name,
      color: `hsl(${(index * 18) % 360}, 70%, 50%)`, // Generate colors
      glyph: null
    }));

    const insertedSigns = await db.insert(daySign).values(signData).returning();
    
    // Create default mappings
    const mappingData = insertedSigns.map((sign, index) => ({
      daySignId: sign.id,
      archetype: `Archetype ${index + 1}`,
      theme: `Theme for ${sign.name}`,
      reflection: `Reflect on the energy of ${sign.name}`,
      ritual: `Ritual for ${sign.name} day`,
      keywords: `energy, ${sign.name.toLowerCase()}, transformation`
    }));

    await db.insert(daySignMapping).values(mappingData);
  }
}