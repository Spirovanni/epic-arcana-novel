import { HeroCTA } from '@/components/landing/HeroCTA'
import { QuickStartCard } from '@/components/landing/QuickStartCard'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative container mx-auto">
          <HeroCTA />
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Begin Your Journey
            </h2>
            <QuickStartCard />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-slate-800/20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How Epic Arcana Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔮</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">
                Story-Driven Assessment
              </h3>
              <p className="text-gray-400">
                Journey through Laurasia with 54 narrative questions that reveal your true personality patterns.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-300 mb-2">
                360 Unique Profiles
              </h3>
              <p className="text-gray-400">
                Discover your exact archetype among 360 distinct personality profiles with personalized insights.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-green-300 mb-2">
                Actionable Growth
              </h3>
              <p className="text-gray-400">
                Get specific strengths, shadows, and growth recommendations based on the Human Framework.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
