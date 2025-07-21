'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface TaskItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'character_arcs' | 'story_gaps_addressed' | 'series_connections';
}

interface TaskChecklistProps {
  chapterId: string;
  chapterData: { id: string; title: string; [key: string]: unknown };
  onTaskCountChange?: (count: number) => void;
}

export default function TaskChecklist({ chapterId, chapterData, onTaskCountChange }: TaskChecklistProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasksFromChapter = useCallback(async () => {
    try {
      // Extract tasks from chapter data or l_outline.json
      const response = await fetch(`/api/chapters/${chapterId}/tasks`);
      if (response.ok) {
        const data = await response.json();
        
        // Load completion status for each task
        const tasksWithStatus = await Promise.all(
          data.tasks.map(async (task: TaskItem) => {
            try {
              const statusResponse = await fetch(`/api/chapters/${chapterId}/tasks/${task.id}`);
              if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                return { ...task, completed: statusData.completed };
              }
            } catch (error) {
              console.error(`Failed to load status for task ${task.id}:`, error);
            }
            return task;
          })
        );
        
        setTasks(tasksWithStatus);
        onTaskCountChange?.(tasksWithStatus.length);
      } else {
        // If API doesn't exist, create tasks from chapterData
        const extractedTasks = extractTasksFromChapterData();
        setTasks(extractedTasks);
        onTaskCountChange?.(extractedTasks.length);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      // Fallback to extracting from chapterData
      const extractedTasks = extractTasksFromChapterData();
      setTasks(extractedTasks);
      onTaskCountChange?.(extractedTasks.length);
    } finally {
      setLoading(false);
    }
  }, [chapterId, onTaskCountChange]);

  useEffect(() => {
    fetchTasksFromChapter();
  }, [chapterId, chapterData, fetchTasksFromChapter]);

  const extractTasksFromChapterData = (): TaskItem[] => {
    const extractedTasks: TaskItem[] = [];
    
    // Mock data for demonstration - in real implementation, this would come from l_outline.json
    const mockChapterTasks = {
      character_arcs: {
        "Francisco": "Initial state - Young law student with hidden poetic talent, struggling with father's expectations vs. personal desires. Academic pressure conflicts with creative impulses. Social naivety evident in his infatuation with Novella.",
        "Novella": "Intelligent daughter hiding behind conventions, representing Francisco's idealized view of love and knowledge.",
        "Dante": "Mysterious guide introduction - Hints at his chronicle manipulation abilities. Shows deeper knowledge of temporal mechanics than he initially reveals."
      },
      story_gaps_addressed: {
        "trionfi_system": "Francisco's first unintentional activation shows him seeing the train pathway on the card - establishes cards as windows to other realities/timelines.",
        "temporal_mechanics": "The distant train grumbling represents the first temporal disturbance, setting up timeline awareness.",
        "character_motivation": "Francisco's preparation shows his growing courage despite fear - establishes his heroic potential beneath academic exterior."
      },
      series_connections: {
        "book_9_parallel": "Opening despair will transform into universal hope when Francisco gives up his singular greatness for humanity's potential.",
        "the_fool_journey": "Francisco's first step as The Fool, unaware of the cosmic significance of his simple card game creation.",
        "timeline_convergence": "This chapter's events will echo in the final book when all timelines converge into a single moment of choice."
      }
    };

    // Convert character_arcs to tasks
    Object.entries(mockChapterTasks.character_arcs).forEach(([key, value], index) => {
      extractedTasks.push({
        id: `character_arc_${index + 1}`,
        title: `${key}: ${value}`,
        description: `Character Arc ${index + 1}`,
        completed: false,
        category: 'character_arcs'
      });
    });

    // Convert story_gaps_addressed to tasks
    Object.entries(mockChapterTasks.story_gaps_addressed).forEach(([key, value], index) => {
      extractedTasks.push({
        id: `story_gap_${index + 1}`,
        title: `${key}: ${value}`,
        description: `Story Gap ${index + 1}`,
        completed: false,
        category: 'story_gaps_addressed'
      });
    });

    // Convert series_connections to tasks
    Object.entries(mockChapterTasks.series_connections).forEach(([key, value], index) => {
      extractedTasks.push({
        id: `series_connection_${index + 1}`,
        title: `${key}: ${value}`,
        description: `Series Connection ${index + 1}`,
        completed: false,
        category: 'series_connections'
      });
    });

    return extractedTasks;
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newCompletionStatus = !task.completed;
      
      // Update local state immediately
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: newCompletionStatus } : t
      ));

      // Save to backend
      await fetch(`/api/chapters/${chapterId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: newCompletionStatus }),
      });

    } catch (error) {
      console.error('Failed to update task completion:', error);
      // Revert local state on error
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));
    }
  };

  // Removed unused getCategoryColor function

  const getCategoryBorderColor = (category: string) => {
    switch (category) {
      case 'character_arcs':
        return 'border-blue-200 dark:border-blue-700';
      case 'story_gaps_addressed':
        return 'border-green-200 dark:border-green-700';
      case 'series_connections':
        return 'border-purple-200 dark:border-purple-700';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'character_arcs':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'story_gaps_addressed':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'series_connections':
        return 'bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Writing Tasks</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your progress on character development, story elements, and series connections
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {completedTasks}/{totalTasks}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% Complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
        ></div>
      </div>

      {/* Task Categories */}
      <div className="space-y-6">
        {/* Character Arcs */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            Character Development
          </h3>
          <div className="space-y-2">
            {tasks.filter(t => t.category === 'character_arcs').map((task) => (
              <div 
                key={task.id}
                className={`relative flex items-start p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${getCategoryBorderColor(task.category)} ${getCategoryBgColor(task.category)}`}
              >
                <div className="flex items-start w-full">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`w-6 h-6 mt-1 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      task.completed 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }`}
                  >
                    {task.completed && <CheckIcon className="w-4 h-4" />}
                  </button>
                  <div className="ml-3 flex-1">
                    <span className={`font-medium leading-relaxed ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
                      {task.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Story Gaps */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Story Elements
          </h3>
          <div className="space-y-2">
            {tasks.filter(t => t.category === 'story_gaps_addressed').map((task) => (
              <div 
                key={task.id}
                className={`relative flex items-start p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${getCategoryBorderColor(task.category)} ${getCategoryBgColor(task.category)}`}
              >
                <div className="flex items-start w-full">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`w-6 h-6 mt-1 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                    }`}
                  >
                    {task.completed && <CheckIcon className="w-4 h-4" />}
                  </button>
                  <div className="ml-3 flex-1">
                    <span className={`font-medium leading-relaxed ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
                      {task.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Series Connections */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            Series Connections
          </h3>
          <div className="space-y-2">
            {tasks.filter(t => t.category === 'series_connections').map((task) => (
              <div 
                key={task.id}
                className={`relative flex items-start p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${getCategoryBorderColor(task.category)} ${getCategoryBgColor(task.category)}`}
              >
                <div className="flex items-start w-full">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`w-6 h-6 mt-1 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      task.completed 
                        ? 'bg-purple-500 border-purple-500 text-white' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    {task.completed && <CheckIcon className="w-4 h-4" />}
                  </button>
                  <div className="ml-3 flex-1">
                    <span className={`font-medium leading-relaxed ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
                      {task.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center border border-gray-200/50 dark:border-gray-600/50">
          <CheckIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">No writing tasks have been loaded for this chapter yet.</p>
        </div>
      )}
    </div>
  );
}