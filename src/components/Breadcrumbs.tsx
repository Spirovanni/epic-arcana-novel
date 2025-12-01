'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="relative z-40 bg-gradient-to-r from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-800/40 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-4">
          <Link
            href="/"
            className="group flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all duration-200"
            title="Home"
          >
            <HomeIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="sr-only">Home</span>
          </Link>

          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700 group-hover:text-gray-400 dark:group-hover:text-gray-600 transition-colors duration-200" />
              {item.current ? (
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-2 py-1.5 rounded-md bg-gray-100/40 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/40">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="group relative text-sm font-medium text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-gray-100/60 dark:hover:bg-gray-800/50 truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}