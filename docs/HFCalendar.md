# Human Framework Calendar

A production-ready, accessible 365-day Mayan-inspired calendar system for the Epic Arcana web application.

## Overview

The Human Framework Calendar is a sacred timing system based on Mayan calendar principles, structured around a 365-day year with specific segments designed for spiritual and personal development.

## Calendar Structure

### Segment Layout

```
Q1: 81 days (80 active + 1 rest day)
Q2: 81 days (80 active + 1 rest day)
Mid-Band: 41 days total
  ├─ Exile/Emptying: 20 days
  ├─ Midpoint Day: 1 day (Axis Mundi)
  └─ Renewal/Return: 20 days
Q3: 81 days (80 active + 1 rest day)
Q4: 81 days (80 active + 1 rest day)
Total: 365 days
```

### Day Types

1. **Active Days** (360 total)
   - Follow the 20-day Mayan sign cadence
   - Used for engagement, learning, and growth
   - Each corresponds to one of 20 day signs

2. **Rest Days** (4 total)
   - The 81st day of each quarter (Q1, Q2, Q3, Q4)
   - Threshold moments for integration and ritual
   - Do not advance the 20-day cadence

3. **Midpoint Day** (1 total)
   - The sacred center point (day 183)
   - "Axis Mundi" - deep reflection and connection
   - Does not advance the 20-day cadence

4. **Detox Phase Days** (40 total)
   - **Exile/Emptying** (days 163-182): Deconstructive phase
   - **Renewal/Return** (days 184-203): Reconstructive phase
   - Both phases advance the 20-day cadence

## 20-Day Sacred Cycles

The calendar uses a continuous 20-day cycle based on Mayan day signs:

```
1. Imix      11. Chuwen
2. Ik'       12. Eb'
3. Ak'bal    13. B'en
4. K'an      14. Ix
5. Chikchan  15. Men
6. Kimi      16. Kib'
7. Manik'    17. Kab'an
8. Lamat     18. Etz'nab'
9. Muluk     19. Kawak
10. Ok       20. Ajaw
```

### Cadence Rules

- Only **active days** advance the 20-day cycle
- Rest days and the Midpoint day are "threshold" days that do not advance the cycle
- The cycle resumes on the next active day
- This creates exactly 18 complete 20-day cycles per year (360 ÷ 20 = 18)

## Leap Year Handling

The system provides three policies for handling leap years:

1. **Duplicate** (default): Feb 29 uses the same sacred day as Feb 28
2. **Skip**: Feb 29 advances the calendar but not the sacred cycle
3. **Insert after Q4**: Feb 29 becomes an extra day after the year ends

## Technical Implementation

### Core Files

- `src/lib/hfCalendar.ts` - Calendar math engine and API functions
- `src/lib/schema.ts` - Database schema definitions
- `test/hfCalendar.test.ts` - Comprehensive unit tests

### Database Schema

```sql
-- Calendar settings (anchor date, leap policy)
calendar_settings (id, key, value, updated_at)

-- 20 day signs (0-19 index, name, color, glyph)
day_sign (id, index0, name, glyph, color, created_at, updated_at)

-- Day sign meanings and guidance
day_sign_mapping (id, day_sign_id, archetype, theme, reflection, ritual, keywords)

-- Custom overrides for specific days (rest days, midpoint, special occasions)
day_override (id, day_of_year, title, description, ritual, tags)
```

### API Endpoints

- `GET /api/hf-calendar?date=YYYY-MM-DD` - Get single day data
- `GET /api/hf-calendar?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get date range
- `GET /api/hf-calendar?year=YYYY` - Get full year calendar
- `GET /api/day-signs` - Get all day signs with mappings
- `POST /api/day-signs/:id/mapping` - Update day sign mapping
- `GET /api/overrides` - Get all day overrides
- `POST /api/overrides` - Create/update day override
- `GET /api/settings` - Get calendar settings
- `POST /api/settings` - Update calendar settings
- `POST /api/hf-calendar/seed` - Initialize default data
- `GET/POST /api/import-export` - Data import/export

### React Components

- `TodayCard` - Displays current day information
- `YearGrid` - 365-day calendar visualization
- `DayDrawer` - Detailed day information modal

### Data Types

```typescript
interface HfCalendarResult {
  dateISO: string;
  dayOfYear365: number;
  segment: 'Q1' | 'Q2' | 'MID_A' | 'MIDPOINT' | 'MID_B' | 'Q3' | 'Q4';
  intraSegmentIndex: number;
  isRestDay: boolean;
  isMidpoint: boolean;
  isActiveDay: boolean;
  twentyDayWeekIndex: number; // 0-19
  detoxPhase: 'NONE' | 'EXILE_1_20' | 'MIDPOINT' | 'RENEWAL_1_20';
  // Optional fields populated from database
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
```

## Usage Examples

### Basic Calendar Resolution

```typescript
import { resolveHfCalendar } from '@/lib/hfCalendar';

// Get today's calendar data
const today = await resolveHfCalendar(new Date());
console.log(today.segment); // e.g., 'Q1'
console.log(today.daySignName); // e.g., 'Imix'
console.log(today.isRestDay); // false
```

### Full Year Calendar

```typescript
import { getFullYearCalendar } from '@/lib/hfCalendar';

// Get entire year
const year2024 = await getFullYearCalendar(2024);
console.log(year2024.length); // 365
```

### Date Range

```typescript
import { resolveHfCalendarRange } from '@/lib/hfCalendar';

const startDate = new Date('2024-01-01');
const endDate = new Date('2024-01-31');
const january = await resolveHfCalendarRange(startDate, endDate);
```

## Admin Panel

Access the admin panel at `/admin/calendar` to:

- Configure calendar settings (anchor date, leap year policy)
- Edit day sign mappings (archetype, theme, reflection, ritual, keywords)
- Add custom overrides for specific days
- Import/export calendar data
- Preview the calendar visualization
- Seed default data

## Accessibility Features

- Full keyboard navigation with arrow keys
- ARIA labels for screen readers
- High contrast focus indicators
- Semantic HTML structure
- Responsive design for all screen sizes

## Detox/Wilderness Period

The 40-day mid-band represents a symbolic "wilderness" or "desert" experience:

### Exile/Emptying (Days 163-182)
- **Purpose**: Deconstructive emptying and release
- **Metaphor**: Journey into the wilderness
- **Practice**: Letting go, simplification, reflection on what no longer serves

### Axis Mundi (Day 183)
- **Purpose**: Sacred pause at the center of existence
- **Metaphor**: The world tree, cosmic axis, point of connection between earth and sky
- **Practice**: Deep meditation, divine connection, accessing inner wisdom

### Renewal/Return (Days 184-203)
- **Purpose**: Reconstructive rebuilding with new wisdom
- **Metaphor**: Return from the wilderness, transformed
- **Practice**: Integration, new habits, applying insights gained

## Testing

Run the comprehensive test suite:

```bash
npm test
```

Tests cover:
- All segment boundary conditions
- Leap year handling for all policies
- 20-day cycle advancement rules
- Calendar math edge cases
- Data integrity checks

## Customization

### Adding New Day Signs

Day signs can be customized through the admin panel or API:

```typescript
// Each day sign has:
{
  index0: 0-19,           // Position in 20-day cycle
  name: string,           // Display name
  glyph: string,          // Unicode glyph or emoji
  color: string,          // Hex color code
  archetype: string,      // Personality archetype
  theme: string,          // Daily theme
  reflection: string,     // Reflective guidance
  ritual: string,         // Suggested practice
  keywords: string        // Comma-separated tags
}
```

### Custom Day Overrides

Add special meaning to specific calendar days:

```typescript
{
  dayOfYear: 1-365,       // Which day to override
  title: string,          // Special title
  description: string,    // Extended description
  ritual: string,         // Special ritual
  tags: string           // Comma-separated tags
}
```

## Integration

The calendar integrates seamlessly with the Epic Arcana application:

- **User Journeys**: Map character development to calendar phases
- **Content Delivery**: Serve personalized content based on current day
- **Ritual Guidance**: Provide daily practices and reflections
- **Progress Tracking**: Track user engagement across the 365-day cycle
- **Community Features**: Shared experiences during special phases

## Philosophy

The Human Framework Calendar bridges ancient Mayan time wisdom with modern personal development needs. It recognizes that:

1. **Time is Sacred**: Each day carries unique energy and potential
2. **Cycles Matter**: Natural rhythms support growth and transformation
3. **Rest is Essential**: Threshold moments allow integration
4. **Wilderness Transforms**: Periods of difficulty catalyze growth
5. **Balance Creates Wholeness**: The interplay of active and reflective phases

This system provides a structured yet flexible framework for conscious living, honoring both the practical needs of modern life and the deeper currents of spiritual development.