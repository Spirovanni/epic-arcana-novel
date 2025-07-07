"use client";

import React from 'react';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            Epic Arcana Novel
          </div>
          <ThemeToggleButton />
        </div>
      </div>
    </nav>
  );
}
