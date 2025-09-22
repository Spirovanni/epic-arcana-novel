'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarSettings } from '@/components/calendar/CalendarSettings';
import { useUser } from '@clerk/nextjs';
import { 
  CheckCircle, 
  Circle, 
  Calendar as CalendarIcon, 
  Target, 
  TrendingUp, 
  BookOpen, 
  User,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MyAssignmentsViewProps {
  showSettings?: boolean;
  onToggleSettings?: () => void;
}

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
  dateISO: string;
  dayOfYear: number;
  segment: string;
}

interface JourneyInfo {
  journeyStartDate: string;
  totalDays: number;
  completedDays: number;
  currentStreak: number;
}

export function MyAssignmentsView({ showSettings = false, onToggleSettings }: MyAssignmentsViewProps) {
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [journeyInfo, setJourneyInfo] = useState<JourneyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [filterSegment, setFilterSegment] = useState<string>('all');
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setLoading(false);
      return;
    }

    fetchAssignments();
  }, [isLoaded, isSignedIn]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user-assignments?full=true');
      
      if (response.status === 500) {
        setError('Assignment system not yet configured. Please complete the personality assessment to begin your journey.');
        return;
      }

      const result = await response.json();
      
      if (response.ok && result.assignments && result.journey) {
        setAssignments(result.assignments);
        setJourneyInfo(result.journey);
        setError(null);
      } else {
        setError('No assignments found. Complete the personality assessment to start your journey.');
      }
    } catch (err) {
      setError('Failed to load assignments. Please try again.');
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAssignment = async (assignmentId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/user-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          action: completed ? 'complete' : 'uncomplete'
        })
      });

      if (response.ok) {
        setAssignments(prev => 
          prev.map(assignment => 
            assignment.id === assignmentId 
              ? { ...assignment, isCompleted: completed }
              : assignment
          )
        );
        
        // Update journey info
        if (journeyInfo) {
          setJourneyInfo(prev => prev ? {
            ...prev,
            completedDays: completed ? prev.completedDays + 1 : prev.completedDays - 1
          } : null);
        }
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.dailyTheme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && assignment.isCompleted) ||
                         (filterStatus === 'pending' && !assignment.isCompleted);
    
    const matchesSegment = filterSegment === 'all' || assignment.segment === filterSegment;
    
    return matchesSearch && matchesStatus && matchesSegment;
  });

  const getSegmentBadgeColor = (segment: string) => {
    switch (segment) {
      case 'Q1': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Q2': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Q3': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Q4': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'MID_A': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'MIDPOINT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'MID_B': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getSegmentName = (segment: string) => {
    switch (segment) {
      case 'Q1': return 'Genesis';
      case 'Q2': return 'Growth';
      case 'Q3': return 'Harvest';
      case 'Q4': return 'Integration';
      case 'MID_A': return 'Exile';
      case 'MIDPOINT': return 'Axis Mundi';
      case 'MID_B': return 'Renewal';
      default: return segment;
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="text-center space-y-4 py-12">
        <Target className="h-16 w-16 mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold">Sign In Required</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Please sign in to view your personal assignments and track your journey through the Human Framework Calendar.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">My Assignments</h2>
          <p className="text-muted-foreground">Loading your personal journey...</p>
        </div>
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">My Assignments</h2>
          <p className="text-muted-foreground">Your personalized sacred journey</p>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Assignments Found</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.href = '/assessment'}>
              Take Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">My Assignments</h2>
        <p className="text-muted-foreground">
          Your personalized sacred journey through 365 days
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* Journey Stats */}
          {journeyInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Journey Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed:</span>
                    <span className="font-medium">{journeyInfo.completedDays}/{journeyInfo.totalDays}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(journeyInfo.completedDays / journeyInfo.totalDays) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current Streak:</span>
                  <span className="font-medium">{journeyInfo.currentStreak} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Started:</span>
                  <span className="font-medium">
                    {new Date(journeyInfo.journeyStartDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Segment</label>
                <Select value={filterSegment} onValueChange={setFilterSegment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="Q1">Q1 - Genesis</SelectItem>
                    <SelectItem value="Q2">Q2 - Growth</SelectItem>
                    <SelectItem value="MID_A">Exile</SelectItem>
                    <SelectItem value="MIDPOINT">Axis Mundi</SelectItem>
                    <SelectItem value="MID_B">Renewal</SelectItem>
                    <SelectItem value="Q3">Q3 - Harvest</SelectItem>
                    <SelectItem value="Q4">Q4 - Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchAssignments}
                className="w-full flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </CardContent>
          </Card>

          {/* Settings Panel */}
          {showSettings && (
            <CalendarSettings />
          )}
        </div>

        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Summary */}
          <div className="text-center text-muted-foreground">
            Showing {filteredAssignments.length} of {assignments.length} assignments
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className={`transition-all duration-200 hover:shadow-md ${assignment.isCompleted ? 'opacity-75' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCompleteAssignment(assignment.id, !assignment.isCompleted)}
                          className="p-1"
                        >
                          {assignment.isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
                        <CardTitle className={`text-lg ${assignment.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {assignment.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Day {assignment.dayOfYear}</span>
                        <Badge className={getSegmentBadgeColor(assignment.segment)}>
                          {getSegmentName(assignment.segment)}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-primary mb-1">{assignment.dailyTheme}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Personality Focus
                        </h4>
                        <p className="text-sm text-muted-foreground">{assignment.personalityFocus}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          Today's Action
                        </h4>
                        <p className="text-sm text-muted-foreground">{assignment.actionItem}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Reflection</h4>
                        <p className="text-sm text-muted-foreground">{assignment.reflectionPrompt}</p>
                      </div>
                      
                      {assignment.bookChapter && (
                        <div>
                          <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            Epic Arcana Connection
                          </h4>
                          <p className="text-sm text-muted-foreground">{assignment.bookChapter}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAssignments.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No assignments found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}