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
    <nav className="relative z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-3">
          <Link
            href="/"
            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <HomeIcon className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
          
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              {item.current ? (
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}