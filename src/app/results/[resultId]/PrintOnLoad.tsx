'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function PrintOnLoad() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('download') !== '1') return

    const timer = setTimeout(() => window.print(), 400)
    return () => clearTimeout(timer)
  }, [searchParams])

  return null
}
