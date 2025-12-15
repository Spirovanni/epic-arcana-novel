'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TodayView } from '@/components/calendar/TodayView';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

function CalendarContent() {
    const searchParams = useSearchParams();
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="space-y-6">
            {/* Settings Toggle */}
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
            </div>

            {/* Today View */}
            <TodayView
                showSettings={showSettings}
                onToggleSettings={() => setShowSettings(!showSettings)}
            />
        </div>
    );
}

export default function DashboardCalendarPage() {
    return (
        <DashboardLayout
            title="Human Framework Calendar"
            subtitle="Current day sacred calendar view"
        >
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <CalendarContent />
            </Suspense>
        </DashboardLayout>
    );
}
