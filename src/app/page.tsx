import { HeroCTA } from '@/components/assessment/HeroCTA'
import { QuickStartCard } from '@/components/assessment/QuickStartCard'
import { UserButton, SignInButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function Home() {
  const user = await currentUser()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Epic Arcana
        </h1>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 transition-colors">
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <SignInButton>
              <button className="text-purple-400 hover:text-purple-300 transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Discover Your Epic Arcana
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Journey through the mystical realm of Laurasia and uncover your unique personality archetype. 
            Map your traits to one of 360 Epic Arcana profiles through story-driven assessment.
          </p>
          
          <HeroCTA />
        </div>
      </section>
      
      {/* Quick Start Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Try a Quick Preview
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the assessment with just 3 story scenarios to get a taste of your Epic Arcana profile
          </p>
        </div>
        
        <QuickStartCard />
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            How It Works
          </h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">📖</span>
            </div>
            <h4 className="text-xl font-semibold text-white">Story Scenarios</h4>
            <p className="text-gray-400">
              Navigate through 18 immersive scenarios set in mystical Laurasia. 
              Choose your preferred responses to reveal your deeper motivations.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">🔮</span>
            </div>
            <h4 className="text-xl font-semibold text-white">Personal Reflection</h4>
            <p className="text-gray-400">
              Rate 36 statements about your thoughts, feelings, and behaviors. 
              Your responses paint a detailed picture of your inner landscape.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✨</span>
            </div>
            <h4 className="text-xl font-semibold text-white">Your Arcana</h4>
            <p className="text-gray-400">
              Discover your unique Epic Arcana profile among 360 possibilities. 
              Get your color, strengths, growth areas, and detailed insights.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Epic Arcana. Discover your unique archetype through the wisdom of Laurasia.</p>
        </div>
      </footer>
    </div>
  )
}
