'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  BookOpenIcon,
  DocumentTextIcon,
  UsersIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  ClockIcon,
  AcademicCapIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  PencilSquareIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & { title?: string | undefined; titleId?: string | undefined; } & React.RefAttributes<SVGSVGElement>>;
  badge?: string | number;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: ChartBarIcon,
  },
  {
    name: 'Books',
    href: '/dashboard/books',
    icon: BookOpenIcon,
    badge: '9',
    children: [
      { name: 'All Books', href: '/dashboard/books', icon: ArchiveBoxIcon },
      { name: 'Book Analytics', href: '/dashboard/books/analytics', icon: ChartBarIcon },
      { name: 'Progress Tracking', href: '/dashboard/books/progress', icon: ClockIcon },
    ]
  },
  {
    name: 'Chapters',
    href: '/dashboard/chapters',
    icon: DocumentTextIcon,
    badge: '360',
    children: [
      { name: 'All Chapters', href: '/dashboard/chapters', icon: DocumentTextIcon },
      { name: 'Chapter Editor', href: '/dashboard/chapters/editor', icon: PencilSquareIcon },
      { name: 'Chapter Analytics', href: '/dashboard/chapters/analytics', icon: ChartBarIcon },
    ]
  },
  {
    name: 'Characters',
    href: '/dashboard/characters',
    icon: UsersIcon,
    children: [
      { name: 'Character Gallery', href: '/dashboard/characters', icon: UsersIcon },
      { name: 'Character Editor', href: '/dashboard/characters/editor', icon: PencilSquareIcon },
      { name: 'Relationships', href: '/dashboard/characters/relationships', icon: SparklesIcon },
    ]
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
    children: [
      { name: 'Writing Stats', href: '/dashboard/analytics/writing', icon: PencilSquareIcon },
      { name: 'Progress Reports', href: '/dashboard/analytics/progress', icon: ClockIcon },
      { name: 'Performance Metrics', href: '/dashboard/analytics/performance', icon: ChartBarIcon },
    ]
  },
  {
    name: 'Tasks & Goals',
    href: '/dashboard/tasks',
    icon: AcademicCapIcon,
    badge: '720',
    children: [
      { name: 'Active Tasks', href: '/dashboard/tasks/active', icon: ClockIcon },
      { name: 'Task Groups', href: '/dashboard/tasks/groups', icon: AcademicCapIcon },
      { name: 'Goal Setting', href: '/dashboard/tasks/goals', icon: SparklesIcon },
    ]
  },
  {
    name: 'Calendar',
    href: '/dashboard/calendar',
    icon: CalendarDaysIcon,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Cog6ToothIcon,
  },
];

export default function DashboardSidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    if (isCollapsed) return;
    
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Quick Access */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Back to Main Site</span>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <div>
                <Link
                  href={item.href}
                  onClick={() => item.children && toggleExpanded(item.name)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
                    {!isCollapsed && (
                      <>
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {!isCollapsed && item.children && (
                    <ChevronRightIcon 
                      className={`w-4 h-4 transition-transform ${
                        isExpanded(item.name) ? 'rotate-90' : ''
                      }`} 
                    />
                  )}
                </Link>
              </div>

              {/* Sub-items */}
              {!isCollapsed && item.children && isExpanded(item.name) && (
                <ul className="ml-8 mt-2 space-y-1">
                  {item.children.map((child) => (
                    <li key={child.name}>
                      <Link
                        href={child.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          isActive(child.href)
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                      >
                        <child.icon className="w-4 h-4" />
                        <span>{child.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Epic Arcana Dashboard
            <br />
            Version 1.0
          </div>
        </div>
      )}
    </div>
  );
}