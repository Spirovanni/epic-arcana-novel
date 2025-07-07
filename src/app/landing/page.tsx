import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="flex-1">
        <Header />
        <MainContent />
      </div>
      <Footer />
    </div>
  );
}