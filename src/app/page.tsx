import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { QuickStartCard } from '@/components/landing/QuickStartCard'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { PersonalitiesSection } from '@/components/landing/PersonalitiesSection'
import { WorldSection } from '@/components/landing/WorldSection'
import { CommunitySection } from '@/components/landing/CommunitySection'
import { CycleSection } from '@/components/landing/CycleSection'
import { FinalCTASection } from '@/components/landing/FinalCTASection'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Start Section */}
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Experience the Assessment
            </h2>
            <QuickStartCard />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorksSection />

      {/* Personalities Section */}
      <PersonalitiesSection />

      {/* World Section */}
      <WorldSection />

      {/* Community Section */}
      <CommunitySection />

      {/* Cycle Section */}
      <CycleSection />

      {/* Final Call to Action */}
      <FinalCTASection />
    </div>
  )
}
