import { Navbar } from './landing/components/Navbar';
import { Hero } from './landing/components/Hero';
import { EpicArcanaIntro } from './landing/components/EpicArcanaIntro';
import { HowItWorks } from './landing/components/HowItWorks';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <EpicArcanaIntro />
      <HowItWorks />
      
      {/* Quick Start Section with shadcn Card */}
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Experience the Assessment
            </h2>
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <AdventureQuickStartCard />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional sections from original */}
      <PersonalitiesSection />
      <WorldSection />
      
      <DashboardPreview />
      <SocialProof />
      
      {/* Community and other sections from original */}
      <CommunitySection />
      <CycleSection />
      
      <FinalCTASection />
      <Footer />
    </main>
  )
}
