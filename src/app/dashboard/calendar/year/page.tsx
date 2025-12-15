'use client';

import { useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { YearView } from '@/components/calendar/YearView';
import { Settings } from 'lucide-react';

function YearViewContent() {
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

            {/* Year View */}
            <YearView
                showSettings={showSettings}
                onToggleSettings={() => setShowSettings(!showSettings)}
            />
        </div>
    );
}

export default function YearViewPage() {
    return (
        <DashboardLayout
            title="Year View"
            subtitle="Complete 365-day calendar overview"
        >
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <YearViewContent />
            </Suspense>
        </DashboardLayout>
    );
}
