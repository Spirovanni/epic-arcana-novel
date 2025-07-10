'use client';

import { 
  CalendarDaysIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  BookOpenIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ActivityItem {
  id: string;
  type: 'page_created' | 'page_updated' | 'chapter_created' | 'book_created' | 'task_completed';
  title: string;
  timestamp: string;
  bookTitle: string;
  chapterTitle?: string;
  metadata?: {
    wordCount?: number;
    pageCount?: number;
    progress?: number;
  };
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  showHeader?: boolean;
}

export default function ActivityFeed({ 
  activities, 
  maxItems = 8, 
  showHeader = true 
}: ActivityFeedProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'page_created':
        return <DocumentTextIcon className="w-4 h-4 text-green-500" />;
      case 'page_updated':
        return <PencilSquareIcon className="w-4 h-4 text-blue-500" />;
      case 'chapter_created':
        return <BookOpenIcon className="w-4 h-4 text-purple-500" />;
      case 'book_created':
        return <BookOpenIcon className="w-4 h-4 text-indigo-500" />;
      case 'task_completed':
        return <ClockIcon className="w-4 h-4 text-amber-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'page_created':
        return `New page created in ${activity.chapterTitle}`;
      case 'page_updated':
        return `Page updated in ${activity.chapterTitle}`;
      case 'chapter_created':
        return `New chapter created: ${activity.title}`;
      case 'book_created':
        return `New book created: ${activity.title}`;
      case 'task_completed':
        return `Task completed: ${activity.title}`;
      default:
        return activity.title;
    }
  };

  const getActivityMetadata = (activity: ActivityItem) => {
    const metadata = activity.metadata;
    if (!metadata) return null;

    const parts = [];
    if (metadata.wordCount) parts.push(`${metadata.wordCount} words`);
    if (metadata.pageCount) parts.push(`${metadata.pageCount} pages`);
    if (metadata.progress) parts.push(`${metadata.progress}% complete`);

    return parts.length > 0 ? parts.join(' • ') : null;
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {showHeader && (
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <CalendarDaysIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
          Recent Activity
        </h3>
      )}

      <div className="space-y-3">
        {displayedActivities.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Start writing to see your progress here
            </p>
          </div>
        ) : (
          displayedActivities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`flex items-start space-x-3 p-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                index === 0 ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {getActivityText(activity)}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
                
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {activity.bookTitle}
                  </p>
                  
                  {getActivityMetadata(activity) && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {getActivityMetadata(activity)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activities.length > maxItems && (
        <div className="mt-4 text-center">
          <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors">
            View all activity ({activities.length} total)
          </button>
        </div>
      )}
    </div>
  );
}