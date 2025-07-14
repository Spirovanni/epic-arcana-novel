'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Breadcrumbs items={[
        { label: 'Settings', current: true }
      ]} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Cog6ToothIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Settings page coming soon!
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              This page will contain user preferences, theme settings, and application configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}