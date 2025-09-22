'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TodayCard } from '@/components/calendar/TodayCard';
import { CalendarSettings } from '@/components/calendar/CalendarSettings';
import { DayDrawer } from '@/components/calendar/DayDrawer';
import { Settings, Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { HfCalendarResult } from '@/lib/hfCalendar';

interface TodayViewProps {
  showSettings?: boolean;
  onToggleSettings?: () => void;
}

export function TodayView({ showSettings = false, onToggleSettings }: TodayViewProps) {
  const [selectedDay, setSelectedDay] = useState<HfCalendarResult | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDayClick = (day: HfCalendarResult) => {
    setSelectedDay(day);
  };

  const handleCloseDrawer = () => {
    setSelectedDay(null);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
    setCurrentDate(newDate);
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = () => {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Today's Sacred Day</h2>
        <p className="text-muted-foreground">
          Your personal connection to the Human Framework Calendar
        </p>
      </div>

      {/* Date Navigation */}
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-lg">Navigate Days</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDay('prev')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="text-center">
              <div className="text-sm font-medium">
                {currentDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              {!isToday() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetToToday}
                  className="text-xs flex items-center gap-1 mt-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Today
                </Button>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDay('next')}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Today Card */}
        <div className="xl:col-span-2 flex justify-center">
          <TodayCard 
            date={currentDate}
            className="w-full max-w-2xl"
          />
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Day of Year:</span>
                <span className="font-medium">
                  {Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1}/365
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Days Remaining:</span>
                <span className="font-medium">
                  {365 - (Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Year:</span>
                <span className="font-medium">{currentDate.getFullYear()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Sacred Calendar Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About This Day</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Each day in the Human Framework Calendar carries unique energy and meaning, 
                connecting you to ancient wisdom and personal growth.
              </p>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Structure:</span>
                  <span className="text-muted-foreground ml-2">
                    365 days organized in 4 quarters + 40-day detox cycle
                  </span>
                </div>
                <div>
                  <span className="font-medium">Day Signs:</span>
                  <span className="text-muted-foreground ml-2">
                    20-day cycles advancing on active days only
                  </span>
                </div>
                <div>
                  <span className="font-medium">Epic Arcana:</span>
                  <span className="text-muted-foreground ml-2">
                    Each day connects to specific chapters and themes
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Panel */}
          {showSettings && (
            <CalendarSettings />
          )}
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