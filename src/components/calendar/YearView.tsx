'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { YearGrid } from '@/components/calendar/YearGrid';
import { TodayCard } from '@/components/calendar/TodayCard';
import { CalendarSettings } from '@/components/calendar/CalendarSettings';
import { DayDrawer } from '@/components/calendar/DayDrawer';
import { Calendar as CalendarIcon, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import type { HfCalendarResult } from '@/lib/hfCalendar';

interface YearViewProps {
  showSettings?: boolean;
  onToggleSettings?: () => void;
}

export function YearView({ showSettings = false, onToggleSettings }: YearViewProps) {
  const [selectedDay, setSelectedDay] = useState<HfCalendarResult | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handleDayClick = (day: HfCalendarResult) => {
    setSelectedDay(day);
  };

  const handleCloseDrawer = () => {
    setSelectedDay(null);
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    setCurrentYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  const resetToCurrentYear = () => {
    setCurrentYear(new Date().getFullYear());
  };

  const isCurrentYear = currentYear === new Date().getFullYear();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">365-Day Sacred Calendar</h2>
        <p className="text-muted-foreground">
          Complete Human Framework Calendar year view
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* Today Card */}
          <TodayCard />

          {/* Year Navigation */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Year Navigation
              </h3>
              
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleYearChange('prev')}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {currentYear - 1}
                </Button>
                
                <div className="text-center">
                  <div className="text-lg font-semibold">{currentYear}</div>
                  {!isCurrentYear && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetToCurrentYear}
                      className="text-xs flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Current
                    </Button>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleYearChange('next')}
                  className="flex items-center gap-1"
                >
                  {currentYear + 1}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Legend */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Calendar Structure</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium">Quarters</div>
                  <div className="text-muted-foreground">
                    Q1 & Q2 & Q3 & Q4: 81 days each
                  </div>
                  <div className="text-muted-foreground">
                    (80 active + 1 rest day)
                  </div>
                </div>
                
                <div>
                  <div className="font-medium">Mid-Band</div>
                  <div className="text-muted-foreground">
                    40-day detox + 1 midpoint = 41 days
                  </div>
                  <div className="text-muted-foreground">
                    20 Exile + Axis Mundi + 20 Renewal
                  </div>
                </div>
                
                <div>
                  <div className="font-medium">20-Day Cycles</div>
                  <div className="text-muted-foreground">
                    Mayan day signs advance on active days only
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Year Statistics */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Year {currentYear} Stats</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Days:</span>
                  <span className="font-medium">365</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Days:</span>
                  <span className="font-medium">324</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rest Days:</span>
                  <span className="font-medium">40</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Midpoint:</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Day Sign Cycles:</span>
                  <span className="font-medium">16.2</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Panel */}
          {showSettings && (
            <CalendarSettings />
          )}
        </div>

        {/* Main Calendar */}
        <div className="xl:col-span-3">
          <YearGrid
            year={currentYear}
            onDayClick={handleDayClick}
            selectedDay={selectedDay?.dateISO}
          />
        </div>
      </div>

      {/* Day Detail Drawer */}
      <DayDrawer
        isOpen={!!selectedDay}
        onClose={handleCloseDrawer}
        day={selectedDay}
      />
    </div>
  );
}