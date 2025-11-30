'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, AlertCircle, Loader2 } from 'lucide-react'

interface Character {
  id: string
  slug: string
  name: string
  imageUrl: string | null
}

export default function CharacterImagesPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [availableImages, setAvailableImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load characters and available images
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load characters from API
        const charactersResponse = await fetch('/api/admin/characters/images')
        if (charactersResponse.ok) {
          const data = await charactersResponse.json()
          setCharacters(data)
        } else if (charactersResponse.status === 401) {
          setError('You must be logged in to manage character images')
        }

        // Get available images from API
        const imagesResponse = await fetch('/api/admin/characters/available-images')
        if (imagesResponse.ok) {
          const images = await imagesResponse.json()
          setAvailableImages(images)
        } else if (imagesResponse.status === 401) {
          setError('You must be logged in to manage character images')
        }
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const updateCharacterImage = async (characterId: string, imageUrl: string) => {
    setUpdating(characterId)
    setSuccess(null)
    setError(null)

    try {
      const response = await fetch('/api/admin/characters/images', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId,
          imageUrl: `/images/characters/${imageUrl}`,
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        setCharacters((prev) =>
          prev.map((char) =>
            char.id === characterId ? updated : char
          )
        )
        setSuccess(`${updated.name} image updated!`)
        setTimeout(() => setSuccess(null), 3000)
      } else {
        const err = await response.json()
        setError(err.error || 'Failed to update image')
      }
    } catch (err) {
      console.error('Error updating character image:', err)
      setError('Error updating image')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Character Image Manager
          </h1>
          <p className="text-muted-foreground">
            Assign profile images to characters from the available image library
          </p>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-green-600 dark:text-green-400">{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">
                {characters.length}
              </div>
              <p className="text-sm text-muted-foreground">Total Characters</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-500">
                {characters.filter((c) => c.imageUrl).length}
              </div>
              <p className="text-sm text-muted-foreground">With Images</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-500">
                {characters.filter((c) => !c.imageUrl).length}
              </div>
              <p className="text-sm text-muted-foreground">Missing Images</p>
            </CardContent>
          </Card>
        </div>

        {/* Characters Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {characters.map((character) => (
            <Card key={character.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{character.name}</CardTitle>
                  {character.imageUrl ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      ✓ Assigned
                    </Badge>
                  ) : (
                    <Badge variant="secondary">No Image</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {/* Current Image Preview */}
                {character.imageUrl && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Current Image:</p>
                    <div className="relative w-full h-48 bg-secondary rounded-lg overflow-hidden border border-border">
                      <img
                        src={character.imageUrl}
                        alt={character.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="16" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground break-all">
                      {character.imageUrl}
                    </p>
                  </div>
                )}

                {/* Image Selection */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Assign Image:</p>
                  <Select
                    onValueChange={(imageUrl) =>
                      updateCharacterImage(character.id, imageUrl)
                    }
                    value={character.imageUrl || ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose an image..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableImages.map((image) => (
                        <SelectItem key={image} value={image}>
                          {image.replace(/^(.+?)-\d+\.(jpg|png)$/, '$1')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                {updating === character.id && (
                  <p className="text-sm text-blue-500 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {characters.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No characters found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
