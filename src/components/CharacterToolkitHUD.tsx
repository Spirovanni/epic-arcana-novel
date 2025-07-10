'use client';

import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  CheckIcon, 
  UserIcon, 
  LightBulbIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  HeartIcon,
  BoltIcon,
  GlobeAltIcon,
  AcademicCapIcon
} from '@heroicons/react/24/solid';

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

interface CharacterToolkitHUDProps {
  characterGuidance: CharacterGuidance[];
  isVisible: boolean;
  onClose: () => void;
}

const getArcTypeIcon = (arcType: string) => {
  switch (arcType.toLowerCase()) {
    case "hero's journey":
      return <StarIconSolid className="h-4 w-4 text-yellow-500" />;
    case 'transformation arc':
      return <BoltIcon className="h-4 w-4 text-purple-500" />;
    case 'mentor arc':
      return <AcademicCapIcon className="h-4 w-4 text-blue-500" />;
    case 'complex antagonist arc':
      return <GlobeAltIcon className="h-4 w-4 text-red-500" />;
    case 'supporting character arc':
      return <HeartIcon className="h-4 w-4 text-pink-500" />;
    case 'tragic antagonist arc':
      return <UserIcon className="h-4 w-4 text-gray-500" />;
    default:
      return <UserIcon className="h-4 w-4 text-gray-400" />;
  }
};

const formatStageName = (stage: string) => {
  return stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function CharacterToolkitHUD({ characterGuidance, isVisible, onClose }: CharacterToolkitHUDProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [expandedCharacters, setExpandedCharacters] = useState<Set<string>>(new Set());
  const [opacity, setOpacity] = useState(0.95);
  const [isMinimized, setIsMinimized] = useState(false);

  // Load completed tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('character-toolkit-completed');
    if (saved) {
      try {
        setCompletedTasks(new Set(JSON.parse(saved)));
      } catch (error) {
        console.error('Error loading completed tasks:', error);
      }
    }
  }, []);

  // Save completed tasks to localStorage
  useEffect(() => {
    localStorage.setItem('character-toolkit-completed', JSON.stringify([...completedTasks]));
  }, [completedTasks]);

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const toggleCharacter = (characterId: string) => {
    const newExpanded = new Set(expandedCharacters);
    if (newExpanded.has(characterId)) {
      newExpanded.delete(characterId);
    } else {
      newExpanded.add(characterId);
    }
    setExpandedCharacters(newExpanded);
  };

  const getTotalTasks = () => {
    return characterGuidance.reduce((total, guidance) => {
      return total + (guidance.arc.development.writer_tasks?.length || 0);
    }, 0);
  };

  const getCompletedTasksCount = () => {
    return completedTasks.size;
  };

  const getProgressPercentage = () => {
    const total = getTotalTasks();
    if (total === 0) return 0;
    return Math.round((getCompletedTasksCount() / total) * 100);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-20 right-4 w-80 max-h-[calc(100vh-6rem)] z-50 transition-all duration-300 ${
        isMinimized ? 'h-auto' : ''
      }`}
      style={{ opacity }}
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ClipboardDocumentCheckIcon className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Character Toolkit</h3>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {getCompletedTasksCount()}/{getTotalTasks()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {/* Opacity Control */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setOpacity(Math.max(0.3, opacity - 0.1))}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Decrease opacity"
                >
                  <EyeSlashIcon className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setOpacity(Math.min(1, opacity + 0.1))}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Increase opacity"
                >
                  <EyeIcon className="h-3 w-3" />
                </button>
              </div>
              
              {/* Minimize Button */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <div className={`w-3 h-0.5 bg-white transform transition-transform ${isMinimized ? 'rotate-90' : ''}`} />
              </button>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Close toolkit"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          {!isMinimized && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Chapter Progress</span>
                <span>{getProgressPercentage()}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {characterGuidance.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <UserIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No character development tasks for this chapter.</p>
              </div>
            ) : (
              characterGuidance.map((guidance) => (
                <div key={guidance.character.id} className="space-y-2">
                  {/* Character Header */}
                  <button
                    onClick={() => toggleCharacter(guidance.character.id)}
                    className="w-full flex items-center justify-between p-2 bg-gray-50/70 dark:bg-gray-800/70 rounded-lg hover:bg-gray-100/70 dark:hover:bg-gray-700/70 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {getArcTypeIcon(guidance.arc.arcType)}
                      <div className="text-left">
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {guidance.character.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {formatStageName(guidance.arc.stage)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full">
                        {guidance.arc.development.writer_tasks?.length || 0} tasks
                      </span>
                      <div className={`transform transition-transform ${expandedCharacters.has(guidance.character.id) ? 'rotate-90' : ''}`}>
                        ▶
                      </div>
                    </div>
                  </button>

                  {/* Character Tasks */}
                  {expandedCharacters.has(guidance.character.id) && (
                    <div className="pl-2 space-y-2">
                      {/* Arc Development */}
                      <div className="bg-blue-50/70 dark:bg-blue-900/20 rounded p-2">
                        <div className="flex items-start space-x-2">
                          <LightBulbIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                              {guidance.arc.development.focus}
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                              {guidance.arc.development.arc_development}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Writer Tasks Checklist */}
                      {guidance.arc.development.writer_tasks && guidance.arc.development.writer_tasks.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Writer Tasks:</p>
                          {guidance.arc.development.writer_tasks.map((task, index) => {
                            const taskId = `${guidance.character.id}-${index}`;
                            const isCompleted = completedTasks.has(taskId);
                            
                            return (
                              <label
                                key={index}
                                className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer group"
                              >
                                <div className="relative mt-0.5">
                                  <input
                                    type="checkbox"
                                    checked={isCompleted}
                                    onChange={() => toggleTask(taskId)}
                                    className="sr-only"
                                  />
                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                                    isCompleted 
                                      ? 'bg-green-500 border-green-500' 
                                      : 'border-gray-300 dark:border-gray-600 group-hover:border-green-400'
                                  }`}>
                                    {isCompleted && <CheckIcon className="h-3 w-3 text-white" />}
                                  </div>
                                </div>
                                <span className={`text-xs transition-all ${
                                  isCompleted 
                                    ? 'text-gray-500 dark:text-gray-400 line-through' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {task}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Key Events */}
                      {guidance.arc.development.key_events && guidance.arc.development.key_events.length > 0 && (
                        <div className="bg-yellow-50/70 dark:bg-yellow-900/20 rounded p-2">
                          <div className="flex items-start space-x-2">
                            <StarIcon className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                                Key Events:
                              </p>
                              <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-0.5">
                                {guidance.arc.development.key_events.map((event, index) => (
                                  <li key={index} className="flex items-start space-x-1">
                                    <span className="text-yellow-500 mt-0.5">•</span>
                                    <span>{event}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}