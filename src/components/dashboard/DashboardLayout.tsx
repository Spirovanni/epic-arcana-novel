'use client'

import { DashboardNavbar } from './DashboardNavbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Navigation */}
      <DashboardNavbar />

      {/* Page Content */}
      <main className="container mx-auto max-w-7xl p-6">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-gray-300">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}