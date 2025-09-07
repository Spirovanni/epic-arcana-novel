'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

interface NavItem {
  href: string
  label: string
  icon: string
  description?: string
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: '🏠',
    description: 'Dashboard home and progress overview'
  },
  {
    href: '/dashboard/assessment',
    label: 'Assessment',
    icon: '🔮',
    description: 'Take or retake your Epic Arcana assessment'
  },
  {
    href: '/dashboard/strengths',
    label: 'Strengths',
    icon: '💪',
    description: 'Your core personality strengths and talents'
  },
  {
    href: '/dashboard/growth',
    label: 'Growth Areas',
    icon: '🌱',
    description: 'Areas for development and improvement'
  },
  {
    href: '/dashboard/goals',
    label: 'Goals & Plans',
    icon: '🎯',
    description: 'Personality-driven goals and action plans'
  },
  {
    href: '/dashboard/insights',
    label: 'Deep Insights',
    icon: '🧠',
    description: 'Advanced personality analysis and patterns'
  },
  {
    href: '/dashboard/history',
    label: 'History',
    icon: '📊',
    description: 'Assessment history and progress tracking'
  }
]

export function DashboardSidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50" 
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-slate-900/95 backdrop-blur-md border-r border-purple-500/20 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-purple-500/20">
          {!isCollapsed && (
            <Link href="/dashboard" className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Epic Arcana
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-200"
          >
            {isCollapsed ? '→' : '←'}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                    isActive 
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/30" 
                      : "text-gray-400 hover:text-gray-200 hover:bg-slate-800/50"
                  )}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-16 ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                      <div className="font-medium">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-gray-400 mt-1">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom section */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-3 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg border border-purple-500/20">
              <div className="text-xs text-gray-400 mb-1">Your Progress</div>
              <div className="text-sm font-medium text-gray-200">Building Your Epic Arcana</div>
              <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">75% Complete</div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}