'use client'

import { DashboardNavbar } from './DashboardNavbar'
import { DashboardSidebar, SidebarProvider, useSidebar } from './Sidebar'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

function DashboardContent({ children, title, subtitle }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area - shifts based on sidebar state */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:pl-[70px]' : 'lg:pl-[260px]'
        )}
      >
        {/* Top Navigation */}
        <DashboardNavbar />

        {/* Page Content */}
        <main className="p-6">
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
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardContent {...props} />
    </SidebarProvider>
  )
}