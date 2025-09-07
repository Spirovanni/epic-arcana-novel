import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Hook } from './components/Hook';
import { EpicArcanaIntro } from './components/EpicArcanaIntro';
import { HowItWorks } from './components/HowItWorks';
import { WorldLaurasia } from './components/WorldLaurasia';
import { Community } from './components/Community';
import { ColorCycle } from './components/ColorCycle';
import { DashboardPreview } from './components/DashboardPreview';
import { SocialProof } from './components/SocialProof';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen text-slate-200 bg-[#0b1220]">
      <Navbar />
      <Hero />
      <Hook />
      <EpicArcanaIntro />
      <HowItWorks />
      <WorldLaurasia />
      <Community />
      <ColorCycle />
      <DashboardPreview />
      <SocialProof />
      <FinalCTA />
      <Footer />
    </main>
  );
}