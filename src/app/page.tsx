import { Navbar } from './landing/components/Navbar';
import { Hero } from './landing/components/Hero';
import { Hook } from './landing/components/Hook';
import { EpicArcanaIntro } from './landing/components/EpicArcanaIntro';
import { HowItWorks } from './landing/components/HowItWorks';
import { WorldLaurasia } from './landing/components/WorldLaurasia';
import { Community } from './landing/components/Community';
import { ColorCycle } from './landing/components/ColorCycle';
import { DashboardPreview } from './landing/components/DashboardPreview';
import { SocialProof } from './landing/components/SocialProof';
import { FinalCTA } from './landing/components/FinalCTA';
import { Footer } from './landing/components/Footer';
import { AdventureQuickStartCard } from '@/components/landing/AdventureQuickStartCard'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { PersonalitiesSection } from '@/components/landing/PersonalitiesSection'
import { WorldSection } from '@/components/landing/WorldSection'
import { CommunitySection } from '@/components/landing/CommunitySection'
import { CycleSection } from '@/components/landing/CycleSection'
import { FinalCTASection } from '@/components/landing/FinalCTASection'

export default function Home() {
  return (
    <main className="min-h-screen text-slate-200 bg-[#0b1220]">
      <Navbar />
      <Hero />
      <Hook />
      <EpicArcanaIntro />
      <HowItWorks />
      <WorldLaurasia />
      
      {/* Quick Start Section from original */}
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Experience the Assessment
            </h2>
            <AdventureQuickStartCard />
          </div>
        </div>
      </section>

      {/* Additional sections from original */}
      <HowItWorksSection />
      <PersonalitiesSection />
      <WorldSection />
      
      <Community />
      <ColorCycle />
      <DashboardPreview />
      <SocialProof />
      
      {/* Community and other sections from original */}
      <CommunitySection />
      <CycleSection />
      
      <FinalCTA />
      <FinalCTASection />
      <Footer />
    </main>
  )
}
