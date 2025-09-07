'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ForcedChoiceItem as ForcedChoiceItemType, ForcedChoiceAnswer } from '@/lib/assessment/types'
import { cn } from '@/lib/utils'

interface ForcedChoiceItemProps {
  item: ForcedChoiceItemType
  answer?: ForcedChoiceAnswer
  onAnswer: (best: number, worst: number) => void
  showLocationHeader?: boolean
}

export function ForcedChoiceItem({ 
  item, 
  answer, 
  onAnswer, 
  showLocationHeader = true 
}: ForcedChoiceItemProps) {
  const [selectedBest, setSelectedBest] = useState<number | null>(answer?.best ?? null)
  const [selectedWorst, setSelectedWorst] = useState<number | null>(answer?.worst ?? null)
  
  const handleOptionClick = (index: number) => {
    if (selectedBest === null) {
      // First selection - mark as best
      setSelectedBest(index)
      if (selectedWorst !== null) {
        onAnswer(index, selectedWorst)
      }
    } else if (selectedWorst === null && index !== selectedBest) {
      // Second selection - mark as worst (if different from best)
      setSelectedWorst(index)
      onAnswer(selectedBest, index)
    } else if (selectedBest === index) {
      // Clicking best option - deselect it
      setSelectedBest(null)
      if (selectedWorst !== null) {
        setSelectedWorst(null)
      }
    } else if (selectedWorst === index) {
      // Clicking worst option - deselect it  
      setSelectedWorst(null)
    } else {
      // Clicking third option - replace worst
      setSelectedWorst(index)
      onAnswer(selectedBest, index)
    }
  }
  
  const getOptionStatus = (index: number) => {
    if (selectedBest === index) return 'best'
    if (selectedWorst === index) return 'worst'
    return 'unselected'
  }
  
  return (
    <div className="space-y-4">
      {showLocationHeader && (
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-purple-300">
            {item.location}
          </h3>
          <p className="text-gray-300 italic">
            "{item.vignette}"
          </p>
        </div>
      )}
      
      <div className="text-center text-sm text-gray-400 mb-4">
        Choose which option appeals to you <strong>MOST</strong> and which appeals <strong>LEAST</strong>
      </div>
      
      <div className="grid gap-3">
        {item.options.map((option, index) => {
          const status = getOptionStatus(index)
          
          return (
            <Card
              key={index}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg",
                status === 'best' && "border-green-500 bg-green-500/20 shadow-green-500/25",
                status === 'worst' && "border-red-500 bg-red-500/20 shadow-red-500/25",
                status === 'unselected' && "border-gray-600 bg-slate-800/50 hover:border-purple-500/50 hover:bg-purple-500/10"
              )}
              onClick={() => handleOptionClick(index)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <p className="text-gray-200 flex-1">
                    {option.label}
                  </p>
                  
                  {status !== 'unselected' && (
                    <div className={cn(
                      "ml-4 px-2 py-1 rounded text-xs font-bold",
                      status === 'best' && "bg-green-600 text-white",
                      status === 'worst' && "bg-red-600 text-white"
                    )}>
                      {status === 'best' ? 'MOST' : 'LEAST'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {selectedBest !== null && selectedWorst === null && (
        <p className="text-center text-sm text-yellow-400">
          Now choose which option appeals to you LEAST
        </p>
      )}
    </div>
  )
}