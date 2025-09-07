'use client'

import { Card, CardContent } from '@/components/ui/card'
import { LikertItem as LikertItemType, LikertAnswer } from '@/lib/assessment/types'
import { cn } from '@/lib/utils'

interface LikertItemProps {
  item: LikertItemType
  answer?: LikertAnswer
  onAnswer: (rating: number) => void
  showLocationHeader?: boolean
}

const SCALE_LABELS = {
  1: 'Strongly Disagree',
  2: 'Disagree', 
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly Agree'
}

export function LikertItem({ 
  item, 
  answer, 
  onAnswer, 
  showLocationHeader = true 
}: LikertItemProps) {
  
  const selectedRating = answer?.rating
  
  const handleRatingClick = (rating: number) => {
    onAnswer(rating)
  }
  
  return (
    <div className="space-y-4">
      {showLocationHeader && (
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-purple-300">
            {item.location}
          </h3>
        </div>
      )}
      
      <Card className="bg-slate-800/50 border-gray-600">
        <CardContent className="p-6">
          <p className="text-lg text-gray-200 text-center mb-6 italic">
            "{item.statement}"
          </p>
          
          <div className="flex justify-between items-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <div
                key={rating}
                className="flex-1 text-center"
              >
                <button
                  onClick={() => handleRatingClick(rating)}
                  className={cn(
                    "w-full p-3 rounded-lg transition-all duration-200 border-2",
                    selectedRating === rating 
                      ? "border-purple-500 bg-purple-500/20 text-white shadow-lg shadow-purple-500/25" 
                      : "border-gray-600 bg-slate-700/50 text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10"
                  )}
                >
                  <div className="text-2xl font-bold mb-1">
                    {rating}
                  </div>
                  <div className="text-xs">
                    {SCALE_LABELS[rating as keyof typeof SCALE_LABELS]}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}