'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TodayCard } from '@/components/calendar/TodayCard';
import { YearGrid } from '@/components/calendar/YearGrid';
import { DayDrawer } from '@/components/calendar/DayDrawer';
import { AppNavbar } from '@/components/shared/AppNavbar';
import { Settings, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import type { HfCalendarResult } from '@/lib/hfCalendar';
import { CalendarSettings } from '@/components/calendar/CalendarSettings';

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState<HfCalendarResult | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showSettings, setShowSettings] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <AppNavbar variant="calendar" />
      
      {/* Page Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Human Framework Calendar</h1>
                <p className="text-sm text-muted-foreground">
                  365-day Mayan-inspired sacred calendar
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Today Card */}
            <TodayCard />

            {/* Year Navigation */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Year Navigation</h3>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleYearChange('prev')}
                  >
                    ← {currentYear - 1}
                  </Button>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold">{currentYear}</div>
                    {currentYear !== new Date().getFullYear() && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetToCurrentYear}
                        className="text-xs flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Today
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleYearChange('next')}
                  >
                    {currentYear + 1} →
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