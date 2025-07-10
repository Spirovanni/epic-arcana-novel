'use client';

import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface ProgressCardProps {
  title: string;
  percentage: number;
  description?: string;
  color?: 'green' | 'blue' | 'indigo' | 'purple' | 'amber' | 'red';
  showIcon?: boolean;
}

const colorClasses = {
  green: 'from-green-500 to-emerald-500',
  blue: 'from-blue-500 to-cyan-500',
  indigo: 'from-indigo-500 to-purple-500',
  purple: 'from-purple-500 to-pink-500',
  amber: 'from-amber-500 to-orange-500',
  red: 'from-red-500 to-pink-500',
};

const iconColors = {
  green: 'text-green-600 dark:text-green-400',
  blue: 'text-blue-600 dark:text-blue-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
  purple: 'text-purple-600 dark:text-purple-400',
  amber: 'text-amber-600 dark:text-amber-400',
  red: 'text-red-600 dark:text-red-400',
};

export default function ProgressCard({ 
  title, 
  percentage, 
  description, 
  color = 'green',
  showIcon = true 
}: ProgressCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          {showIcon && (
            <ArrowTrendingUpIcon className={`w-6 h-6 mr-2 ${iconColors[color]}`} />
          )}
          {title}
        </h3>
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {percentage}%
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={`bg-gradient-to-r ${colorClasses[color]} h-3 rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}

      {/* Progress indicators */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}