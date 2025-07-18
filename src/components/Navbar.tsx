'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useUser, UserButton } from '@clerk/nextjs';
import { 
  BookOpenIcon, 
  SparklesIcon, 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  UsersIcon,
  ClockIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface Book {
  id: string;
  bookNumber: number;
  title: string;
  fictionNovelTitle: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoaded } = useUser();
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch by waiting for client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isBooksDropdownOpen) {
        const dropdown = document.getElementById('books-dropdown');
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setIsBooksDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBooksDropdownOpen]);


  return (
    <nav className="relative z-50 bg-gradient-to-r from-indigo-900 via-purple-900 to-violet-900 dark:from-gray-900 dark:via-gray-800 dark:to-black shadow-2xl border-b border-purple-500/20 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-amber-500/25 transition-all duration-300 flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-white tracking-tight">
                  Epic Arcana
                </h1>
                <p className="text-xs text-purple-200 -mt-1">
                  Temporal Chronicles
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              <Link
                href="/"
                className="group flex items-center px-4 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Home
              </Link>
              
              {/* Books Dropdown */}
              <div className="relative" id="books-dropdown">
                <button
                  onClick={() => setIsBooksDropdownOpen(!isBooksDropdownOpen)}
                  className="group flex items-center px-4 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <BookOpenIcon className="w-4 h-4 mr-2" />
                  Books
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </button>
                
                {isBooksDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <Link
                        href="/books"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsBooksDropdownOpen(false)}
                      >
                        <BookOpenIcon className="w-4 h-4 mr-3 inline" />
                        All Books
                      </Link>
                      <Link
                        href="/trilogies"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsBooksDropdownOpen(false)}
                      >
                        <SparklesIcon className="w-4 h-4 mr-3 inline" />
                        Trilogies
                      </Link>
                      <hr className="my-1 border-gray-200 dark:border-gray-600" />
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        The Trionfi Genesis
                      </div>
                      <Link
                        href="/books/1"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsBooksDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                          Crown of the Ancient Ones
                        </div>
                      </Link>
                      <Link
                        href="/books/2"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsBooksDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                          Rise of the Triassic Nine
                        </div>
                      </Link>
                      <Link
                        href="/books/3"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsBooksDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-pink-500 rounded-full mr-3"></div>
                          Awake Iron!
                        </div>
                      </Link>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        The Wheel of Realms
                      </div>
                      <Link
                        href="/books/4"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsBooksDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                          Maiden of Mercy
                        </div>
                      </Link>
                      <Link
                        href="/books/5"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsBooksDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-violet-500 rounded-full mr-3"></div>
                          Holder of the Life Force
                        </div>
                      </Link>
                      <Link
                        href="/books/6"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsBooksDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-teal-500 rounded-full mr-3"></div>
                          The City of Shadows
                        </div>
                      </Link>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        The Arcana Ascended
                      </div>
                      <Link
                        href="/books/7"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsBooksDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          Dark Path to Victory
                        </div>
                      </Link>
                      <Link
                        href="/books/8"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsBooksDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                          Inferno Garden
                        </div>
                      </Link>
                      <Link
                        href="/books/9"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsBooksDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
                          The Blades of Triumph
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/characters"
                className="group flex items-center px-4 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <UsersIcon className="w-4 h-4 mr-2" />
                Characters
              </Link>
              <Link
                href="/timelines"
                className="group flex items-center px-4 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <ClockIcon className="w-4 h-4 mr-2" />
                Timelines
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="group flex items-center px-4 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <ChartBarIcon className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="group flex items-center px-4 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <Cog6ToothIcon className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => {
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
              }}
              className="p-2 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="w-5 h-5 bg-gray-400 rounded" />
              ) : theme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
            {isLoaded && user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">
                    {user.firstName || user.username || 'Writer'}
                  </p>
                  <p className="text-xs text-purple-200">
                    {user.publicMetadata?.role === 'admin' ? 'Administrator' : 'Member'}
                  </p>
                </div>
                <div className="relative">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 rounded-lg shadow-lg ring-2 ring-purple-400/50 hover:ring-purple-300 transition-all duration-200",
                        userButtonTrigger: "hover:scale-105 transition-transform duration-200"
                      }
                    }}
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-900"></div>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-sm font-medium text-purple-100 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-purple-500/20">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/20 rounded-b-lg mt-2">
              <Link
                href="/"
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                Home
              </Link>
              <Link
                href="/books"
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpenIcon className="w-5 h-5 mr-3" />
                Books
              </Link>
              <Link
                href="/trilogies"
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <SparklesIcon className="w-5 h-5 mr-3" />
                Trilogies
              </Link>
              <Link
                href="/characters"
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <UsersIcon className="w-5 h-5 mr-3" />
                Characters
              </Link>
              <Link
                href="/timelines"
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <ClockIcon className="w-5 h-5 mr-3" />
                Timelines
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ChartBarIcon className="w-5 h-5 mr-3" />
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Cog6ToothIcon className="w-5 h-5 mr-3" />
                    Settings
                  </Link>
                </>
              )}
              {!user && (
                <div className="pt-2 border-t border-purple-500/20">
                  <Link
                    href="/sign-in"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block px-3 py-2 mt-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}