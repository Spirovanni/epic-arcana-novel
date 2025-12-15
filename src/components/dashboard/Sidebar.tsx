'use client'

import { useState, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    User,
    Calendar,
    BookOpen,
    Settings,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Target,
    LineChart,
    Lightbulb,
    History,
    Palette,
    Menu
} from 'lucide-react'

// Sidebar context for global state management
interface SidebarContextType {
    isCollapsed: boolean
    setIsCollapsed: (value: boolean) => void
    isMobileOpen: boolean
    setIsMobileOpen: (value: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }}>
            {children}
        </SidebarContext.Provider>
    )
}

// Navigation items configuration - easily extensible
export interface NavItem {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
    disabled?: boolean
}

export interface NavSection {
    title?: string
    items: NavItem[]
}

export const navigationConfig: NavSection[] = [
    {
        items: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'Profile', href: '/profile', icon: User },
            { title: 'Calendar', href: '/calendar', icon: Calendar },
        ]
    },
    {
        title: 'Assessment',
        items: [
            { title: 'My Results', href: '/dashboard/assessment', icon: Sparkles },
            { title: 'Strengths', href: '/dashboard/strengths', icon: Target },
            { title: 'Growth', href: '/dashboard/growth', icon: LineChart },
            { title: 'Insights', href: '/dashboard/insights', icon: Lightbulb },
            { title: 'History', href: '/dashboard/history', icon: History },
        ]
    },
    {
        title: 'Explore',
        items: [
            { title: 'Books', href: '/dashboard/books', icon: BookOpen },
            { title: 'Characters', href: '/characters', icon: Palette },
        ]
    },
    {
        title: 'System',
        items: [
            { title: 'Settings', href: '/settings', icon: Settings, disabled: true },
        ]
    }
]

interface SidebarNavItemProps {
    item: NavItem
    isCollapsed: boolean
}

function SidebarNavItem({ item, isCollapsed }: SidebarNavItemProps) {
    const pathname = usePathname()
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    const Icon = item.icon

    if (item.disabled) {
        return (
            <div
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    'text-slate-500 cursor-not-allowed opacity-50',
                    isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? item.title : undefined}
            >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
            </div>
        )
    }

    return (
        <Link
            href={item.href}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                'hover:bg-white/10',
                isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/20 text-white border-l-2 border-purple-400'
                    : 'text-slate-300 hover:text-white',
                isCollapsed && 'justify-center px-2'
            )}
            title={isCollapsed ? item.title : undefined}
        >
            <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-purple-400')} />
            {!isCollapsed && (
                <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/30 text-purple-300">
                            {item.badge}
                        </span>
                    )}
                </>
            )}
        </Link>
    )
}

export function DashboardSidebar() {
    const { isCollapsed, setIsCollapsed, setIsMobileOpen } = useSidebar()

    return (
        <>
            {/* Mobile overlay */}
            <div
                className="lg:hidden fixed inset-0 bg-black/60 z-40 transition-opacity"
                onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-50 h-screen bg-slate-900/95 backdrop-blur-xl border-r border-white/10',
                    'flex flex-col transition-all duration-300 ease-in-out',
                    isCollapsed ? 'w-[70px]' : 'w-[260px]'
                )}
            >
                {/* Logo Header */}
                <div className={cn(
                    'flex items-center h-16 px-4 border-b border-white/10',
                    isCollapsed ? 'justify-center' : 'gap-3'
                )}>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-xl">🔮</span>
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <h1 className="font-bold text-white text-lg leading-tight">Epic Arcana</h1>
                            <p className="text-xs text-slate-400 truncate">Dashboard</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                    {navigationConfig.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                            {section.title && !isCollapsed && (
                                <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {section.title}
                                </h3>
                            )}
                            {section.title && isCollapsed && (
                                <div className="h-px bg-white/10 mx-2 mb-2" />
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <SidebarNavItem key={item.href} item={item} isCollapsed={isCollapsed} />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Collapse Toggle */}
                <div className="p-3 border-t border-white/10">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            'flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm',
                            'text-slate-400 hover:text-white hover:bg-white/10 transition-colors',
                            isCollapsed && 'justify-center px-2'
                        )}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <>
                                <ChevronLeft className="h-5 w-5" />
                                <span>Collapse</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>
        </>
    )
}

// Mobile trigger button
export function MobileSidebarTrigger() {
    const { setIsMobileOpen } = useSidebar()

    return (
        <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
        >
            <Menu className="h-6 w-6" />
        </button>
    )
}
