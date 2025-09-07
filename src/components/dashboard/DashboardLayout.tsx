'use client'

import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { DashboardSidebar } from './DashboardSidebar'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Sidebar */}
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md border-b border-purple-500/20">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden text-gray-400 hover:text-gray-200"
            >
              ☰
            </button>
            
            {title && (
              <div>
                <h1 className="text-xl font-bold text-white">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-400">{subtitle}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/assessment" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
              Take Assessment
            </Link>
            <UserButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}