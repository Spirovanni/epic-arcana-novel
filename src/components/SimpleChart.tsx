'use client';

import { useTheme } from 'next-themes';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: DataPoint[];
  type: 'bar' | 'line' | 'pie';
  title?: string;
  height?: number;
}

export default function SimpleChart({ data, type, title, height = 200 }: SimpleChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
  ];

  if (type === 'bar') {
    return (
      <div className="w-full">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        )}
        <div className="flex items-end justify-between space-x-2" style={{ height }}>
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-end justify-center" style={{ height: height - 40 }}>
                <div
                  className="w-full rounded-t-lg transition-all duration-500 flex items-end justify-center p-1"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color || colors[index % colors.length],
                    minHeight: '8px'
                  }}
                >
                  <span className="text-xs font-semibold text-white">
                    {item.value}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center break-words">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'line') {
    const points = data.map((item, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: 100 - (item.value / maxValue) * 80 // 80% of height for chart area
    }));

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="w-full">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        )}
        <div className="relative" style={{ height }}>
          <svg width="100%" height="100%" className="overflow-visible">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={`${y}%`}
                x2="100%"
                y2={`${y}%`}
                stroke={isDark ? '#374151' : '#E5E7EB'}
                strokeWidth="1"
              />
            ))}
            
            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={`${point.x}%`}
                cy={`${point.y}%`}
                r="4"
                fill="#3B82F6"
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>
          
          {/* Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            {data.map((item, index) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'pie') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // Start from top

    return (
      <div className="w-full">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        )}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="relative" style={{ width: height, height: height }}>
            <svg width="100%" height="100%" viewBox="0 0 200 200">
              {data.map((item, index) => {
                const angle = (item.value / total) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                
                const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 100 100`,
                  `L ${x1} ${y1}`,
                  `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `Z`
                ].join(' ');
                
                currentAngle += angle;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={item.color || colors[index % colors.length]}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Legend */}
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color || colors[index % colors.length] }}
                ></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.label}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}