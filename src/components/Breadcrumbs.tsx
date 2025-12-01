'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: 'light' | 'dark';
  sticky?: boolean;
}

export default function Breadcrumbs({ items, variant = 'light', sticky = true }: BreadcrumbsProps) {
  const isDark = variant === 'dark';

  return (
    <nav
      className={cn(
        'relative z-30 border-b transition-all duration-300 overflow-hidden',
        sticky ? 'sticky top-20' : 'relative',
        isDark
          ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-slate-800/70 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.8)]'
          : 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-950 dark:to-black backdrop-blur-sm border-gray-200/60 dark:border-gray-800 shadow-sm hover:shadow-md'
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 py-4">
          <Link
            href="/"
            className={cn(
              'group flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 border',
              isDark
                ? 'border-slate-800 bg-white/5 text-slate-200 hover:border-primary/60 hover:text-white hover:shadow-[0_10px_30px_-12px_rgba(59,130,246,0.35)]'
                : 'border-transparent text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
            )}
            title="Home"
          >
            <HomeIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="sr-only">Home</span>
          </Link>

          {items.map((item, index) => (
            <div key={index} className="group flex items-center gap-2">
              <ChevronRightIcon
                className={cn(
                  'w-3.5 h-3.5 transition-colors duration-200',
                  isDark
                    ? 'text-slate-600 group-hover:text-slate-400'
                    : 'text-gray-300 dark:text-gray-700 group-hover:text-gray-400 dark:group-hover:text-gray-600'
                )}
              />
              {item.current ? (
                <span
                  className={cn(
                    'text-sm font-semibold truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-2.5 py-1.5 rounded-md border',
                    isDark
                      ? 'text-white bg-white/5 border-slate-800/70'
                      : 'text-gray-900 dark:text-gray-200 bg-gray-100/40 dark:bg-gray-800/40 border-gray-200/50 dark:border-gray-700/40'
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className={cn(
                    'group relative text-sm font-medium transition-colors duration-200 px-2.5 py-1.5 rounded-md truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg',
                    isDark
                      ? 'text-slate-200/80 hover:text-white hover:bg-white/5 border border-transparent hover:border-primary/30'
                      : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-gray-800/50'
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all duration-300',
                      isDark
                        ? 'bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100'
                        : 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 scale-x-0 group-hover:scale-x-100'
                    )}
                  />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
