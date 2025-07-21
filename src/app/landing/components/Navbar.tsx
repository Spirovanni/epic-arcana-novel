"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { DropdownMenu } from '@/components/DropdownMenu';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  const navItems = [
    { name: 'Books', href: '/books' },
    { name: 'Timeline', href: '/timeline' },
    { name: 'Characters', href: '/characters' },
    { name: 'Documentation', href: '/docs' },
  ];

  const featureItems = [
    {
      title: 'Chapter-Centric World Map',
      description: 'Interactive map connecting chapters to locations and lore',
      href: '/features/world-map',
      icon: '🗺️',
      category: 'Writing Tools'
    },
    {
      title: 'Timeline & Paradox System',
      description: 'Track Alpha, Beta, Gamma timelines and paradox triggers',
      href: '/features/timelines',
      icon: '⏳',
      category: 'Core Features',
      featured: true
    },
    {
      title: 'Trionfi Card Engine',
      description: 'Embed tarot-based magic system into scenes and chapters',
      href: '/features/trionfi-cards',
      icon: '🃏',
      category: 'Core Features',
      featured: true
    },
    {
      title: 'Chapter Builder',
      description: 'Markdown editor with Sudowrite sync and AI integration',
      href: '/features/chapter-builder',
      icon: '✍️',
      category: 'Writing Tools'
    },
    {
      title: 'Character Arc Visualizer',
      description: 'Graph-style matrix for character relationships and development',
      href: '/features/character-arcs',
      icon: '🎭',
      category: 'Writing Tools'
    },
    {
      title: 'Lore & Narrative Codex',
      description: 'Unified encyclopedia with auto-tagging and linking',
      href: '/features/lore-codex',
      icon: '📚',
      category: 'Writing Tools'
    },
    {
      title: 'AI Integration',
      description: 'Taskmaster AI for scene analysis and arc consistency',
      href: '/features/ai-tools',
      icon: '🤖',
      category: 'AI Tools',
      featured: true
    },
    {
      title: 'Sudowrite Sync',
      description: 'Seamless integration with Sudowrite for drafting',
      href: '/features/sudowrite-sync',
      icon: '🔄',
      category: 'AI Tools'
    }
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-lg"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link href="/landing" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-300 dark:hover:to-blue-300 transition-all duration-300">
              ChronoScriptor
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Features Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <DropdownMenu
                trigger={
                  <div className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200 relative group">
                    Features
                    <svg 
                      className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </div>
                }
                items={featureItems}
                title="ChronoScriptor Features"
              />
            </motion.div>

            {/* Other Nav Items */}
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
              </motion.div>
            ))}
            
            {/* Auth Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              className="flex items-center space-x-4"
            >
              {isSignedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Dashboard
                  </Link>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-colors",
                        userButtonPopoverCard: "shadow-2xl border border-gray-200 dark:border-gray-700",
                        userButtonPopoverActionButton: "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }
                    }}
                  />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                      Get Started
                    </button>
                  </SignUpButton>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <ThemeToggleButton />
            </motion.div>
            
            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex flex-col space-y-4">
                {/* Features in Mobile */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: 0 }}
                >
                  <div className="text-gray-700 dark:text-gray-300 font-medium py-2">
                    Features
                  </div>
                  <div className="ml-4 space-y-2">
                    {featureItems.slice(0, 4).map((feature) => (
                      <Link
                        key={feature.href}
                        href={feature.href}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="mr-2">{feature.icon}</span>
                        {feature.title}
                      </Link>
                    ))}
                    <Link
                      href="/features"
                      className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 py-1 block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      View all features →
                    </Link>
                  </div>
                </motion.div>

                {/* Other Nav Items */}
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: (index + 1) * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200 block py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: (navItems.length + 1) * 0.1 }}
                  className="pt-2"
                >
                  {isSignedIn ? (
                    <div className="flex items-center space-x-4">
                      <Link
                        href="/dashboard"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md inline-block"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700",
                            userButtonPopoverCard: "shadow-2xl border border-gray-200 dark:border-gray-700"
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <SignInButton mode="modal">
                        <button 
                          className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200 py-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button 
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md inline-block"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Get Started
                        </button>
                      </SignUpButton>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
