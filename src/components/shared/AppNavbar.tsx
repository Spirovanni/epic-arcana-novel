'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { AssessmentButton } from '@/components/ui/AssessmentButton';
import { useAssessmentButtonText } from '@/hooks/useAssessmentButtonText';
import { Calendar, Book, Users, Clock, BarChart3, Settings, Map } from 'lucide-react';

const gradCTA = "bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  requiresAuth?: boolean;
  showOnPaths?: string[];
}

interface AppNavbarProps {
  variant?: 'landing' | 'app' | 'dashboard' | 'admin';
}

export function AppNavbar({ variant = 'app' }: AppNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  const { buttonText } = useAssessmentButtonText();
  const pathname = usePathname();

  const getNavItems = (): NavItem[] => {
    switch (variant) {
      case 'landing':
        return [
          { href: '#how-it-works', label: 'How it Works' },
          { href: '#world', label: 'World' },
          { href: '#community', label: 'Community' },
          { href: '#cycle', label: 'Cycle' },
          { href: '/dashboard', label: 'Dashboard', requiresAuth: true },
          { href: '/calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" />, requiresAuth: true },
        ];
      
      case 'dashboard':
        return [
          { href: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
          { href: '/calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
          { href: '/books', label: 'Books', icon: <Book className="w-4 h-4" /> },
          { href: '/characters', label: 'Characters', icon: <Users className="w-4 h-4" /> },
          { href: '/timelines', label: 'Timelines', icon: <Clock className="w-4 h-4" /> },
          { href: '/features/world-map', label: 'World Map', icon: <Map className="w-4 h-4" /> },
        ];
      
      case 'admin':
        return [
          { href: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
          { href: '/calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
          { href: '/admin/calendar', label: 'Admin', icon: <Settings className="w-4 h-4" /> },
        ];
      
      default: // 'app'
        return [
          { href: '/books', label: 'Books', icon: <Book className="w-4 h-4" /> },
          { href: '/characters', label: 'Characters', icon: <Users className="w-4 h-4" /> },
          { href: '/calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
          { href: '/timelines', label: 'Timelines', icon: <Clock className="w-4 h-4" /> },
          { href: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" />, requiresAuth: true },
          { href: '/features/world-map', label: 'World Map', icon: <Map className="w-4 h-4" /> },
        ];
    }
  };

  const navItems = getNavItems().filter(item => 
    !item.requiresAuth || isSignedIn
  );

  const getHomeHref = () => {
    switch (variant) {
      case 'landing':
        return '/';
      case 'admin':
        return '/admin/calendar';
      default:
        return '/landing';
    }
  };

  const isActivePath = (href: string) => {
    if (href.startsWith('#')) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-[#0b1220]/70 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
        {/* Left brand */}
        <div className="flex items-center">
          <Link href={getHomeHref()} className="flex items-center group">
            <Image
              src="/images/Epic_Arcana_Logo.png"
              alt="Epic Arcana"
              width={174}
              height={58}
              className="hover:opacity-90 transition-all duration-300"
            />
          </Link>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-white/90 transition-colors tracking-wide flex items-center gap-2 ${
                isActivePath(item.href) ? 'text-white' : ''
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right auth section */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              {variant === 'landing' ? (
                <AssessmentButton 
                  className={`${gradCTA} text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                />
              ) : (
                <Link
                  href="/dashboard"
                  className={`${gradCTA} text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-105 ${
                    isActivePath('/dashboard') ? 'ring-2 ring-indigo-400' : ''
                  }`}
                >
                  Dashboard
                </Link>
              )}
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border border-white/20 hover:border-white/40 transition-colors"
                  }
                }}
              />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-sm text-slate-300 hover:text-white/90 transition-colors font-semibold tracking-wide">
                  Sign In
                </button>
              </SignInButton>
              {variant === 'landing' ? (
                <SignInButton mode="modal" forceRedirectUrl="/assessment">
                  <button className={`${gradCTA} text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 tracking-wide transition-all duration-300 hover:scale-105`}>
                    {buttonText}
                  </button>
                </SignInButton>
              ) : (
                <Link 
                  href="/assessment"
                  className={`${gradCTA} text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 tracking-wide transition-all duration-300 hover:scale-105`}
                >
                  Take Assessment
                </Link>
              )}
            </>
          )}
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white/90 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0b1220]/95 backdrop-blur">
          <div className="px-4 py-4 space-y-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block text-slate-300 hover:text-white/90 transition-colors flex items-center gap-2 py-2 ${
                    isActivePath(item.href) ? 'text-white' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="pt-2 border-t border-white/5">
              {isSignedIn ? (
                variant === 'landing' ? (
                  <AssessmentButton 
                    className={`${gradCTA} block text-center text-sm font-semibold px-4 py-2 rounded-xl`}
                  />
                ) : (
                  <Link
                    href="/dashboard"
                    className={`${gradCTA} block text-center text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )
              ) : (
                <div className="space-y-2">
                  <SignInButton mode="modal">
                    <button className="block w-full text-slate-300 hover:text-white/90 transition-colors py-2">
                      Sign In
                    </button>
                  </SignInButton>
                  {variant === 'landing' ? (
                    <SignInButton mode="modal" forceRedirectUrl="/assessment">
                      <button className={`${gradCTA} block w-full text-center text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105`}>
                        {buttonText}
                      </button>
                    </SignInButton>
                  ) : (
                    <Link 
                      href="/assessment"
                      className={`${gradCTA} block w-full text-center text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Take Assessment
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}