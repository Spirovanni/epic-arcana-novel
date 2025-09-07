'use client'

import { Component, ReactNode } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-slate-800/80 backdrop-blur-md border-red-500/30">
            <CardHeader className="text-center">
              <CardTitle className="text-red-400 flex items-center justify-center gap-2">
                ⚠️ Something went wrong
              </CardTitle>
              <CardDescription className="text-gray-400">
                The application encountered an unexpected error
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-400 bg-slate-900/50 p-3 rounded-lg">
                {this.state.error?.message || 'Unknown error occurred'}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="mystical" 
                  className="flex-1"
                >
                  Reload Page
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'} 
                  variant="outline" 
                  className="flex-1 border-purple-500/50"
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}