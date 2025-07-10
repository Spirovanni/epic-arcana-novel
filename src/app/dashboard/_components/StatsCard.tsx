'use client';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'indigo' | 'blue' | 'green' | 'purple' | 'amber' | 'red' | 'pink' | 'cyan';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const colorClasses = {
  indigo: 'text-indigo-600 dark:text-indigo-400',
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  purple: 'text-purple-600 dark:text-purple-400',
  amber: 'text-amber-600 dark:text-amber-400',
  red: 'text-red-600 dark:text-red-400',
  pink: 'text-pink-600 dark:text-pink-400',
  cyan: 'text-cyan-600 dark:text-cyan-400',
};

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'indigo', 
  trend, 
  subtitle 
}: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <Icon className={`w-8 h-8 ${colorClasses[color]}`} />
            {trend && (
              <div className={`flex items-center text-sm font-medium ${
                trend.isPositive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                <span className="mr-1">
                  {trend.isPositive ? '↗' : '↘'}
                </span>
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {formatValue(value)}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {title}
          </div>
          
          {subtitle && (
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}