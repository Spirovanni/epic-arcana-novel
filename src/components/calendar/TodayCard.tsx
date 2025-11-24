'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Circle, User, Calendar } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import type { HfCalendarResult } from '@/lib/hfCalendar';
import { getBookColorForDay, getChapterColorForDay, clearChapterColorCache, debugDayColors } from '@/lib/bookColors';

const isDev = process.env.NODE_ENV === 'development';

interface UserAssignment {
  id: string;
  title: string;
  description: string;
  dailyTheme: string;
  personalityFocus: string;
  reflectionPrompt: string;
  practiceExercise: string;
  journalPrompt: string;
  actionItem: string;
  isCompleted: boolean;
  bookChapter?: string;
  chapterFocus?: string;
}

interface TodayCardProps {
  className?: string;
  date?: Date;
}

// Simple cache to prevent duplicate API calls
const calendarCache = new Map<string, HfCalendarResult>();
const assignmentCache = new Map<string, UserAssignment | null>();

// Clear cache in development for hot reload
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__clearCalendarCache = () => {
    calendarCache.clear();
    assignmentCache.clear();
    console.log('Calendar cache cleared');
  };
}

// Clear caches on load to show new colors
if (typeof window !== 'undefined') {
  calendarCache.clear();
  assignmentCache.clear();
  clearChapterColorCache();
  
  if (isDev) {
    // Debug the first 20 days to verify colors
    debugDayColors(1, 20);
    
    // Make debug function available globally
    (window as any).__debugDayColors = debugDayColors;
  }
}

export function TodayCard({ className, date }: TodayCardProps) {
  // Memoize the date to prevent infinite re-renders
  const stableDate = useMemo(() => {
    return date || new Date();
  }, [date]);
  
  // Memoize the date string to use as a stable dependency
  const dateString = useMemo(() => {
    return stableDate.toISOString().split('T')[0];
  }, [stableDate]);

  const [calendarData, setCalendarData] = useState<HfCalendarResult | null>(null);
  const [userAssignment, setUserAssignment] = useState<UserAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enhancing, setEnhancing] = useState(false);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('assignment');
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const generateFallbackData = (date: Date, dateStr: string): HfCalendarResult => {
      const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return {
        dateISO: dateStr,
        dayOfYear365: dayOfYear,
        segment: dayOfYear <= 81 ? 'Q1' : dayOfYear <= 162 ? 'Q2' : dayOfYear <= 203 ? 'MID_A' : dayOfYear <= 284 ? 'Q3' : 'Q4',
        intraSegmentIndex: dayOfYear <= 81 ? dayOfYear : dayOfYear <= 162 ? dayOfYear - 81 : dayOfYear - 162,
        isRestDay: false,
        isMidpoint: false,
        isActiveDay: true,
        twentyDayWeekIndex: (dayOfYear - 1) % 20,
        detoxPhase: 'NONE',
        daySignName: `Day ${(dayOfYear - 1) % 20 + 1}`,
        theme: 'Sacred Calendar Day',
        reflection: 'Reflect on the energy of this day',
        color: getBookColorForDay(dayOfYear)
      };
    };

    const fetchCalendarData = async () => {
      // Check cache first
      const cached = calendarCache.get(dateString);
      if (cached) {
        setCalendarData(cached);
        setLoading(false);
        return;
      }

      // Load fallback data immediately for fast UI
      const fallbackData = generateFallbackData(stableDate, dateString);
      setCalendarData(fallbackData);
      setLoading(false);

      // Try to enhance with API data in background
      try {
        setEnhancing(true);
        
        // First try to get enhanced chapter color
        const dayOfYear = Math.floor((stableDate.getTime() - new Date(stableDate.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const enhancedColor = await getChapterColorForDay(dayOfYear);
        if (enhancedColor !== fallbackData.color) {
          // Update with enhanced color
          const enhancedFallbackData = { ...fallbackData, color: enhancedColor };
          calendarCache.set(dateString, enhancedFallbackData);
          setCalendarData(enhancedFallbackData);
        }
        
        // Then try to get calendar API data
        const response = await fetch(`/api/hf-calendar?date=${dateString}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Ensure the API data has the enhanced color
            if (enhancedColor) {
              result.data.color = enhancedColor;
            }
            
            if (result.meta?.source === 'database') {
              // Only update if we got enhanced database data
              calendarCache.set(dateString, result.data);
              setCalendarData(result.data);
            } else {
              // Cache the enhanced fallback data
              calendarCache.set(dateString, result.data);
            }
          } else {
            // Cache the fallback data since API didn't provide better data
            calendarCache.set(dateString, fallbackData);
          }
        } else {
          // Cache fallback data on API error
          calendarCache.set(dateString, fallbackData);
          console.warn(`Calendar API returned ${response.status}, using fallback data`);
        }
      } catch (err) {
        // Cache fallback data on network error
        calendarCache.set(dateString, fallbackData);
        console.warn('Calendar API failed, using fallback data:', err);
      } finally {
        setEnhancing(false);
      }
    };

    fetchCalendarData();
  }, [dateString, stableDate]);

  useEffect(() => {
    const fetchUserAssignment = async () => {
      if (!isLoaded || !isSignedIn) return;
      
      // Check cache first
      const cacheKey = `${dateString}-${isSignedIn}`;
      const cached = assignmentCache.get(cacheKey);
      if (cached !== undefined) {
        setUserAssignment(cached);
        setAssignmentLoading(false);
        return;
      }
      
      try {
        setAssignmentLoading(true);
        const response = await fetch(`/api/user-assignments?date=${dateString}`);
        
        if (response.status === 500) {
          // Database tables don't exist yet, stop trying
          console.warn('User assignments API not available yet (500 error)');
          assignmentCache.set(cacheKey, null);
          setUserAssignment(null);
          return;
        }
        
        const result = await response.json();
        
        if (response.ok && result.assignments && result.assignments.length > 0 && result.journey) {
          const assignment = result.assignments[0];
          const journey = result.journey;
          
          // Ensure we only show assignments within the first 365 days
          const journeyStart = new Date(journey.journeyStartDate);
          const daysSinceStart = Math.floor((stableDate.getTime() - journeyStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          
          if (daysSinceStart >= 1 && daysSinceStart <= 365) {
            assignmentCache.set(cacheKey, assignment);
            setUserAssignment(assignment);
          } else {
            assignmentCache.set(cacheKey, null);
            setUserAssignment(null); // Outside the 365-day window
          }
        } else {
          assignmentCache.set(cacheKey, null);
          setUserAssignment(null);
        }
      } catch (err) {
        console.warn('Error fetching user assignment (gracefully handling):', err);
        assignmentCache.set(cacheKey, null);
        setUserAssignment(null);
      } finally {
        setAssignmentLoading(false);
      }
    };

    fetchUserAssignment();
  }, [dateString, isLoaded, isSignedIn]);

  const handleCompleteAssignment = async (completed: boolean) => {
    if (!userAssignment) return;
    
    try {
      const response = await fetch('/api/user-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: userAssignment.id,
          action: completed ? 'complete' : 'uncomplete'
        })
      });

      if (response.ok) {
        setUserAssignment(prev => prev ? { ...prev, isCompleted: completed } : null);
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  if (loading) {
    return (
      <Card className={cn("w-full max-w-md", className)}>
        <CardContent className="flex flex-col items-center justify-center h-48 space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading calendar data...</p>
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
        {isSignedIn && userAssignment ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assignment" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                My Journey
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assignment" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{userAssignment.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{userAssignment.dailyTheme}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCompleteAssignment(!userAssignment.isCompleted)}
                    className="ml-2 p-1"
                  >
                    {userAssignment.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium text-xs mb-1">Focus</h4>
                    <p className="text-xs text-muted-foreground">{userAssignment.personalityFocus}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-xs mb-1">Today's Action</h4>
                    <p className="text-xs text-muted-foreground">{userAssignment.actionItem}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-xs mb-1">Reflection</h4>
                    <p className="text-xs text-muted-foreground">{userAssignment.reflectionPrompt}</p>
                  </div>
                  
                  {userAssignment.bookChapter && (
                    <div>
                      <h4 className="font-medium text-xs mb-1">Epic Arcana Connection</h4>
                      <p className="text-xs text-muted-foreground">{userAssignment.bookChapter}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="space-y-4 mt-4">
              {/* Original calendar content */}
              <CalendarContent 
                calendarData={calendarData}
                dayInfo={dayInfo}
                detoxDisplay={detoxDisplay}
              />
            </TabsContent>
          </Tabs>
        ) : (
          /* Show calendar content for non-authenticated users or users without assignments */
          <CalendarContent 
            calendarData={calendarData}
            dayInfo={dayInfo}
            detoxDisplay={detoxDisplay}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Extracted calendar content component
function CalendarContent({ 
  calendarData, 
  dayInfo, 
  detoxDisplay 
}: { 
  calendarData: HfCalendarResult;
  dayInfo: any;
  detoxDisplay: string | null;
}) {
  return (
    <>
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
    </>
  );
}
