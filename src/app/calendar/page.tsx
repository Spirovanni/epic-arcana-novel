'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TodayCard } from '@/components/calendar/TodayCard';
import { YearGrid } from '@/components/calendar/YearGrid';
import { DayDrawer } from '@/components/calendar/DayDrawer';
import { AppNavbar } from '@/components/shared/AppNavbar';
import { TodayView } from '@/components/calendar/TodayView';
import { YearView } from '@/components/calendar/YearView';
import { MyAssignmentsView } from '@/components/calendar/MyAssignmentsView';
import { Settings, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import type { HfCalendarResult } from '@/lib/hfCalendar';
import { CalendarSettings } from '@/components/calendar/CalendarSettings';

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const [selectedDay, setSelectedDay] = useState<HfCalendarResult | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showSettings, setShowSettings] = useState(false);
  const [currentView, setCurrentView] = useState<'today' | 'year' | 'assignments'>('today');

  // Handle view changes from URL parameters
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'year' || view === 'assignments') {
      setCurrentView(view);
    } else {
      setCurrentView('today');
    }
  }, [searchParams]);

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

  const getViewTitle = () => {
    switch (currentView) {
      case 'today': return 'Today';
      case 'year': return 'Year View';
      case 'assignments': return 'My Assignments';
      default: return 'Calendar';
    }
  };

  const getViewDescription = () => {
    switch (currentView) {
      case 'today': return 'Current day sacred calendar view';
      case 'year': return 'Complete 365-day calendar overview';
      case 'assignments': return 'Your personalized journey tasks';
      default: return '365-day Mayan-inspired sacred calendar';
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'today':
        return (
          <TodayView 
            showSettings={showSettings}
            onToggleSettings={() => setShowSettings(!showSettings)}
          />
        );
      case 'year':
        return (
          <YearView 
            showSettings={showSettings}
            onToggleSettings={() => setShowSettings(!showSettings)}
          />
        );
      case 'assignments':
        return (
          <MyAssignmentsView 
            showSettings={showSettings}
            onToggleSettings={() => setShowSettings(!showSettings)}
          />
        );
      default:
        return (
          <TodayView 
            showSettings={showSettings}
            onToggleSettings={() => setShowSettings(!showSettings)}
          />
        );
    }
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
                  {getViewDescription()}
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
        {renderCurrentView()}
      </div>
    </div>
  );
}