'use client';

import { useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function MonthViewContent() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        setCurrentDate(newDate);
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    return (
        <div className="space-y-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>

                <h2 className="text-2xl font-bold text-white">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>

            {/* Calendar Grid */}
            <Card className="bg-black/40 border-purple-500/30">
                <CardContent className="p-4">
                    {/* Week Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map((day) => (
                            <div key={day} className="text-center text-sm font-semibold text-purple-300 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => {
                            const isToday = day === today.getDate() &&
                                currentDate.getMonth() === today.getMonth() &&
                                currentDate.getFullYear() === today.getFullYear();

                            return (
                                <div
                                    key={index}
                                    className={`
                    aspect-square flex items-center justify-center rounded-lg text-sm
                    ${day ? 'cursor-pointer hover:bg-purple-500/20' : ''}
                    ${isToday ? 'bg-purple-500/30 ring-2 ring-purple-400 text-purple-300 font-bold' : 'text-white'}
                    ${!day ? 'bg-transparent' : 'bg-white/5'}
                  `}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function MonthViewPage() {
    return (
        <DashboardLayout
            title="Month View"
            subtitle="Your monthly calendar overview"
        >
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <MonthViewContent />
            </Suspense>
        </DashboardLayout>
    );
}
