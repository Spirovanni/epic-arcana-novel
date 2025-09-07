import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ResultHeader } from '@/components/results/ResultHeader'
import { TypeBars } from '@/components/results/TypeBars'
import { ColorSwatch } from '@/components/results/ColorSwatch'
import { TraitLists } from '@/components/results/TraitLists'
import { AssessmentResult } from '@/lib/assessment/types'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'

interface ResultsPageProps {
  params: Promise<{
    resultId: string
  }>
}

async function loadResult(resultId: string): Promise<AssessmentResult | null> {
  try {
    // Try to load from local file storage
    const resultsFile = path.join(process.cwd(), 'data', '_local_results.json')
    
    if (fs.existsSync(resultsFile)) {
      const fileContent = fs.readFileSync(resultsFile, 'utf-8')
      const results = JSON.parse(fileContent)
      return results[resultId] || null
    }
    
    // TODO: Load from database if available
    
    return null
  } catch (error) {
    console.error('Error loading result:', error)
    return null
  }
}

function getInstinctStack(instincts: { SP: number; SO: number; SX: number }): string {
  return Object.entries(instincts)
    .sort(([,a], [,b]) => b - a)
    .map(([key]) => key)
    .join(' > ')
}

function getWingDescription(wing_bin: number): string {
  const descriptions = [
    'Strong left-wing influence',
    'Moderate left-wing influence', 
    'Slight left-wing influence',
    'Minimal left-wing influence',
    'Minimal right-wing influence',
    'Slight right-wing influence',
    'Moderate right-wing influence',
    'Strong right-wing influence'
  ]
  
  return descriptions[wing_bin] || 'Unknown wing pattern'
}

function getDevelopmentDescription(development_bin: number): string {
  const descriptions = [
    'Emerging awareness',
    'Developing skills',
    'Applied competence',
    'Refined mastery', 
    'Transcendent integration'
  ]
  
  return descriptions[development_bin] || 'Unknown development stage'
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { resultId } = await params
  const result = await loadResult(resultId)
  
  if (!result) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Your Epic Arcana Profile
          </h1>
          <p className="text-gray-400">
            A complete analysis of your personality archetype
          </p>
        </div>
        
        {/* Result Header */}
        <div className="mb-12">
          <ResultHeader result={result} />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Type Probabilities */}
          <TypeBars result={result} />
          
          {/* Color Swatch */}
          <ColorSwatch result={result} />
        </div>
        
        {/* Instinct and Development Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Instinct Stack */}
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">
              Instinct Stack
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-200 mb-2">
                  {getInstinctStack(result.instincts)}
                </div>
                <div className="text-sm text-gray-400">
                  Primary → Secondary → Tertiary
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-blue-300">SP</div>
                  <div className="text-sm text-gray-400 mb-1">Self-Preservation</div>
                  <div className="text-2xl font-bold">
                    {Math.round(result.instincts.SP * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-300">SO</div>
                  <div className="text-sm text-gray-400 mb-1">Social</div>
                  <div className="text-2xl font-bold">
                    {Math.round(result.instincts.SO * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-red-300">SX</div>
                  <div className="text-sm text-gray-400 mb-1">Sexual/One-to-One</div>
                  <div className="text-2xl font-bold">
                    {Math.round(result.instincts.SX * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wing and Development */}
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">
              Development Pattern
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">Wing Pattern</div>
                <div className="text-lg font-semibold text-gray-200">
                  Bin {result.wing_bin}
                </div>
                <div className="text-sm text-gray-400">
                  {getWingDescription(result.wing_bin)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Development Stage</div>
                <div className="text-lg font-semibold text-gray-200">
                  Bin {result.development_bin}
                </div>
                <div className="text-sm text-gray-400">
                  {getDevelopmentDescription(result.development_bin)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trait Lists */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Your Personality Profile
          </h3>
          <TraitLists result={result} />
        </div>
        
        {/* Top Signal Items */}
        <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6 mb-12">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">
            Key Assessment Signals
          </h3>
          <p className="text-gray-400 mb-4">
            The following assessment items had the strongest influence on your results:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {result.top_signal_items.map(itemId => (
              <div key={itemId} className="text-sm text-gray-300 bg-slate-700/50 px-3 py-2 rounded">
                {itemId}
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dashboard">
            <Button variant="mystical" size="lg">
              Go to Dashboard
            </Button>
          </Link>
          
          <Link href="/assessment">
            <Button variant="outline" size="lg" className="border-purple-500/50 hover:bg-purple-500/10">
              Take Assessment Again
            </Button>
          </Link>
        </div>
        
        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-purple-500/20">
          <p className="text-sm text-gray-400">
            Assessment completed on {new Date(result.meta.duration_sec * 1000).toLocaleDateString()} • 
            Version {result.meta.version}
          </p>
        </footer>
      </div>
    </div>
  )
}