'use client';

import { useState } from 'react';
import { UserIcon, BookOpenIcon, LightBulbIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon, HeartIcon, BoltIcon, GlobeAltIcon, AcademicCapIcon } from '@heroicons/react/24/solid';

interface CharacterGuidance {
  character: {
    id: string;
    name: string;
    description: string;
  };
  arc: {
    id: string;
    arcType: string;
    triumphTheme: string;
    stage: string;
    development: {
      book: number;
      chapter: number;
      focus: string;
      arc_development: string;
      key_events: string[];
      character_growth: string;
      writer_tasks: string[];
    };
  };
}

interface CharacterArcGuidanceProps {
  characterGuidance: CharacterGuidance[];
  isExpanded?: boolean;
}

const getArcTypeIcon = (arcType: string) => {
  switch (arcType.toLowerCase()) {
    case "hero's journey":
      return <StarIcon className="h-5 w-5 text-yellow-500" />;
    case 'transformation arc':
      return <BoltIcon className="h-5 w-5 text-purple-500" />;
    case 'mentor arc':
      return <AcademicCapIcon className="h-5 w-5 text-blue-500" />;
    case 'complex antagonist arc':
      return <GlobeAltIcon className="h-5 w-5 text-red-500" />;
    case 'supporting character arc':
      return <HeartIcon className="h-5 w-5 text-pink-500" />;
    case 'tragic antagonist arc':
      return <UserIcon className="h-5 w-5 text-gray-500" />;
    default:
      return <BookOpenIcon className="h-5 w-5 text-gray-400" />;
  }
};

const getTriumphThemeColor = (theme: string) => {
  const colors = {
    'transformation': 'bg-purple-100 text-purple-800 border-purple-200',
    'power': 'bg-red-100 text-red-800 border-red-200',
    'knowledge': 'bg-blue-100 text-blue-800 border-blue-200',
    'love': 'bg-pink-100 text-pink-800 border-pink-200',
    'wisdom': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'order': 'bg-gray-100 text-gray-800 border-gray-200',
    'identity': 'bg-green-100 text-green-800 border-green-200',
    'honor': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'first love': 'bg-rose-100 text-rose-800 border-rose-200'
  };
  return colors[theme as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const formatStageName = (stage: string) => {
  return stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function CharacterArcGuidance({ characterGuidance, isExpanded = false }: CharacterArcGuidanceProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showAllCharacters, setShowAllCharacters] = useState(isExpanded);

  const toggleCard = (characterId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(characterId)) {
      newExpanded.delete(characterId);
    } else {
      newExpanded.add(characterId);
    }
    setExpandedCards(newExpanded);
  };

  const displayedCharacters = showAllCharacters ? characterGuidance : characterGuidance.slice(0, 2);

  if (characterGuidance.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
        <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No Character Development
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No character arcs are specifically focused on this chapter. Consider adding character moments that advance the story.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <UserIcon className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Character Development Guide
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            {characterGuidance.length} character{characterGuidance.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {characterGuidance.length > 2 && (
          <button
            onClick={() => setShowAllCharacters(!showAllCharacters)}
            className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            {showAllCharacters ? 'Show Less' : `Show All (${characterGuidance.length})`}
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {displayedCharacters.map((guidance) => (
          <div
            key={guidance.character.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getArcTypeIcon(guidance.arc.arcType)}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {guidance.character.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatStageName(guidance.arc.stage)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTriumphThemeColor(guidance.arc.triumphTheme)}`}>
                    {guidance.arc.triumphTheme}
                  </span>
                  <button
                    onClick={() => toggleCard(guidance.character.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    {expandedCards.has(guidance.character.id) ? 'Less' : 'More'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <BookOpenIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {guidance.arc.development.focus}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {guidance.arc.development.arc_development}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Character Growth
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {guidance.arc.development.character_growth}
                      </p>
                    </div>
                  </div>
                </div>

                {expandedCards.has(guidance.character.id) && (
                  <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                    {guidance.arc.development.key_events && guidance.arc.development.key_events.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <StarIcon className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                              Key Events
                            </p>
                            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                              {guidance.arc.development.key_events.map((event, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-yellow-500 mt-1">•</span>
                                  <span>{event}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {guidance.arc.development.writer_tasks && guidance.arc.development.writer_tasks.length > 0 && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <LightBulbIcon className="h-4 w-4 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                              Writer Tasks
                            </p>
                            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                              {guidance.arc.development.writer_tasks.map((task, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-purple-500 mt-1">✓</span>
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <InformationCircleIcon className="h-4 w-4 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                            Character Background
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {guidance.character.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAllCharacters && characterGuidance.length > 2 && (
        <div className="text-center">
          <button
            onClick={() => setShowAllCharacters(true)}
            className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            Show {characterGuidance.length - 2} more character{characterGuidance.length - 2 !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}