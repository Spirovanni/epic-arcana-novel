import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import { daySign, daySignMapping, calendarSettings } from '../lib/schema';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const connection = postgres(connectionString);
const db = drizzle(connection);

// Default 20 Mayan day-signs
const DEFAULT_DAY_SIGNS = [
  'Imix', 'Ik\'', 'Ak\'bal', 'K\'an', 'Chikchan', 'Kimi', 
  'Manik\'', 'Lamat', 'Muluk', 'Ok', 'Chuwen', 'Eb\'',
  'B\'en', 'Ix', 'Men', 'Kib\'', 'Kab\'an', 'Etz\'nab\'', 
  'Kawak', 'Ajaw'
];

async function seedCalendarData() {
  try {
    console.log('🌱 Starting calendar data seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(daySignMapping);
    await db.delete(daySign);
    await db.execute(sql`DELETE FROM calendar_settings WHERE key LIKE 'calendar.%'`);

    // Seed calendar settings
    console.log('⚙️ Setting up calendar configuration...');
    await db.insert(calendarSettings).values([
      {
        key: 'calendar.anchor',
        value: new Date().getFullYear() + '-01-01'
      },
      {
        key: 'calendar.leapPolicy', 
        value: 'duplicate'
      }
    ]);

    // Seed day signs
    console.log('🎨 Creating day signs...');
    const daySignData = DEFAULT_DAY_SIGNS.map((name, index) => ({
      index0: index,
      name,
      glyph: null,
      color: `hsl(${index * 18}, 70%, 50%)` // Evenly spaced colors around the color wheel
    }));

    const insertedSigns = await db.insert(daySign).values(daySignData).returning();
    console.log(`✅ Created ${insertedSigns.length} day signs`);

    // Seed day sign mappings with basic data
    console.log('🗺️ Creating day sign mappings...');
    const mappingData = insertedSigns.map((sign, index) => ({
      daySignId: sign.id,
      archetype: `Archetype ${index + 1}`,
      theme: `Day ${index + 1} theme - ${sign.name}`,
      reflection: `Reflect on the qualities of ${sign.name}`,
      ritual: `Ritual for ${sign.name}`,
      keywords: `${sign.name}, energy, transformation`
    }));

    await db.insert(daySignMapping).values(mappingData);
    console.log(`✅ Created ${mappingData.length} day sign mappings`);

    console.log('🎉 Calendar seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding calendar data:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the seeding
seedCalendarData().catch(console.error);