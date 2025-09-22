'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { AssessmentButton } from '@/components/ui/AssessmentButton';
import { useAssessmentButtonText } from '@/hooks/useAssessmentButtonText';
import { Button } from '@/components/ui/button';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Calendar, Book, Users, Clock, BarChart3, Settings, Map, ChevronDown, RefreshCw, TrendingUp, Target, Brain, Palette, FileText, Database, Sparkles, Zap, Globe, User } from 'lucide-react';
import { BooksDropdown } from './BooksDropdown';
import { getBooksDropdownItems } from './BooksDropdownData';

const gradCTA = "bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400";

interface NavItem {
  href?: string;
  label: string;
  icon?: React.ReactNode;
  requiresAuth?: boolean;
  showOnPaths?: string[];
  dropdown?: DropdownItem[];
  isDropdown?: boolean;
}

interface DropdownItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface PageAction {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
}

interface AppNavbarProps {
  variant?: 'landing' | 'app' | 'dashboard' | 'admin' | 'calendar';
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
          { 
            label: 'Dashboard', 
            icon: <BarChart3 className="w-4 h-4" />, 
            isDropdown: true,
            dropdown: [
              { href: '/dashboard', label: 'Overview', icon: <BarChart3 className="w-4 h-4" />, description: 'Your personality dashboard' },
              { href: '/dashboard/strengths', label: 'Strengths', icon: <TrendingUp className="w-4 h-4" />, description: 'Core strengths analysis' },
              { href: '/dashboard/growth', label: 'Growth Areas', icon: <Target className="w-4 h-4" />, description: 'Development opportunities' },
              { href: '/dashboard/goals', label: 'Goals & Plans', icon: <Target className="w-4 h-4" />, description: 'Personality-driven goals' },
            ]
          },
          { href: '/calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
          { href: '/characters', label: 'Characters', icon: <Users className="w-4 h-4" /> },
          { 
            label: 'Features', 
            icon: <Sparkles className="w-4 h-4" />, 
            isDropdown: true,
            dropdown: [
              { href: '/features/world-map', label: 'World Map', icon: <Map className="w-4 h-4" />, description: 'Interactive world exploration' },
              { href: '/features/character-arcs-3d', label: '3D Character Arcs', icon: <Users className="w-4 h-4" />, description: 'Visual character development' },
              { href: '/features/locations', label: 'Locations', icon: <Globe className="w-4 h-4" />, description: 'Discover epic locations' },
              { href: '/timelines', label: 'Timelines', icon: <Clock className="w-4 h-4" />, description: 'Story timeline explorer' },
            ]
          },
        ];

      case 'calendar':
        return [
          { href: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
          { 
            label: 'Calendar', 
            icon: <Calendar className="w-4 h-4" />, 
            isDropdown: true,
            dropdown: [
              { href: '/calendar', label: 'Today', icon: <Calendar className="w-4 h-4" />, description: 'Current day view' },
              { href: '/calendar?view=year', label: 'Year View', icon: <Calendar className="w-4 h-4" />, description: 'Full 365-day calendar' },
              { href: '/calendar?view=assignments', label: 'My Assignments', icon: <Target className="w-4 h-4" />, description: 'Personal journey tasks' },
            ]
          },
          { href: '/books', label: 'Books', icon: <Book className="w-4 h-4" /> },
          { href: '/characters', label: 'Characters', icon: <Users className="w-4 h-4" /> },
          { 
            label: 'Features', 
            icon: <Sparkles className="w-4 h-4" />, 
            isDropdown: true,
            dropdown: [
              { href: '/features/world-map', label: 'World Map', icon: <Map className="w-4 h-4" />, description: 'Interactive world exploration' },
              { href: '/features/character-arcs-3d', label: '3D Character Arcs', icon: <Users className="w-4 h-4" />, description: 'Visual character development' },
              { href: '/features/locations', label: 'Locations', icon: <Globe className="w-4 h-4" />, description: 'Discover epic locations' },
              { href: '/timelines', label: 'Timelines', icon: <Clock className="w-4 h-4" />, description: 'Story timeline explorer' },
            ]
          },
        ];
      
      case 'admin':
        return [
          { href: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
          { href: '/calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
          { 
            label: 'Admin', 
            icon: <Settings className="w-4 h-4" />, 
            isDropdown: true,
            dropdown: [
              { href: '/admin/calendar', label: 'Calendar Settings', icon: <Settings className="w-4 h-4" />, description: 'HF Calendar configuration' },
              { href: '/admin/calendar#day-signs', label: 'Day Signs', icon: <Palette className="w-4 h-4" />, description: 'Manage day sign mappings' },
              { href: '/admin/calendar#overrides', label: 'Overrides', icon: <FileText className="w-4 h-4" />, description: 'Special day configurations' },
              { href: '/admin/calendar#data', label: 'Data Management', icon: <Database className="w-4 h-4" />, description: 'Import/export and seeding' },
            ]
          },
        ];
      
      default: // 'app'
        return [
          { href: '/books', label: 'Books', icon: <Book className="w-4 h-4" /> },
          { href: '/characters', label: 'Characters', icon: <Users className="w-4 h-4" /> },
          { href: '/calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
          { href: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" />, requiresAuth: true },
          { 
            label: 'Features', 
            icon: <Sparkles className="w-4 h-4" />, 
            isDropdown: true,
            dropdown: [
              { href: '/features/world-map', label: 'World Map', icon: <Map className="w-4 h-4" />, description: 'Interactive world exploration' },
              { href: '/features/character-arcs-3d', label: '3D Character Arcs', icon: <Users className="w-4 h-4" />, description: 'Visual character development' },
              { href: '/features/locations', label: 'Locations', icon: <Globe className="w-4 h-4" />, description: 'Discover epic locations' },
              { href: '/timelines', label: 'Timelines', icon: <Clock className="w-4 h-4" />, description: 'Story timeline explorer' },
            ]
          },
        ];
    }
  };

  const getPageActions = (): PageAction[] => {
    switch (variant) {
      case 'dashboard':
        return [
          {
            label: 'Retake Assessment',
            icon: <RefreshCw className="w-4 h-4" />,
            href: 'https://www.epicarcana.com/assessment?retake=true',
            variant: 'outline'
          }
        ];
      
      case 'calendar':
        return [
          {
            label: 'Settings',
            icon: <Settings className="w-4 h-4" />,
            onClick: () => {
              // Scroll to settings section or open settings modal
              const settingsSection = document.querySelector('[data-settings]');
              settingsSection?.scrollIntoView({ behavior: 'smooth' });
            },
            variant: 'outline'
          }
        ];

      case 'admin':
        return [
          {
            label: 'Seed Database',
            icon: <Database className="w-4 h-4" />,
            onClick: () => {
              // This would trigger the seed database function
              const seedButton = document.querySelector('[data-seed-database]') as HTMLButtonElement;
              seedButton?.click();
            },
            variant: 'secondary'
          }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems().filter(item => 
    !item.requiresAuth || isSignedIn
  );
  
  const pageActions = getPageActions();

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

  const isDropdownActive = (dropdown: DropdownItem[]) => {
    return dropdown.some(item => isActivePath(item.href));
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-[#0b1220]/90 border-b border-white/10 shadow-lg shadow-black/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
        {/* Left brand */}
        <div className="flex items-center">
          <Link href={getHomeHref()} className="flex items-center group">
            <Image
              src="/images/Epic_Arcana_Logo.png"
              alt="Epic Arcana"
              width={174}
              height={58}
              className="hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </div>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm text-slate-300 font-medium">
          {navItems.map((item, index) => (
            item.isDropdown ? (
              <DropdownMenuPrimitive.Root key={index}>
                <DropdownMenuPrimitive.Trigger className={`px-4 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 tracking-wide flex items-center gap-2 group ${
                  item.dropdown && isDropdownActive(item.dropdown) ? 'text-white bg-white/5' : ''
                }`}>
                  {item.icon}
                  {item.label}
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180 group-data-[state=open]:rotate-180" />
                </DropdownMenuPrimitive.Trigger>
                <DropdownMenuPrimitive.Portal>
                  <DropdownMenuPrimitive.Content 
                    align="start" 
                    className="w-64 bg-[#1a1a2e]/95 backdrop-blur border border-white/10 rounded-xl shadow-xl shadow-black/30 p-2 animate-in fade-in-0 zoom-in-95 duration-200"
                    sideOffset={8}
                  >
                    {item.dropdown?.map((dropdownItem, dropdownIndex) => (
                      <DropdownMenuPrimitive.Item key={dropdownIndex} asChild>
                        <Link
                          href={dropdownItem.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer group/item ${
                            isActivePath(dropdownItem.href) ? 'text-white bg-white/10 shadow-md' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className="flex-shrink-0 text-indigo-400 group-hover/item:text-indigo-300">
                            {dropdownItem.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{dropdownItem.label}</span>
                            {dropdownItem.description && (
                              <span className="text-xs text-slate-400 group-hover/item:text-slate-300">{dropdownItem.description}</span>
                            )}
                          </div>
                        </Link>
                      </DropdownMenuPrimitive.Item>
                    ))}
                  </DropdownMenuPrimitive.Content>
                </DropdownMenuPrimitive.Portal>
              </DropdownMenuPrimitive.Root>
            ) : item.href === '/books' ? (
              // Replace any Books link with the robust BooksDropdown component
              <BooksDropdown key={index} />
            ) : (
              // Render normal links
              <Link
                key={item.href}
                href={item.href || '#'}
                className={`px-4 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 tracking-wide flex items-center gap-2 ${
                  item.href && isActivePath(item.href) ? 'text-white bg-white/5' : ''
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          ))}
        </nav>

        {/* Right auth section */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              {/* Page-specific actions */}
              {pageActions.map((action, index) => (
                action.href ? (
                  <Link key={index} href={action.href}>
                    <Button 
                      variant={action.variant} 
                      size="sm" 
                      className="flex items-center gap-2 hover:scale-105 transition-all duration-200 shadow-md"
                    >
                      {action.icon}
                      <span className="hidden sm:inline">{action.label}</span>
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    key={index}
                    variant={action.variant} 
                    size="sm" 
                    onClick={action.onClick}
                    className="flex items-center gap-2 hover:scale-105 transition-all duration-200 shadow-md"
                  >
                    {action.icon}
                    <span className="hidden sm:inline">{action.label}</span>
                  </Button>
                )
              ))}
              
              {variant === 'landing' ? (
                <AssessmentButton 
                  className={`${gradCTA} text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-105`}
                />
              ) : (
                !pageActions.some(action => action.href === '/dashboard') && (
                  <Link
                    href="/dashboard"
                    className={`${gradCTA} text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-105 ${
                      isActivePath('/dashboard') ? 'ring-2 ring-indigo-400' : ''
                    }`}
                  >
                    <span className="hidden sm:inline">Dashboard</span>
                    <BarChart3 className="w-4 h-4 sm:hidden" />
                  </Link>
                )
              )}
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full border-2 border-white/20 hover:border-indigo-400/60 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
                  }
                }}
              />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="hidden sm:block text-sm text-slate-300 hover:text-white/90 transition-colors font-medium tracking-wide px-3 py-2 rounded-lg hover:bg-white/5">
                  Sign In
                </button>
              </SignInButton>
              {variant === 'landing' ? (
                <SignInButton mode="modal" forceRedirectUrl="/assessment">
                  <button className={`${gradCTA} text-sm font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                    <span className="hidden sm:inline">{buttonText}</span>
                    <span className="sm:hidden">Start</span>
                  </button>
                </SignInButton>
              ) : (
                <Link 
                  href="/assessment"
                  className={`${gradCTA} text-sm font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  <span className="hidden sm:inline">Take Assessment</span>
                  <span className="sm:hidden">Start</span>
                </Link>
              )}
            </>
          )}
          
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0b1220]/95 backdrop-blur shadow-xl">
          <div className="px-4 py-6 space-y-6">
            <nav className="space-y-3">
              {/* Regular nav items - exclude Books links since we handle them separately */}
              {navItems.filter(item => !item.isDropdown && item.href && item.href !== '/books').map((item) => (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    isActivePath(item.href!) 
                      ? 'text-white bg-white/10 shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="text-indigo-400">{item.icon}</div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              {/* Books dropdown - show for any variant that has Books link */}
              {navItems.some(item => item.href === '/books') && (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Books
                  </div>
                  {getBooksDropdownItems().map((bookItem) => (
                    <Link
                      key={bookItem.href}
                      href={bookItem.href}
                      className={`block px-4 py-3 ml-4 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        isActivePath(bookItem.href) 
                          ? 'text-white bg-white/10 shadow-md' 
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="text-indigo-400 text-sm">{bookItem.icon}</div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {bookItem.bookNumber ? `Book ${bookItem.bookNumber}: ${bookItem.label}` : bookItem.label}
                        </span>
                        <span className="text-xs text-slate-400">{bookItem.description}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Dropdown sections */}
              {navItems.filter(item => item.isDropdown).map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </div>
                  {item.dropdown?.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.href}
                      href={dropdownItem.href}
                      className={`block px-4 py-3 ml-4 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        isActivePath(dropdownItem.href) 
                          ? 'text-white bg-white/10 shadow-md' 
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="text-indigo-400 text-sm">{dropdownItem.icon}</div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{dropdownItem.label}</span>
                        {dropdownItem.description && (
                          <span className="text-xs text-slate-400">{dropdownItem.description}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
            
            <div className="pt-4 border-t border-white/10">
              {isSignedIn ? (
                <div className="space-y-3">
                  {pageActions.map((action, index) => (
                    action.href ? (
                      <Link key={index} href={action.href}>
                        <Button 
                          variant={action.variant} 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {action.icon}
                          {action.label}
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        key={index}
                        variant={action.variant} 
                        onClick={() => {
                          action.onClick?.();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    )
                  ))}
                  {variant === 'landing' ? (
                    <AssessmentButton 
                      className={`${gradCTA} w-full text-center text-sm font-semibold px-4 py-3 rounded-xl`}
                    />
                  ) : (
                    !pageActions.some(action => action.href === '/dashboard') && (
                      <Link
                        href="/dashboard"
                        className={`${gradCTA} block w-full text-center text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-300`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <SignInButton mode="modal">
                    <button className="w-full text-slate-300 hover:text-white/90 transition-colors py-3 px-4 rounded-lg hover:bg-white/5 font-medium">
                      Sign In
                    </button>
                  </SignInButton>
                  {variant === 'landing' ? (
                    <SignInButton mode="modal" forceRedirectUrl="/assessment">
                      <button className={`${gradCTA} w-full text-center text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-300`}>
                        {buttonText}
                      </button>
                    </SignInButton>
                  ) : (
                    <Link 
                      href="/assessment"
                      className={`${gradCTA} block w-full text-center text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-300`}
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