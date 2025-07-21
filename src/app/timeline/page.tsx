'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data structure - will be replaced with real database calls
interface TimelineEvent {
  id: string;
  eventKey: string;
  label: string;
  year: number | null;
  era: string;
  historical: boolean;
  summary: string;
  month?: string;
  day?: string;
}

interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  historicalDate: string;
  alternateTimelineVariant: string;
  temporalDivergencePoint: string;
  realWorldContext: string;
  heroJourneyStage: string;
  primaryTarotCard: string;
  timelineSignificance?: string;
  chronologicalSequence?: number;
}

interface DivergencePoint {
  id: string;
  name: string;
  historicalDate: string;
  divergenceType: string;
  realTimelineOutcome: string;
  storyTimelineOutcome: string;
  historicalConsequences: string[];
  fantasyJustification: string;
  cascadeEffects: string[];
}

export default function TimelinePage() {
  const [selectedTimeline, setSelectedTimeline] = useState<'all' | 'historical' | 'fantasy'>('all');
  const [selectedScene, setSelectedScene] = useState<number | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [divergencePoints, setDivergencePoints] = useState<DivergencePoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const [timelineResponse, divergenceResponse] = await Promise.all([
          fetch('/api/timeline'),
          fetch('/api/timeline/divergence')
        ]);
        
        if (!timelineResponse.ok || !divergenceResponse.ok) {
          throw new Error('Failed to fetch timeline data');
        }
        
        const timelineData = await timelineResponse.json();
        const divergenceData = await divergenceResponse.json();
        
        setTimelineEvents(timelineData.events || []);
        setScenes(timelineData.scenes || []);
        setDivergencePoints(divergenceData.divergencePoints || []);
      } catch (error) {
        console.error('Error fetching timeline data:', error);
        // Fallback to empty arrays
        setTimelineEvents([]);
        setScenes([]);
        setDivergencePoints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, []);

  const filteredEvents = timelineEvents.filter(event => {
    if (selectedTimeline === 'historical') return event.historical;
    if (selectedTimeline === 'fantasy') return !event.historical;
    return true;
  });

  const getTimelineColor = (variant: string) => {
    switch (variant) {
      case 'Prime Timeline': return 'bg-green-500';
      case 'Divergence Point Alpha': return 'bg-yellow-500';
      case 'Pangea Insertion Point': return 'bg-purple-500';
      case 'Timeline Fracture A1': return 'bg-red-500';
      case 'Timeline Convergence B': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getDivergenceImpact = (divergence: string) => {
    if (divergence.includes('None')) return 'low';
    if (divergence.includes('minor') || divergence.includes('supernatural intrusions')) return 'medium';
    return 'high';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading timeline data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">CS</span>
                </div>
                <span className="text-xl font-bold">ChronoScriptor</span>
              </Link>
              <span className="text-gray-400">•</span>
              <h1 className="text-xl font-semibold">Timeline & Paradox System</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                ← Back to Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Epic Arcana Timeline</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Track chapter branches across multiple timelines. Explore paradox triggers, convergence points, and temporal divergences.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</label>
              <select 
                value={selectedTimeline} 
                onChange={(e) => setSelectedTimeline(e.target.value as 'all' | 'historical' | 'fantasy')}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="historical">Historical Only</option>
                <option value="fantasy">Fantasy Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timeline Legend */}
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Timeline Variants</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { name: 'Prime Timeline', color: 'bg-green-500', description: 'Original historical path' },
              { name: 'Divergence Point Alpha', color: 'bg-yellow-500', description: 'First magical manifestation' },
              { name: 'Pangea Insertion', color: 'bg-purple-500', description: 'Temporal realm access' },
              { name: 'Timeline Fracture', color: 'bg-red-500', description: 'Reality instability' },
              { name: 'Convergence Point', color: 'bg-blue-500', description: 'Multiple streams merge' }
            ].map((variant) => (
              <div key={variant.name} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${variant.color}`}></div>
                <div>
                  <div className="text-xs font-medium">{variant.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{variant.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timeline Events */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Historical Events & Scenes</h3>
              <div className="space-y-4">
                {filteredEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    {index < filteredEvents.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${event.historical ? 'bg-blue-100 dark:bg-blue-900' : 'bg-purple-100 dark:bg-purple-900'}`}>
                        <div className={`w-3 h-3 rounded-full ${event.historical ? 'bg-blue-600' : 'bg-purple-600'}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{event.label}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${event.historical ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}`}>
                            {event.historical ? 'Historical' : 'Fantasy'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {event.year && `${event.year}`}
                          {event.month && ` - ${event.month}`}
                          {event.day && ` ${event.day}`}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{event.summary}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scene Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Chapter Scenes & Timeline Variants</h3>
              <div className="space-y-4">
                {scenes.map((scene) => (
                  <div 
                    key={scene.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedScene === scene.sceneNumber 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedScene(selectedScene === scene.sceneNumber ? null : scene.sceneNumber)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          Scene {scene.sceneNumber}
                        </span>
                        <h4 className="font-medium">{scene.title}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getTimelineColor(scene.alternateTimelineVariant)}`}></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{scene.historicalDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-300">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{scene.heroJourneyStage}</span>
                      <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                        {scene.primaryTarotCard}
                      </span>
                      <span className={`px-2 py-1 rounded ${
                        getDivergenceImpact(scene.temporalDivergencePoint) === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        getDivergenceImpact(scene.temporalDivergencePoint) === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {getDivergenceImpact(scene.temporalDivergencePoint) === 'high' ? 'High Impact' :
                         getDivergenceImpact(scene.temporalDivergencePoint) === 'medium' ? 'Medium Impact' : 'Low Impact'}
                      </span>
                    </div>

                    {selectedScene === scene.sceneNumber && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-sm mb-2">Timeline Variant</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{scene.alternateTimelineVariant}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm mb-2">Real World Context</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{scene.realWorldContext}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <h5 className="font-medium text-sm mb-2">Temporal Divergence Point</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{scene.temporalDivergencePoint}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Paradox Analysis */}
          <div className="space-y-6">
            {/* Paradox Risk Assessment */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Paradox Risk Assessment</h3>
              
              <div className="space-y-4">
                {divergencePoints.length > 0 ? (
                  <>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-red-800 dark:text-red-200">Major Alterations</span>
                        <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                          {divergencePoints.filter(d => d.divergenceType === 'major_alteration').length} events
                        </span>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Fundamental changes that could cascade across multiple eras
                      </p>
                      <ul className="text-xs text-red-600 dark:text-red-400 mt-2 space-y-1">
                        {divergencePoints
                          .filter(d => d.divergenceType === 'major_alteration')
                          .slice(0, 3)
                          .map((point, index) => (
                            <li key={index}>• {point.name}</li>
                          ))}
                      </ul>
                    </div>

                    {divergencePoints.some(d => d.divergenceType === 'minor_change') && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-yellow-800 dark:text-yellow-200">Minor Changes</span>
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                            {divergencePoints.filter(d => d.divergenceType === 'minor_change').length} events
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Localized changes with potential ripple effects
                        </p>
                      </div>
                    )}

                    {divergencePoints.some(d => d.divergenceType === 'hidden_event') && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-green-800 dark:text-green-200">Hidden Events</span>
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                            {divergencePoints.filter(d => d.divergenceType === 'hidden_event').length} events
                          </span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Concealed changes with minimal apparent disruption
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No divergence points loaded yet
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Timeline Statistics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Total Events</span>
                  <span className="font-medium">{timelineEvents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Historical Events</span>
                  <span className="font-medium">{timelineEvents.filter(e => e.historical).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Fantasy Events</span>
                  <span className="font-medium">{timelineEvents.filter(e => !e.historical).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Active Scenes</span>
                  <span className="font-medium">{scenes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Timeline Variants</span>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </div>

            {/* Convergence Points */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Key Convergence Points</h3>
              
              <div className="space-y-3">
                <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="font-medium text-sm text-blue-800 dark:text-blue-200">1321-09-14</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Dante&apos;s Transcendence</div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Multiple timeline possibilities converge at this critical moment
                  </p>
                </div>

                <div className="p-3 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="font-medium text-sm text-purple-800 dark:text-purple-200">1321-10-31</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Final Judgment</div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Ultimate choice determines all future timeline branches
                  </p>
                </div>

                <div className="p-3 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="font-medium text-sm text-green-800 dark:text-green-200">1322-01-01</div>
                  <div className="text-xs text-green-600 dark:text-green-400">New Timeline</div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Establishment of the New Golden Timeline begins
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}