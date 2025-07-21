"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface DropdownItem {
  title: string;
  description: string;
  href: string;
  icon?: string;
  category?: string;
  featured?: boolean;
  gradient?: string;
}

interface FeatureCard {
  title: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
  items?: string[];
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  title?: string;
}

export function DropdownMenu({ trigger, items, title }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Removed unused hoveredItem state
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const featureCards: FeatureCard[] = [
    {
      title: "Timeline System",
      description: "Master the complexity of time travel narratives with our advanced timeline management.",
      href: "/features/timelines",
      icon: "⏳",
      gradient: "from-purple-500 to-blue-500",
      items: ["Alpha Timeline", "Beta Timeline", "Gamma Timeline", "Paradox Detection"]
    },
    {
      title: "Trionfi Cards",
      description: "Integrate tarot-based magic seamlessly into your narrative structure.",
      href: "/features/trionfi-cards",
      icon: "🃏",
      gradient: "from-amber-500 to-orange-500",
      items: ["Card Database", "Scene Integration", "Divination Logic", "Arcana Powers"]
    },
    {
      title: "AI Writing Tools",
      description: "Enhance your creative process with intelligent writing assistance.",
      href: "/features/ai-tools",
      icon: "🤖",
      gradient: "from-emerald-500 to-teal-500",
      items: ["Taskmaster AI", "Scene Analysis", "Arc Consistency", "Character Insights"]
    }
  ];

  const quickAccessItems = items.filter(item => !item.featured);
  const groupedQuickAccess = quickAccessItems.reduce((acc, item) => {
    const category = item.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, DropdownItem[]>);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {trigger}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-[800px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onMouseLeave={() => setIsOpen(false)}
          >
            {title && (
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="flex">
              {/* Left Side - Feature Cards */}
              <div className="flex-1 p-6 border-r border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  {featureCards.map((card, index) => (
                    <motion.div
                      key={card.href}
                      className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Link href={card.href} onClick={() => setIsOpen(false)}>
                        <div className="flex items-start p-4">
                          {/* Icon with gradient background */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-xl mr-4 group-hover:scale-110 transition-transform duration-300`}>
                            {card.icon}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {card.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
                              {card.description}
                            </p>
                            
                            {/* Feature List */}
                            <div className="grid grid-cols-2 gap-1">
                              {card.items?.map((item, i) => (
                                <div key={i} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Right Side - Quick Access Lists */}
              <div className="w-80 p-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Quick Access</h3>
                <div className="space-y-6">
                  {Object.entries(groupedQuickAccess).map(([category, categoryItems]) => (
                    <div key={category}>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {categoryItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                          >
                            <motion.div
                              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer group"
                              onMouseEnter={() => {}}
                              onMouseLeave={() => {}}
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.icon && (
                                <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                                  {item.icon}
                                </span>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                  {item.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {item.description}
                                </p>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/features"
                className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View all features →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}