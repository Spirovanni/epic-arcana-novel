'use client';

import { useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';

function WeekViewContent() {
    const [showSettings, setShowSettings] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(() => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return startOfWeek;
    });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getWeekDates = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeek);
            date.setDate(currentWeek.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newWeek = new Date(currentWeek);
        newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeek(newWeek);
    };

    const weekDates = getWeekDates();
    const today = new Date();

    return (
        <div className="space-y-6">
            {/* Week Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('prev')}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>

                <div className="text-center">
                    <h2 className="text-xl font-semibold text-white">
                        {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </h2>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('next')}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>

            {/* Week Grid */}
            <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date, index) => {
                    const isToday = date.toDateString() === today.toDateString();
                    return (
                        <Card
                            key={index}
                            className={`bg-black/40 border-purple-500/30 ${isToday ? 'ring-2 ring-purple-400' : ''}`}
                        >
                            <CardHeader className="py-3 px-2 text-center">
                                <CardTitle className={`text-sm ${isToday ? 'text-purple-400' : 'text-white/60'}`}>
                                    {weekDays[index]}
                                </CardTitle>
                                <p className={`text-2xl font-bold ${isToday ? 'text-purple-300' : 'text-white'}`}>
                                    {date.getDate()}
                                </p>
                            </CardHeader>
                            <CardContent className="p-2">
                                <div className="h-24 text-xs text-white/40 text-center">
                                    {isToday ? (
                                        <span className="text-purple-300">Today</span>
                                    ) : (
                                        <span>No assignments</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

export default function WeekViewPage() {
    return (
        <DashboardLayout
            title="Week View"
            subtitle="Your weekly calendar overview"
        >
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <WeekViewContent />
            </Suspense>
        </DashboardLayout>
    );
}
