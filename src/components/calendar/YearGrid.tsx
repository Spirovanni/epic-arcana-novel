'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { HfCalendarResult } from '@/lib/hfCalendar';
import { getBookColorForDay, clearChapterColorCache } from '@/lib/bookColors';

// Cache for year data to prevent duplicate API calls
const yearCache = new Map<number, HfCalendarResult[]>();

// Clear cache in development for hot reload
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__clearYearCache = () => {
    yearCache.clear();
    console.log('Year cache cleared');
  };
}

// Clear cache on load to show new colors
if (typeof window !== 'undefined') {
  yearCache.clear();
  clearChapterColorCache();
}

// Client-safe calendar utility functions
const SEGMENT_BOUNDARIES = {
  Q1: { start: 1, end: 81 },
  Q2: { start: 82, end: 162 },
  MID_A: { start: 163, end: 182 },
  MIDPOINT: { start: 183, end: 183 },
  MID_B: { start: 184, end: 203 },
  Q3: { start: 204, end: 284 },
  Q4: { start: 285, end: 365 }
} as const;

function resolveSegmentClient(dayOfYear365: number) {
  for (const [segment, bounds] of Object.entries(SEGMENT_BOUNDARIES)) {
    if (dayOfYear365 >= bounds.start && dayOfYear365 <= bounds.end) {
      return {
        segment: segment as any,
        intraSegmentIndex: dayOfYear365 - bounds.start + 1
      };
    }
  }
  return { segment: 'Q1' as any, intraSegmentIndex: 1 };
}

function isRestDayClient(segment: string, intraSegmentIndex: number): boolean {
  return ['Q1', 'Q2', 'Q3', 'Q4'].includes(segment) && intraSegmentIndex === 81;
}

function isMidpointClient(segment: string): boolean {
  return segment === 'MIDPOINT';
}

function isActiveDayClient(segment: string, intraSegmentIndex: number): boolean {
  if (isMidpointClient(segment) || isRestDayClient(segment, intraSegmentIndex)) {
    return false;
  }
  return true;
}

function getTwentyDayWeekIndexClient(dayOfYear365: number): number {
  let activeIndex = 0;
  
  for (let day = 1; day < dayOfYear365; day++) {
    const { segment, intraSegmentIndex } = resolveSegmentClient(day);
    if (isActiveDayClient(segment, intraSegmentIndex)) {
      activeIndex++;
    }
  }
  
  // Add current day if it's active
  const { segment, intraSegmentIndex } = resolveSegmentClient(dayOfYear365);
  if (isActiveDayClient(segment, intraSegmentIndex)) {
    activeIndex++;
  }
  
  return (activeIndex - 1) % 20;
}

function getDetoxPhaseClient(segment: string) {
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

interface YearGridProps {
  year?: number;
  className?: string;
  onDayClick?: (day: HfCalendarResult) => void;
  selectedDay?: string; // ISO date string
}

interface GridCellProps {
  day: HfCalendarResult;
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
}

function GridCell({ day, isSelected, isToday, onClick }: GridCellProps) {
  const getCellStyle = () => {
    let baseClasses = "relative w-6 h-6 border border-border/20 cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 focus:scale-110 focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary";
    
    if (day.isMidpoint) {
      return cn(baseClasses, "bg-gradient-to-br from-purple-500 via-gold-500 to-emerald-500 rounded-full shadow-md");
    }
    
    if (day.isRestDay) {
      return cn(baseClasses, "bg-gradient-to-br from-slate-500 to-slate-600 rounded-sm");
    }
    
    if (day.detoxPhase === 'EXILE_1_20') {
      return cn(baseClasses, "bg-gradient-to-br from-red-500 to-orange-500 rounded-sm");
    }
    
    if (day.detoxPhase === 'RENEWAL_1_20') {
      return cn(baseClasses, "bg-gradient-to-br from-green-500 to-emerald-500 rounded-sm");
    }
    
    // Active days - use day sign color if available
    const bgColor = day.color || 'hsl(var(--primary))';
    return cn(
      baseClasses, 
      "rounded-sm",
      isSelected && 'ring-2 ring-primary ring-offset-1',
      isToday && !isSelected && 'ring-2 ring-orange-400 ring-offset-1'
    );
  };

  return (
    <button
      className={getCellStyle()}
      style={{
        backgroundColor: day.isActiveDay && day.color ? day.color : undefined
      }}
      onClick={onClick}
      title={`Day ${day.dayOfYear365}: ${day.segment}${day.daySignName ? ` - ${day.daySignName}` : ''}${day.isRestDay ? ' (Rest)' : ''}${day.isMidpoint ? ' (Midpoint)' : ''}`}
      aria-label={`Day ${day.dayOfYear365}, ${day.segment}${day.daySignName ? `, ${day.daySignName}` : ''}${day.isRestDay ? ', Rest Day' : ''}${day.isMidpoint ? ', Midpoint Day' : ''}`}
    >
      {/* Subtle day number for accessibility */}
      <span className="sr-only">
        {day.dayOfYear365}
      </span>
      
      {/* Visual indicators */}
      {isToday && (
        <div className="absolute inset-0 border-2 border-orange-400 rounded-sm pointer-events-none" />
      )}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-primary rounded-sm pointer-events-none" />
      )}
    </button>
  );
}

function QuarterGrid({ days, title, onDayClick, selectedDay, todayISO }: {
  days: HfCalendarResult[];
  title: string;
  onDayClick: (day: HfCalendarResult) => void;
  selectedDay?: string;
  todayISO: string;
}) {
  // Quarter has 81 days: indices 0-80
  // Display as 9x9 grid (9 rows × 9 columns = 81 cells)
  // Last cell (row 8, col 8) is the rest day
  const allDays = days.slice(0, 81);

  // Build 9x9 grid = 81 cells
  const grid: (HfCalendarResult | null)[][] = [];

  for (let row = 0; row < 9; row++) {
    const rowDays: (HfCalendarResult | null)[] = [];

    for (let col = 0; col < 9; col++) {
      const index = row * 9 + col;
      rowDays.push(allDays[index] || null);
    }

    grid.push(rowDays);
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-center text-muted-foreground">
        {title}
      </h3>
      <div className="grid grid-cols-9 gap-1">
        {grid.map((row, rowIndex) =>
          row.map((day, colIndex) => {
            return day ? (
              <GridCell
                key={day.dateISO}
                day={day}
                isSelected={selectedDay === day.dateISO}
                isToday={todayISO === day.dateISO}
                onClick={() => onDayClick(day)}
              />
            ) : (
              <div key={`empty-${rowIndex}-${colIndex}`} className="w-6 h-6" />
            );
          })
        )}
      </div>
    </div>
  );
}

function MidBandGrid({ days, onDayClick, selectedDay, todayISO }: {
  days: HfCalendarResult[];
  onDayClick: (day: HfCalendarResult) => void;
  selectedDay?: string;
  todayISO: string;
}) {
  const exileDays = days.slice(0, 20);
  const midpointDay = days.slice(20, 21);
  const renewalDays = days.slice(21, 41);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-center text-muted-foreground">
        40-Day Detox + Midpoint
      </h3>
      
      {/* Exile (20 days) */}
      <div className="space-y-2">
        <h4 className="text-xs text-center text-red-600 dark:text-red-400">
          Exile/Emptying
        </h4>
        <div className="flex gap-1 justify-center flex-wrap">
          {exileDays.map((day) => (
            <GridCell
              key={day.dateISO}
              day={day}
              isSelected={selectedDay === day.dateISO}
              isToday={todayISO === day.dateISO}
              onClick={() => onDayClick(day)}
            />
          ))}
        </div>
      </div>

      {/* Midpoint (1 day) */}
      <div className="flex justify-center">
        {midpointDay.map((day) => (
          <GridCell
            key={day.dateISO}
            day={day}
            isSelected={selectedDay === day.dateISO}
            isToday={todayISO === day.dateISO}
            onClick={() => onDayClick(day)}
          />
        ))}
      </div>

      {/* Renewal (20 days) */}
      <div className="space-y-2">
        <h4 className="text-xs text-center text-green-600 dark:text-green-400">
          Renewal/Return
        </h4>
        <div className="flex gap-1 justify-center flex-wrap">
          {renewalDays.map((day) => (
            <GridCell
              key={day.dateISO}
              day={day}
              isSelected={selectedDay === day.dateISO}
              isToday={todayISO === day.dateISO}
              onClick={() => onDayClick(day)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function YearGrid({ year, className, onDayClick, selectedDay }: YearGridProps) {
  const [calendarData, setCalendarData] = useState<HfCalendarResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetYear = year || new Date().getFullYear();
  const todayISO = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const generateFallbackYearData = (year: number): HfCalendarResult[] => {
      const fallbackData: HfCalendarResult[] = [];
      for (let dayOfYear = 1; dayOfYear <= 365; dayOfYear++) {
        const date = new Date(year, 0, dayOfYear - 1);
        const { segment, intraSegmentIndex } = resolveSegmentClient(dayOfYear);
        
        const isRest = isRestDayClient(segment, intraSegmentIndex);
        const isMid = isMidpointClient(segment);
        const isActive = isActiveDayClient(segment, intraSegmentIndex);
        
        fallbackData.push({
          dateISO: date.toISOString().split('T')[0],
          dayOfYear365: dayOfYear,
          segment: segment as any,
          intraSegmentIndex,
          isRestDay: isRest,
          isMidpoint: isMid,
          isActiveDay: isActive,
          twentyDayWeekIndex: getTwentyDayWeekIndexClient(dayOfYear),
          detoxPhase: getDetoxPhaseClient(segment) as any,
          daySignName: isActive ? `Day ${getTwentyDayWeekIndexClient(dayOfYear) + 1}` : undefined,
          color: isActive ? getBookColorForDay(dayOfYear) : undefined,
          theme: isActive ? 'Sacred Calendar Day' : isMid ? 'Sacred Center' : 'Rest Day'
        });
      }
      return fallbackData;
    };

    const fetchYearData = async () => {
      // Check cache first
      const cached = yearCache.get(targetYear);
      if (cached) {
        setCalendarData(cached);
        setLoading(false);
        return;
      }

      // Load fallback data immediately for fast UI
      const fallbackData = generateFallbackYearData(targetYear);
      setCalendarData(fallbackData);
      setLoading(false);

      // Try to enhance with API data in background
      try {
        const response = await fetch(`/api/hf-calendar?year=${targetYear}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && Array.isArray(result.data)) {
            // Cache and use the enhanced API data
            yearCache.set(targetYear, result.data);
            setCalendarData(result.data);
          } else {
            // Cache the fallback data since API didn't provide better data
            yearCache.set(targetYear, fallbackData);
          }
        } else {
          // Cache fallback data on API error
          yearCache.set(targetYear, fallbackData);
          console.warn(`Calendar API returned ${response.status} for year ${targetYear}, using fallback data`);
        }
      } catch (err) {
        // Cache fallback data on network error
        yearCache.set(targetYear, fallbackData);
        console.warn(`Calendar API failed for year ${targetYear}, using fallback data:`, err);
      }
    };

    fetchYearData();
  }, [targetYear]);

  if (loading) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-96 space-y-2", className)}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading {targetYear} calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center text-destructive p-8", className)}>
        Error loading calendar: {error}
      </div>
    );
  }

  if (calendarData.length === 0) {
    return (
      <div className={cn("text-center text-muted-foreground p-8", className)}>
        No calendar data available
      </div>
    );
  }

  // Split data into segments
  const q1Days = calendarData.slice(0, 81);
  const q2Days = calendarData.slice(81, 162);
  const midBandDays = calendarData.slice(162, 203);
  const q3Days = calendarData.slice(203, 284);
  const q4Days = calendarData.slice(284, 365);

  const handleDayClick = (day: HfCalendarResult) => {
    onDayClick?.(day);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // TODO: Implement arrow key navigation
    // This would require tracking focus state and moving between cells
  };

  return (
    <div className={cn("space-y-8 select-none", className)} onKeyDown={handleKeyDown}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          Human Framework Calendar {targetYear}
        </h2>
        <p className="text-muted-foreground text-sm">
          365 days • 4 quarters + 40-day detox/midpoint • 20-day sacred cycles
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-sm"></div>
          <span>Active Days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-slate-500 to-slate-600 rounded-sm"></div>
          <span>Rest Days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-sm"></div>
          <span>Exile/Emptying</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-gold-500 rounded-full"></div>
          <span>Midpoint</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-sm"></div>
          <span>Renewal/Return</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-12">
        {/* Q1 and Q2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuarterGrid
            days={q1Days}
            title="Q1 • Genesis (81 days)"
            onDayClick={handleDayClick}
            selectedDay={selectedDay}
            todayISO={todayISO}
          />
          <QuarterGrid
            days={q2Days}
            title="Q2 • Growth (81 days)"
            onDayClick={handleDayClick}
            selectedDay={selectedDay}
            todayISO={todayISO}
          />
        </div>

        {/* Half-Year Midpoint Circle */}
        <div className="flex justify-center py-4">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-gold-500 to-emerald-500 shadow-lg flex items-center justify-center">
            <div className="absolute inset-1 rounded-full bg-background/20" />
          </div>
        </div>

        {/* Mid-Band */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <MidBandGrid
              days={midBandDays}
              onDayClick={handleDayClick}
              selectedDay={selectedDay}
              todayISO={todayISO}
            />
          </div>
        </div>

        {/* Q3 and Q4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuarterGrid
            days={q3Days}
            title="Q3 • Harvest (81 days)"
            onDayClick={handleDayClick}
            selectedDay={selectedDay}
            todayISO={todayISO}
          />
          <QuarterGrid
            days={q4Days}
            title="Q4 • Integration (81 days)"
            onDayClick={handleDayClick}
            selectedDay={selectedDay}
            todayISO={todayISO}
          />
        </div>
      </div>
    </div>
  );
}