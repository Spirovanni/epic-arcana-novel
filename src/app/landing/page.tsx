import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EpicArcanaIntro } from './components/EpicArcanaIntro';
import { HowItWorks } from './components/HowItWorks';
import { ColorCycle } from './components/ColorCycle';
import { DashboardPreview } from './components/DashboardPreview';
import { SocialProof } from './components/SocialProof';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <EpicArcanaIntro />
      <HowItWorks />
      <ColorCycle />
      <DashboardPreview />
      <SocialProof />
      <FinalCTA />
      <Footer />
    </main>
  );
}