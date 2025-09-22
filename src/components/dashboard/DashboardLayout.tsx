'use client'

import { DashboardNavbar } from './DashboardNavbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Large Desktop Hero Background */}
      <div className="hidden xl:block fixed inset-0 w-full h-full">
        {/* Cosmic Fantasy Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero_castle.png')",
          }}
        />
        
        {/* Dark overlay for better content readability */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Subtle animated overlay effects */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-cyan-500/5 blur-xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 h-24 w-24 rounded-full bg-purple-500/5 blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/3 h-16 w-16 rounded-full bg-pink-500/5 blur-xl animate-pulse delay-2000" />
        </div>
      </div>

      {/* Fallback background for smaller screens */}
      <div className="xl:hidden min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
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

      {/* Large Desktop Layout */}
      <div className="hidden xl:block relative z-10 min-h-screen">
        {/* Navigation */}
        <DashboardNavbar />

        {/* Hero Section for Large Desktop */}
        <section className="relative min-h-[60vh] flex items-center">
          <div className="container mx-auto max-w-7xl px-6 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Hero Content */}
              <div className="text-center lg:text-left">
                {/* Epic Arcana Logo/Brand */}
                <div className="mb-8 flex justify-center lg:justify-start">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-2xl">
                      <span className="text-3xl">👑</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Epic Arcana
                      </h2>
                      <p className="text-slate-300/80 text-sm">Your Personal Dashboard</p>
                    </div>
                  </div>
                </div>
                
                {title && (
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight mb-6">
                    <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {title}
                    </span>
                  </h1>
                )}
                
                {subtitle && (
                  <p className="text-xl text-slate-200/90 leading-relaxed mb-8 max-w-2xl">
                    {subtitle}
                  </p>
                )}

                {/* Hero Stats or Quick Actions */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                    <div className="text-2xl font-bold text-cyan-300">360</div>
                    <div className="text-sm text-slate-300/80">Personality Types</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                    <div className="text-2xl font-bold text-purple-300">9</div>
                    <div className="text-sm text-slate-300/80">Core Families</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                    <div className="text-2xl font-bold text-pink-300">∞</div>
                    <div className="text-sm text-slate-300/80">Possibilities</div>
                  </div>
                </div>
              </div>

              {/* Right side - Dashboard Preview or Content */}
              <div className="relative">
                <div className="relative">
                  {/* Glowing backdrop */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl scale-110" />
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl">🔮</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Your Journey Awaits</h3>
                      <p className="text-slate-300/80 mb-6">
                        Explore your unique personality profile and discover your path through the mystical world of Laurasia.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-purple-300 font-semibold">Assessment</div>
                          <div className="text-slate-400">Complete</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-blue-300 font-semibold">Profile</div>
                          <div className="text-slate-400">Active</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="relative z-10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}