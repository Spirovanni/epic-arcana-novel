'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { HfCalendarResult } from '@/lib/hfCalendar';

interface TodayCardProps {
  className?: string;
  date?: Date;
}

export function TodayCard({ className, date = new Date() }: TodayCardProps) {
  const [calendarData, setCalendarData] = useState<HfCalendarResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dateParam = date.toISOString().split('T')[0];
        const response = await fetch(`/api/hf-calendar?date=${dateParam}`);
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

    fetchCalendarData();
  }, [date]);

  if (loading) {
    return (
      <Card className={cn("w-full max-w-md", className)}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full max-w-md border-destructive", className)}>
        <CardContent className="p-6">
          <p className="text-destructive text-sm">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!calendarData) {
    return null;
  }

  const getSegmentDisplay = () => {
    switch (calendarData.segment) {
      case 'Q1': return 'Q1 • Genesis';
      case 'Q2': return 'Q2 • Growth';
      case 'MID_A': return 'Exile • Emptying';
      case 'MIDPOINT': return 'Axis Mundi';
      case 'MID_B': return 'Renewal • Return';
      case 'Q3': return 'Q3 • Harvest';
      case 'Q4': return 'Q4 • Integration';
      default: return calendarData.segment;
    }
  };

  const getDetoxDisplay = () => {
    switch (calendarData.detoxPhase) {
      case 'EXILE_1_20': return `Exile Day ${calendarData.intraSegmentIndex}/20`;
      case 'MIDPOINT': return 'Sacred Pause';
      case 'RENEWAL_1_20': return `Renewal Day ${calendarData.intraSegmentIndex}/20`;
      default: return null;
    }
  };

  const getDayTypeInfo = () => {
    if (calendarData.isMidpoint) {
      return {
        type: 'Axis Mundi',
        description: 'Sacred center point • Deep reflection',
        bgColor: 'bg-gradient-to-br from-purple-500/10 to-gold-500/10',
        borderColor: 'border-purple-500/30'
      };
    }
    
    if (calendarData.isRestDay) {
      return {
        type: 'Rest Day',
        description: 'Threshold ritual • Integration',
        bgColor: 'bg-gradient-to-br from-slate-500/10 to-slate-600/10',
        borderColor: 'border-slate-500/30'
      };
    }
    
    if (calendarData.detoxPhase === 'EXILE_1_20') {
      return {
        type: 'Exile',
        description: 'Deconstruction • Emptying',
        bgColor: 'bg-gradient-to-br from-red-500/10 to-orange-500/10',
        borderColor: 'border-red-500/30'
      };
    }
    
    if (calendarData.detoxPhase === 'RENEWAL_1_20') {
      return {
        type: 'Renewal',
        description: 'Reconstruction • Return',
        bgColor: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
        borderColor: 'border-green-500/30'
      };
    }
    
    return {
      type: 'Active Day',
      description: `${calendarData.daySignName || 'Sacred Day'} • Day sign ${calendarData.twentyDayWeekIndex + 1}/20`,
      bgColor: calendarData.color ? `bg-gradient-to-br from-[${calendarData.color}]/10 to-[${calendarData.color}]/20` : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10',
      borderColor: calendarData.color ? `border-[${calendarData.color}]/30` : 'border-blue-500/30'
    };
  };

  const dayInfo = getDayTypeInfo();
  const detoxDisplay = getDetoxDisplay();

  return (
    <Card className={cn(
      "w-full max-w-md transition-all duration-300",
      dayInfo.bgColor,
      dayInfo.borderColor,
      className
    )}>
      <CardHeader className="text-center">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {new Date(calendarData.dateISO).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <CardTitle className="text-xl">
            {getSegmentDisplay()}
          </CardTitle>
          <CardDescription className="font-medium">
            Day {calendarData.dayOfYear365}/365 • {dayInfo.type}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Day Sign or Special Day Info */}
        {calendarData.isActiveDay && calendarData.daySignName && (
          <div className="text-center space-y-2">
            <div className="text-lg font-semibold flex items-center justify-center gap-2">
              {calendarData.glyph && (
                <span className="text-2xl">{calendarData.glyph}</span>
              )}
              <span>{calendarData.daySignName}</span>
            </div>
            {calendarData.archetype && (
              <p className="text-sm text-muted-foreground">
                {calendarData.archetype}
              </p>
            )}
          </div>
        )}

        {/* Detox Phase Display */}
        {detoxDisplay && (
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {detoxDisplay}
            </div>
          </div>
        )}

        {/* Theme */}
        {calendarData.theme && (
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Today's Theme</h4>
            <p className="text-sm text-muted-foreground">
              {calendarData.theme}
            </p>
          </div>
        )}

        {/* Reflection */}
        {calendarData.reflection && (
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Reflection</h4>
            <p className="text-sm text-muted-foreground">
              {calendarData.reflection}
            </p>
          </div>
        )}

        {/* Override content for rest/midpoint days */}
        {(calendarData.isRestDay || calendarData.isMidpoint) && (
          <>
            {calendarData.overrideTitle && (
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Special Focus</h4>
                <p className="text-sm text-muted-foreground">
                  {calendarData.overrideTitle}
                </p>
              </div>
            )}
            {calendarData.overrideDescription && (
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {calendarData.overrideDescription}
                </p>
              </div>
            )}
          </>
        )}

        {/* Ritual */}
        {(calendarData.ritual || calendarData.overrideRitual) && (
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Today's Ritual</h4>
            <p className="text-sm text-muted-foreground">
              {calendarData.overrideRitual || calendarData.ritual}
            </p>
          </div>
        )}

        {/* Keywords */}
        {calendarData.keywords && (
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Keywords</h4>
            <div className="flex flex-wrap gap-1">
              {calendarData.keywords.split(',').map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-muted rounded-md text-xs"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}