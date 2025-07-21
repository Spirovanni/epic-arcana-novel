'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  ClockIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XMarkIcon,
  BoltIcon,
  StarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  timeline: 'alpha' | 'beta' | 'gamma';
  eventType: 'character_action' | 'plot_point' | 'world_event' | 'convergence' | 'paradox';
  chapterId?: string;
  bookId?: string;
  characters: string[];
  consequences: string[];
  paradoxRisk: 'none' | 'low' | 'medium' | 'high' | 'critical';
  isConvergencePoint: boolean;
  relatedEvents: string[];
  militaryOrder?: string;
  artifacts?: string[];
  location?: string;
}

interface TimelineBranch {
  id: string;
  name: string;
  timeline: 'alpha' | 'beta' | 'gamma';
  description: string;
  startEvent: string;
  endEvent?: string;
  probability: number;
  status: 'active' | 'dormant' | 'collapsed' | 'merged';
  divergencePoint: string;
  affectedCharacters: string[];
  outcomes: string[];
}

interface ParadoxAlert {
  id: string;
  severity: 'warning' | 'error' | 'critical';
  type: 'temporal_loop' | 'causality_violation' | 'character_contradiction' | 'timeline_conflict';
  description: string;
  affectedEvents: string[];
  suggestedResolution: string;
  detectedAt: string;
  resolved: boolean;
}

interface ConvergencePoint {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  involvedTimelines: ('alpha' | 'beta' | 'gamma')[];
  triggerEvents: string[];
  outcome: string;
  probability: number;
  consequences: string[];
}

export default function TimelinesPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [branches, setBranches] = useState<TimelineBranch[]>([]);
  const [paradoxes, setParadoxes] = useState<ParadoxAlert[]>([]);
  const [convergences, setConvergences] = useState<ConvergencePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeline, setSelectedTimeline] = useState<'all' | 'alpha' | 'beta' | 'gamma'>('all');
  const [selectedView, setSelectedView] = useState<'timeline' | 'branches' | 'paradoxes' | 'convergences'>('timeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEventType, setFilterEventType] = useState<string>('all');
  const [showParadoxAlerts, setShowParadoxAlerts] = useState(true);

  useEffect(() => {
    fetchTimelineData();
  }, [fetchTimelineData]);

  const fetchTimelineData = useCallback(async () => {
    try {
      const response = await fetch('/api/timelines');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
        setBranches(data.branches || []);
        setParadoxes(data.paradoxes || []);
        setConvergences(data.convergences || []);
      }
    } catch (error) {
      console.error('Failed to fetch timeline data:', error);
      // Generate mock data for development
      setEvents(generateMockEvents());
      setBranches(generateMockBranches());
      setParadoxes(generateMockParadoxes());
      setConvergences(generateMockConvergences());
    } finally {
      setLoading(false);
    }
  }, []);

  const generateMockEvents = (): TimelineEvent[] => {
    const militaryOrders = [
      "The Varangian Guard", "The Catalan Grand Company", "The Swiss Guard", 
      "The White Company", "The Knights Templar", "The Order of the Dragon"
    ];
    
    const artifacts = [
      "Cup of Jamshid", "Golden Apple", "Kusanagi", "Philosopher's Stone", 
      "Cintamani Stone", "Zanetti Train", "Trionfi Cards"
    ];

    const characters = [
      "Francisco", "Dante", "Petrarch", "Roger de Flor", "Dagon Atumari", 
      "The Operative", "The Observer", "The Alchemist"
    ];

    return Array.from({ length: 50 }, (_, i) => ({
      id: `event-${i + 1}`,
      title: [
        "Francisco Discovers the Temporal Rift",
        "Dante's Journey Through the Inferno Portal",
        "The Varangian Guard's First Loop",
        "Convergence at the Zanetti Station",
        "Petrarch's Temporal Vision",
        "The Great Paradox Crisis",
        "Roger de Flor's Timeline Intervention",
        "Discovery of the Alpha Codex",
        "The Beta Timeline Collapse",
        "Gamma Reality Stabilization"
      ][i % 10],
      description: `A critical event in the temporal mechanics of the Epic Arcana universe, involving complex interactions between characters, artifacts, and military orders across multiple timelines.`,
      timestamp: new Date(1300 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
      timeline: ['alpha', 'beta', 'gamma'][Math.floor(Math.random() * 3)] as 'alpha' | 'beta' | 'gamma',
      eventType: ['character_action', 'plot_point', 'world_event', 'convergence', 'paradox'][Math.floor(Math.random() * 5)] as 'character_action' | 'plot_point' | 'world_event' | 'convergence' | 'paradox',
      chapterId: `chapter-${Math.floor(Math.random() * 40) + 1}`,
      bookId: `book-${Math.floor(Math.random() * 9) + 1}`,
      characters: [characters[Math.floor(Math.random() * characters.length)], characters[Math.floor(Math.random() * characters.length)]],
      consequences: [
        "Timeline divergence detected",
        "Character fate altered",
        "Artifact power amplified",
        "Reality stability decreased"
      ],
      paradoxRisk: ['none', 'low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 5)] as 'none' | 'low' | 'medium' | 'high' | 'critical',
      isConvergencePoint: Math.random() > 0.8,
      relatedEvents: [`event-${Math.floor(Math.random() * 50) + 1}`],
      militaryOrder: Math.random() > 0.5 ? militaryOrders[Math.floor(Math.random() * militaryOrders.length)] : undefined,
      artifacts: Math.random() > 0.6 ? [artifacts[Math.floor(Math.random() * artifacts.length)]] : undefined,
      location: ["Bologna", "Constantinople", "Pangea", "The Inferno", "Zanetti Station"][Math.floor(Math.random() * 5)]
    }));
  };

  const generateMockBranches = (): TimelineBranch[] => {
    return [
      {
        id: 'branch-alpha-1',
        name: 'The Operative\'s Path',
        timeline: 'alpha',
        description: 'Primary timeline where Francisco follows the path of the Operative, mastering discerning intervention and strategic anticipation.',
        startEvent: 'event-1',
        probability: 85,
        status: 'active',
        divergencePoint: 'Francisco\'s choice at the Temporal Crossroads',
        affectedCharacters: ['Francisco', 'Dante', 'The Operative'],
        outcomes: ['Mastery of temporal mechanics', 'Alliance with the Varangian Guard', 'Discovery of the Alpha Codex']
      },
      {
        id: 'branch-beta-1',
        name: 'The Observer\'s Vision',
        timeline: 'beta',
        description: 'Alternative timeline where Francisco develops observer capabilities, focusing on intelligence gathering and balanced force.',
        startEvent: 'event-12',
        probability: 67,
        status: 'active',
        divergencePoint: 'The encounter with the Order of Justice',
        affectedCharacters: ['Francisco', 'The Observer', 'Roger de Flor'],
        outcomes: ['Enhanced perception abilities', 'Temporal stability', 'Beta timeline reinforcement']
      },
      {
        id: 'branch-gamma-1',
        name: 'The Alchemist\'s Transformation',
        timeline: 'gamma',
        description: 'Experimental timeline exploring Francisco\'s potential as an alchemist, wielding intentional strategy and active passion.',
        startEvent: 'event-23',
        probability: 43,
        status: 'dormant',
        divergencePoint: 'Discovery of the Philosopher\'s Stone fragment',
        affectedCharacters: ['Francisco', 'The Alchemist', 'Petrarch'],
        outcomes: ['Transmutation abilities', 'Reality manipulation', 'Gamma timeline creation']
      }
    ];
  };

  const generateMockParadoxes = (): ParadoxAlert[] => {
    return [
      {
        id: 'paradox-1',
        severity: 'critical',
        type: 'temporal_loop',
        description: 'Francisco\'s intervention in the past creates a causal loop where his own existence depends on events he caused.',
        affectedEvents: ['event-5', 'event-15', 'event-32'],
        suggestedResolution: 'Implement a quantum uncertainty buffer at the divergence point to break the causal chain.',
        detectedAt: new Date().toISOString(),
        resolved: false
      },
      {
        id: 'paradox-2',
        severity: 'warning',
        type: 'character_contradiction',
        description: 'Roger de Flor appears in both Alpha and Beta timelines simultaneously with conflicting motivations.',
        affectedEvents: ['event-8', 'event-22'],
        suggestedResolution: 'Establish clear character state tracking between timeline branches.',
        detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        resolved: true
      },
      {
        id: 'paradox-3',
        severity: 'error',
        type: 'timeline_conflict',
        description: 'Beta and Gamma timelines show incompatible outcomes for the Zanetti Train\'s destination.',
        affectedEvents: ['event-45', 'event-48'],
        suggestedResolution: 'Consolidate timeline outcomes or introduce probability matrices.',
        detectedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        resolved: false
      }
    ];
  };

  const generateMockConvergences = (): ConvergencePoint[] => {
    return [
      {
        id: 'convergence-1',
        name: 'The Great Synthesis',
        description: 'All three timelines converge at the moment Francisco masters the complete temporal mechanics.',
        timestamp: new Date(1350, 5, 15).toISOString(),
        involvedTimelines: ['alpha', 'beta', 'gamma'],
        triggerEvents: ['event-10', 'event-25', 'event-40'],
        outcome: 'Timeline unification and reality stabilization',
        probability: 78,
        consequences: ['Universal temporal mastery', 'End of paradoxes', 'Francisco\'s final transformation']
      },
      {
        id: 'convergence-2',
        name: 'The Zanetti Nexus',
        description: 'Alpha and Beta timelines merge at the Zanetti Station, creating a stable dual-reality.',
        timestamp: new Date(1347, 3, 20).toISOString(),
        involvedTimelines: ['alpha', 'beta'],
        triggerEvents: ['event-6', 'event-18'],
        outcome: 'Stable Alpha-Beta hybrid timeline',
        probability: 65,
        consequences: ['Enhanced narrative complexity', 'Dual character perspectives', 'Temporal stability increase']
      }
    ];
  };

  const filteredEvents = events.filter(event => {
    const matchesTimeline = selectedTimeline === 'all' || event.timeline === selectedTimeline;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterEventType === 'all' || event.eventType === filterEventType;
    return matchesTimeline && matchesSearch && matchesType;
  });

  const getTimelineColor = (timeline: string) => {
    switch (timeline) {
      case 'alpha': return 'bg-blue-500';
      case 'beta': return 'bg-green-500';
      case 'gamma': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimelineTextColor = (timeline: string) => {
    switch (timeline) {
      case 'alpha': return 'text-blue-600 dark:text-blue-400';
      case 'beta': return 'text-green-600 dark:text-green-400';
      case 'gamma': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getParadoxColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'error': return 'bg-orange-100 border-orange-500 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'warning': return 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 border-gray-500 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const unresolvedParadoxes = paradoxes.filter(p => !p.resolved);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Breadcrumbs items={[{ label: 'Dynamic Timelines', current: true }]} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading timeline data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Breadcrumbs items={[{ label: 'Dynamic Timelines & Paradoxes', current: true }]} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-4">
            Dynamic Timelines & Paradoxes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            Track branching narratives across Alpha, Beta, and Gamma timelines. Identify convergence points and manage temporal paradoxes with precision.
          </p>
        </div>

        {/* Paradox Alerts */}
        {showParadoxAlerts && unresolvedParadoxes.length > 0 && (
          <div className="mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                      Temporal Paradoxes Detected
                    </h3>
                    <p className="text-red-700 dark:text-red-300">
                      {unresolvedParadoxes.length} unresolved paradox{unresolvedParadoxes.length !== 1 ? 'es' : ''} require attention
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowParadoxAlerts(false)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {unresolvedParadoxes.slice(0, 3).map((paradox) => (
                  <div key={paradox.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {paradox.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{paradox.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedView('paradoxes')}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
                    >
                      Resolve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Timeline Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Timeline:</span>
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {[
                    { key: 'all', label: 'All', color: 'gray' },
                    { key: 'alpha', label: 'Alpha', color: 'blue' },
                    { key: 'beta', label: 'Beta', color: 'green' },
                    { key: 'gamma', label: 'Gamma', color: 'purple' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTimeline(key as 'all' | 'alpha' | 'beta' | 'gamma')}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        selectedTimeline === key
                          ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    >
                      {key !== 'all' && (
                        <div className={`w-2 h-2 rounded-full ${getTimelineColor(key)}`}></div>
                      )}
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Event Type Filter */}
              <select
                value={filterEventType}
                onChange={(e) => setFilterEventType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="all">All Events</option>
                <option value="character_action">Character Actions</option>
                <option value="plot_point">Plot Points</option>
                <option value="world_event">World Events</option>
                <option value="convergence">Convergences</option>
                <option value="paradox">Paradoxes</option>
              </select>
            </div>

            {/* View Selector */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {[
                { key: 'timeline', label: 'Timeline', icon: ClockIcon },
                { key: 'branches', label: 'Branches', icon: ArrowPathIcon },
                { key: 'paradoxes', label: 'Paradoxes', icon: ExclamationTriangleIcon },
                { key: 'convergences', label: 'Convergences', icon: StarIcon }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedView(key as 'timeline' | 'branches' | 'paradoxes' | 'convergences')}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedView === key
                      ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <ClockIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{events.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <ArrowPathIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{branches.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Branches</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{unresolvedParadoxes.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Paradoxes</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <StarIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{convergences.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Convergences</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {events.filter(e => e.isConvergencePoint).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Convergence Points</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <BoltIcon className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {Math.round(branches.reduce((sum, b) => sum + b.probability, 0) / branches.length)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Probability</div>
          </div>
        </div>

        {/* Main Content */}
        {selectedView === 'timeline' && (
          <div className="space-y-6">
            {/* Timeline Events */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <CalendarDaysIcon className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Timeline Events ({filteredEvents.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEvents.slice(0, 20).map((event) => (
                  <div key={event.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getTimelineColor(event.timeline)}`}></div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {event.title}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(event.timestamp)}
                          </span>
                          {event.isConvergencePoint && (
                            <StarIcon className="w-5 h-5 text-yellow-500" title="Convergence Point" />
                          )}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {event.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getTimelineTextColor(event.timeline)} bg-gray-100 dark:bg-gray-700`}>
                            {event.timeline} Timeline
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {event.eventType.replace('_', ' ')}
                          </span>
                          {event.paradoxRisk !== 'none' && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(event.paradoxRisk)} bg-gray-100 dark:bg-gray-700`}>
                              {event.paradoxRisk} risk
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Characters:</span>
                            <div className="text-gray-600 dark:text-gray-400">
                              {event.characters.join(', ') || 'None'}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                            <div className="text-gray-600 dark:text-gray-400">
                              {event.location || 'Unknown'}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Military Order:</span>
                            <div className="text-gray-600 dark:text-gray-400">
                              {event.militaryOrder || 'None'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/timelines/events/${event.id}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedView === 'branches' && (
          <div className="space-y-6">
            {branches.map((branch) => (
              <div key={branch.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getTimelineColor(branch.timeline)}`}></div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {branch.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      branch.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      branch.status === 'dormant' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {branch.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {branch.probability}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Probability</div>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {branch.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Affected Characters</h4>
                    <div className="flex flex-wrap gap-2">
                      {branch.affectedCharacters.map((character, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {character}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Potential Outcomes</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {branch.outcomes.slice(0, 3).map((outcome, index) => (
                        <li key={index} className="flex items-center">
                          <ChevronRightIcon className="w-3 h-3 mr-1" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Divergence Point:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{branch.divergencePoint}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedView === 'paradoxes' && (
          <div className="space-y-6">
            {paradoxes.map((paradox) => (
              <div key={paradox.id} className={`rounded-xl border-l-4 p-6 ${getParadoxColor(paradox.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <ExclamationTriangleIcon className="w-6 h-6" />
                      <h3 className="text-lg font-bold">
                        {paradox.type.replace('_', ' ').toUpperCase()} - {paradox.severity.toUpperCase()}
                      </h3>
                      {paradox.resolved && (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    
                    <p className="mb-4">
                      {paradox.description}
                    </p>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-2">Suggested Resolution:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {paradox.suggestedResolution}
                      </p>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Affected Events: {paradox.affectedEvents.length}</span>
                      <span>Detected: {formatDate(paradox.detectedAt)}</span>
                    </div>
                  </div>
                  
                  {!paradox.resolved && (
                    <button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedView === 'convergences' && (
          <div className="space-y-6">
            {convergences.map((convergence) => (
              <div key={convergence.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <StarIcon className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {convergence.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {convergence.probability}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Probability</div>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {convergence.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Involved Timelines</h4>
                    <div className="flex space-x-2">
                      {convergence.involvedTimelines.map((timeline, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <div className={`w-3 h-3 rounded-full ${getTimelineColor(timeline)}`}></div>
                          <span className={`text-sm font-medium ${getTimelineTextColor(timeline)}`}>
                            {timeline.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Timeline</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(convergence.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Expected Outcome</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {convergence.outcome}
                  </p>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Consequences:</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {convergence.consequences.map((consequence, index) => (
                      <li key={index} className="flex items-center">
                        <ChevronRightIcon className="w-3 h-3 mr-1" />
                        {consequence}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}