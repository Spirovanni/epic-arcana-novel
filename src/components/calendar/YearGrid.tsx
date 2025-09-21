'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { HfCalendarResult } from '@/lib/hfCalendar';

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
      return cn(baseClasses, "bg-gradient-to-br from-purple-500 to-gold-500 rounded-full shadow-md");
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
  // Arrange 81 days in 9x9 grid
  const grid = Array.from({ length: 9 }, (_, row) =>
    days.slice(row * 9, (row + 1) * 9)
  );

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-center text-muted-foreground">
        {title}
      </h3>
      <div className="grid grid-cols-9 gap-1">
        {grid.map((row, rowIndex) =>
          row.map((day) => (
            <GridCell
              key={day.dateISO}
              day={day}
              isSelected={selectedDay === day.dateISO}
              isToday={todayISO === day.dateISO}
              onClick={() => onDayClick(day)}
            />
          ))
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
    const fetchYearData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/hf-calendar?year=${targetYear}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch calendar data');
        }
        
        setCalendarData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchYearData();
  }, [targetYear]);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-96", className)}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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