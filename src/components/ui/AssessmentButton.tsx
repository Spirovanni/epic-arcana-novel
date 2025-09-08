'use client'

import { useAssessmentStatus } from '@/hooks/useAssessmentStatus'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ButtonProps } from '@/components/ui/button'

interface AssessmentButtonProps extends Omit<ButtonProps, 'children'> {
  href?: string
  children?: React.ReactNode
  showIcon?: boolean
  onClick?: () => void
  asButton?: boolean
}

export function AssessmentButton({ 
  href = '/assessment', 
  className = '',
  variant = 'default',
  size = 'default',
  children,
  showIcon = false,
  onClick,
  asButton = false,
  ...props 
}: AssessmentButtonProps) {
  const { hasCompletedAssessment, loading } = useAssessmentStatus()
  const { resetAssessment } = useAssessmentStore()
  const router = useRouter()
  
  const buttonText = loading 
    ? 'Loading...' 
    : hasCompletedAssessment 
      ? 'Retake Assessment' 
      : 'Take Assessment'
      
  const handleClick = () => {
    if (hasCompletedAssessment) {
      // Reset the assessment state for retake
      resetAssessment()
    }
    
    if (onClick) {
      onClick()
    } else {
      router.push(href || '/assessment')
    }
  }

  const content = children || buttonText

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      disabled={loading} 
      onClick={handleClick}
      {...props}
    >
      {content}
    </Button>
  )
}